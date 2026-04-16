import Link from "next/link";
import { ShieldCheck, Server, AlertTriangle, Fingerprint } from "lucide-react";

export default function TransparenciaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <ShieldCheck className="w-16 h-16 text-red-600 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Central de Transparência e IA</h1>
        <p className="text-xl text-zinc-400">Como protegemos os leitores, o Driver News e nossos autores via arquitetura auditável.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Server className="w-48 h-48" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
          <Fingerprint className="w-6 h-6 text-red-500" />
          Rastreabilidade Criptográfica
        </h2>
        <div className="space-y-4 text-zinc-400 leading-relaxed font-light relative z-10">
          <p>
            O Portal Driver News utiliza inteligência artificial generativa (Driver AI Engine) estritamente como formatadora de estilo e fluência. <strong>Qualquer conteúdo classificado como "Exclusivo" foi preenchido por um humano real, assinante da plataforma</strong>, fornecendo a matriz original dos fatos cronológicos e aspas diretas (Input Original).
          </p>
          <p>
            Em conformidade protetiva ao <strong className="text-white">Art. 19 do Marco Civil da Internet (Lei 12.965/14)</strong>, informamos que o portal atua exclusivamente como veículo provedor e não realiza revisões prévias ou monitoramento curatorial sobre o conteúdo postado por seus membros pagantes. A responsabilidade civil, criminal e de difamação é transferida integralmente ao Autor Final no momento de publicação.
          </p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-red-900/30 rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden">
         <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          Protocolo de Publicação e Retenção
        </h2>
        <ul className="space-y-5 text-zinc-400">
          <li className="flex items-start gap-4">
            <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold shrink-0 mt-1">1</span>
            <div>
              <strong className="text-white">Input Imutável:</strong> O texto cru do piloto é guardado. A IA padroniza as frases. O resultado volta para o piloto revisar livremente, sem interferência nossa.
            </div>
          </li>
          <li className="flex items-start gap-4">
            <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold shrink-0 mt-1">2</span>
            <div>
              <strong className="text-white">Isenção e Hash SHA-256:</strong> Ao publicar, o servidor calcula a identidade da notícia (um HASH indestrutível) e vincula ele ao aceite jurídico com endereço de IP, selando o pacto do autor com os termos civis em cartório de bits.
            </div>
          </li>
          <li className="flex items-start gap-4">
            <span className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold shrink-0 mt-1">3</span>
            <div>
               <strong className="text-white">Long Life Logs:</strong> Os IPs, aceites e o Input provado do assinante não são recicláveis. Eles permanecem armazenados como auditoria jurídica pela NextHub (CNPJ 65.934.326/0001-31), independentemente da matéria original ser delecionada publicamente depois ou não.
            </div>
          </li>
        </ul>
      </div>

      <div className="flex justify-center gap-6 mt-12 pt-8 border-t border-zinc-800/80 text-sm font-semibold uppercase tracking-wider text-red-500">
        <Link href="/termos.html" className="hover:text-white transition-colors">Termos de Uso</Link>
        <Link href="/politica.html" className="hover:text-white transition-colors">Privacidade</Link>
        <Link href="/remocao.html" className="hover:text-white transition-colors">Política de Remoção DMCA</Link>
      </div>

    </div>
  );
}
