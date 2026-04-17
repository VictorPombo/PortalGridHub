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

    const event_id = body.id
    if (event_id) {
      // 🚫 Idempotency check: verifica se já processou esse webhook exato
      const { data: alreadyProcessed } = await supabase
        .from("webhook_events")
        .select("event_id")
        .eq("event_id", event_id)
        .single()
      
      if (alreadyProcessed) {
        console.log(`Webhook Event ${event_id} já processado. Ignorando.`);
        return new Response("ok")
      }

      // Registra a intenção de processo para bloquear concorrência
      await supabase.from("webhook_events").insert({ event_id, processed: true })
    }

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

      // Update plan based on value
      const value = payment.value || 0
      let plan = "starter"
      if (value >= 149.9) plan = "pro"

      // ✅ ativa usuário e atualiza o plano pago
      await supabase
        .from("users")
        .update({ 
          is_active: true,
          plan: plan
        })
        .eq("id", userId)
    }

    // ============================
    // 🟠 PAGAMENTO ATRASADO
    // ============================
    
    if (event === "PAYMENT_OVERDUE") {
      // Opcional: Implementar Grace Period (Carência de x dias antes de derrubar o usuário)
      // Por ora, a asaas continua tentando cobrar, não inativamos imediatamente aqui caso
      // você tenha dias de tolerância configurados.
      console.log(`Pagamento em atraso para o usuário/fatura: ${payment?.id}`);
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
