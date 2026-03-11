import React from "react";
import { FaRulerCombined } from "react-icons/fa";
import { LuRuler } from "react-icons/lu";
import { MdPolyline } from "react-icons/md";
import { TbPolygon } from "react-icons/tb";

const measureGroups = [
  {
    label: "Setup",
    tools: [{ id: "measure_calibrate", icon: <FaRulerCombined size={14} />, label: "Calibrate Scale" }],
  },
  {
    label: "Distance",
    tools: [
      { id: "measure_distance", icon: <LuRuler size={14} />, label: "Distance" },
      { id: "measure_multiline", icon: <MdPolyline size={14} />, label: "Multi-Line Distance" },
    ],
  },
  {
    label: "Area",
    tools: [{ id: "measure_area", icon: <TbPolygon size={14} />, label: "Measure Area" }],
  },
];

export default function MeasurePopup({ onSelect, DropdownTooltip }) {
  return (
    <div className="absolute left-9 top-0 bg-zinc-900 border border-zinc-700 flex flex-row shadow-2xl" style={{ zIndex: 10000 }}>
      {measureGroups.map((group, idx) => (
        <div key={idx} className="border-r border-zinc-800 last:border-none p-1">
          <div className="text-zinc-500 text-[10px] px-2 py-1">{group.label}</div>
          <div className="flex flex-row">
            {group.tools.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className="p-2 hover:bg-zinc-700 text-zinc-400 hover:text-white border-r border-zinc-800 last:border-none transition-colors relative group"
              >
                {t.icon}
                <DropdownTooltip text={t.label} />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}