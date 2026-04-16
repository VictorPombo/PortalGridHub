import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const adminToken = process.env.ADMIN_AUTH_TOKEN;

  if (adminToken && authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: "Proibido" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { dominio, motivo } = body;

    if (!dominio) {
      return NextResponse.json({ error: "Domínio obrigatório" }, { status: 400 });
    }

    // Isola o bloqueio
    await supabase.from("dominios_bloqueados").insert({
      dominio,
      motivo: motivo || "Solicitação DMCA",
    });

    // Derruba os ativos imediatamente
    await supabase
      .from("noticias_agregadas")
      .update({ ativo: false })
      .like("link_original", `%${dominio}%`);

    return NextResponse.json({ sucesso: true, mensagem: `Domínio ${dominio} bloqueado e inativado com sucesso.` }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
