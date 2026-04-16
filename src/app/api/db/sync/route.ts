import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET() {
  try {
    const { data: users, error: errUsers } = await supabase.from('users').select('id, email, name, type, plan, status, avatar, category, number, bio, instagram, whatsapp, pilot_name, team, city, dob, career, last_race, next_race, goals, sponsors, sponsor_message, conquests, social, created_at, referred_by');
    if (errUsers) throw errUsers;

    const { data: articles, error: errArticles } = await supabase.from('articles').select('*');
    if (errArticles) throw errArticles;

    return NextResponse.json({ success: true, users, articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
