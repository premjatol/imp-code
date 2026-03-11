"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineGlobe, HiOutlineChevronDown } from "react-icons/hi";

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update selected language when i18next changes (in case of external changes)
  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng");
    if (storedLang) {
      setSelectedLang(storedLang);
      i18n.changeLanguage(storedLang);
    }
  }, [i18n.language]);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  const handleChangeLanguage = (code) => {
    i18n.changeLanguage(code).then(() => {
      localStorage.setItem("i18nextLng", code);
      setSelectedLang(code);
      window.location.reload(); // optional: reload to apply translations
    });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
        title="Change Language"
      >
        <HiOutlineGlobe className="w-5 h-5" />
        <HiOutlineChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-(--background) border border-slate-300 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={`w-full flex items-center px-4 py-2 text-xs transition-colors cursor-pointer ${
                selectedLang === lang.code
                  ? "bg-primary-100 text-primary font-semibold"
                  : "text-slate-600 hover:bg-primary-50"
              }`}
            >
              <span className="mr-3">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
