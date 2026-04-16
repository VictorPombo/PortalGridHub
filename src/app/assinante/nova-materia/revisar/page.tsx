"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Save, RotateCcw, AlertTriangle } from "lucide-react";

export default function RevisarMateriaPage() {
  const [iaContent, setIaContent] = useState("");
  const [loading, setLoading] = useState(true);

  // MOCK DE CALL DA IA
  useEffect(() => {
    setTimeout(() => {
      setIaContent("TÍTULO: Vitória suada na etapa de Interlagos da F4\n\nSUBTÍTULO: Piloto superou desgaste de pneus e garantiu ultrapassagem emocionante na volta 15.\n\nCORPO:\n\nA etapa de Interlagos do Campeonato F4 Brasil foi marcada por intensos desafios estratégicos e momentos de superação na pista. Em uma corrida que exigiu tanto do conjunto mecânico quanto do preparo do piloto, a vitória foi conquistada em circunstâncias dramáticas testando os limites do regulamento esportivo.\n\nLargando da terceira posição, a largada já demonstrou agressividade, consolidando um ritmo consistente durante a primeira metade da prova. O ápice ocorreu na volta 15, quando, demonstrando absoluto controle frente ao avançado desgaste de pneus, foi possível realizar uma ultrapassagem decisiva assumindo a ponta do pelotão.\n\n\"Foi uma corrida brutal contra a equipe rival.\", declarou o piloto oficial.\n\nCom o carro número 32 ostentando as cores da XPTO, este resultado não apenas confirma o excelente momento da equipe na etapa paulista, mas catapulta a posição geral do piloto para a vice-liderança (P2) na tabela do campeonato.");
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-6 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Revisão Jornalística (Driver AI)</h1>
          <p className="text-zinc-400 text-sm mt-1">Sua redação foi formatada aos padrões do Portal. Você pode editar o resultado à direita.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-sm font-semibold flex items-center gap-2">
            <Save className="w-4 h-4" /> Salvar Rascunho
          </button>
          <Link href="/assinante/nova-materia/publicar" className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-red-600/20">
            Continuar para Publicação <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* COLUNA ESQUERDA - ORIGINAL (Readonly) */}
        <div className="flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="bg-zinc-900/80 border-b border-zinc-800 p-3 px-5 font-semibold text-sm text-zinc-300 flex justify-between items-center">
            <span>O que você escreveu (Input Bruto)</span>
          </div>
          <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-600 block mb-1">Título de Sugestão</span>
                <p className="text-zinc-300">Vitória suada na etapa de Interlagos da F4</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-600 block mb-1">Fatos Principais</span>
                <p className="text-zinc-400 text-sm leading-relaxed">Venci a etapa X do campeonato Y na data Z, largando em 3º e fazendo ultrapassagem na volta 15 logo antes do pneu desgastar completamente...</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-600 block mb-1">Citações</span>
                <p className="text-zinc-400 text-sm leading-relaxed">"Foi uma corrida brutal contra a equipe rival."</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-600 block mb-1">Contexto Extra</span>
                <p className="text-zinc-400 text-sm leading-relaxed">Meu carro é o número 32, patrocinado pela XPTO, estou em P2 no geral do campeonato...</p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex gap-3 text-sm text-zinc-400">
               <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
               <p>Este painel se manterá gravado e imutável para nossa auditoria interna do Marco Civil de metadados.</p>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA - IA E EDITÁVEL */}
        <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden relative">
          <div className="bg-zinc-950 border-b border-zinc-800 p-3 px-5 font-semibold text-sm text-red-500 flex justify-between items-center">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/></svg> 
              Versão Redigida pela IA (Editável)
            </span>
            <button className="text-zinc-400 hover:text-white flex items-center gap-1.5 text-xs">
              <RotateCcw className="w-3.5 h-3.5" /> Refazer (Gasta Limite)
            </button>
          </div>
          
          <div className="flex-1 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 bg-zinc-900/50 backdrop-blur-sm z-10">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-red-400 animate-pulse">Driver Engine redigindo a matéria...</span>
              </div>
            ) : null}

            {/* Simulacao de Rich Text Editor */}
            <textarea
              className="w-full h-full bg-transparent text-white p-5 resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-red-600/20 leading-relaxed font-serif text-lg custom-scrollbar"
              value={iaContent}
              onChange={(e) => setIaContent(e.target.value)}
            />
          </div>
          <div className="bg-zinc-950 px-4 py-2 border-t border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
            <span>Auto-save a cada 30s ativado</span>
            <span>{iaContent.length} caracteres limitados a 12.000</span>
          </div>
        </div>

      </div>
    </div>
  );
}
