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

        {/* SOBRE ESTA MATÉRIA - DISCLAIMER OBRIGATÓRIO (SUBSTITUIDO CONFORME ITEM 4) */}
        <div className="mt-16 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-sm text-zinc-400">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">ℹ️</span>
            <h4 className="text-white font-bold uppercase tracking-wider">
              Sobre esta matéria
            </h4>
          </div>
          <p className="leading-relaxed mb-4">
            Esta matéria exclusiva foi produzida por {materia.autor.nome}, {materia.autor.categoria}, utilizando a plataforma Driver News. O conteúdo foi redigido com auxílio de inteligência artificial a partir de informações fornecidas pelo autor, que revisou e aprovou a versão final e é o único responsável pelo conteúdo publicado.
          </p>
          <p className="leading-relaxed font-semibold">
            Se você identificou alguma imprecisão ou deseja reportar este conteúdo, entre em contato: <a href="mailto:contato.drivernews@proton.me" className="text-red-500 hover:text-red-400">contato.drivernews@proton.me</a>
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
