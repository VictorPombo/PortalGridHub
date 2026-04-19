import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../../lib/supabase';

// Lista embaixadores e totais
export async function GET() {
  try {
    const { data: users, error: usersErr } = await supabase
      .from('users')
      .select('id, name, coupon_code')
      .eq('role', 'ambassador');

    if (usersErr) throw usersErr;

    const { data: commissions, error: comErr } = await supabase
      .from('commissions')
      .select('ambassador_code, amount, status, user_id, users(name)');

    if (comErr) throw comErr;

    const result = users.map(u => {
      const uComms = commissions.filter(c => c.ambassador_code === u.coupon_code);
      const totalPaid = uComms.filter(c => c.status === 'paid').reduce((a, b) => a + Number(b.amount), 0);
      const totalPending = uComms.filter(c => c.status === 'pending').reduce((a, b) => a + Number(b.amount), 0);
      
      const pilotsList = uComms.map(c => ({
        amount: c.amount,
        status: c.status,
        pilot_name: c.users?.name || 'Desconhecido'
      }));

      return {
        ...u,
        totalPaid,
        totalPending,
        details: pilotsList
      };
    });

    return NextResponse.json({ success: true, ambassadors: result });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Paga comissão mútua ou de todos para um cupom
export async function POST(request: Request) {
  try {
    const { ambassador_code, commission_id } = await request.json();

    if (commission_id) {
       // Paga uma especifica (PATCH manual)
       const { error } = await supabase.from('commissions').update({ status: 'paid' }).eq('id', commission_id);
       if(error) throw error;
       return NextResponse.json({ success: true });
    }

    if (!ambassador_code) return NextResponse.json({ success: false, error: 'Código do embaixador obrigatório' }, { status: 400 });

    const { error } = await supabase
      .from('commissions')
      .update({ status: 'paid' })
      .eq('ambassador_code', ambassador_code)
      .eq('status', 'pending');

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
