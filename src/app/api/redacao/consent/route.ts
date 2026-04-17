import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { user_id, materia_id, final_titulo, final_corpo, consent_version } = await req.json();

    if (!user_id || !materia_id || !final_titulo) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
    }

    const contentString = final_titulo + final_corpo;
    const content_hash = crypto.createHash('sha256').update(contentString).digest('hex');

    // Extract IP securely. Note: Vercel/Next headers provide x-forwarded-for
    const ip_address = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const user_agent = req.headers.get('user-agent') || 'Unknown Agent';

    const { error: insErr } = await supabase.from('publication_consents').insert({
      user_id,
      materia_id,
      consent_type: 'publication',
      consent_version: consent_version || 'v1',
      content_hash,
      ip_address,
      user_agent
    });

    if (insErr) throw insErr;

    // Update Article Status
    const { error: updErr } = await supabase
      .from('materias')
      .update({
        status: 'publicada',
        published_at: new Date().toISOString()
      })
      .eq('id', materia_id);

    if (updErr) throw updErr;

    return NextResponse.json({ success: true, content_hash });
  } catch (err: any) {
    console.error('Consent error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
