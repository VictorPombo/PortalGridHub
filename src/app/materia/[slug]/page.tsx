import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Share2, ArrowLeft } from "lucide-react";
import { ContentOriginBadge } from "../../../components/badges/ContentOriginBadge";
import { SejaAutorCTA } from "../../../components/cta/SejaAutorCTA";

// Isso seria trazido do Supabase via fetching no Next.js Server Side.
// Dummy function para o layout
async function getMateria(slug: string) {
  // Simulando dados do DB
  return {
    titulo: "Mercedes Surpreende em 2026 e Retoma o Controle do Mundial de F1",
    subtitulo: "A flecha de prata domina o campeonato de construtores após 3 GPs, provando que decodificou perfeitamente o novo regulamento.",
    imagem_capa: "https://upload.wikimedia.org/wikipedia/commons/3/3f/FIA_F1_Austria_2023_Nr._44_%282%29.jpg",
    categoria: "F1",
    publicado_em: "16 de Abril de 2026",
    conteudo_markdown: "Aqui entra o corpo da matéria...\n\nEle foi otimizado pela IA a partir das respostas do piloto autor.",
    autor: {
      nome: "Renato Diniz",
      categoria: "Engenheiro Motorsport",
      foto: "https://i.pravatar.cc/150?u=renato"
    }
  };
}

export default async function MateriaPage({ params }: { params: { slug: string } }) {
  const materia = await getMateria(params.slug);

  if (!materia) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      {/* Header Back */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4">
        {/* Header Artigo */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ContentOriginBadge tipo="exclusivo" />
              <span className="text-zinc-400 text-sm font-medium">{materia.publicado_em}</span>
            </div>
            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" title="Compartilhar">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
            {materia.titulo}
          </h1>

          {materia.subtitulo && (
            <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed font-light mb-8">
              {materia.subtitulo}
            </p>
          )}

          {/* Autor Highlight */}
          <div className="flex items-center gap-4 py-5 border-y border-zinc-800/60 mb-8 bg-zinc-900/30 px-4 rounded-xl">
             <img 
              src={materia.autor.foto} 
              alt={materia.autor.nome} 
              className="w-14 h-14 rounded-full object-cover border-2 border-red-600/50 p-0.5" 
            />
            <div className="flex flex-col">
              <span className="text-sm text-zinc-400 mb-0.5 tracking-wide uppercase font-semibold">Redação Driver News por</span>
              <span className="text-lg font-bold text-white">{materia.autor.nome} <span className="font-normal text-zinc-500 text-sm ml-2">({materia.autor.categoria})</span></span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-zinc-800 shadow-2xl">
          <img 
            src={materia.imagem_capa} 
            alt={materia.titulo} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Dynamic Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-red-500 hover:prose-a:text-red-400">
          <p>{materia.conteudo_markdown}</p>
        </div>

        {/* DISCLAIMER DE IA - OBRIGATÓRIO */}
        <div className="mt-16 p-6 sm:p-8 bg-zinc-900 border-l-4 border-l-red-600 rounded-r-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/></svg>
          </div>
          <h4 className="text-white font-bold mb-3 uppercase text-sm tracking-wider flex items-center gap-2">
            Nota de Publicação e IA
          </h4>
          <p className="text-zinc-400 text-sm sm:text-[15px] leading-relaxed">
            Esta é uma matéria autoral e exclusiva Driver News. O conteúdo estrutural foi gerado e refinado através de <strong>Inteligência Artificial</strong> (Driver AI Engine), operando estritamente a partir do preenchimento contextual (Input Original) submetido por <strong className="text-zinc-200">{materia.autor.nome}</strong>. O autor validou o rascunho de forma afirmativa sob os Termos de Uso do Portal, isentando a NextHub de edições textuais próprias.
          </p>
        </div>

      </article>

      {/* CTA Final */}
      <div className="max-w-4xl mx-auto px-4 mt-20">
        <SejaAutorCTA />
      </div>
    </main>
  );
}
