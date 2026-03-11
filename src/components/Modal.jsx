"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

export default function Modal({
  open,
  onClose,
  heading,
  width = "500px",
  children,
}) {
  // close on ESC
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-600"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{ width }}
        className={`pb-4 rounded-xl bg-white shadow-xl
          transform transition-all duration-500 ease-out
          max-h-[90vh] flex flex-col
          ${
            open
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-90 opacity-0 translate-y-4"
          }
        `}
      >
        <div className="flex px-6 py-4 items-center justify-between gap-5 border-b border-gray-300">
          <h2 className="truncate text-lg">{heading || "Heading"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Scroll only when height exceeds 90vh */}
        <div className="overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
