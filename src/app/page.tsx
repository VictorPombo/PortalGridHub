"use client";

import { useState } from "react";
import Link from "next/link";
import { ExclusiveCard } from "../components/cards/ExclusiveCard";
import { AggregatedCard } from "../components/cards/AggregatedCard";
import { CategoryFilter } from "../components/filters/CategoryFilter";
import { SejaAutorCTA } from "../components/cta/SejaAutorCTA";

// DADOS MOCKADOS (No futuro virão do Supabase no Server Components)
const exclusivas = [
  {
    slug: "victor-s-teste-f4",
    titulo: "Avanços Aerdinâmicos na F4 Brasileira: O que aprendi em Interlagos",
    subtitulo: "Testes sob chuva revelam janelas estreitas de setup que podem definir a temporada.",
    imagemCapa: "https://upload.wikimedia.org/wikipedia/commons/3/3f/FIA_F1_Austria_2023_Nr._44_%282%29.jpg",
    categoria: "Piloto F4",
    autor: { nome: "Victor S.", foto: "", categoria: "Piloto F4" },
    publicadoEm: "Hoje",
    destaque: true
  },
  {
    slug: "renato-eng-setup",
    titulo: "Telemetria Avançada: Lendo além dos gráficos de suspensão",
    imagemCapa: "https://upload.wikimedia.org/wikipedia/commons/9/9f/FIA_F1_Austria_2023_Nr._55_%281%29.jpg",
    categoria: "Engenharia",
    autor: { nome: "Renato Diniz", foto: "", categoria: "Engenheiro" },
    publicadoEm: "Ontem, 14:00"
  },
  {
    slug: "guilherme-copa-truck",
    titulo: "Desafios térmicos dos pesados no forte calor de Goiânia",
    imagemCapa: "https://upload.wikimedia.org/wikipedia/commons/7/79/FIA_F1_Austria_2023_Nr._1_%281%29.jpg",
    categoria: "Copa Truck",
    autor: { nome: "Guilherme B.", foto: "", categoria: "Piloto" },
    publicadoEm: "Ontem, 20:30"
  }
];

const agregadas = [
  { id: 1, cat: "f1", titulo: "Ferrari Prepara Pacote Agressivo de Atualizações para Miami", img: "https://upload.wikimedia.org/wikipedia/commons/9/9f/FIA_F1_Austria_2023_Nr._55_%281%29.jpg", link: "https://www.google.com", portal: "motorsport_brasil", date: "Há 2 horas" },
  { id: 2, cat: "motogp", titulo: "Marc Márquez lidera testes na Espanha sob forte emoção", img: "https://upload.wikimedia.org/wikipedia/commons/3/3f/FIA_F1_Austria_2023_Nr._44_%282%29.jpg", link: "https://www.google.com", portal: "f1mania", date: "Há 4 horas" },
  { id: 3, cat: "stock_car", titulo: "Pole position inédita embaralha o grid para a corrida de domingo", img: "https://upload.wikimedia.org/wikipedia/commons/7/79/FIA_F1_Austria_2023_Nr._1_%281%29.jpg", link: "https://www.google.com", portal: "motorsport_brasil", date: "Há 6 horas" },
];

export default function Homepage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      
      {/* SEÇÃO "EXCLUSIVAS DRIVER NEWS" */}
      <section className="pt-8 pb-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-2 uppercase tracking-tight">Exclusivas Driver News</h2>
            <p className="text-zinc-500 font-medium tracking-wide">Conteúdo técnico produzido por pilotos e especialistas do grid.</p>
          </div>

          {(activeTab === "exclusivas" || activeTab === "all") && exclusivas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* O Hero Master Focus (Destaque) */}
              <div className="md:col-span-8">
                <ExclusiveCard {...exclusivas[0]} />
              </div>
              {/* As Médias */}
              <div className="md:col-span-4 flex flex-col gap-6">
                 {exclusivas.slice(1).map((el, i) => (
                    <ExclusiveCard key={i} {...el} />
                 ))}
              </div>
            </div>
          ) : (
            <div className="w-full">
              {activeTab === "exclusivas" ? (
                <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
                   <p className="text-zinc-400 mb-4">Nenhuma matéria exclusiva para este filtro no momento.</p>
                </div>
              ) : null}
            </div>
          )}

          {/* Fallback caso a categoria selecionada seja específica (ex: F1) mostraremos aqui o CTA */}
          <div className="mt-12">
            <SejaAutorCTA />
          </div>
        </div>
      </section>

      {/* DIVISOR DA MURALHA JURÍDICA */}
      {activeTab !== "exclusivas" && (
        <div className="flex items-center gap-4 my-14 max-w-7xl mx-auto px-4">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-zinc-800"></div>
          <div className="flex flex-col items-center">
            <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center">
              Do mundo do Motorsport
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-600 font-medium tracking-wide text-center mt-1">
              Notícias agregadas anonimamente via RSS. Clique para ler no hub de origem.
            </span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-zinc-800 to-zinc-800"></div>
        </div>
      )}

      {/* GRID DE AGREGADAS */}
      {activeTab !== "exclusivas" && (
        <section className="max-w-7xl mx-auto px-4">
          
          <div className="mb-10 sticky top-0 z-30 bg-black/80 backdrop-blur-md py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <CategoryFilter activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agregadas
              .filter(a => activeTab === "all" || a.cat === activeTab)
              .map((agg, idx) => (
              <AggregatedCard 
                key={idx}
                titulo={agg.titulo}
                ogImageUrl={agg.img}
                linkOriginal={agg.link}
                portalOrigem={agg.portal}
                categoria={agg.cat}
                publicadoEm={agg.date}
              />
            ))}
          </div>

          {/* Carregar Mais Mock */}
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-full font-medium transition-all text-sm uppercase tracking-wider">
              Carregar Mais Agregadas
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
