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
      systemInstruction = `Você é um Redator de Automobilismo escrevendo para um portal.
Sua missão é reescrever a biografia do piloto para que fique coerente e profissional, MAS COM UMA REGRA DE OURO: USE PALAVRAS NORMAIS DO COTIDIANO.
PROIBIDO usar palavras poéticas, absurdas ou dramáticas como "saga", "destino traçado na borracha", "empoeirados", "palco primordial", "lapidou", "jornada". Fale como uma pessoa normal conversando.
Corrija erros gramaticais e mantenha os fatos narrados pelo piloto, organizando o texto.
Retorne APENAS o texto aprimorado, sem introduções ou formatação markdown complexa.`;
    } else if (tipoCampo === 'career') {
      systemInstruction = `Você é um Assessor de Imprensa de Automobilismo.
Transforme o histórico e conquistas do piloto em um texto limpo, direto e profissional.
REGRA DE OURO: Use palavras normais do cotidiano. Proibido forçar a barra com exageros teatrais, linguagem heroica ou "contextos doidos". 
Seja super claro e objetivo. Organize os fatos em texto que dê gosto de ler.
Retorne APENAS o texto aprimorado.`;
    } else if (tipoCampo === 'sponsormsg') {
      systemInstruction = `Você é um Profissional de Marketing Comercial.
Reescreva a mensagem para patrocinadores para que seja B2B, séria e agregue valor de marca.
REGRA DE OURO: Linguagem corporativa normal e acessível. Nada de drama, nada de palavras de efeito exageradas ou promessas mirabolantes inventadas. Baseie-se apenas nos fatos informados.
Retorne APENAS o texto aprimorado.`;
    } else if (tipoCampo === 'briefing') {
      systemInstruction = `Você é um Redator de Automobilismo.
Expanda as anotações do piloto sobre o evento para formar um relato com 3 parágrafos curtos.
REGRA DE OURO: ESCREVA COMO UMA PESSOA NORMAL FALARIA. Evite a todo custo jargões literários, poéticos e clichês de IA (ex: "em um balé de máquinas", "desafiando a física"). 
Use a "Diretriz de Identidade do Piloto" com leveza e contexto real.
NÃO repita o nome do piloto exaustivamente. Alterne (ex: ele, o piloto).
Retorne APENAS o texto.`;
    } else if (tipoCampo === 'questions') {
      systemInstruction = `Você é um Estrategista de Conteúdo de Automobilismo.
SUA TAREFA:
1. Resuma o que o usuário escreveu de forma super natural, como uma pessoa normal comentando, sem robô e sem palavras dramáticas.
2. Liste EXATAMENTE 3 perguntas curtas diretas para o piloto extrair mais fatos da corrida, sem fru-fru gramatical.
Retorne de forma limpa.`;
    } else if (tipoCampo === 'title') {
      systemInstruction = `Você é um Jornalista Automotivo.
Crie um TÍTULO JORNALÍSTICO (manchete) simples, real e direto, sem sensacionalismo exagerado.
Deve soar como matéria normal de portal. Máximo 10 palavras, sem ponto final, sem aspas.
Retorne APENAS a string do título finalizado.`;
    } else if (tipoCampo === 'article') {
      systemInstruction = `Você é um Repórter da DriverNews.
Escreva uma MATÉRIA JORNALÍSTICA (em HTML) baseada no "Texto Original" e nas Diretrizes.
REGRAS ESTRITAS DE TOM DE VOZ:
- USE PORTUGUÊS NORMAL DO COTIDIANO. Proibido linguagem épica, teatral ou absurda ("a saga", "o menino nascido para correr", "o rugido dos motores").
- Foco jornalístico: relato claro, dados concretos, corrida limpa. Se soar como inteligência artificial tentando imitar Shakespeare, você falhou.
- Retorne apenas tags HTML puras (<p>, <strong>, etc). Sem \`\`\`html.
- Adicione um "quote" (aspas) natural no 3º parágrafo.`;
    } else {
      systemInstruction = `Reescreva este texto para ficar com tom profissional, usando português claro e simples do cotidiano. Sem floreios ou palavras dramáticas artificiais.`;
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
