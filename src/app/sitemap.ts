import { MetadataRoute } from 'next';
import { supabaseAdmin as supabase } from '../../lib/supabase';

// URL base oficial em produção
const BASE_URL = 'https://www.drivernews.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pilotos.html`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/planos.html`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sobre.html`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/transparencia.html`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

    // Fetcha todas as matérias ativas
    const articlesRes = await fetch(
      `${supabaseUrl}/rest/v1/articles?select=id,published_at,submitted_at&status=eq.published`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        cache: 'no-store',
      }
    );

    if (articlesRes.ok) {
      const articles = await articlesRes.json();
      articles.forEach((a: any) => {
        routes.push({
          url: `${BASE_URL}/materia.html?id=${a.id}`,
          lastModified: new Date(a.published_at || a.submitted_at || Date.now()),
          changeFrequency: 'never',
          priority: 0.9,
        });
      });
    }

    // Fetcha todos os usuários criadores (pilotos, especialistas, etc.)
    const usersRes = await fetch(
      `${supabaseUrl}/rest/v1/users?select=id,created_at&is_active=eq.true`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        cache: 'no-store',
      }
    );

    if (usersRes.ok) {
      const users = await usersRes.json();
      users.forEach((u: any) => {
        routes.push({
          url: `${BASE_URL}/piloto.html?id=${u.id}`,
          lastModified: new Date(u.created_at || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.warn('Erro ao gerar sitemap dinâmico:', error);
  }

  return routes;
}
