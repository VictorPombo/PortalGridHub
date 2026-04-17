import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', body.email)
      .single();

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'E-mail já cadastrado.' }, { status: 400 });
    }

    // Insert user
    let password_hash = null;
    if (body.password) {
      password_hash = crypto.createHash('sha256').update(body.password).digest('hex');
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name: body.name,
          email: body.email,
          password_hash,
          type: body.type || 'piloto',
          plan: body.plan || 'starter',
          is_active: false, // Start as false until Asaas webhook confirms
          avatar: body.avatar,
          referred_by: body.referredBy || null,
          category: body.category || '',
          number: body.number || '',
          bio: body.bio || '',
          instagram: body.instagram || '',
          whatsapp: body.whatsapp || '',
          pilot_name: body.pilotName || '',
          team: body.team || '',
          city: body.city || '',
          dob: body.dob || '',
          career: body.career || '',
          last_race: body.lastRace || '',
          next_race: body.nextRace || '',
          goals: body.goals || '',
          sponsors: body.sponsors || '',
          sponsor_message: body.sponsorMessage || '',
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error('Add user error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;
    if (!id) return NextResponse.json({ success: false, error: 'ID requerido.' }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Use raw fetch to bypass Supabase JS SDK schema cache
    const res = await fetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(updates),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    const rows = await res.json();
    const updatedUser = rows[0];

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
