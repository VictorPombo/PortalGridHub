"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("drivernews_cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("drivernews_cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 transform transition-transform duration-500 animate-in slide-in-from-bottom-full">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie className="w-6 h-6 text-yellow-600 shrink-0" />
          <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
            Usamos cookies para melhorar sua experiência e entender como o Driver News é utilizado. Ao continuar, você concorda com nossa Política de Privacidade.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link href="/politica.html" className="text-xs text-zinc-400 hover:text-white underline decoration-zinc-600 transition-colors whitespace-nowrap">
            Política de Privacidade
          </Link>
          <button 
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-red-600/20 transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
