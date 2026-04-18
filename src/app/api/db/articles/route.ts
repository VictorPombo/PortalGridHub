import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Válida status do autor antes de permitir inserir
    const { data: userAuth } = await supabase
      .from('users')
      .select('type, status')
      .eq('id', body.authorId)
      .single();

    if (!userAuth || (userAuth.status !== 'active' && userAuth.type !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Acesso negado. Assinatura pendente ou inativa.' }, { status: 403 });
    }

    const { data: newArticle, error } = await supabase
      .from('articles')
      .insert([
        {
          author_id: body.authorId,
          title: body.title,
          brief: body.brief || '',
          body: body.body || '',
          img: body.img || '',
          status: body.status || 'draft',
          category: body.category || '',
          submitted_at: ['sent', 'review', 'approved', 'published'].includes(body.status) ? (body.submittedAt || new Date().toISOString()) : null,
          published_at: body.status === 'published' ? (body.publishedAt || new Date().toISOString()) : null
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, article: newArticle });
  } catch (error: any) {
    console.error('Add article error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;
    
    if (!id) return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });

    // Válida status do autor antes de permitir atualizar
    const { data: articleCheck } = await supabase
      .from('articles')
      .select('author_id')
      .eq('id', id)
      .single();

    if (articleCheck) {
      const { data: userAuth } = await supabase
        .from('users')
        .select('type, status')
        .eq('id', articleCheck.author_id)
        .single();

      if (!userAuth || (userAuth.status !== 'active' && userAuth.type !== 'admin')) {
        return NextResponse.json({ success: false, error: 'Acesso negado. Assinatura pendente ou inativa.' }, { status: 403 });
      }
    }

    const payload: any = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.publishedAt !== undefined) payload.published_at = updates.publishedAt;
    if (updates.submittedAt !== undefined) payload.submitted_at = updates.submittedAt;
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.brief !== undefined) payload.brief = updates.brief;
    if (updates.body !== undefined) payload.body = updates.body;
    if (updates.img !== undefined) payload.img = updates.img;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.deleted !== undefined) payload.deleted = updates.deleted;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Use raw fetch to bypass SDK schema cache (for new columns like 'deleted')
    const res = await fetch(
      `${supabaseUrl}/rest/v1/articles?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    const rows = await res.json();
    const updatedArticle = rows[0];

    return NextResponse.json({ success: true, article: updatedArticle });
  } catch (error: any) {
    console.error('Update article error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
