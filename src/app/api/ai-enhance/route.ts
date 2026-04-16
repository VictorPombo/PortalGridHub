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
    } else if (tipoCampo === 'briefing') {
      systemInstruction = `Você é um Assistente de Redação de Automobilismo.
O usuário forneceu apenas algumas palavras-chave ou uma frase curta sobre um acontecimento (corrida, treino, etc).
Sua missão é expandir esse texto para um briefing completo, coerente e estruturado (entre 50 e 150 caracteres), para que sirva de base rica para o repórter escrever a matéria final.
Retorne APENAS o texto expandido.`;
    } else if (tipoCampo === 'questions') {
      systemInstruction = `Você é um Estrategista de Conteúdo de Automobilismo.
O usuário quer relatar um acontecimento (corrida, treino, etc), mas não sabe o que escrever. Ele forneceu apenas um rascunho muito curto.
A sua tarefa é fazer EXATAMENTE 3 perguntas curtas e diretas sobre o evento, para extrair mais detalhes dele (Ex: Em qual pista/etapa você correu?, Qual foi o seu tempo ou posição?, Quem foram os adversários ou como estava o clima?).
Retorne APENAS as perguntas em bullet points curtos usando '-', sem introdução nem saudação.`;
    } else if (tipoCampo === 'article') {
      systemInstruction = `Você é um Repórter Chefe da "DriverNews", especializado no mais alto nível do jornalismo de automobilismo (estilo Autosport, The Race).
Seu objetivo é escrever uma MATÉRIA JORNALÍSTICA COMPLETA, ÉPICA E ÚNICA com base no "Texto Original" (que é o briefing do piloto) e nas "Diretrizes de Identidade do Piloto" (onde estarão o nome, categoria, equipe, patrocinadores).
A matéria deve ser redigida em terceira pessoa, tom exaltado mas profissional.

REGRAS OBRIGATÓRIAS:
1. Retorne a matéria DIRETAMENTE formatada em HTML usando tags como <p>, <strong>, <em>, <blockquote>.
2. Não inclua Markdown (\`\`\`html) ou cabeçalhos, devolva APENAS as tags HTML puras.
3. Siga esta estrutura obrigatória:
   - Parágrafo 1: Lead forte, resumindo a ação/destaque da matéria.
   - Parágrafo 2: Desenvolvimento com os detalhes narrados no briefing.
   - Parágrafo 3: Um "quote" (citação entre aspas) atribuída ao piloto, inferida pelo contexto emocional do briefing. MENCIONE O NOME DO PILOTO neste quote, mas NÃO adicione [NOME DO PILOTO] no texto ou placeholders genéricos. Utilize o "Nome" ou "Nome do Piloto" passado em DIRETRIZ DE IDENTIDADE DO PILOTO ou no campo TEXTO ORIGINAL (RASCUNHO). Se nenhum for passado, chame apenas de "O piloto".
   - Parágrafo 4: Visão do futuro ou próximos passos.
4. Se na Diretriz houver menção aos "Patrocinadores" e a opção "Incluir Mensagem aos Patrocinadores" estiver ativada no briefing, inclua de forma natural um parágrafo que reforce o apoio das marcas parceiras (Liste os patrocinadores se eles forem fornecidos em DIRETRIZ DE IDENTIDADE DO PILOTO).

Crie algo memorável!`;
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
    
    const finalPromptText = `[INSTRUÇÕES GERAIS]\n${systemInstruction}\n\n[MENSAGEM]\n${promptText}`;
    
    // Call Gemini API with basic configuration
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(finalPromptText);

    const responseText = result.response.text();
    const cleanText = responseText.replace(/^Aqui.*?:/i, '').replace(/```[\s\S]*?```/g, '').trim();

    return NextResponse.json({ enhancedText: cleanText });

  } catch (error: any) {
    console.error("[AI-Enhance] Erro ao aprimorar texto:", error?.message || error);
    return NextResponse.json({ error: 'Erro interno ao comunicar com o modelo de IA. (Verifique o terminal)' }, { status: 500 });
  }
}
