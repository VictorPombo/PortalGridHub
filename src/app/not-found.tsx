import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center mb-6 text-zinc-400">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
        Não encontramos essa matéria
      </h1>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8 text-zinc-400 leading-relaxed max-w-xl mx-auto">
        <p>
          Pode ser que o conteúdo tenha sido removido pelo autor ou por solicitação legal externa. Para mais informações, consulte nossa <Link href="/remocao.html" className="text-red-500 hover:underline">Política de Remoção</Link> ou entre em contato: <a href="mailto:contato.drivernews@proton.me" className="text-red-500 hover:underline">contato.drivernews@proton.me</a>
        </p>
      </div>
      <Link href="/" className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-lg transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar à página inicial
      </Link>
    </div>
  );
}
