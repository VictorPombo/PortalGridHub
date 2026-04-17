import { NextResponse } from 'next/server';

const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;
const ASAAS_BASE_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';

const asaasHeaders = {
  'Content-Type': 'application/json',
  'access_token': ASAAS_API_KEY,
};

// Buscar ou criar cliente no Asaas
async function findOrCreateCustomer(name: string, email: string, cpf?: string): Promise<string> {
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
  if (!createData.id) throw new Error('Falha ao criar cliente no Asaas');
  return createData.id;
}

export async function POST(req: Request) {
  try {
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

    // 1. Criar/buscar cliente
    const customerId = await findOrCreateCustomer(user_name, user_email, user_cpf);

    // 2. Criar cobrança com link de pagamento
    const paymentRes = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: asaasHeaders,
      body: JSON.stringify({
        customer: customerId,
        billingType: 'UNDEFINED', // Pix + Cartão + Boleto
        value: planData.value,
        description: `Driver News - ${planData.name} | user: ${user_id}`,
        externalReference: user_id,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // vence amanhã
      }),
    });

    const paymentData = await paymentRes.json();

    if (!paymentData.id) {
      console.error('[Asaas] Erro ao criar cobrança:', paymentData);
      return NextResponse.json({ error: 'Falha ao criar cobrança' }, { status: 500 });
    }

    // 3. O invoiceUrl é a página de pagamento do Asaas (pode ser embeddada)
    const invoiceUrl = paymentData.invoiceUrl;

    // 4. Também criar assinatura recorrente para os próximos meses
    try {
      await fetch(`${ASAAS_BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: asaasHeaders,
        body: JSON.stringify({
          customer: customerId,
          billingType: 'UNDEFINED',
          value: planData.value,
          cycle: 'MONTHLY',
          description: `Driver News - ${planData.name} | user: ${user_id}`,
          externalReference: user_id,
          nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }),
      });
    } catch (subErr) {
      console.warn('[Asaas] Erro ao criar assinatura recorrente (não crítico):', subErr);
    }

    return NextResponse.json({
      success: true,
      payment_id: paymentData.id,
      invoice_url: invoiceUrl,
      plan: plan,
      plan_name: planData.name,
      value: planData.value,
    });

  } catch (err) {
    console.error('[Asaas Checkout] Erro:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
