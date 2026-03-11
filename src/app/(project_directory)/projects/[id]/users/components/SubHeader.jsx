"use client";

import Modal from "@/components/Modal";
import { useState, useRef, useEffect } from "react";
import { FaPlus, FaChevronDown, FaFilter } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import NewUsersModal from "../modals/NewUsersModal";
import ClickPopup from "@/components/common/ClickPopup";

const SubHeader = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);
  const actionButtonRef = useRef(null);
  const [isModal, setIsModal] = useState(false);
  const { t } = useTranslation();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterOptions = {
    Access: ["Admin", "PM", "Lead", "Installer", "Client"],
  };

  return (
    <div className="w-full bg-background text-foreground border-b border-gray-200 dark:border-gray-800 font-sans">
      {/* --- First Row: Main Actions (Image 1) --- */}
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center space-x-2">
          <button
            className="flex items-center bg-primary text-white px-4 py-1.5 rounded text-xs hover:opacity-90 transition-opacity cursor-pointer"
            onClick={() => setIsModal("INVITE_USERS")}
          >
            <FaPlus className="mr-2 text-xs" /> New users
          </button>

          <div className="relative">
            <button
              ref={actionButtonRef}
              onClick={() =>
                setIsModal((prev) => (prev ? false : "ACTIONS_OPTIONS"))
              }
              className="flex items-center border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
            >
              Actions <FaChevronDown className="ml-2 text-xxs" />
            </button>

            {isModal === "ACTIONS_OPTIONS" && (
              <ClickPopup
                optionsList={[
                  { name: "Change Access" },
                  { name: "Approve Project Access", },
                  { name: "Remove", css: "text-red-600! hover:bg-red-200" },
                ]}
                startFrom="left"
                buttonRef={actionButtonRef}
                onClose={() => setIsModal(false)}
              />
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-8">
            {/* Search bar */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search project users"
                className="w-full rounded-md border border-gray-300 py-1.5 pl-3 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <FiSearch
                size={12}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center border px-4 py-1.5 rounded text-xs transition-all cursor-pointer ${
              showFilters
                ? "border-primary text-primary bg-primary-100 dark:bg-opacity-10"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            <FaFilter className="mr-2 text-xs" /> Filters
          </button>
        </div>
      </div>

      {/* --- Second Row: Filter Header (Image 2) --- */}
      {showFilters && (
        <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center space-x-3 relative" ref={popupRef}>
            {Object.keys(filterOptions).map((filter) => (
              <div key={filter} className="relative">
                <button
                  onClick={() =>
                    setActivePopup(activePopup === filter ? null : filter)
                  }
                  className={`flex items-center px-4 py-1.5 border rounded-full text-xs transition-colors cursor-pointer ${
                    activePopup === filter
                      ? "border-black dark:border-white ring-0.5 ring-black dark:ring-white"
                      : "border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800"
                  }`}
                >
                  {filter} <FaChevronDown className="ml-2 text-xxs" />
                </button>

                {/* --- Popup Box (Image 3) --- */}
                {activePopup === filter && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-xl z-50 py-2">
                    <div className="px-4 py-1.5 border-b border-gray-100 dark:border-gray-700">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-xs">Select all</span>
                      </label>
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {filterOptions[filter].map((option) => (
                        <label
                          key={option}
                          className="flex items-center px-4 py-1.5 space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <input
                            type="checkbox"
                            className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-xs text-gray-700 dark:text-gray-300">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => setActivePopup(null)}
              className="text-primary text-xs hover:underline ml-2"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      <Modal
        open={isModal === "INVITE_USERS"}
        heading={t("Invite to projects")}
        onClose={() => setIsModal(false)}
        width="450px"
      >
        <NewUsersModal />
      </Modal>
    </div>
  );
};

export default SubHeader;
