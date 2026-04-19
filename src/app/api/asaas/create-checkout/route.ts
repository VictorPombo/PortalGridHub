import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";

// Buscar ou criar cliente no Asaas
async function findOrCreateCustomer(name: string, email: string, cpf?: string): Promise<string> {
  const asaasHeaders = {
    'Content-Type': 'application/json',
    'access_token': process.env.ASAAS_API_KEY || '',
  };
  const ASAAS_BASE_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';

  const searchRes = await fetch(`${ASAAS_BASE_URL}/customers?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: asaasHeaders,
  });
  let searchData;
  try {
    const rawSearch = await searchRes.text();
    searchData = JSON.parse(rawSearch);
  } catch(e) {
    throw new Error("Erro Asaas Search: " + String(e));
  }

  if (searchData.data && searchData.data.length > 0) {
    const existingId = searchData.data[0].id;
    // Se o cliente já existia (talvez gerado sem CPF antes), e agora temos um CPF, atualiza a ficha dele no Asaas
    if (cpf) {
      await fetch(`${ASAAS_BASE_URL}/customers/${existingId}`, {
        method: 'POST',
        headers: asaasHeaders,
        body: JSON.stringify({ cpfCnpj: cpf }),
      });
    }
    return existingId;
  }

  const createRes = await fetch(`${ASAAS_BASE_URL}/customers`, {
    method: 'POST',
    headers: asaasHeaders,
    body: JSON.stringify({ name, email, cpfCnpj: cpf || undefined }),
  });
  
  let createData;
  try {
    const rawCreate = await createRes.text();
    createData = JSON.parse(rawCreate);
  } catch(e) {
    throw new Error("Erro Asaas Create: " + String(e));
  }
  
  if (!createData.id) {
    const errorDetails = createData.errors ? JSON.stringify(createData.errors) : 'Desconhecido';
    throw new Error('Falha ao criar cliente no Asaas: ' + errorDetails);
  }
  return createData.id;
}

export async function POST(req: Request) {
  try {
    const asaasHeaders = {
      'Content-Type': 'application/json',
      'access_token': process.env.ASAAS_API_KEY || '',
    };
    const ASAAS_BASE_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';

    const { user_id, user_name, user_email, user_cpf, plan, isUpgrade, paymentMethod } = await req.json();

    if (!user_id || !user_name || !user_email || !plan) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const PLANS: Record<string, { name: string; value: number }> = {
      starter: { name: 'Piloto Starter', value: 99.90 },
      pro: { name: 'Piloto Pro', value: 149.90 },
      extra: { name: 'Matéria Extra', value: 59.90 },
    };

    const planData = PLANS[plan];
    if (!planData) return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });

    // 1. Criar/buscar cliente
    const customerId = await findOrCreateCustomer(user_name, user_email, user_cpf);

    // 2. Criar cobrança (Assinatura ou Avulso)
    let asaasRes;
    
    if (isUpgrade && plan === 'pro') {
      // UPGRADE FLOW
      const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const { data: currentSub } = await supabaseAdmin.from('subscriptions').select('asaas_subscription_id').eq('user_id', user_id).eq('status', 'active').single();

      if (currentSub?.asaas_subscription_id) {
        // Atualiza a assinatura existente para 149.90 a partir do ciclo seguinte
        await fetch(`${ASAAS_BASE_URL}/subscriptions/${currentSub.asaas_subscription_id}`, {
          method: 'POST',
          headers: asaasHeaders,
          body: JSON.stringify({
            value: planData.value,
            updatePendingPayments: true
          }),
        });
      }

      // Fatura avulsa da diferença imediata
      asaasRes = await fetch(`${ASAAS_BASE_URL}/payments`, {
        method: 'POST',
        headers: asaasHeaders,
        body: JSON.stringify({
          customer: customerId,
          billingType: 'CREDIT_CARD',
          value: 50.00,
          dueDate: new Date().toISOString().split('T')[0],
          description: `Driver News - UPGRADE para ${planData.name} | user: ${user_id}`,
          externalReference: `UPGRADE_${user_id}`,
        }),
      });
    } else if (plan === 'extra') {
      // Cobrança avulsa (Pagamento Único)
      asaasRes = await fetch(`${ASAAS_BASE_URL}/payments`, {
        method: 'POST',
        headers: asaasHeaders,
        body: JSON.stringify({
          customer: customerId,
          billingType: paymentMethod || 'UNDEFINED',
          value: planData.value,
          dueDate: new Date().toISOString().split('T')[0], // Hoje
          description: `Driver News - ${planData.name} | user: ${user_id}`,
          externalReference: `EXTRA_${user_id}`,
        }),
      });
    } else {
      // Assinatura recorrente padrão
      asaasRes = await fetch(`${ASAAS_BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: asaasHeaders,
        body: JSON.stringify({
          customer: customerId,
          billingType: 'CREDIT_CARD',
          value: planData.value,
          cycle: 'MONTHLY',
          description: `Driver News - ${planData.name} | user: ${user_id}`,
          externalReference: user_id,
        }),
      });
    }

    let subData;
    try {
      const rawText = await asaasRes.text();
      try {
        subData = JSON.parse(rawText);
      } catch (e) {
        throw new Error("Asaas retornou algo inválido: " + rawText);
      }
    } catch(err: any) {
      return NextResponse.json({ error: 'Erro lidando com retorno da Asaas: ' + err.message }, { status: 500 });
    }

    if (!subData.id) {
      console.error('[Asaas] Erro ao criar cobrança:', subData);
      const errs = subData.errors ? JSON.stringify(subData.errors) : 'Desconhecido';
      return NextResponse.json({ error: 'Falha ao processar pagamento no Asaas: ' + errs }, { status: 500 });
    }

    let invoiceUrl = subData.invoiceUrl || subData.bankSlipUrl;

    // Se é assinatura, o Asaas não retorna URL de fatura. Precisamos pegar a primeira cobrança gerada para a assinatura!
    if (plan !== 'extra' && subData.id && subData.id.startsWith('sub_') && !invoiceUrl) {
      try {
        const payRes = await fetch(`${ASAAS_BASE_URL}/payments?subscription=${subData.id}`, {
          method: 'GET',
          headers: asaasHeaders,
        });
        const payData = await payRes.json();
        if (payData.data && payData.data.length > 0) {
          invoiceUrl = payData.data[0].invoiceUrl;
        }
      } catch (e) {
        console.error("Erro ao buscar primeira cobrança da assinatura:", e);
      }
    }

    if (!invoiceUrl) {
      invoiceUrl = `https://www.asaas.com/i/${subData.id}`;
    }

    return NextResponse.json({
      success: true,
      payment_id: subData.id,
      invoice_url: invoiceUrl,
      plan: plan,
      plan_name: planData.name,
      value: planData.value,
    });

  } catch (err: any) {
    console.error('[Asaas Checkout] Erro:', err);
    return NextResponse.json({ error: String(err.stack || err.message || err) }, { status: 500 });
  }
}
