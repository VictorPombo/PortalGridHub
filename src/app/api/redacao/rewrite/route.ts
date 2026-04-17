import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { materia_id, instructions, final_titulo, final_corpo, ia_versao } = await req.json();

    if (!materia_id || !instructions) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
    }

    // Set status to corrigindo
    await supabase.from('materias').update({ status: 'corrigindo' }).eq('id', materia_id);

    // Fire & Forget background processing
    rewriteArticleBg(materia_id, instructions, final_titulo, final_corpo, ia_versao).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

async function rewriteArticleBg(id: string, instructions: string, oldTitulo: string, oldCorpo: string, versao: number) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Você é editor do Driver News. O assinante pediu a seguinte correção na matéria abaixo:

PEDIDO DO ASSINANTE:
"${instructions}"

MATÉRIA ATUAL:
Título: ${oldTitulo}
Corpo: ${oldCorpo}

Aplique EXATAMENTE o que o assinante pediu. Não altere nada além do solicitado.
Mantenha o tom jornalístico profissional. Não adicione markdown externo de bloco.
Retorne no formato JSON rigoroso:
{"titulo": "...", "corpo": "..."}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let parsed: any = null;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    } catch(e) { console.error('Parse erro', e); }

    if(!parsed || !parsed.titulo || !parsed.corpo) throw new Error('Invalid JSON format back from LLM');

    const nextVersao = (versao || 1) + 1;
    const historyEntry = {
      pedido: instructions,
      versao_antes: versao || 1,
      versao_depois: nextVersao,
      timestamp: new Date().toISOString()
    };

    const { error: updErr } = await supabase.rpc('append_history', { // Fallback se rpc nao houver
      row_id: id, entry: historyEntry 
    }).catch(() => null);

    // Na falta de um append native RLS json, faremos fetch + update:
    const { data: row } = await supabase.from('materias').select('historico_correcoes').eq('id', id).single();
    let currentHistory = row?.historico_correcoes || [];
    currentHistory.push(historyEntry);

    await supabase
      .from('materias')
      .update({
        status: 'revisao',
        final_titulo: parsed.titulo,
        final_corpo: parsed.corpo,
        ia_versao: nextVersao,
        historico_correcoes: currentHistory,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

  } catch (error) {
    console.error('Failed LLM Rewrite:', error);
    await supabase.from('materias').update({ status: 'revisao' }).eq('id', id);
  }
}
