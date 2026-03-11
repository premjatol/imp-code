import React, { useState, useRef, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";

const ActionsDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center px-4 py-2 bg-[--background] border border-slate-300 rounded-lg text-xs  text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        Actions
        <HiChevronDown className="ml-2 w-4 h-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute mt-1 left-0 w-48 bg-white border border-slate-300 rounded-md shadow-lg z-10">
          <ul className="py-1 text-xs text-slate-700">
            <li
              className="block px-4 py-2 cursor-pointer hover:bg-slate-100"
              onClick={() => {
                alert("Invite to project clicked");
                setOpen(false);
              }}
            >
              Invite to project
            </li>
            <li
              className="block px-4 py-2 cursor-pointer text-red-500 hover:bg-red-100"
              onClick={() => {
                alert("Remove clicked");
                setOpen(false);
              }}
            >
              Remove
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;
