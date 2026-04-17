import { NextResponse } from 'next/server';

// Buscar ou criar cliente no Asaas
async function findOrCreateCustomer(name: string, email: string, cpf?: string): Promise<string> {
  const asaasHeaders = {
    'Content-Type': 'application/json',
    'access_token': process.env.ASAAS_API_KEY || '',
  };
  const ASAAS_BASE_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';

  // 1. Tenta buscar cliente existente pelo email
  const searchRes = await fetch(`${ASAAS_BASE_URL}/customers?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: asaasHeaders,
  });
  const searchData = await searchRes.json();

  if (searchData.data && searchData.data.length > 0) {
    return searchData.data[0].id; // Retorna ID do cliente existente
  }

  // 2. Se não existe, cria novo
  const createRes = await fetch(`${ASAAS_BASE_URL}/customers`, {
    method: 'POST',
    headers: asaasHeaders,
    body: JSON.stringify({
      name,
      email,
      cpfCnpj: cpf || undefined,
      notificationDisabled: false,
    }),
  });

  const createData = await createRes.json();

  if (!createData.id) {
    console.error('[Asaas] Erro ao criar cliente:', createData);
    throw new Error('Falha ao criar cliente no Asaas');
  }

  return createData.id;
}

// ═══════════════════════════════════════════════════════
// POST — Criar assinatura no Asaas
// ═══════════════════════════════════════════════════════
export async function POST(req: Request) {
  try {
    const asaasHeaders = {
      'Content-Type': 'application/json',
      'access_token': process.env.ASAAS_API_KEY || '',
    };
    const ASAAS_BASE_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';

    const body = await req.json();
    const { user_id, user_name, user_email, user_cpf, plan } = body;

    // Validações
    if (!user_id || !user_name || !user_email || !plan) {
      return NextResponse.json({ error: 'Campos obrigatórios: user_id, user_name, user_email, plan' }, { status: 400 });
    }

    // Preços por plano
    const PLAN_PRICES: Record<string, number> = {
      starter: 99.90,
      pro: 149.90,
    };

    const value = PLAN_PRICES[plan];
    if (!value) {
      return NextResponse.json({ error: 'Plano inválido. Use: starter ou pro' }, { status: 400 });
    }

    // 1. Criar/buscar cliente no Asaas
    const customerId = await findOrCreateCustomer(user_name, user_email, user_cpf);

    // 2. Criar assinatura com externalReference = user_id
    const subRes = await fetch(`${ASAAS_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: asaasHeaders,
      body: JSON.stringify({
        customer: customerId,
        billingType: 'UNDEFINED', // Permite cartão, pix e boleto
        value: value,
        cycle: 'MONTHLY',
        description: `Driver News - Plano ${plan.charAt(0).toUpperCase() + plan.slice(1)} | user: ${user_id}`,
        externalReference: user_id, // ← CRÍTICO: é assim que o webhook identifica o usuário
      }),
    });

    const subData = await subRes.json();

    if (!subData.id) {
      console.error('[Asaas] Erro ao criar assinatura:', subData);
      return NextResponse.json({ error: 'Falha ao criar assinatura', details: subData }, { status: 500 });
    }

    // 3. Buscar o link de pagamento da primeira fatura
    // Asaas gera automaticamente a primeira cobrança ao criar a assinatura
    // O invoiceUrl é o link onde o cliente paga (aceita cartão, pix e boleto)
    const paymentUrl = subData.invoiceUrl || `https://www.asaas.com/i/${subData.id}`;

    return NextResponse.json({
      success: true,
      subscription_id: subData.id,
      payment_url: paymentUrl,
      plan: plan,
      value: value,
    });

  } catch (err) {
    console.error('[Asaas] Erro:', err);
    return NextResponse.json({ error: 'Erro interno ao processar pagamento' }, { status: 500 });
  }
}
