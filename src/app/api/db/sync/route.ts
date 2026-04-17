import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Raw fetch for users to bypass PostgREST SDK schema cache
    const usersRes = await fetch(
      `${supabaseUrl}/rest/v1/users?select=*`,
      {
        method: 'GET',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        cache: 'no-store',
      }
    );
    if (!usersRes.ok) throw new Error(await usersRes.text());
    const users = await usersRes.json();

    // Articles can stay on SDK (no new columns added there)
    const { data: articles, error: errArticles } = await supabase.from('articles').select('*');
    if (errArticles) throw errArticles;

    return NextResponse.json({ success: true, users, articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
