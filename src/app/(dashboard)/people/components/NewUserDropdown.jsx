import React, { useState, useRef, useEffect } from "react";
import { HiPlus } from "react-icons/hi";

const NewUserDropdown = ({ setIsModal }) => {
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
        className="flex items-center px-4 py-2 bg-primary hover:opacity-90 text-white rounded-lg font-bold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
      >
        <HiPlus className="w-4.5 h-4.5 mr-1" />
        New users
      </button>

      {open && (
        <div className="absolute mt-1 left-0 w-48 bg-white border border-slate-300 rounded-md shadow-lg z-10">
          <ul className="py-1 text-xs text-slate-700">
            <li
              className="block px-4 py-2 cursor-pointer hover:bg-slate-100"
              onClick={() => {
                setIsModal("ADD_NEW_USER");
                setOpen(false);
              }}
            >
              Add new user
            </li>
            <li
              className="block px-4 py-2 cursor-pointer hover:bg-slate-100"
              onClick={() => {
                setIsModal("INVITE_TO_PROJECT");
                setOpen(false);
              }}
            >
              Invite to project
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NewUserDropdown;
