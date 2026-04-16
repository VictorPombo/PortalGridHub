import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
          submitted_at: body.status === 'sent' ? new Date().toISOString() : null
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

    const payload: any = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.publishedAt !== undefined) payload.published_at = updates.publishedAt;
    if (updates.submittedAt !== undefined) payload.submitted_at = updates.submittedAt;
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.brief !== undefined) payload.brief = updates.brief;
    if (updates.body !== undefined) payload.body = updates.body;
    if (updates.img !== undefined) payload.img = updates.img;

    const { data: updatedArticle, error } = await supabase
      .from('articles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, article: updatedArticle });
  } catch (error: any) {
    console.error('Update article error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
