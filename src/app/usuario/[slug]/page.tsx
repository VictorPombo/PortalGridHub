import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseAdmin as supabase } from '../../../lib/supabase';
import Link from 'next/link';

export const revalidate = 300; // Cache de 5min (CDN)

async function getPilotData(slug: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !user) {
    // Tenta fallback por ID caso o slug seja igual ao ID antigo
    const { data: userById, error: errId } = await supabase
      .from('users')
      .select('*')
      .eq('id', slug)
      .single();
    if (errId || !userById) return null;
    return userById;
  }
  return user;
}

async function getPilotArticles(userId: string, pageNum: number = 1) {
  const limit = 15;
  const start = (pageNum - 1) * limit;
  const end = start + limit - 1;

  const { data: articles, count } = await supabase
    .from('articles')
    .select('id, title, brief, img, published_at, views', { count: 'exact' })
    .eq('author_id', userId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(start, end);

  return { articles: articles || [], total: count || 0, limit };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const user = await getPilotData(params.slug);
  if (!user) return { title: 'Piloto não encontrado' };

  const finalSlug = user.slug || user.id;
  const title = `${user.name} — Perfil do Piloto`;
  const desc = user.bio ? user.bio.substring(0, 160) : `Acompanhe a trajetória oficial de ${user.name} na Driver News.`;
  const imgUrl = user.avatar || user.avatar_url || user.cover_url || 'https://www.drivernews.com.br/images/share.jpg';

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://www.drivernews.com.br/usuario/${finalSlug}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://www.drivernews.com.br/usuario/${finalSlug}`,
      siteName: 'Driver News',
      images: [
        {
          url: imgUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: 'profile',
    },
  };
}

export default async function PilotPage({ params, searchParams }: { params: { slug: string }, searchParams: { page?: string } }) {
  const user = await getPilotData(params.slug);
  if (!user) return notFound();

  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const { articles, total, limit } = await getPilotArticles(user.id, currentPage);

  const conquests = user.conquests || {};
  const hasMultiplePages = total > limit;
  const totalPages = Math.ceil(total / limit);

  // Fallbacks e cálculos
  const planName = user.plan === 'pro' ? 'Pro' : user.plan === 'starter' ? 'Starter' : 'Free';
  const finalCover = user.cover_url || user.avatar_url || user.avatar || 'https://images.unsplash.com/photo-1541344983572-c511a5fe03fd?auto=format&fit=crop&w=1400&q=80';
  const bio = user.bio || 'Perfil em construção — o piloto ainda não adicionou sua biografia.';
  const statTotalViews = articles.reduce((acc: number, a: any) => acc + (a.views || 0), 0);

  // JSON-LD Person Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": user.name,
    "url": `https://www.drivernews.com.br/usuario/${user.slug || user.id}`,
    "image": finalCover,
    "jobTitle": user.category ? `Piloto de ${user.category}` : "Piloto de Automobilismo",
    "address": user.city || user.estado ? {
      "@type": "PostalAddress",
      "addressLocality": user.city || "",
      "addressRegion": user.estado || ""
    } : undefined
  };

  return (
    <main className="min-h-screen bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pilot-hero relative min-h-[400px] flex flex-col justify-end overflow-hidden border-b border-white/10">
        <img className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" src={finalCover} alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="absolute top-[80px] right-4 md:right-10 text-[100px] md:text-[200px] font-['Bebas_Neue'] text-white/5 select-none leading-none z-0">
          {user.number || '00'}
        </div>
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-8 pb-12">
          <span className="text-3xl md:text-5xl mb-4 block drop-shadow-lg">{user.flag || '🇧🇷'}</span>
          <h1 className="text-4xl md:text-7xl font-['Bebas_Neue'] uppercase text-white mb-2 tracking-wide drop-shadow-md">{user.name}</h1>
          <div className="text-sm md:text-base font-['Inter'] text-zinc-300 font-medium uppercase tracking-widest flex flex-wrap gap-2 items-center">
             <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold skew-x-[-10deg]">#{user.number || '00'}</span>
             <span>{user.category || 'Automobilismo'}</span>
             <span className="opacity-50">•</span>
             <span>Piloto {planName}</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
             {user.instagram && (
                <a href={`https://instagram.com/${user.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded px-4 py-2 transition text-sm font-medium">
                   IG: {user.instagram}
                </a>
             )}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* LEFT COL */}
         <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* Títulos e Conquistas */}
            <section>
               <h3 className="text-sm font-bold uppercase tracking-[3px] text-zinc-500 mb-6 flex items-center gap-4">
                 <span className="w-8 h-[1px] bg-red-600"></span>
                 Títulos e Conquistas
               </h3>
               <div className="flex bg-[#0a0a0a] border border-white/10 rounded-xl p-6 items-center flex-wrap md:flex-nowrap gap-6">
                 <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-5xl md:text-6xl text-white font-['Bebas_Neue'] font-bold">{conquests.titles || 0}</span>
                    <span className="text-sm text-zinc-400 uppercase tracking-widest">Títulos<br/>Gerais</span>
                 </div>
                 {conquests.titles_desc && (
                    <div className="md:border-l md:border-white/10 md:pl-6 text-zinc-300 italic text-sm md:text-base leading-relaxed">
                       "{conquests.titles_desc}"
                    </div>
                 )}
               </div>
            </section>

            {/* Bio */}
            <section>
               <h3 className="text-sm font-bold uppercase tracking-[3px] text-zinc-500 mb-6 flex items-center gap-4">
                 <span className="w-8 h-[1px] bg-red-600"></span>
                 Biografia
               </h3>
               <div className="text-zinc-300 leading-relaxed space-y-4 font-['Inter'] font-light">
                  <p>{bio}</p>
               </div>
            </section>

            {/* Layout de Matérias Paginação nativa */}
            <section>
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-[3px] text-zinc-500 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-red-600"></span>
                    Matérias Publicadas
                  </h3>
                  <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-2 py-1 rounded">{total} artigos</span>
               </div>
               
               {articles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {articles.map((a: any) => (
                       <Link href={`/materia/${a.id}`} key={a.id} className="group flex flex-col bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-red-600/50 transition">
                          <div className="relative h-40 bg-zinc-900 overflow-hidden">
                             {a.img && <img src={a.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />}
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                             <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-2">Notícia</span>
                             <h4 className="text-white font-semibold font-['Inter'] leading-snug line-clamp-3 mb-3 group-hover:text-red-500 transition">{a.title}</h4>
                             <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center text-[11px] text-zinc-500 font-mono">
                                <span>{new Date(a.published_at || new Date()).toLocaleDateString('pt-BR')}</span>
                                <span>{(a.views || 0).toLocaleString()} <span className="opacity-50">views</span></span>
                             </div>
                          </div>
                       </Link>
                    ))}
                  </div>
               ) : (
                  <div className="p-8 text-center text-zinc-500 bg-[#0a0a0a] border border-white/5 rounded-xl text-sm">
                     O piloto ainda não publicou matérias no portal.
                  </div>
               )}

               {/* Paginador */}
               {hasMultiplePages && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                     {currentPage > 1 && (
                        <Link href={`/usuario/${params.slug}?page=${currentPage - 1}`} className="px-4 py-2 border border-white/10 bg-white/5 text-white rounded hover:bg-white/10 transition text-sm">
                           Anterior
                        </Link>
                     )}
                     <span className="text-zinc-500 text-sm">Página {currentPage} de {totalPages}</span>
                     {currentPage < totalPages && (
                        <Link href={`/usuario/${params.slug}?page=${currentPage + 1}`} className="px-4 py-2 border border-white/10 bg-white/5 text-white rounded hover:bg-white/10 transition text-sm">
                           Próxima
                        </Link>
                     )}
                  </div>
               )}
            </section>
         </div>

         {/* RIGHT COL - SPONSORSHIP */}
         <div className="lg:col-span-4">
            <div className="sticky top-[100px] bg-gradient-to-b from-[#111] to-black border border-white/10 rounded-2xl p-8 relative overflow-hidden">
               <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full border border-red-600/30 flex items-center justify-center text-red-500 mb-6 bg-red-600/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Seja Patrocinador<br/>de {user.name}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                     Associe sua marca a {user.name}. Um acumulado de <span className="text-white font-bold">{statTotalViews.toLocaleString()} visualizações</span> no conteúdo publicado.
                  </p>
                  <a href={`mailto:${user.email}`} className="w-full bg-red-600 text-white font-bold uppercase tracking-widest text-xs py-4 rounded hover:bg-red-700 transition block cursor-pointer">
                    Entrar em Contato
                  </a>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
