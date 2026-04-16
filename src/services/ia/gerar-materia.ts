import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Puxa a chave de API (Gemini gratuita p/ Dev ou Paga em Prod)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODELO_REDATOR = "gemini-1.5-flash"; // Agente Criativo & Ágil
const MODELO_REVISOR = "gemini-1.5-pro"; // Agente Analítico de Qualidade / Auditor de Alucinação

export interface FormInput {
  titulo: string;
  categoria: string;
  fatos: string;
  citacoes?: string;
  contexto?: string;
  autor: {
    nome: string;
    categoria: string;
    bio?: string;
    historico?: string;
    mensagemPatrocinadores?: string;
  };
}

export interface MateriaGerada {
  titulo: string;
  subtitulo: string | null;
  conteudo: string;
  prompt_sistema_id: string; // Vai referenciar o Revisor final
  modelo_ia: string;
}

// Helpers de extração regEx
function extrairTitulo(texto: string) {
  const match = texto.match(/TÍTULO:\s*(.+)/i);
  return match ? match[1].trim() : "Sem Título Extratado";
}

function extrairSubtitulo(texto: string) {
  const match = texto.match(/SUBTÍTULO:\s*(.+)/i);
  return match ? match[1].trim() : null;
}

function extrairCorpo(texto: string) {
  const match = texto.match(/CORPO:\s*([\s\S]*)/i);
  // Se não tem match na formatação exata, retorna o texto limpo de lixos de formatação
  return match ? match[1].trim() : texto.replace(/TÍTULO:.*?\n/ig, '').replace(/SUBTÍTULO:.*?\n/ig, '').trim();
}

/**
 * Função Engine Multi-Agent
 * Phase 1: Redator -> Expande os fatos
 * Phase 2: Editor Chefe -> Revisa, checa alucinações baseadas nos dados originais e devolve resultado polido.
 */
export async function gerarMateriaMultiAgente(materiaId: string, input: FormInput): Promise<MateriaGerada> {
  if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY não encontrada. Abortando serviço real de IA.");
      throw new Error("Serviço de IA Indisponível (Sem Chave).");
  }

  // 1. DADOS ESTÁTICOS DO PILOTO E CONDIÇÕES DE PERSONALIDADE ÚNICA
  const fatosDoPiloto = `
DADOS DO AUTOR: Nome: ${input.autor.nome} | Categoria: ${input.autor.categoria}

=== PERFIL ÚNICO DO PILOTO (IDENTIDADE JORNALÍSTICA) ===
Os detalhes abaixo representam a história e modelo de negócio exclusivos do piloto na plataforma. 
É TOTALMENTE PROIBIDO gerar matérias genéricas. Você DEVE usar detalhes da sua Bio/Histórico para adicionar cor, tom e exclusividade ao texto, tornando a narrativa inconfundível. NINGUÉM deve ter uma matéria similar a esta.
${input.autor.bio ? `- BIO / TRAJETÓRIA: ${input.autor.bio}\n` : ''}${input.autor.historico ? `- TÍTULOS / CARREIRA: ${input.autor.historico}\n` : ''}${input.autor.mensagemPatrocinadores ? `- OBJETIVO P/ PATROCINADORES: ${input.autor.mensagemPatrocinadores}\n` : ''}

=== DADOS DO EVENTO/TEMA DA MATÉRIA ===
DADOS TÉCNICOS: Título sugerido: ${input.titulo} | Categoria da matéria: ${input.categoria}
FATOS NO PONTO DE VISTA DO PILOTO: ${input.fatos}
ASPAS E CITAÇÕES FORNECIDAS: ${input.citacoes || "nenhuma"}
CONTEXTO EXTRA (CAMPEONATO): ${input.contexto || "nenhum"}
  `;

  // =========================================================================
  // FASE 1: O AGENTE REDATOR (Gemini Flash)
  // =========================================================================
  const { data: promptRedator } = await supabase.from("prompts_sistema").select("*").eq("versao", "v1.0.0-redator").single();
  const redatorAi = genAI.getGenerativeModel({ model: MODELO_REDATOR });

  console.log("[Driver multi-agent] 🧠 Iniciando Agente 1 (Redator)...");
  
  const ctxRedator = `${promptRedator?.texto_prompt}\n\nMENSAGEM A REDIGIR DA SEGUINTE FONTE DE DADOS:\n${fatosDoPiloto}`;
  const responseRedator = await redatorAi.generateContent(ctxRedator);
  const textoRascunho = responseRedator.response.text();
  
  // Logga o trabalho da Fase 1 no Banco
  await supabase.from("logs_ia").insert({
    materia_id: materiaId,
    tipo: "geracao",
    input: { facts: input, promptConfig: 'v1.0.0-redator' },
    output: textoRascunho,
    modelo: MODELO_REDATOR,
    // Gemini Flash não envia custo unitário de token tão detalhado no SDK grátis da node API simplificada (usageMetadata) diretamente. 
    // Em prod oficial, recuperamos da propriedade usageMetadata.
    tokens_input: responseRedator.response.usageMetadata?.promptTokenCount || 0,
    tokens_output: responseRedator.response.usageMetadata?.candidatesTokenCount || 0
  });


  // =========================================================================
  // FASE 2: O AGENTE REVISOR/EDITOR-CHEFE (Gemini Pro)
  // =========================================================================
  const { data: promptRevisor } = await supabase.from("prompts_sistema").select("*").eq("versao", "v1.0.0-revisor").single();
  const editorAi = genAI.getGenerativeModel({ model: MODELO_REVISOR });

  console.log("[Driver multi-agent] ⚖️ Iniciando Agente 2 (Editor-Chefe de Auditoria)...");

  // O Editor recebe a Missão (Prompt) + A Peça Bruta (Redator) + Os Fatos como base de Checagem.
  const ctxEditor = `${promptRevisor?.texto_prompt}\n\nDADOS REAIS FORNECIDOS PELO PILOTO (USE COMO CHECK DE FATOS):\n${fatosDoPiloto}\n\n================\nRASCUNHO CRIADO PELA REDAÇÃO PARA SER POLIDO:\n${textoRascunho}`;
  const responseEditor = await editorAi.generateContent(ctxEditor);
  const textoFinalPolido = responseEditor.response.text();

  // Logga o trabalho do Editor Chefe no Banco blindado
  await supabase.from("logs_ia").insert({
    materia_id: materiaId,
    tipo: "revisao_oficial",
    input: { facts: input, rascunhoInternoBase: textoRascunho, promptConfig: 'v1.0.0-revisor' },
    output: textoFinalPolido,
    modelo: MODELO_REVISOR,
    tokens_input: responseEditor.response.usageMetadata?.promptTokenCount || 0,
    tokens_output: responseEditor.response.usageMetadata?.candidatesTokenCount || 0
  });

  console.log("[Driver multi-agent] ✅ Processo Editorial Concluído.");

  return {
    titulo: extrairTitulo(textoFinalPolido),
    subtitulo: extrairSubtitulo(textoFinalPolido),
    conteudo: extrairCorpo(textoFinalPolido),
    prompt_sistema_id: promptRevisor?.id || "unknown",
    modelo_ia: `${MODELO_REDATOR} + ${MODELO_REVISOR}`
  };
}
