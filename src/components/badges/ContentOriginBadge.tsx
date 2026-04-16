import { Star, ExternalLink } from "lucide-react";

interface ContentOriginBadgeProps {
  tipo: "exclusivo" | "agregado";
  portal?: string;
  className?: string;
}

export function ContentOriginBadge({ tipo, portal, className = "" }: ContentOriginBadgeProps) {
  if (tipo === "exclusivo") {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-red-600/90 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${className}`}>
        <Star className="w-3.5 h-3.5 fill-white" />
        EXCLUSIVO
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 font-medium text-[10px] sm:text-xs px-2.5 py-1 rounded-md ${className}`}>
      Via {portal || "Portal Parceiro"}
      <ExternalLink className="w-3 h-3 text-zinc-400" />
    </div>
  );
}
