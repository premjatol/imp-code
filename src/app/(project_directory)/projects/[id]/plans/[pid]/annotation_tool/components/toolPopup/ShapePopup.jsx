import React from "react";
import { MdOutlineCloud } from "react-icons/md";
import { FaRegSquare, FaRegCircle, FaDrawPolygon, FaSquare, FaCircle } from "react-icons/fa";
import { BiShapeTriangle } from "react-icons/bi";
import { BsTriangleFill, BsCloudFill } from "react-icons/bs";

const shapeGroups = [
  {
    label: "Outline",
    tools: [
      { id: "cloud", icon: <MdOutlineCloud size={14} />, label: "Cloud" },
      { id: "rect", icon: <FaRegSquare size={14} />, label: "Rectangle" },
      { id: "circle", icon: <FaRegCircle size={14} />, label: "Circle" },
      { id: "triangle", icon: <BiShapeTriangle size={14} />, label: "Triangle" },
      { id: "polygon", icon: <FaDrawPolygon size={14} />, label: "Polygon" },
    ],
  },
  {
    label: "Filled",
    tools: [
      { id: "cloud-filled", icon: <BsCloudFill size={14} />, label: "Filled Cloud" },
      { id: "rect-filled", icon: <FaSquare size={14} />, label: "Filled Rectangle" },
      { id: "circle-filled", icon: <FaCircle size={14} />, label: "Filled Circle" },
      { id: "triangle-filled", icon: <BsTriangleFill size={14} />, label: "Filled Triangle" },
      { id: "polygon-filled", icon: <FaDrawPolygon size={14} />, label: "Filled Polygon" },
    ],
  },
];

export default function ShapePopup({ onSelect, DropdownTooltip }) {
  return (
    <div className="absolute left-9 top-0 bg-zinc-900 border border-zinc-700 flex flex-col shadow-2xl" style={{ zIndex: 10000 }}>
      {shapeGroups.map((group, idx) => (
        <div key={idx} className="border-b border-zinc-800 last:border-none p-1">
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