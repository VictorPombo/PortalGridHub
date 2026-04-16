import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Driver News — Automobilismo e Agregação',
  description: 'Provedor de notícias do automobilismo com conteúdo exclusivo de pilotos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
         <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
         <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-regular-rounded/css/uicons-regular-rounded.css" />
      </head>
      <body className="bg-black text-white antialiased">
        {/* NAVEGAÇÃO TOP (NAVBAR) IGUAL AO VANILLA */}
        <nav className="fixed top-0 w-full z-50 bg-[#000000a6] backdrop-blur text-white border-b border-white/5 h-[70px] flex items-center shadow-lg transition-transform duration-300">
          <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 flex items-center justify-between">
            
            <Link className="flex items-center gap-3 shrink-0 group" href="/">
              <div className="w-9 h-9 bg-red-600 text-white rounded flex items-center justify-center transform -skew-x-[12deg] group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] fill-current"><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-['Bebas_Neue'] text-[26px] tracking-wide m-0 text-white leading-none">Driver</span>
                <span className="font-['Bebas_Neue'] text-[15px] text-red-500 m-0 leading-none" style={{marginTop:'-3px'}}>News</span>
              </div>
            </Link>

            <ul className="hidden md:flex items-center gap-8 ml-10">
              <li><Link href="/" className="text-white hover:text-red-500 font-medium text-sm transition">Início</Link></li>
              <li><Link href="/index.html?view=plans" className="text-zinc-300 hover:text-red-500 font-medium text-sm transition">Para Pilotos</Link></li>
            </ul>

            <div className="ml-auto flex items-center">
              <a href="/cadastro.html" className="font-sans font-bold text-xs uppercase tracking-widest text-[#111] bg-white hover:bg-[#e0e0e0] border-none px-6 py-2.5 rounded transform skew-x-[-12deg] transition-all whitespace-nowrap min-w-[100px] text-center shadow-[0_4px_10px_rgba(255,255,255,0.15)] flex items-center justify-center cursor-pointer">
                Entrar
              </a>
            </div>
            
          </div>
        </nav>

        {/* CONTAINER DINÂMICO PAGES */}
        <div className="pt-[70px] min-h-screen flex flex-col">
          {children}
        </div>

        {/* FOOTER JURÍDICO RESTRITO */}
        <footer className="w-full bg-[#050505] border-t border-white/5 py-12 lg:py-16 mt-auto">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              <div className="flex flex-col gap-5">
                <Link className="flex items-center gap-3 shrink-0" href="/">
                  <div className="w-8 h-8 bg-zinc-800 text-white rounded flex items-center justify-center transform -skew-x-[12deg]">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current"><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></svg>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="font-['Bebas_Neue'] text-xl tracking-wide text-zinc-400">Driver</span>
                  </div>
                </Link>
                <div className="text-sm text-zinc-500 font-mono tracking-tight leading-relaxed">
                  Conectando a velocidade aos fãs de ponta a ponta. Portal especializado em agregados.
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="font-bold uppercase text-zinc-300 tracking-widest text-sm mb-1">Institucional</h4>
                <Link href="/termos.html" className="text-sm text-zinc-500 hover:text-white transition">Termos de Uso</Link>
                <Link href="/politica.html" className="text-sm text-zinc-500 hover:text-white transition">Política de Privacidade</Link>
                <Link href="/remocao.html" className="text-sm text-zinc-500 hover:text-white transition">Política de Remoção</Link>
                <a href="mailto:contato.drivernews@proton.me" className="text-sm text-zinc-500 hover:text-white transition mt-2 flex items-center gap-2">
                  <i className="fi fi-rr-envelope text-red-500"></i> Fale Conosco
                </a>
              </div>

            </div>

            <div className="w-full mt-16 pt-8 border-t border-white/5 flex flex-col items-center justify-between gap-6 text-center">
              
              <div className="flex items-start justify-center gap-3 w-full bg-zinc-950 p-6 rounded-lg border border-red-900/30">
                <Shield className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                <div className="text-left text-xs sm:text-sm text-zinc-500 leading-relaxed font-medium">
                  Informação de Responsabilidade Cívil: O motor de busca da placa "Últimas Notícias Agregadas" é gerado por processos autômatos via indexadores terceiros (RSS). Este portal se isenta expressamente da reprodução de conteúdo em servidor local, publicando apenas a indicação externa e mascarando as imagens sob Fair Use da Lei 9.610. Em caso de litígio, contate a matriz operada legalmente por <strong>NextHub <span className="ml-1 text-zinc-400">CNPJ: 65.934.326/0001-31</span></strong>.
                </div>
              </div>

              <div className="text-zinc-600 text-[11px] uppercase tracking-widest font-mono">
                © {new Date().getFullYear()} Nexthub Driver News Project. Todos os direitos reservados.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
