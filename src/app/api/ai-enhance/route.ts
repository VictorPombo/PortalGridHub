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
      systemInstruction = `Você é um Redator de Automobilismo.
O usuário forneceu anotações soltas sobre uma corrida ou treino. Você deve expandir isso utilizando a "Diretriz de Identidade do Piloto" fornecida para que o texto reflita sua categoria/situação real.
Sua missão é expandir esse texto para um **relato completo e detalhado (mínimo de 3 parágrafos)**.
REGRAS DE TOM DE VOZ:
- Ao embutir a categoria ou campeonatos do piloto, faça de forma suave e contextual, sem parecer "jogado".
- Use vocabulário natural, do cotidiano. Evite palavras pomposas ou excessivamente dramáticas.
- Flua o texto de forma limpa e humana.
- NÃO repita o nome do piloto exaustivamente. Alterne usando pronomes ("ele", "sua") ou termos como "o piloto".
Retorne APENAS o texto longo expandido, sem saudações.`;
    } else if (tipoCampo === 'questions') {
      systemInstruction = `Você é um Estrategista de Conteúdo de Automobilismo.
Leia o texto fornecido pelo usuário e a "Diretriz de Identidade do Piloto" para embasar suas perguntas (ex: se for Fórmula, pergunte de acerto aerodinâmico; se for Rally, pergunte de navegação, etc).

SUA DUPLA TAREFA:
1. Se o usuário JÁ ESCREVEU algo no rascunho anterior (história, respostas), pegue TUDO isso e organize em um texto narrativo fluido, curto e coerente para começar a matéria dele.
2. LOGO ABAIXO desse texto organizado, adicione EXATAMENTE 3 perguntas curtas e diretas, em bullet points, projetadas para extrair NOVOS detalhes aprofundados sobre o evento, para ele ir respondendo e iterando.

Se o texto do usuário for apenas "Conte sua história sobre a pauta:", traga apenas as 3 perguntas inaugurais.
Retorne de forma limpa, sem saudações (apenas o parágrafo seguido dos bullets).`;
    } else if (tipoCampo === 'title') {
      systemInstruction = `Você é um Editor Chefe de uma revista de Automobilismo.
Crie um TÍTULO JORNALÍSTICO (manchete) de altíssimo impacto, chamativo e profissional, baseado no rascunho fornecido e na "Diretriz de Identidade do Piloto" (inserindo o nome dele ou categoria se fizer o título mais forte).
O título não deve ter ponto final, deve ter no máximo 10 palavras, e não deve conter aspas.
Retorne APENAS a string do título finalizado.`;
    } else if (tipoCampo === 'article') {
      systemInstruction = `Você é um Repórter Chefe da "DriverNews", focado em jornalismo de automobilismo moderno.
Seu objetivo é escrever uma MATÉRIA JORNALÍSTICA COMPLETA com base no "Texto Original" (que é o briefing do piloto) e nas "Diretrizes de Identidade do Piloto" (onde estarão o nome, categoria, equipe, patrocinadores).
A matéria deve ser redigida em terceira pessoa.

REGRAS DE TOM DE VOZ:
- Mantenha uma linguagem natural e acessível do cotidiano (sem palavras rebuscadas ou dramáticas demais).
- NÃO repita o nome do piloto repitidas vezes; alterne com 'ele', 'o corredor', 'o talento', 'o piloto'.
- Transmita profissionalismo, mas soando humano e realista.

REGRAS OBRIGATÓRIAS (HTML):
1. Retorne a matéria DIRETAMENTE formatada em HTML usando tags como <p>, <strong>, <em>, <blockquote>.
2. Não inclua Markdown (\`\`\`html) ou cabeçalhos, devolva APENAS as tags HTML puras.
3. Siga esta estrutura obrigatória:
   - Parágrafo 1: Lead informativo e direto, resumindo o destaque da matéria.
   - Parágrafo 2: Desenvolvimento do relato com os detalhes do briefing.
   - Parágrafo 3: Um "quote" (citação entre aspas) atribuída ao piloto de forma natural, inferida pelo contexto. Utilize o nome do piloto apenas na autoria da fala se fizer sentido, sem placeholders.
   - Parágrafo 4: Visão de futuro ou próximos passos na categoria.
4. Se na Diretriz houver menção aos "Patrocinadores" e estiver ativado, mencione de forma fluída no último parágrafo o apoio recebido dessas marcas parceiras.

Crie uma notícia de ótima leitura!`;
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
