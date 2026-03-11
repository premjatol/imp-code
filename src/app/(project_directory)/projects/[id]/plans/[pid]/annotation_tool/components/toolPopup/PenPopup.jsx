import React from "react";
import { FaPen, FaHighlighter, FaArrowRight } from "react-icons/fa";
import { RxBorderWidth } from "react-icons/rx";
import { AiOutlineLine } from "react-icons/ai";
import { MdPolyline } from "react-icons/md";

export default function PenPopup({ onSelect, DropdownTooltip }) {
  const sections = [
    {
      title: "Freehand",
      tools: [
        { id: "pen", icon: <FaPen size={14} />, label: "Pen" },
        { id: "highlighter", icon: <FaHighlighter size={14} />, label: "Highlighter" },
        { id: "large_highlighter", icon: <RxBorderWidth size={14} />, label: "Large Highlighter" },
      ],
    },
    {
      title: "Lines",
      tools: [
        { id: "straight_line", icon: <AiOutlineLine size={14} />, label: "Straight Line" },
        { id: "arrow", icon: <FaArrowRight size={14} />, label: "Arrow" },
        { id: "multi_line", icon: <MdPolyline size={14} />, label: "Multi-Line" },
      ],
    },
  ];

  return (
    <div className="absolute left-9 top-0 bg-zinc-900 border border-zinc-700 flex flex-col shadow-2xl" style={{ zIndex: 10000 }}>
      {sections.map((section, idx) => (
        <div key={idx} className={`${idx === 0 ? "border-b" : ""} border-zinc-800 p-1`}>
          <div className="text-zinc-500 text-[10px] px-2 py-1">{section.title}</div>
          <div className="flex flex-row">
            {section.tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelect(tool.id)}
                className="p-2 hover:bg-zinc-700 text-zinc-400 hover:text-white border-r border-zinc-800 last:border-none transition-colors relative group"
              >
                {tool.icon}
                <DropdownTooltip text={tool.label} />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}