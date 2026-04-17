"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, FileText, ArrowRight } from "lucide-react";

export default function CheckoutAssinaturaPage() {
  const [loading, setLoading] = useState(false);
  const [termos, setTermos] = useState(false);
  const [privacidade, setPrivacidade] = useState(false);
  const [idade, setIdade] = useState(false);
  const [marcoCivil, setMarcoCivil] = useState(false);

  const tudoVerde = termos && privacidade && idade && marcoCivil;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Buscar dados do usuário logado
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('pl_session') : null;
      if (!userStr) {
        alert('Faça login antes de assinar.');
        window.location.href = '/cadastro.html';
        return;
      }
      const session = JSON.parse(userStr);
      
      // Buscar dados completos do usuário do cache local
      const usersStr = localStorage.getItem('pl_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const user = users.find((u: any) => u.id === session.userId) || session;
      
      // Detectar plano (pode vir da URL)
      const params = new URLSearchParams(window.location.search);
      const plan = params.get('plan') || user.plan || 'starter';
      
      const res = await fetch('/api/asaas/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id || session.userId,
          user_name: user.name || 'Assinante',
          user_email: user.email || '',
          plan: plan,
        }),
      });
      
      const data = await res.json();
      
      if (data.success && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert('Erro ao gerar pagamento. Tente novamente.');
        console.error(data);
      }
    } catch (err) {
      alert('Erro de conexão. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <Lock className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
        <h1 className="text-3xl font-black text-white mb-2">Finalização de Assinatura</h1>
        <p className="text-zinc-400">Antes de prosseguir para o módulo financeiro, valide seus termos como autor autônomo.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-6 sm:p-8 mt-8">
        
        <h3 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
          <FileText className="w-5 h-5 text-red-500" />
          Ao assinar o Driver News, você declara:
        </h3>

        <div className="space-y-4">
          <label className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${termos ? 'bg-zinc-800/50 border-zinc-700' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
            <input type="checkbox" className="mt-0.5 w-5 h-5 accent-red-600 shrink-0 cursor-pointer" checked={termos} onChange={(e)=>setTermos(e.target.checked)}/>
            <span className="text-sm text-zinc-300">
              Ter lido e aceito integralmente os <a href="/termos.html" target="_blank" className="text-red-500 hover:underline">Termos de Uso</a>.
            </span>
          </label>

          <label className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${privacidade ? 'bg-zinc-800/50 border-zinc-700' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
            <input type="checkbox" className="mt-0.5 w-5 h-5 accent-red-600 shrink-0 cursor-pointer" checked={privacidade} onChange={(e)=>setPrivacidade(e.target.checked)}/>
            <span className="text-sm text-zinc-300">
              Ter lido e aceito obrigatoriamente a nossa <a href="/politica.html" target="_blank" className="text-red-500 hover:underline">Política de Privacidade (LGPD)</a>.
            </span>
          </label>

          <label className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${idade ? 'bg-zinc-800/50 border-zinc-700' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
            <input type="checkbox" className="mt-0.5 w-5 h-5 accent-red-600 shrink-0 cursor-pointer" checked={idade} onChange={(e)=>setIdade(e.target.checked)}/>
            <span className="text-sm text-zinc-300">
              Ser civilmente capaz e de maioridade penal (+18 anos).
            </span>
          </label>

          <label className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${marcoCivil ? 'bg-red-600/10 border-red-600/30' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
            <input type="checkbox" className="mt-0.5 w-5 h-5 accent-red-600 shrink-0 cursor-pointer" checked={marcoCivil} onChange={(e)=>setMarcoCivil(e.target.checked)}/>
            <span className="text-sm text-zinc-300 font-medium">
              Compreender que as matérias jornalísticas que eu compilar e publicar via sistema AI Driver News são de minha inteira responsabilidade cível, criminal e autoral, conforme o <strong className="text-white">Art. 19 do Marco Civil da Internet</strong>.
            </span>
          </label>
        </div>

        <button 
          disabled={!tudoVerde || loading}
          onClick={handlePayment}
          className={`w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-bold transition-all ${!tudoVerde || loading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-none' : 'bg-white hover:bg-zinc-200 text-black shadow-lg shadow-white/10'}`}
        >
          {loading ? 'Gerando link seguro...' : 'Continuar para o Pagamento'}
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
