import React from "react";

const COLORS = [
  { name: "Green", value: "#22c55e" },
  { name: "Red", value: "#ef4444" },
  { name: "Dark Blue", value: "#1e3a8a" },
  { name: "Orange", value: "#f97316" },
  { name: "Dark Green", value: "#166534" },
  { name: "Pink", value: "#ec4899" },
  { name: "Light Blue", value: "#38bdf8" },
  { name: "Yellow", value: "#facc15" },
  { name: "Light Green", value: "#86efac" },
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Purple", value: "#a855f7" }, // private color
];

export default function ColorPopup({ onSelect, selectedColor }) {
  return (
    <div className="absolute left-full ms-2 bottom-0 w-48 bg-[#1f1f23] border border-zinc-700 rounded-sm shadow-2xl p-3 text-zinc-300 z-50">
      
      {/* Header */}
      <p className="text-xs text-zinc-400 mb-2">Colors</p>

      {/* Color Grid */}
      <div className="grid grid-cols-6 gap-3">
        {COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => onSelect(c.value)}
            className={`relative w-5 h-5 rounded-full border transition-all
              ${
                selectedColor === c.value
                  ? "border-white scale-110"
                  : "border-zinc-600 hover:border-white hover:scale-110"
              }
            `}
            style={{ backgroundColor: c.value }}
            title={c.name}
          />
        ))}
      </div>
    </div>
  );
}
