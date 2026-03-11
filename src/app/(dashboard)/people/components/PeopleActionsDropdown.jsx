"use client";

import { useState, useRef, useEffect } from "react";
import {
  HiOutlineDotsVertical,
  HiOutlinePencil,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { TbLockPassword } from "react-icons/tb";

export default function PeopleActionsDropdown({ setIsModal }) {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState("down");
  const ref = useRef(null);
  const buttonRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleDropdown = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // approx dropdown height
    const dropdownHeight = 220;

    setDirection(
      spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? "up" : "down",
    );
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="hover:text-(--foreground) cursor-pointer"
      >
        <HiOutlineDotsVertical className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          className={`absolute right-0 w-56 bg-(--background) border border-slate-300 rounded-lg shadow-lg z-50
            animate-in fade-in
            ${
              direction === "down"
                ? "mt-2 top-full slide-in-from-top-1"
                : "mb-2 bottom-full slide-in-from-bottom-1"
            }
          `}
        >
          <div className="py-1 text-xs text-slate-700">
            <button
              onClick={() => setIsModal("EDIT_PROFILE")}
              className="menu-item"
            >
              <HiOutlinePencil className="icon" />
              Edit Profile
            </button>

            <button
              onClick={() => setIsModal("CHANGE_PASSWORD")}
              className="menu-item"
            >
              <TbLockPassword className="icon" />
              Change Password
            </button>

            <div className="my-1 h-px bg-slate-200" />

            <button
              onClick={() => setIsModal("STATUS_UPDATE")}
              className="menu-item"
            >
              <HiOutlineCheckCircle className="icon" />
              Active
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
