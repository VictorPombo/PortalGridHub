import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase dedicado ao servidor com Service Role (Ignora RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    
    // Validação de segurança do Webhook Asaas para evitar fraudes ou pings falsos
    const asaasSignature = request.headers.get('asaas-signature');
    if (!asaasSignature && process.env.ASAAS_WEBHOOK_TOKEN) {
      // Se não enviou a assinatura e nós exigimos (temos o token no ENV), bloqueia.
      console.warn("Webhook negado: Falta asaas-signature header");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // Rejeita eventos que não sejam de confirmação de pagamento
    if (body.event !== 'PAYMENT_RECEIVED' && body.event !== 'PAYMENT_CONFIRMED') {
      return NextResponse.json({ success: true, message: 'Evento ignorado' });
    }

    const customerId = body.payment?.customer;
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Customer ID não encontrado' }, { status: 400 });
    }

    // Buscamos o email associado a esse customer na API do Asaas.
    const asaasResponse = await fetch(`https://api.asaas.com/v3/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'access_token': process.env.ASAAS_API_KEY || '',
        'Content-Type': 'application/json'
      }
    });

    if (!asaasResponse.ok) {
      throw new Error('Falha ao buscar dados do cliente no Asaas');
    }

    const customerData = await asaasResponse.json();
    const customerEmail = customerData.email;

    if (!customerEmail) {
       return NextResponse.json({ success: false, error: 'Cliente no Asaas sem email' }, { status: 400 });
    }

    // Ativamos o Piloto no nosso banco de dados (Bypassing RLS usando Admin Client).
    const { data: updatedUser, error: dbError } = await supabaseAdmin
      .from('users')
      .update({ status: 'active' }) // Ativa a conta!
      .eq('email', customerEmail)
      .select()
      .single();

    if (dbError) throw dbError;
    
    return NextResponse.json({ success: true, activated: customerEmail });

  } catch (error: any) {
    console.error('Asaas Webhook Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
