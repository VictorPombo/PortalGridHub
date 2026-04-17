import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { user_id, input_titulo, input_corpo, input_fotos, input_categoria, input_dados_extras } = await req.json();

    if (!user_id || !input_titulo) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
    }

    // Insert as "gerando"
    const { data: bgData, error } = await supabase
      .from('materias')
      .insert({
        user_id,
        status: 'gerando',
        input_titulo,
        input_corpo,
        input_fotos: input_fotos || [],
        input_categoria,
        input_dados_extras: input_dados_extras || {}
      })
      .select('id')
      .single();

    if (error) throw error;
    const materiaId = bgData.id;

    // Fire & Forget background generation
    generateArticleBg(materiaId, { ...bgData, input_titulo, input_corpo, input_categoria, input_dados_extras }).catch(console.error);

    return NextResponse.json({ success: true, id: materiaId });
  } catch (err: any) {
    console.error('Error generating article wrapper:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

async function generateArticleBg(id: string, payload: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Você é um redator experiente de automobilismo (Driver News). 
Escreva uma matéria profissional completa usando as informações abaixo do piloto/equipe.
A matéria deve ser jornalística e atrativa. Retorne estritamente um JSON com "titulo" e "corpo".

TÍTULO SUGERIDO / CONTEXTO:
${payload.input_titulo}

INFORMAÇÕES DISPONÍVEIS:
${payload.input_corpo}

CATEGORIA:
${payload.input_categoria}

SUA SAÍDA DEVE SER EXATAMENTE NESTE FORMATO JSON:
{ "titulo": "Título Jornalístico Forte...", "corpo": "<p>Primeiro paragrafo...</p><p>Segundo...</p>" }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let parsed: any = { titulo: payload.input_titulo, corpo: payload.input_corpo };
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    } catch(e) { console.error('Failed to parse JSON from AI', e); }

    const { error: updErr } = await supabase
      .from('materias')
      .update({
        status: 'revisao',
        ia_titulo: parsed.titulo,
        ia_corpo: parsed.corpo,
        final_titulo: parsed.titulo,
        final_corpo: parsed.corpo,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updErr) console.error('Failed to update article BG', updErr);
  } catch (error) {
    console.error('Failed LLM Generate:', error);
    await supabase.from('materias').update({ status: 'rascunho' }).eq('id', id);
  }
}
