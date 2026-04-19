import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../../lib/supabase';

export async function PATCH(request: Request) {
  try {
    const { user_id } = await request.json();

    if (!user_id) return NextResponse.json({ success: false, error: 'User ID obrigatório' }, { status: 400 });

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user_id)
      .eq('read', false);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
