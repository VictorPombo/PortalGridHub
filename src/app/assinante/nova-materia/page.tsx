"use client";

import { useState } from "react";
import { ArrowRight, Info, Upload } from "lucide-react";
import Link from "next/link";

export default function NovaMateriaPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2">Detalhes da Matéria</h1>
        <p className="text-zinc-400">Preencha os fatos crus. Nossa IA (Driver AI Engine) escreverá o texto jornalístico para a sua revisão final.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Categoria</label>
          <select className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
            <option>F1</option>
            <option>MotoGP</option>
            <option>F4 Brasil</option>
            <option>Stock Car</option>
            <option>Por trás dos Boxes (Setup)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Título de Sugestão (10-120 caracteres)</label>
          <input 
            type="text" 
            placeholder="Ex: Vitória suada na etapa de Interlagos da F4" 
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 placeholder:text-zinc-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Fatos Principais (min 50 caracteres) <span className="text-red-500">*</span></label>
          <div className="flex bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg mb-3 items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">Descreva exatamente os fatos cronológicos de maneira crua. A IA interpretará e expandirá no padrão Driver News de redação.</p>
          </div>
          <textarea 
            rows={5}
            placeholder={`Venci a etapa X do campeonato Y na data Z, largando em 3º e fazendo ultrapassagem na volta 15 logo antes do pneu desgastar completamente...`}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 resize-none placeholder:text-zinc-600"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Citações e Aspas (Opcional)</label>
          <textarea 
            rows={3}
            placeholder={`Se quiser ser citado diretamente, coloque aspas. Ex: "Foi uma corrida brutal contra a equipe rival."`}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 resize-none placeholder:text-zinc-600"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Contexto Adicional (Equipe, Campeonatos) (Opcional)</label>
          <textarea 
            rows={3}
            placeholder={`Meu carro é o número 32, patrocinado pela XPTO, estou em P2 no geral do campeonato...`}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 resize-none placeholder:text-zinc-600"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Imagem de Capa</label>
          <div className="w-full border-2 border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-950 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors">
            <Upload className="w-8 h-8 text-zinc-500 mb-3" />
            <span className="text-zinc-400 text-sm">Clique para fazer upload de foto (JPG/PNG máx 5mb)</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Link href="/assinante/nova-materia/revisar" className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-red-600/20">
          Avançar para IA
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
