"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldAlert, Cpu, Check, Loader2 } from "lucide-react";

export default function PublicarMateriaPage() {
  const [ac1, setAc1] = useState(false);
  const [ac2, setAc2] = useState(false);
  const [ac3, setAc3] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [success, setSuccess] = useState(false);

  const tudoMarcado = ac1 && ac2 && ac3;

  const handlePublish = () => {
    setPublishing(true);
    // Aqui no MUNDO REAL o Next.js geraria o SHA-256 e IP no Server Action via pacote `crypto` do node e Headers() e gravaria no Supabase em aceites_publicacao.
    setTimeout(() => {
      setPublishing(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/50">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-white mb-4">Matéria Publicada!</h1>
        <p className="text-zinc-400 text-lg mb-8 leading-relaxed max-w-lg">
          O log criptográfico com seus aceites foi lacrado irreversivelmente no banco de dados. Sua matéria já está imune no ar pela proteção jornalística.
        </p>
        <Link href="/" className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors">
          Visualizar na Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/10 text-red-500 rounded-full mb-4 ring-1 ring-red-600/30">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Painel de Assinatura Legal</h1>
        <p className="text-zinc-400">Antes de ir ao ar, as assinaturas vinculantes exigidas pelo <br/>Marco Civil da Internet (Lei 12.965/14) precisam ser concordadas.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-6 sm:p-8 space-y-8">
        
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-sm">
           <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2"><Cpu className="w-4 h-4" /> Monitoramento Crypto</h3>
           <p className="text-zinc-400 leading-relaxed">
             Ao realizar a submissão final abaixo, o servidor NextHub.js computará estruturalmente o Hash (SHA-256) das exatas palavras do corpo do seu texto. Esse artefato será salvo juntamente do seu endereço de IP de requisição no banco de auditoria (aceites_publicacao). Isso valida em cartório que **a cópia publicada é fidedigna ao seu aceite.**
           </p>
        </div>

        <div className="space-y-4">
          
          <label className={`flex items-start gap-4 p-5 rounded-xl border transition-colors cursor-pointer ${ac1 ? 'bg-red-600/10 border-red-600/30' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
            <input type="checkbox" className="mt-1 w-5 h-5 accent-red-600 shrink-0 cursor-pointer" checked={ac1} onChange={(e)=>setAc1(e.target.checked)}/>
            <span className="text-sm text-zinc-300 leading-relaxed">
              "Confirmo que todas as informações publicadas nesta matéria são verdadeiras e que eu sou o autor dos fatos e citações aqui contidos."
            </span>
          </label>

          <label className={`flex items-start gap-4 p-5 rounded-xl border transition-colors cursor-pointer ${ac2 ? 'bg-red-600/10 border-red-600/30' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
            <input type="checkbox" className="mt-1 w-5 h-5 accent-red-600 shrink-0 cursor-pointer" checked={ac2} onChange={(e)=>setAc2(e.target.checked)}/>
            <span className="text-sm text-zinc-300 leading-relaxed">
              "Declaro que assumo integral e exclusiva responsabilidade civil e criminal pelo conteúdo publicado, incluindo eventuais consequências legais decorrentes de informações falsas, difamatórias, caluniosas ou violadoras de direitos de terceiros."
            </span>
          </label>

          <label className={`flex items-start gap-4 p-5 rounded-xl border transition-colors cursor-pointer ${ac3 ? 'bg-red-600/10 border-red-600/30' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
            <input type="checkbox" className="mt-1 w-5 h-5 accent-red-600 shrink-0 cursor-pointer" checked={ac3} onChange={(e)=>setAc3(e.target.checked)}/>
            <span className="text-sm text-zinc-300 leading-relaxed">
              "Isento o Driver News e a NextHub (CNPJ 65.934.326/0001-31) de qualquer responsabilidade civil sobre o conteúdo desta matéria, reconhecendo que a plataforma atua apenas como espelho logístico de publicação para o Assinante e não realiza curadoria ou moderação editorial prévia ao impulsionamento online."
            </span>
          </label>

        </div>

      </div>

      <div className="mt-8">
        <button 
          onClick={handlePublish}
          disabled={!tudoMarcado || publishing}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-bold transition-all ${!tudoMarcado ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-none' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'}`}
        >
          {publishing ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
          {publishing ? "Enviando para Criptografia..." : "ACEITO E PUBLICO A MATÉRIA (FINAL)"}
        </button>
      </div>

    </div>
  );
}
