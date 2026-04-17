import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    // 🔐 valida token do Asaas
    const token = req.headers.get("asaas-access-token")

    if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
      return new Response("unauthorized", { status: 401 })
    }

    const body = await req.json()

    console.log("Webhook recebido:", body)

    const { event, payment, subscription } = body

    // 🛠️ Função Helper: Extrair User ID (Fallback para ler da description do link de pagamento Asaas)
    const extractUserId = (obj: any): string | null => {
      if (obj?.externalReference) return obj.externalReference;
      if (obj?.description && obj.description.includes('| user: ')) {
        const parts = obj.description.split('| user: ');
        if (parts.length > 1) return parts[1].trim();
      }
      return null;
    };

    // ============================
    // 💳 PAGAMENTO CONFIRMADO
    // ============================

    if (
      event === "PAYMENT_RECEIVED" ||
      event === "PAYMENT_CONFIRMED"
    ) {
      if (!payment) return new Response("ok")

      // segurança
      if (payment.status !== "RECEIVED" && payment.status !== "CONFIRMED") return new Response("ok")

      const userId = extractUserId(payment)
      const paymentId = payment.id

      if (!userId) return new Response("ok")

      // 🚫 evita duplicidade
      const { data: existing } = await supabase
        .from("payments")
        .select("id")
        .eq("payment_id", paymentId)
        .single()

      if (existing) return new Response("ok")

      // 💾 salva pagamento
      await supabase.from("payments").insert({
        user_id: userId,
        payment_id: paymentId,
        status: "paid",
        value: payment.value
      })

      // ✅ ativa usuário
      await supabase
        .from("users")
        .update({ is_active: true })
        .eq("id", userId)
    }

    // ============================
    // 🔁 ASSINATURA CRIADA
    // ============================

    if (event === "SUBSCRIPTION_CREATED") {
      if (!subscription) return new Response("ok")

      const userId = extractUserId(subscription)
      if (!userId) return new Response("ok")

      await supabase.from("subscriptions").insert({
        user_id: userId,
        asaas_subscription_id: subscription.id,
        status: "active"
      })
    }

    // ============================
    // 🔁 ASSINATURA CANCELADA
    // ============================

    if (event === "SUBSCRIPTION_INACTIVATED" || event === "SUBSCRIPTION_CANCELED") {
      if (!subscription) return new Response("ok")

      const subId = subscription.id

      // pega usuário
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("asaas_subscription_id", subId)
        .single()

      if (sub?.user_id) {
        // bloqueia usuário
        await supabase
          .from("users")
          .update({ is_active: false })
          .eq("id", sub.user_id)
      }

      // atualiza assinatura
      await supabase
        .from("subscriptions")
        .update({ status: "inactive" })
        .eq("asaas_subscription_id", subId)
    }

    return new Response("ok", { status: 200 })
  } catch (err) {
    console.error("Erro webhook:", err)
    return new Response("error", { status: 500 })
  }
}
