import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';

export const revalidate = 60;

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
        next: { revalidate: 60 },
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
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        next: { revalidate: 60 },
      }
    );
    if (!articlesRes.ok) throw new Error(await articlesRes.text());
    const articles = await articlesRes.json();

    return NextResponse.json({ success: true, users, articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
