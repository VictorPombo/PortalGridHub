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
      let extRef = obj?.externalReference;
      if (extRef) {
        if (extRef.startsWith('EXTRA_')) return extRef.replace('EXTRA_', '');
        if (extRef.startsWith('UPGRADE_')) return extRef.replace('UPGRADE_', '');
        return extRef;
      }
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

      // 💾 tenta salvar pagamento (ignora se a tabela não existir)
      const { error: pErr } = await supabase.from("payments").insert({
        user_id: userId,
        payment_id: paymentId,
        status: "paid",
        value: payment.value
      });
      if (pErr) console.log("Aviso: Falha ao inserir na tabela payments");

      const value = payment.value || 0
      
      // ✅ MATÉRIA EXTRA (Avulsa)
      if (value === 59.90 || (payment.externalReference && payment.externalReference.startsWith('EXTRA_'))) {
        const actualUserId = payment.externalReference?.replace('EXTRA_', '') || userId;
        
        // Buscar saldo atual e adicionar +1
        const { data: userRef } = await supabase.from('users').select('extra_credits').eq('id', actualUserId).single();
        const currentCredits = userRef?.extra_credits || 0;
        
        await supabase
          .from("users")
          .update({ extra_credits: currentCredits + 1 })
          .eq("id", actualUserId);
          
        console.log(`[Webhook] Matéria Extra (+1) concedida ao usuário ${actualUserId}`);
      } else if (payment?.externalReference && payment.externalReference.startsWith("UPGRADE_")) {
        // ✅ UPGRADE PRO (Diferença de assinatura avulsa, mas ativa plan Pro definitivo)
        const actualUserId = payment.externalReference.replace('UPGRADE_', '');
        await supabase
          .from("users")
          .update({ 
            status: 'active',
            plan: 'pro'
          })
          .eq("id", actualUserId)
          
        console.log(`[Webhook] UPGRADE PRO (+ R$50) concedido ao usuário ${actualUserId}`);
      } else {
        // ✅ ASSINATURAS PADRÃO (Starter ou Pro)
        let plan = "starter"
        if (value >= 149.9) plan = "pro"

        await supabase
          .from("users")
          .update({ 
            status: 'active',
            plan: plan
          })
          .eq("id", userId)
        
        console.log(`[Webhook] Assinatura ${plan} ativada para usuário ${userId}`);
      }

      // Fetch the updated user to process commission
      const { data: user } = await supabase
        .from('users')
        .select('id, name, referred_by')
        .eq('id', payment.externalReference?.replace('EXTRA_', '') || userId)
        .single();
      
      // Sistema de comissões de embaixadores
      if (user && user.referred_by) {
        const { data: ambassador } = await supabase
          .from('users')
          .select('id, coupon_code')
          .eq('coupon_code', user.referred_by)
          .single();

        if (ambassador && ambassador.id !== user.id) {
          // Check se já existe comissão para este usuário (1ª mensalidade apenas)
          const { data: existingComm } = await supabase
            .from('commissions')
            .select('id')
            .eq('user_id', user.id)
            .single();
            
          if (!existingComm) {
            // Criar comissão
          await supabase.from('commissions').insert({
            ambassador_code: user.referred_by,
            user_id: user.id,
            amount: value, // valor do 1º mês do plano que o piloto assinou
            status: 'pending'
          });

          // Notificar embaixador
          await supabase.from('notifications').insert({
            user_id: ambassador.id,
            type: 'new_commission',
            message: `Novo piloto ${user.name} gerou comissão de R$${value}`
          });

          // Notificar admin
          const { data: admin } = await supabase
            .from('users')
            .select('id')
            .eq('type', 'admin')
            .single();

          if (admin) {
            await supabase.from('notifications').insert({
              user_id: admin.id,
              type: 'commission_pending',
              message: `Embaixadora ${user.referred_by.toUpperCase()} tem comissão pendente por ${user.name}`
            });
          }
          }
        }
      }
    }

    // ============================
    // 🟠 PAGAMENTO ATRASADO (3 dias de carência)
    // ============================

    if (event === "PAYMENT_OVERDUE") {
      if (!payment) return new Response("ok")

      const userId = extractUserId(payment)
      if (!userId) return new Response("ok")

      // Verifica data de vencimento — se passou 3 dias, desativa
      const dueDate = new Date(payment.dueDate || payment.originalDueDate)
      const now = new Date()
      const diasAtraso = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diasAtraso >= 3) {
        await supabase
          .from("users")
          .update({ status: 'inactive' })
          .eq("id", userId)

        console.log(`[Webhook] Inadimplência ${diasAtraso} dias: usuário ${userId} desativado.`);
      } else {
        console.log(`[Webhook] Pagamento atrasado ${diasAtraso} dias (carência 3 dias). Aguardando.`);
      }
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
          .update({ status: 'inactive' })
          .eq("id", sub.user_id)
      }

      // atualiza assinatura
      await supabase
        .from("subscriptions")
        .update({ status: "inactive" })
        .eq("asaas_subscription_id", subId)
    }

    // ============================
    // 💸 PAGAMENTO REEMBOLSADO
    // ============================

    if (event === "PAYMENT_REFUNDED" || event === "PAYMENT_DELETED") {
      if (!payment) return new Response("ok")

      const userId = extractUserId(payment)
      if (!userId) return new Response("ok")

      // Desativa o usuário (reembolso = perda de acesso)
      await supabase
        .from("users")
        .update({ status: 'inactive' })
        .eq("id", userId)

      console.log(`[Webhook] Reembolso/Exclusão: usuário ${userId} desativado.`);
    }

    // ============================
    // 🔴 CARTÃO RECUSADO
    // ============================

    if (event === "PAYMENT_CREDIT_CARD_CAPTURE_REFUSED") {
      if (!payment) return new Response("ok")

      const userId = extractUserId(payment)
      if (userId) {
        console.log(`[Webhook] Cartão recusado para usuário ${userId}. Asaas tentará novamente.`);
        // Não desativa imediatamente — Asaas tentará cobrar novamente
        // Se virar OVERDUE por 3+ dias, o bloco acima desativa
      }
    }

    return new Response("ok", { status: 200 })
  } catch (err) {
    console.error("Erro webhook:", err)
    return new Response("error", { status: 500 })
  }
}
