import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { slugify } from '../../../../lib/slugify';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug')
    .is('slug', null);

  if (!articles || articles.length === 0) {
    return Response.json({ message: 'Nenhum artigo sem slug.' });
  }

  const results = [];

  for (const article of articles) {
    let slug = slugify(article.title || '');
    let attempt = 0;

    // Garantir unicidade
    while (true) {
      const candidateSlug = attempt === 0 ? slug : `${slug}-${attempt}`;
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', candidateSlug)
        .single();

      if (!existing) {
        slug = candidateSlug;
        break;
      }
      attempt++;
    }

    await supabase.from('articles').update({ slug }).eq('id', article.id);
    results.push({ id: article.id, slug });
  }

  return Response.json({ updated: results.length, slugs: results });
}
