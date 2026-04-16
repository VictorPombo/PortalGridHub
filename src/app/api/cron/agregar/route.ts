import { NextResponse } from "next/server";
import { ingerir } from "../../../../services/agregador/ingerir";

export const dynamic = 'force-dynamic';
// Vercel maximiza funções cron longas se estiver no plano pago, ou 10s no free.
export const maxDuration = 60; 

export async function POST(request: Request) {
  // Verifica se a chamada tem a Secret Key
  const authHeader = request.headers.get("authorization") || request.headers.get("x-cron-secret");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && authHeader !== cronSecret) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const resultado = await ingerir();

  return NextResponse.json(resultado, { status: 200 });
}

export async function GET(request: Request) {
  // Permite gatilho GET no debug do dev se não tiver secret
  if (process.env.NODE_ENV === "development") {
    const resultado = await ingerir();
    return NextResponse.json(resultado, { status: 200 });
  }
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}
