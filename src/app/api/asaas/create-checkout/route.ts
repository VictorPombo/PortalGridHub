import { NextResponse } from 'next/server';

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
  const searchData = await searchRes.json();

  if (searchData.data && searchData.data.length > 0) {
    return searchData.data[0].id;
  }

  const createRes = await fetch(`${ASAAS_BASE_URL}/customers`, {
    method: 'POST',
    headers: asaasHeaders,
    body: JSON.stringify({ name, email, cpfCnpj: cpf || undefined }),
  });
  const createData = await createRes.json();
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

    const { user_id, user_name, user_email, user_cpf, plan } = await req.json();

    if (!user_id || !user_name || !user_email || !plan) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const PLANS: Record<string, { name: string; value: number }> = {
      starter: { name: 'Piloto Starter', value: 99.90 },
      pro: { name: 'Piloto Pro', value: 149.90 },
    };

    const planData = PLANS[plan];
    if (!planData) return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });

    // TEMPORARY BYPASS TO DIAGNOSE INFINITE HANG:
    return NextResponse.json({
      success: true,
      payment_id: "fake_id_123",
      invoice_url: "https://sandbox.asaas.com/i/fake_abc",
      plan: plan,
      plan_name: planData.name,
      value: planData.value,
    });

    /* -- Comentando código temporariamente --
    // 1. Criar/buscar cliente
    const customerId = await findOrCreateCustomer(user_name, user_email, user_cpf);

    // 2. Criar assinatura recorrente nativa
    const subRes = await fetch(`${ASAAS_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: asaasHeaders,
      body: JSON.stringify({
        customer: customerId,
        billingType: 'UNDEFINED',
        value: planData.value,
        cycle: 'MONTHLY',
        description: `Driver News - ${planData.name} | user: ${user_id}`,
        externalReference: user_id,
      }),
    });

    const subData = await subRes.json();

    if (!subData.id) {
      console.error('[Asaas] Erro ao criar assinatura:', subData);
      const errs = subData.errors ? JSON.stringify(subData.errors) : 'Desconhecido';
      return NextResponse.json({ error: 'Falha ao criar assinatura: ' + errs }, { status: 500 });
    }

    const invoiceUrl = subData.invoiceUrl || `https://www.asaas.com/i/${subData.id}`;

    return NextResponse.json({
      success: true,
      payment_id: subData.id,
      invoice_url: invoiceUrl,
      plan: plan,
      plan_name: planData.name,
      value: planData.value,
    });
    */

  } catch (err: any) {
    console.error('[Asaas Checkout] Erro:', err);
    return NextResponse.json({ error: String(err.stack || err.message || err) }, { status: 500 });
  }
}
