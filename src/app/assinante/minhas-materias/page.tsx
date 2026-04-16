import Link from "next/link";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { ContentOriginBadge } from "../../../components/badges/ContentOriginBadge";

// MOCK para exibir no App
const minhasMaterias = [
  { id: "1", titulo: "Vitória na F4", views: 2450, status: "publicada", date: "16/04/2026", slug: "vitoria-na-f4" },
  { id: "2", titulo: "Desafio nos boxes: troca de pneus", views: 0, status: "rascunho", date: "10/04/2026", slug: "desafio-boxes" },
];

export default function MinhasMateriasPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white">Minhas Matérias</h1>
          <p className="text-zinc-400 mt-2">Você assina o Plano Pro (2/3 publicadas neste mês).</p>
        </div>
        <Link href="/assinante/nova-materia" className="bg-red-600 hover:bg-red-500 text-white px-5 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/20">
          <Plus className="w-5 h-5" /> Escrever Nova (1 Restante)
        </Link>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-sm">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Matéria</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Publish Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Views</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm">
              {minhasMaterias.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {m.titulo}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      m.status === 'publicada' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                      m.status === 'rascunho' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {m.date}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-right font-mono">
                    {m.views.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {m.status === 'publicada' && (
                        <Link href={`/materia/${m.slug}`} className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors" title="Ver Publicação">
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <button className="p-1.5 text-zinc-400 hover:text-red-400 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors" title="Corrigir Erro">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-zinc-400 hover:text-red-600 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors" title="Deletar (Soft Delete)">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {minhasMaterias.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    Você ainda não gerou nenhuma matéria com a IA.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
