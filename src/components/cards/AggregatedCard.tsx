import { ExternalLink } from "lucide-react";

interface AggregatedCardProps {
  titulo: string;
  ogImageUrl: string;
  linkOriginal: string;
  portalOrigem: "motorsport_brasil" | "f1mania" | string;
  categoria: string;
  publicadoEm: string;
}

const PORTAIS: Record<string, { nome: string; cor: string }> = {
  motorsport_brasil: { nome: "Motorsport Brasil", cor: "#ff6b35" },
  f1mania: { nome: "F1Mania", cor: "#0090d4" }
};

export function AggregatedCard({
  titulo,
  ogImageUrl,
  linkOriginal,
  portalOrigem,
  categoria,
  publicadoEm,
}: AggregatedCardProps) {
  
  const portal = PORTAIS[portalOrigem] || { nome: portalOrigem.replace('_', ' '), cor: "#a1a1aa" };

  return (
    <a
      href={linkOriginal}
      target="_blank"
      rel="noopener nofollow"
      className="block rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:scale-[1.005] group"
    >
      <div className="aspect-video relative overflow-hidden bg-zinc-800">
         {/* Interceptando a origem pelo nosso proxy para proteger hotlinks! */}
         <img 
          src={`/api/img-proxy?url=${encodeURIComponent(ogImageUrl)}`}
          alt={titulo}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="p-4 flex flex-col gap-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          {categoria}
        </span>
        
        <h3 className="text-sm sm:text-base font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug">
          {titulo}
          <ExternalLink className="inline-block w-3 h-3 ml-1.5 text-zinc-500 mb-0.5" />
        </h3>
        
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-800/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: portal.cor }}></span>
            <span className="text-xs text-zinc-400 font-medium tracking-tight">
              Via {portal.nome}
            </span>
          </div>
          <span className="text-[10px] text-zinc-600">
            {publicadoEm}
          </span>
        </div>
      </div>
    </a>
  );
}
