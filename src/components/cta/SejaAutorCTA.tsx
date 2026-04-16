import Link from "next/link";
import { PenLine, ArrowRight } from "lucide-react";

export function SejaAutorCTA() {
  return (
    <div className="w-full bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
      {/* Decoração sutil */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-600/10 blur-3xl rounded-full"></div>
      
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex bg-zinc-800/80 p-3 rounded-lg border border-zinc-700/50">
          <PenLine className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">É piloto ou profissional do motorsport?</h3>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Publique suas matérias exclusivas no Driver News e conecte-se com sua base de fãs — <span className="text-zinc-300 font-medium tracking-tight">a partir de R$ 99,90/mês.</span>
          </p>
        </div>
      </div>
      
      <div className="w-full sm:w-auto shrink-0 z-10">
        <Link 
          href="/cadastro.html" 
          className="group relative flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:-translate-y-0.5"
        >
          Conhecer planos
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
