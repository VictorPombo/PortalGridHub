import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Rejeita eventos que não sejam de confirmação de pagamento
    if (body.event !== 'PAYMENT_RECEIVED' && body.event !== 'PAYMENT_CONFIRMED') {
      return NextResponse.json({ success: true, message: 'Evento ignorado' });
    }

    const customerId = body.payment?.customer;
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Customer ID não encontrado' }, { status: 400 });
    }

    // Precisamos saber quem é o dono desse pagamento. Como o link é genérico,
    // o Asaas cria um customer novo com o email que o usuário digitou no checkout.
    // 1. Buscamos o email associado a esse customer na API do Asaas.
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

    // 2. Com o email em mãos, ativamos o Piloto no nosso banco de dados.
    const { data: updatedUser, error: dbError } = await supabase
      .from('users')
      .update({ status: 'active' }) // Ativa a conta!
      .eq('email', customerEmail)
      .select()
      .single();

    if (dbError) throw dbError;

    // Se tudo deu certo, podemos opcionalmente disparar email de boas vindas aqui
    
    return NextResponse.json({ success: true, activated: customerEmail });

  } catch (error: any) {
    console.error('Asaas Webhook Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
