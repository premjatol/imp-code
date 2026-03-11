import React from "react";
import { MdLink, MdImage, MdAttachFile } from "react-icons/md";

const linkTools = [
  { id: "link_plan", icon: <MdLink size={16} />, label: "Link to Plan" },
  { id: "link_photo", icon: <MdImage size={16} />, label: "Link Photo" },
  { id: "link_file", icon: <MdAttachFile size={16} />, label: "Link File" },
];

export default function LinkPopup({ onSelect, DropdownTooltip }) {
  return (
    <div className="absolute left-9 top-0 bg-zinc-900 border border-zinc-700 flex flex-col shadow-2xl" style={{ zIndex: 10000 }}>
      <div className="p-1">
        <div className="text-zinc-500 text-[10px] px-2 py-1">Links</div>
        <div className="flex flex-row">
          {linkTools.map((t) => (
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
    </div>
  );
}