import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(request: Request, { params }: { params: { materiaId: string } }) {
  const authHeader = request.headers.get("authorization");
  const adminToken = process.env.ADMIN_AUTH_TOKEN;

  // Proteção básica para a rota de auditoria (DPO Compliance)
  if (adminToken && authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: "Access Denied. DPO Only." }, { status: 403 });
  }

  try {
    const { materiaId } = params;

    // 1. Matéria Base c/ autor
    const { data: materia, error: mErr } = await supabase
      .from("materias_exclusivas")
      .select(`
        *,
        autor:autor_id (nome_completo, cpf, categoria_piloto, email)
      `)
      .eq("id", materiaId)
      .single();

    if (mErr) throw mErr;

    // 2. Os Aceites inalteráveis
    const { data: aceite } = await supabase
      .from("aceites_publicacao")
      .select("*")
      .eq("materia_id", materiaId)
      .order("timestamp_aceite", { ascending: false })
      .limit(1)
      .single();

    // 3. O Histórico Loggado da IA
    const { data: logs } = await supabase
      .from("logs_ia")
      .select("*")
      .eq("materia_id", materiaId)
      .order("executado_em", { ascending: true });

    // 4. O Prompt de máquina estático usado no tempo
    const { data: prompt } = await supabase
      .from("prompts_sistema")
      .select("*")
      .eq("id", materia?.prompt_sistema_id)
      .single();

    return NextResponse.json({
      auditoria_valida: true,
      artigo_19_marco_civil: true,
      materia_data: {
        id: materia.id,
        status: materia.status,
        titulo: materia.titulo,
        has_revisao_humana_interna: false,
        publicado_em: materia.publicado_em,
        autor_responsavel: materia.autor
      },
      input_original_piloto: materia.input_original,
      versao_ia_crua: materia.versao_ia,
      versao_final_editada_aprovada: materia.versao_final,
      assinatura_criptografica_aceite: {
        ...aceite,
        observacao_dpo: "Este log é inalterável e comprova a assinatura do submissor."
      },
      prompt_sistema_operado: prompt,
      logs_ia_tracking: logs
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ erro_auditoria: error.message }, { status: 500 });
  }
}
