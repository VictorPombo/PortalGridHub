import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    const password_hash = crypto.createHash('sha256').update(password).digest('hex');

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password_hash)
      .single();

    if (error || !user) {
      return NextResponse.json({ success: false, error: 'Credenciais inválidas.' }, { status: 401 });
    }

    // Removendo o hash da senha por segurança antes de devolver ao client
    delete user.password_hash;

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Login auth error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
