import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;
const ASAAS_BASE_URL = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: 'user_id obrigatório' }, { status: 400 });
    }

    // Busca assinatura ativa do usuário
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('asaas_subscription_id')
      .eq('user_id', user_id)
      .eq('status', 'active')
      .single();

    if (!sub?.asaas_subscription_id) {
      return NextResponse.json({ error: 'Nenhuma assinatura ativa encontrada' }, { status: 404 });
    }

    // Cancela no Asaas
    const cancelRes = await fetch(`${ASAAS_BASE_URL}/subscriptions/${sub.asaas_subscription_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
    });

    if (!cancelRes.ok) {
      const err = await cancelRes.json();
      return NextResponse.json({ error: 'Falha ao cancelar no Asaas', details: err }, { status: 500 });
    }

    // Atualiza local (webhook também fará isso, mas fazemos aqui por segurança)
    await supabase.from('subscriptions').update({ status: 'inactive' }).eq('asaas_subscription_id', sub.asaas_subscription_id);
    await supabase.from('users').update({ is_active: false }).eq('id', user_id);

    return NextResponse.json({ success: true, message: 'Assinatura cancelada' });

  } catch (err) {
    console.error('[Asaas Cancel] Erro:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
