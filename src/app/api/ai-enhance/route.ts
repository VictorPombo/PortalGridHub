import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { textoOriginal, tipoCampo, contexto } = body;

    if (!textoOriginal) {
      return NextResponse.json({ error: 'Texto original não fornecido' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY ausente. Usando mock provisório.");
      // Fallback if no API key
      return NextResponse.json({ enhancedText: textoOriginal + " (Simulação de IA: Chave ausente na Vercel/Local)" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fast model ideal for UI interactions

    let systemInstruction = "";

    if (tipoCampo === 'bio') {
      systemInstruction = `Você é um Redator Chefe especializado em Automobilismo focado na marca pessoal de pilotos.
O usuário enviou uma biografia básica. Sua missão é reescrever este texto para que soe ÉPICO, PROFISSIONAL, ÚNICO e atraente para patrocinadores e fãs.
NÃO seja genérico. Crie um "storytelling autoral". Corrija erros gramaticais.
Mantenha os fatos narrados pelo piloto, mas mude estruturalmente para um tom jornalístico premium.
Retorne APENAS o texto aprimorado, sem introduções ou formatação markdown complexa.`;
    } else if (tipoCampo === 'career') {
      systemInstruction = `Você é um Assessor de Imprensa de Automobilismo.
O usuário enviou seu histórico de carreira e conquistas (títulos, pódiuns). Transforme esse bullet point confuso ou texto simples em um parágrafo denso, de altíssimo valor e prestígio, destacando as vitórias como um piloto de elite.
Retorne APENAS o texto aprimorado, sem formatação extra.`;
    } else if (tipoCampo === 'sponsormsg') {
      systemInstruction = `Você é um Executivo de Marketing Esportivo.
O usuário escreveu o que ele tem a oferecer para patrocinadores. Transforme esse texto em um "Pitch de Patrocínio B2B" agressivo, profissional e irresistível para grandes marcas.
Destaque o retorno sobre o investimento (ROI), engajamento de redes, espaço de tela no carro/macacão.
Retorne APENAS o texto aprimorado, nada mais.`;
    } else {
      systemInstruction = `Reescreva este texto para ficar mais profissional, corrigindo a gramática.`;
    }

    const promptText = `
DIRETRIZ DE IDENTIDADE DO PILOTO:
${contexto || "Dados não informados (Trate como piloto neutro)"}

TEXTO ORIGINAL DO PILOTO (RASCUNHO):
"${textoOriginal}"

Aprimore o texto seguindo estritamente as diretrizes informadas. 
LEMBRE-SE: Retorne EXCLUSIVAMENTE o novo texto gerado. Não adicione frases como "Aqui está o texto aprimorado...".`;

    console.log(`[AI-Enhance] Iniciando aprimoramento de campo: ${tipoCampo}`);
    
    // Call Gemini API
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptText }] }],
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }]}
    });

    const responseText = result.response.text();
    const cleanText = responseText.replace(/^Aqui.*?:/i, '').replace(/```[\s\S]*?```/g, '').trim();

    return NextResponse.json({ enhancedText: cleanText });

  } catch (error) {
    console.error("[AI-Enhance] Erro ao aprimorar texto:", error);
    return NextResponse.json({ error: 'Erro interno ao comunicar com o modelo de IA.' }, { status: 500 });
  }
}
