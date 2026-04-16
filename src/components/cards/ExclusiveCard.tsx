import Link from "next/link";
import Image from "next/image";
import { ContentOriginBadge } from "../badges/ContentOriginBadge";

interface ExclusiveCardProps {
  slug: string;
  titulo: string;
  subtitulo?: string;
  imagemCapa: string;
  categoria: string;
  autor: {
    nome: string;
    foto: string;
    categoria: string;
  };
  publicadoEm: string;
  destaque?: boolean;
}

export function ExclusiveCard({
  slug,
  titulo,
  subtitulo,
  imagemCapa,
  categoria,
  autor,
  publicadoEm,
  destaque = false,
}: ExclusiveCardProps) {
  return (
    <Link 
      href={`/materia/${slug}`}
      className="block relative rounded-xl overflow-hidden group cursor-pointer border border-red-600/30 hover:border-red-500/80 bg-gradient-to-b from-zinc-900 to-black transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20 hover:scale-[1.01]"
    >
      <ContentOriginBadge tipo="exclusivo" className="absolute top-4 left-4 z-20" />
      
      <div className={`relative w-full ${destaque ? 'aspect-video' : 'aspect-[4/3]'} overflow-hidden`}>
        {/* Placeholder image tag with object fit fallback */}
        <div className="absolute inset-0 bg-zinc-800">
           <img 
            src={imagemCapa} 
            alt={titulo}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 z-20 flex flex-col gap-3">
        <span className="text-[10px] sm:text-xs font-bold text-red-500 uppercase tracking-wider">
          {categoria}
        </span>
        
        <div>
          <h2 className={`${destaque ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'} font-bold text-white leading-tight mb-2 group-hover:text-red-100 transition-colors`}>
            {titulo}
          </h2>
          {subtitulo && (
            <p className="text-zinc-400 text-sm line-clamp-2 hidden sm:block">
              {subtitulo}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1 pt-3 border-t border-zinc-800/60">
          {autor.foto ? (
             <img src={autor.foto} alt={autor.nome} className="w-8 h-8 rounded-full object-cover border border-zinc-700" loading="lazy" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500">
              {autor.nome.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold text-zinc-200">{autor.nome}</span>
            <div className="flex items-center text-[10px] text-zinc-500 gap-1.5">
              <span>{autor.categoria}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span>{publicadoEm}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
