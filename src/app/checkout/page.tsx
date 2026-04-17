"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, FileText, ArrowRight, Shield, Check, CreditCard, QrCode, Barcode, Loader2 } from "lucide-react";

const PLANS: Record<string, { name: string; price: string; value: number; daily: string; features: string[] }> = {
  starter: {
    name: 'Piloto Starter',
    price: 'R$ 99,90',
    value: 99.90,
    daily: 'Menos de R$ 3,50/dia',
    features: [
      '1 matéria profissional por mês',
      'Perfil de piloto no portal',
      'Página pública otimizada',
      'Badge "Piloto Verificado"',
      'Link compartilhável',
    ],
  },
  pro: {
    name: 'Piloto Pro',
    price: 'R$ 149,90',
    value: 149.90,
    daily: 'Menos de R$ 5/dia',
    features: [
      '2 matérias profissionais por mês',
      'Perfil completo com mídia kit',
      'Página pública otimizada',
      'Badge "Piloto Verificado"',
      'Link compartilhável',
      'Selo PRO exclusivo',
      'Prioridade no grid de destaque',
    ],
  },
};

export default function CheckoutPage() {
  const [plan, setPlan] = useState<string>('starter');
  const [loading, setLoading] = useState(true);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [termos, setTermos] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    // Detectar plano da URL
    const params = new URLSearchParams(window.location.search);
    const urlPlan = params.get('plan');
    if (urlPlan && PLANS[urlPlan]) {
      setPlan(urlPlan);
    }
  }, []);

  // Gerar link de pagamento no Asaas
  const gerarPagamento = async () => {
    setLoading(true);
    setError(null);

    // Buscar dados do usuário logado
    const userStr = localStorage.getItem('pl_user') || localStorage.getItem('pl_session');
    if (!userStr) {
      setError('Faça login antes de assinar.');
      setLoading(false);
      return;
    }

    const session = JSON.parse(userStr);
    
    // Buscar dados completos se available (ajuste de state var)
    const usersStr = localStorage.getItem('pl_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    const user = users.find((u: any) => u.id === session.userId || u.id === session.id) || session;

    try {
      const res = await fetch('/api/asaas/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id || user.userId,
          user_name: user.name || 'Assinante',
          user_email: user.email || '',
          plan: plan,
        }),
      });

      const data = await res.json();

      if (data.success && data.invoice_url) {
        setInvoiceUrl(data.invoice_url);
        setShowPayment(true);
      } else {
        setError(data.error || 'Erro ao gerar pagamento. Tente novamente.');
      }
    } catch (err) {
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    }

    setLoading(false);
  };

  const planData = PLANS[plan];

  // ═══════════════════════════════════════
  // TELA DE PAGAMENTO (após aceite)
  // ═══════════════════════════════════════
  if (showPayment && invoiceUrl) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-6xl mx-auto px-4 py-8 lg:py-16">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-[3px] bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-4">
              <Lock className="w-3.5 h-3.5" />
              Pagamento Seguro
            </div>
            <h1 className="font-['Bebas_Neue'] text-4xl lg:text-5xl text-white">
              Finalize sua assinatura
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* COLUNA ESQUERDA — Resumo do plano */}
            <div className="lg:col-span-2 space-y-6">

              {/* Card do plano */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="text-xs font-bold text-red-500 uppercase tracking-[2px] mb-2">
                  {plan === 'pro' ? '⭐ RECOMENDADO' : 'SEU PLANO'}
                </div>
                <h2 className="font-['Bebas_Neue'] text-3xl text-white mb-1">{planData.name}</h2>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-['Bebas_Neue'] text-5xl text-white">{planData.price}</span>
                  <span className="text-zinc-500 text-sm">/mês</span>
                </div>
                <p className="text-zinc-500 text-xs mb-6">{planData.daily}</p>

                <div className="space-y-3">
                  {planData.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      <span className="text-sm text-zinc-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métodos aceitos */}
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-3">Aceitamos</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs">Cartão</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <QrCode className="w-4 h-4" />
                    <span className="text-xs">Pix</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Barcode className="w-4 h-4" />
                    <span className="text-xs">Boleto</span>
                  </div>
                </div>
              </div>

              {/* Garantia */}
              <div className="flex items-start gap-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5">
                <Shield className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white mb-1">Garantia de 7 dias</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Não ficou satisfeito? Cancele em até 7 dias e devolvemos 100% do valor, conforme Art. 49 do CDC.
                  </p>
                </div>
              </div>

              {/* Trocar plano */}
              <div className="text-center">
                <Link
                  href={`/checkout?plan=${plan === 'pro' ? 'starter' : 'pro'}`}
                  className="text-xs text-zinc-500 hover:text-red-500 transition"
                  onClick={() => {
                    setPlan(plan === 'pro' ? 'starter' : 'pro');
                    setShowPayment(false);
                    setInvoiceUrl(null);
                  }}
                >
                  Trocar para plano {plan === 'pro' ? 'Starter' : 'Pro'} →
                </Link>
              </div>
            </div>

            {/* COLUNA DIREITA — iframe do Asaas */}
            <div className="lg:col-span-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="bg-zinc-800/50 px-6 py-4 border-b border-zinc-700/50 flex items-center gap-3">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-zinc-300 font-medium">Ambiente seguro de pagamento</span>
                  <span className="ml-auto text-[10px] text-zinc-500 uppercase tracking-widest">Powered by Asaas</span>
                </div>
                <iframe
                  src={invoiceUrl}
                  className="w-full border-0"
                  style={{ minHeight: '680px', background: '#111' }}
                  title="Pagamento Driver News"
                  allow="payment"
                />
              </div>
            </div>
          </div>

          {/* Nota de segurança */}
          <div className="text-center mt-8">
            <p className="text-[11px] text-zinc-600 max-w-lg mx-auto leading-relaxed">
              Seus dados financeiros são processados diretamente pelo Asaas (instituição regulada pelo Banco Central). O Driver News não armazena dados de cartão. Conexão protegida por criptografia SSL/TLS.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // TELA DE ACEITE (antes do pagamento)
  // ═══════════════════════════════════════
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-8 lg:py-16">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-[3px] bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-4">
            <Lock className="w-3.5 h-3.5" />
            Checkout Seguro
          </div>
          <h1 className="font-['Bebas_Neue'] text-4xl lg:text-5xl text-white mb-2">
            {planData.name}
          </h1>
          <p className="text-zinc-400 text-sm">
            {planData.price}/mês · {planData.daily}
          </p>
        </div>

        {/* Card de aceite */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">

          <h3 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
            <FileText className="w-5 h-5 text-red-500" />
            Ao assinar, você declara:
          </h3>

          <div className="space-y-3">
            <label className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${termos ? 'bg-zinc-800/50 border-zinc-700' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
              <input
                type="checkbox"
                className="mt-0.5 w-5 h-5 accent-red-600 shrink-0 cursor-pointer"
                checked={termos}
                onChange={(e) => setTermos(e.target.checked)}
              />
              <span className="text-sm text-zinc-300 leading-relaxed">
                Li e aceito os{' '}
                <a href="/termos.html" target="_blank" className="text-red-500 hover:underline">Termos de Uso</a>
                {' '}e a{' '}
                <a href="/politica.html" target="_blank" className="text-red-500 hover:underline">Política de Privacidade</a>.
                Compreendo que sou <strong className="text-white">responsável pelo conteúdo</strong> que publicar,
                que as matérias são redigidas com auxílio de IA e que a aprovação final é minha,
                conforme o <strong className="text-white">Art. 19 do Marco Civil da Internet</strong>.
                Autorizo o uso do meu nome e imagem para fins de publicação na plataforma.
              </span>
            </label>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            disabled={!termos || loading}
            onClick={gerarPagamento}
            className={`w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-bold transition-all ${
              !termos
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
            }`}
          >
            {loading && termos ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preparando pagamento...
              </>
            ) : (
              <>
                Continuar para o Pagamento
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Garantia */}
        <div className="flex items-start gap-4 mt-6 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5">
          <Shield className="w-6 h-6 text-emerald-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-white mb-1">Garantia de 7 dias</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cancele em até 7 dias e receba 100% de volta (Art. 49, CDC).
            </p>
          </div>
        </div>

        {/* Trocar plano */}
        <div className="text-center mt-6">
          <Link
            href={`/checkout?plan=${plan === 'pro' ? 'starter' : 'pro'}`}
            className="text-xs text-zinc-500 hover:text-red-500 transition"
            onClick={() => setPlan(plan === 'pro' ? 'starter' : 'pro')}
          >
            Prefiro o plano {plan === 'pro' ? 'Starter (R$ 99,90)' : 'Pro (R$ 149,90)'} →
          </Link>
        </div>
      </div>
    </div>
  );
}
