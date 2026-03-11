"use client";

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import Link from "next/link";

// {
//   name: string;
//   icon?: ReactNode;
//   link?: string;
//   disabled?: boolean;
//   css?: string;
//   lineBreak?: boolean;
//   onClick?: (ctx: any) => void;
//   closeOnClick?: boolean;
// }

export default function ClickPopup({
  optionsList = [],
  startFrom = "left",
  context = null,
  onClose,
  buttonRef,
}) {
  const popupRef = useRef(null);
  const [openUpward, setOpenUpward] = useState(false);

  // Detect click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current?.contains(e.target)) return;
      if (buttonRef?.current?.contains(e.target)) return;
      onClose?.();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, buttonRef]);

  // Calculate position dynamically
  useLayoutEffect(() => {
    if (!popupRef.current || !buttonRef?.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const popupHeight = popupRef.current.offsetHeight;

    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    if (spaceBelow < popupHeight && spaceAbove > popupHeight) {
      setOpenUpward(true);
    } else {
      setOpenUpward(false);
    }
  }, [optionsList]);

  if (!Array.isArray(optionsList) || optionsList.length === 0) return null;

  const handleClick = (option) => {
    if (option.disabled) return;

    try {
      if (typeof option.onClick === "function") {
        option.onClick(context);
      }

      if (option.closeOnClick !== false && onClose) {
        onClose();
      }
    } catch (err) {
      console.error(`Popup action failed: ${option.name}`, err);
    }
  };

  return (
    <div
      ref={popupRef}
      className={`absolute ${startFrom === "left" ? "left-0" : "right-0"} ${
        openUpward ? "bottom-full mb-2" : "top-full mt-2"
      } min-w-38 rounded-md bg-white border border-gray-300 shadow-lg z-50`}
      onClick={(e) => e.stopPropagation()}
    >
      {optionsList.map((op, i) => {
        const baseClasses = `
          flex w-full items-center gap-3 px-4 py-2
          text-left text-xs text-nowrap transition hover:bg-gray-200
          ${
            op.disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 cursor-pointer"
          }
          ${op.lineBreak ? "border-b border-gray-300" : ""}
          ${op.css ?? ""}
        `;

        if (op.link && !op.disabled) {
          return (
            <Link
              key={i}
              href={op.link}
              className={baseClasses}
              onClick={() => {
                if (op.closeOnClick !== false && onClose) {
                  onClose();
                }
              }}
            >
              {op.icon && <span>{op.icon}</span>}
              <span>{op.name}</span>
            </Link>
          );
        }

        return (
          <button
            key={i}
            disabled={op.disabled}
            onClick={() => handleClick(op)}
            className={baseClasses}
          >
            {op.icon && <span>{op.icon}</span>}
            <span>{op.name}</span>
          </button>
        );
      })}
    </div>
  );
}
