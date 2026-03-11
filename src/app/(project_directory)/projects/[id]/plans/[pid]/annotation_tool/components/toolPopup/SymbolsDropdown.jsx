import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import {
  SYMBOL_CATEGORIES,
  SYMBOL_LIBRARY,
  getRecentlyUsedSymbols,
} from "../../data/SymbolsData";

export default function SymbolsDropdown({
  show,
  onClose,
  onSelectSymbol,
  recentlyUsed = [],
}) {
  const [selectedCategory, setSelectedCategory] = useState("audiovisual");

  if (!show) return null;

  const getCurrentSymbols = () => {
    if (selectedCategory === "recently_used") {
      return getRecentlyUsedSymbols(recentlyUsed);
    }
    return SYMBOL_LIBRARY[selectedCategory] || [];
  };

  const symbols = getCurrentSymbols();

  return (
    <div
      className="absolute left-9 top-0 bg-zinc-900 border border-zinc-700 shadow-2xl w-72 flex flex-col"
      style={{ zIndex: 10000 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-2 border-b border-zinc-800 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-zinc-500 font-medium text-[10px] uppercase tracking-wider">
            Symbols
          </h3>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <MdClose size={14} />
          </button>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-white text-[11px] focus:outline-none hover:border-zinc-500 transition-colors cursor-pointer"
        >
          {SYMBOL_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Grid Body */}
      <div className="p-2 max-h-64 overflow-y-auto grid grid-cols-4 gap-2 scrollbar-thin scrollbar-thumb-zinc-700">
        {symbols.map((symbol) => (
          <button
            key={symbol.id}
            onClick={() => onSelectSymbol(symbol)}
            className="flex items-center justify-center p-2 bg-zinc-800 hover:bg-blue-600 border border-zinc-700 hover:border-blue-400 rounded transition-all text-white group"
            title={symbol.name}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">
              {symbol.icon}
            </span>
          </button>
        ))}
        {symbols.length === 0 && (
          <div className="col-span-4 py-8 text-center text-zinc-500 text-[11px]">
            No symbols found
          </div>
        )}
      </div>
    </div>
  );
}