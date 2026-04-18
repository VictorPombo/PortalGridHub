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


    let systemInstruction = "";

    if (tipoCampo === 'bio') {
      systemInstruction = `REESCREVA ESTA BIOGRAFIA USANDO APENAS PALAVRAS SIMPLES DO DIA A DIA.
PROIBIDO USAR: saga, destino traçado, empoeirados, palco primordial, inquestionável, coroa, triunfo, avassaladora, sagrar-se, maestria técnica, elite.
Fale como se fosse uma pessoa normal conversando em 2024.
OBJETIVO: Pegar o que o piloto escreveu e apenas corrigir o português e organizar as frases de um jeito humano e simples. Não adicione drama, emoção ou palavras chiques.
Retorne apenas o texto final.`;
    } else if (tipoCampo === 'career') {
      systemInstruction = `REESCREVA O HISTÓRICO DE CARREIRA USANDO APENAS PALAVRAS SIMPLES DO DIA A DIA.
PROIBIDO USAR: saga, inquestionável, elite, triunfo, avassaladora, sagrar-se, coroa, maestria, destaque absoluto, incomparável.
Fale como uma pessoa normal. Apenas liste os campeonatos que ele correu e os títulos que ele ganhou, usando frases normais e curtas.
OBJETIVO: Ser direto. Ex: "Victor é campeão da F1600." (NÃO "Victor consolidou sua maestria técnica ao sagrar-se campeão da altamente competitiva F1600").
Retorne apenas o texto final.`;
    } else if (tipoCampo === 'sponsormsg') {
      systemInstruction = `REESCREVA ESSA MENSAGEM PARA PATROCINADORES DE FORMA DIRETA E SIMPLES.
PROIBIDO USAR palavras corporativas exageradas ou emocionais. Use palavras normais de uma conversa de negócios sincera e humilde.
Retorne apenas o texto final.`;
    } else if (tipoCampo === 'briefing') {
      systemInstruction = `ESCREVA UM RESUMO DE 3 PARÁGRAFOS CURTOS SOBRE O EVENTO USANDO PALAVRAS SIMPLES DO DIA A DIA.
PROIBIDO usar linguagem poética, épica, ou adjetivos dramáticos (avassalador, triunfo, heróico, maestria, inquestionável).
Pareça com um repórter normal relatando um fato ocorrido na pista, e ponto final.
Não repita muito o nome do piloto. Use apenas o que aconteceu de verdade.
Retorne apenas o texto.`;
    } else if (tipoCampo === 'questions') {
      systemInstruction = `Escreva 3 perguntas curtas e muito simples, em bullet points, para o piloto contar mais sobre a corrida. Sem enrolação.
Retorne apenas as perguntas de forma limpa.`;
    } else if (tipoCampo === 'title') {
      systemInstruction = `CRIE UM TÍTULO SEGUINDO ESTRITAMENTE A REGRA DE ENTIDADE SEO:
O título DEVE OBRIGATORIAMENTE começar com o NOME COMPLETO do piloto seguido de uma ação ou fato. Ex: "Victor Assis vence a corrida..."
Sem sensacionalismo. Baseie-se no rascunho do piloto. Máximo 12 palavras, sem aspas.
Retorne apenas o título.`;
    } else if (tipoCampo === 'article') {
      systemInstruction = `ESCREVA UMA MATÉRIA (em HTML <p> e <blockquote>) USANDO APENAS PALAVRAS SIMPLES E COMUNS.
PROIBIDO USAR QUAISQUER ADJETIVOS DRAMÁTICOS OU POÉTICOS: "saga", "inquestionável", "maestria", "triunfo", "elite".
REGRA SEO OBRIGATÓRIA: Insira o NOME COMPLETO do piloto pelo menos 2 a 3 vezes no texto de forma orgânica. EM UMA DAS VEZES, converta-o num hiperlink EXATO neste formato: <a href="/usuario/[SLUG_DO_PILOTO]">NOME COMPLETO (OU PARCIAL) AQUI</a>.
O [SLUG_DO_PILOTO] será fornecido na Diretriz de Identidade.
Escreva como um jornalista esportivo. Adicione um "quote" (aspas) natural no 3º parágrafo.
Retorne apenas o HTML.`;
    } else {
      systemInstruction = `Reescreva o texto corrigindo o português, usando palavras simples como em uma conversa normal. PROIBIDO drama ou adjetivos exagerados.`;
    }

    const promptText = `
DIRETRIZ DE IDENTIDADE DO PILOTO:
${contexto || "Dados não informados (Trate como piloto neutro)"}

TEXTO ORIGINAL DO PILOTO (RASCUNHO):
"${textoOriginal}"

Aprimore o texto seguindo estritamente as diretrizes informadas. 
LEMBRE-SE: Retorne EXCLUSIVAMENTE o novo texto gerado. Não adicione frases como "Aqui está o texto aprimorado...".`;

    console.log(`[AI-Enhance] Iniciando aprimoramento de campo: ${tipoCampo}`);
    
    const finalPromptText = `[INSTRUÇÕES GERAIS]\n${systemInstruction}\n\n[MENSAGEM]\n${promptText}`;
    
    // Call Gemini API with basic configuration
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(finalPromptText);

    const responseText = result.response.text();
    const cleanText = responseText.replace(/^Aqui.*?:/i, '').replace(/```[\s\S]*?```/g, '').trim();

    return NextResponse.json({ enhancedText: cleanText });

  } catch (error: any) {
    console.error("[AI-Enhance] Erro ao aprimorar texto:", error?.message || error);
    return NextResponse.json({ error: 'Erro de IA: ' + (error?.message || 'Falha de conexão') }, { status: 500 });
  }
}
