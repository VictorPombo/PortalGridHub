"use client";

import { useState } from "react";
import { Mail, AlertTriangle, Send, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ContatoPage() {
  const [assunto, setAssunto] = useState("Dúvida geral");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 border border-green-500/30 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white mb-4">Mensagem Recebida!</h1>
        <p className="text-zinc-400 mb-8 max-w-md">Nossa equipe retornará o contato através do seu e-mail cadastrado em até 48 horas úteis.</p>
        <button onClick={() => setSuccess(false)} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors">Enviar outra mensagem</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">Fale Conosco</h1>
        <p className="text-zinc-400">Entre em contato para tirar dúvidas, parcerias editoriais ou reporte corporativo da NextHub.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Seu Nome</label>
              <input required type="text" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="Nome completo" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Seu E-mail</label>
              <input required type="email" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="contato@exemplo.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Assunto</label>
            <select 
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
            >
              <option>Dúvida geral</option>
              <option>Remoção de conteúdo</option>
              <option>Imprensa</option>
              <option>Parceria</option>
              <option>Outro</option>
            </select>
          </div>

          {assunto === "Remoção de conteúdo" && (
            <div className="bg-red-950/40 border border-red-900/50 p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-200/90 leading-relaxed">
                <strong>Atenção legal:</strong> Para solicitações formais de remoção, recomendamos seguir o procedimento contido em nossa <Link href="/remocao.html" className="underline font-bold text-red-400">Política de Remoção</Link>. Nossa análise protetiva atua em até 48 horas úteis baseada no modelo <em>Notice and Takedown</em>.
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Mensagem</label>
            <textarea required rows={5} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 resize-y" placeholder="Como podemos ajudar?"></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-widest text-sm py-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {loading ? "Enviando..." : "Enviar Mensagem"}
          </button>
        </form>
      </div>
    </div>
  );
}
