import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';

export async function POST(req: Request) {
  try {
    const { user_id, consent_version } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
    }

    const ip_address = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const user_agent = req.headers.get('user-agent') || 'Unknown Agent';

    const { error: insErr } = await supabase.from('publication_consents').insert({
      user_id,
      materia_id: null,
      consent_type: 'subscription',
      consent_version: consent_version || 'v1',
      content_hash: null,
      ip_address,
      user_agent
    });

    if (insErr) throw insErr;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Subscription Consent error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
