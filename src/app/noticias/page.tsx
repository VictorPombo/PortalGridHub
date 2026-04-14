"use client";

import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  image_url: string;
  category: string;
  tipo: 'mundial' | 'br';
  published_at: string;
}

export default function NoticiasPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        const json = await res.json();
        
        if (json.success && json.data) {
          const combined = [...(json.data.br || []), ...(json.data.mundial || [])];
          
          // Ordena tudo junto descrecente
          combined.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
          
          setNews(combined);
        }
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-[#ff2a2a] animate-spin mb-4" />
        <p className="text-gray-400 text-lg font-medium">Carregando notícias automotivas...</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <Newspaper className="w-16 h-16 text-gray-700 mb-4" />
        <p className="text-gray-400 text-lg">Nenhuma notícia encontrada no momento.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10 border-b border-gray-800 pb-6">
          <Newspaper className="w-8 h-8 text-[#ff2a2a]" />
          <h1 className="text-3xl font-bold text-white tracking-tight">PitLane <span className="text-[#ff2a2a]">News</span></h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => {
            const dateStr = item.published_at ? format(new Date(item.published_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : '';

            return (
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block bg-[#111111] border border-gray-800 rounded-xl overflow-hidden hover:border-[#ff2a2a]/60 hover:shadow-2xl hover:shadow-[#ff2a2a]/10 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="relative aspect-video overflow-hidden bg-black">
                  {/* tag categoria absolute */}
                  <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[#ff2a2a] text-xs font-bold tracking-wider uppercase">{item.category}</span>
                  </div>
                  
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Text Area */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">
                    <span>{item.source}</span>
                    <span>&bull;</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-lg leading-snug line-clamp-3 mb-6 flex-1 group-hover:text-gray-200 transition-colors">
                    {item.title}
                  </h3>

                  {/* Footer Area */}
                  <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">Acessar Portal</span>
                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-[#ff2a2a] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
