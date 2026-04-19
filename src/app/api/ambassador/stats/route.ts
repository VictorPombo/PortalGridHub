import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const coupon_code = searchParams.get('coupon_code');

    if (!coupon_code) {
      return NextResponse.json({ success: false, error: 'Cupom é obrigatório' }, { status: 400 });
    }

    // Pilotos indicados
    const { data: pilots, error: pilotError } = await supabase
      .from('users')
      .select('id, name, created_at, status')
      .eq('referred_by', coupon_code.toLowerCase());

    if (pilotError) throw pilotError;

    // Comissões
    const { data: commissions, error: comError } = await supabase
      .from('commissions')
      .select('user_id, amount, status')
      .eq('ambassador_code', coupon_code.toLowerCase());

    if (comError) throw comError;

    const safeCommissions = commissions || [];
    const totalPaid = safeCommissions.filter(c => c.status === 'paid').reduce((a, b) => a + Number(b.amount), 0);
    const totalPending = safeCommissions.filter(c => c.status === 'pending').reduce((a, b) => a + Number(b.amount), 0);

    // Notificações
    const { data: ambassador } = await supabase
      .from('users')
      .select('id')
      .eq('coupon_code', coupon_code.toLowerCase())
      .single();

    let unreadNotifications = 0;
    if (ambassador) {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', ambassador.id)
        .eq('read', false);
      unreadNotifications = count || 0;
    }

    const enrichedPilots = (pilots || []).map(p => {
      const comm = safeCommissions.find(c => c.user_id === p.id);
      return {
        ...p,
        commission_status: comm ? comm.status : 'none',
        commission_amount: comm ? comm.amount : 0
      }
    });

    return NextResponse.json({
      success: true,
      pilots: enrichedPilots,
      totalPaid,
      totalPending,
      unreadNotifications
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
