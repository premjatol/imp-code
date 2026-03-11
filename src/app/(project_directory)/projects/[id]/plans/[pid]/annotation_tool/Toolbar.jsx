import React, { useState } from "react";
import {
  MdOutlineFullscreen,
  MdZoomIn,
  MdZoomOut,
  MdLocationOn,
} from "react-icons/md";
import { FaPen, FaLink, FaTextHeight, FaEraser } from "react-icons/fa";
import { BiNavigation } from "react-icons/bi";
import { LuScale } from "react-icons/lu";
import { GiHandBag } from "react-icons/gi";
import { FaShapes } from "react-icons/fa6";

import PenPopup from "./components/toolPopup/PenPopup";
import ShapePopup from "./components/toolPopup/ShapePopup";
import LinkPopup from "./components/toolPopup/LinkPopup";
import MeasurePopup from "./components/toolPopup/MeasurePopup";
import SymbolsDropdown from "./components/toolPopup/SymbolsDropdown";
import ColorPopup from "./components/toolPopup/ColorPopup";

export default function Toolbar({
  selectedTool,
  setSelectedTool,
  color,
  setColor,
  onSelectSymbol,
  recentlyUsedSymbols = [],
}) {
  const [activePopup, setActivePopup] = useState(null);

  // Child tool mapping to identify which category a child belongs to
  const childToolsMapping = {
    pen: [
      "pen",
      "highlighter",
      "large_highlighter",
      "straight_line",
      "arrow",
      "multi_line",
    ],
    shapes: [
      "rect",
      "circle",
      "cloud",
      "triangle",
      "polygon",
      "rect-filled",
      "circle-filled",
      "cloud-filled",
      "triangle-filled",
      "polygon-filled",
    ],
    link: ["link_plan", "link_photo", "link_file"],
    measure: [
      "measure_calibrate",
      "measure_distance",
      "measure_multiline",
      "measure_area",
    ],
    symbols: ["symbols"],
  };

  const handleToolClick = (toolId) => {
    if (selectedTool === toolId) {
      setSelectedTool(null);
    } else {
      setSelectedTool(toolId);
    }
    setActivePopup(null);
  };

  const handleCategoryClick = (category) => {
    setActivePopup(activePopup === category ? null : category);
  };

  // Improved highlight logic
  const getIconStyle = (id, isCategory = false) => {
    let isActive = false;

    if (activePopup) {
      // If a popup is open, ONLY highlight the button that opened it
      isActive = activePopup === id;
    } else {
      // If no popup is open, highlight the active tool OR its parent category
      if (isCategory) {
        isActive =
          selectedTool === id || childToolsMapping[id]?.includes(selectedTool);
      } else {
        isActive = selectedTool === id;
      }
    }

    return `p-1.5 cursor-pointer transition-all rounded-sm flex items-center justify-center relative group/btn ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-600 hover:bg-zinc-300 hover:text-black"
    }`;
  };

  const Tooltip = ({ text }) => (
    <span className="absolute left-12 scale-0 transition-all rounded bg-zinc-800 p-1 px-2 text-xs text-white group-hover/btn:scale-100 whitespace-nowrap pointer-events-none border border-zinc-300 shadow-xl z-9999">
      {text}
    </span>
  );

  const DropdownTooltip = ({ text }) => (
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 scale-0 transition-all rounded bg-zinc-800 p-1 px-2 text-xs text-white group-hover:scale-100 whitespace-nowrap pointer-events-none border border-zinc-300 shadow-xl z-10001">
      {text}
    </span>
  );

  return (
    <div className="w-10 h-full bg-zinc-100 flex flex-col items-center py-2 gap-1 border-r border-zinc-300 select-none relative">
      {/* Navigation Group */}
      <button
        onClick={() => handleToolClick("fullView")}
        className={getIconStyle("fullView")}
      >
        <MdOutlineFullscreen size={18} />
        <Tooltip text="Full Screen" />
      </button>
      <button
        onClick={() => handleToolClick("zoomin")}
        className={getIconStyle("zoomin")}
      >
        <MdZoomIn size={18} />
        <Tooltip text="Zoom In" />
      </button>
      <button
        onClick={() => handleToolClick("zoomout")}
        className={getIconStyle("zoomout")}
      >
        <MdZoomOut size={18} />
        <Tooltip text="Zoom Out" />
      </button>

      <hr className="w-6 border-zinc-300" />

      {/* Select Tool */}
      <button
        onClick={() => handleToolClick("select")}
        className={getIconStyle("select")}
      >
        <BiNavigation size={18} className="-rotate-90" />
        <Tooltip text="Select Tool (V)" />
      </button>

      <hr className="w-6 border-zinc-300" />

      {/* Pen Popup */}
      <div className="relative">
        <button
          onClick={() => handleCategoryClick("pen")}
          className={getIconStyle("pen", true)}
        >
          <FaPen size={14} />
          <Tooltip text="Drawing Tools" />
        </button>
        {activePopup === "pen" && (
          <PenPopup
            onSelect={handleToolClick}
            DropdownTooltip={DropdownTooltip}
          />
        )}
      </div>

      {/* Shapes Popup */}
      <div className="relative">
        <button
          onClick={() => handleCategoryClick("shapes")}
          className={getIconStyle("shapes", true)}
        >
          <FaShapes size={18} />
          <Tooltip text="Shapes" />
        </button>
        {activePopup === "shapes" && (
          <ShapePopup
            onSelect={handleToolClick}
            DropdownTooltip={DropdownTooltip}
          />
        )}
      </div>

      {/* Symbols Dropdown */}
      <div className="relative">
        <button
          onClick={() => handleCategoryClick("symbols")}
          className={getIconStyle("symbols", true)}
        >
          <GiHandBag size={14} />
          <Tooltip text="Add Symbols" />
        </button>
        <SymbolsDropdown
          show={activePopup === "symbols"}
          onClose={() => setActivePopup(null)}
          onSelectSymbol={(s) => {
            onSelectSymbol(s);
            handleToolClick("symbols");
          }}
          recentlyUsed={recentlyUsedSymbols}
        />
      </div>

      <button
        onClick={() => handleToolClick("marker")}
        className={getIconStyle("marker")}
      >
        <MdLocationOn size={18} />
        <Tooltip text="Add Task" />
      </button>

      {/* <div className="relative">
        <button
          onClick={() => handleCategoryClick("link")}
          className={getIconStyle("link", true)}
        >
          <FaLink size={14} />
          <Tooltip text="Add Hyperlink" />
        </button>
        {activePopup === "link" && (
          <LinkPopup
            onSelect={handleToolClick}
            DropdownTooltip={DropdownTooltip}
          />
        )}
      </div> */}

      <button
        onClick={() => handleToolClick("text")}
        className={getIconStyle("text")}
      >
        <FaTextHeight size={14} />
        <Tooltip text="Text Box" />
      </button>

      <div className="relative">
        <button
          onClick={() => handleCategoryClick("measure")}
          className={getIconStyle("measure", true)}
        >
          <LuScale size={16} />
          <Tooltip text="Measurement Tools" />
        </button>
        {activePopup === "measure" && (
          <MeasurePopup
            onSelect={handleToolClick}
            DropdownTooltip={DropdownTooltip}
          />
        )}
      </div>

      <hr className="w-6 border-zinc-300 my-1" />

      {/* Color Popup */}
      <div className="relative">
        <button
          onClick={() => handleCategoryClick("color")}
          className={getIconStyle("color", true)}
        >
          <div
            className="w-4 h-4 rounded-full border border-zinc-400"
            style={{ backgroundColor: color }}
          />
          <Tooltip text="Color" />
        </button>

        {activePopup === "color" && (
          <ColorPopup
            selectedColor={color}
            onSelect={(selected) => {
              setColor(selected);
              setActivePopup(null);
            }}
          />
        )}
      </div>

      <button
        onClick={() => handleToolClick("eraser")}
        className={getIconStyle("eraser")}
      >
        <FaEraser size={14} />
        <Tooltip text="Eraser" />
      </button>
    </div>
  );
}
