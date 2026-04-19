import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js"
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { data, error } = await supabaseAdmin.from('users').select('status').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ status: data.status, is_active: data.status === 'active' });
}
