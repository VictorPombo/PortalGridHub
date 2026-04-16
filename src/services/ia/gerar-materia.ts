import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export interface FormInput {
  titulo: string;
  categoria: string;
  fatos: string;
  citacoes?: string;
  contexto?: string;
  autor: {
    nome: string;
    categoria: string;
  };
}

export interface MateriaGerada {
  titulo: string;
  subtitulo: string | null;
  conteudo: string;
  prompt_sistema_id: string;
  modelo_ia: string;
}

// Simulador provisório de chamadas AI. Substituir por API do OpenAI/Claude em prod.
async function chamarIA(params: { modelo: string; prompt: string; max_tokens: number }) {
  console.log(`[Driver AI Engine] Chamando ${params.modelo}...`);
  return {
    texto: `TÍTULO: Notícia sobre a atuação de destaque na pista.\nSUBTÍTULO: Contexto resumido da performance e fatos citados.\nCORPO:\n\nAqui vai o corpo jornalístico formatado do texto. Ele interpretou os resumos enviados de forma profissional.`,
    usage: { input: 350, output: 400 }
  };
}

function calcularCusto(usage: { input: number; output: number }) {
  // Placeholder cost estimation
  return (usage.input * 0.00001) + (usage.output * 0.00003); 
}

function extrairTitulo(texto: string) {
  const match = texto.match(/TÍTULO:\s*(.+)/i);
  return match ? match[1].trim() : "Sem Título";
}

function extrairSubtitulo(texto: string) {
  const match = texto.match(/SUBTÍTULO:\s*(.+)/i);
  return match ? match[1].trim() : null;
}

function extrairCorpo(texto: string) {
  const parts = texto.split(/CORPO:/i);
  return parts.length > 1 ? parts[1].trim() : texto.trim();
}

export async function gerarMateria(materiaId: string, input: FormInput): Promise<MateriaGerada> {
  // 1. Buscar prompt_sistema ativo atual
  const { data: promptSistema, error: promptErr } = await supabase
    .from("prompts_sistema")
    .select("*")
    .eq("ativo", true)
    .single();

  if (promptErr || !promptSistema) {
    throw new Error("Não foi possível encontrar um prompt de sistema ativo.");
  }

  // 2. Montar prompt final
  const promptCompleto = `
${promptSistema.texto_prompt}

DADOS DO AUTOR:
Nome: ${input.autor.nome}
Categoria: ${input.autor.categoria}

INFORMAÇÕES FORNECIDAS:
Título sugerido: ${input.titulo}
Categoria da matéria: ${input.categoria}
Fatos: ${input.fatos}
Citações: ${input.citacoes || "nenhuma"}
Contexto: ${input.contexto || "nenhum"}
`;

  // 3. Chamar IA
  const MODELO_ALVO = "gpt-4-turbo";
  const resposta = await chamarIA({
    modelo: MODELO_ALVO,
    prompt: promptCompleto,
    max_tokens: 2000
  });

  // 4. Salvar log blindado no banco
  await supabase.from("logs_ia").insert({
    materia_id: materiaId,
    tipo: "geracao",
    input: input,
    output: resposta.texto,
    modelo: MODELO_ALVO,
    tokens_input: resposta.usage.input,
    tokens_output: resposta.usage.output,
    custo_estimado: calcularCusto(resposta.usage)
  });

  return {
    titulo: extrairTitulo(resposta.texto),
    subtitulo: extrairSubtitulo(resposta.texto),
    conteudo: extrairCorpo(resposta.texto),
    prompt_sistema_id: promptSistema.id,
    modelo_ia: MODELO_ALVO
  };
}
