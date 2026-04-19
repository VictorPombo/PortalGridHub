import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Raw fetch for users to bypass PostgREST SDK schema cache
    const usersRes = await fetch(
      `${supabaseUrl}/rest/v1/users?select=*`,
      {
        method: 'GET',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
        },
        cache: 'no-store',
      }
    );
    if (!usersRes.ok) throw new Error(await usersRes.text());
    const users = await usersRes.json();

    // Como a coluna 'deleted' foi adicionada direto no banco fora das migrations originiais, 
    // precisamos ler via RAW REST para contornar o cache do PostgREST SDK.
    const articlesRes = await fetch(
      `${supabaseUrl}/rest/v1/articles?select=*`,
      {
        method: 'GET',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
        },
        cache: 'no-store',
      }
    );
    if (!articlesRes.ok) throw new Error(await articlesRes.text());
    const articles = await articlesRes.json();

    return NextResponse.json({ success: true, users, articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
