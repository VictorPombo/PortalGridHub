"use client";

import { Star } from "lucide-react";

interface CategoryFilterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "Tudo" },
  { id: "f1", label: "F1" },
  { id: "motogp", label: "MotoGP" },
  { id: "endurance", label: "Endurance" },
  { id: "stock_car", label: "Stock Car" },
  { id: "wrc", label: "WRC" },
  { id: "nascar", label: "NASCAR" },
];

export function CategoryFilter({ activeTab, onTabChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x">
      {/* Tab exclusiva com distinção premium */}
      <button
        onClick={() => onTabChange("exclusivas")}
        className={`snap-start flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          activeTab === "exclusivas"
            ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] border border-red-500"
            : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white"
        }`}
      >
        <Star className={activeTab === "exclusivas" ? "w-3.5 h-3.5 fill-white text-white" : "w-3.5 h-3.5 text-red-500 fill-red-500/20"} />
        EXCLUSIVAS
      </button>

      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onTabChange(cat.id)}
          className={`snap-start flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeTab === cat.id
              ? "bg-zinc-200 text-black border border-white"
              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
