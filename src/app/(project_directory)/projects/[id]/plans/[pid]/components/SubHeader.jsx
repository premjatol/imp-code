"use client";

import ClickPopup from "@/components/common/ClickPopup";
import Modal from "@/components/Modal";
import { useAnnotationStore } from "@/stores/plans/useAnnotationStore";
import { usePlansStore } from "@/stores/plans/usePlansStore";
import useContextStore from "@/stores/useContextStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaFilter, FaHistory } from "react-icons/fa";
import { MdArrowBackIos } from "react-icons/md";
import VersionControlModal from "../../modals/VersionControlModal";

const MODULEKEY = "annotationTool";

const SubHeader = ({ showFilters, setShowFilters }) => {
  const { getPlanDetails, setProjectId, setPlanId, setIsModal, isModal } =
    useAnnotationStore();

  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);
  const sortButtonRef = useRef(null);

  const { id, pid } = useParams();

  useEffect(() => {
    if (id && pid) {
      setProjectId(id);
      setPlanId(pid);

      const str = useContextStore
        .getState()
        .createParamsStr({ page: "", limit: "", planId: pid }, MODULEKEY);
      if (str) {
        getPlanDetails(id, str);
      }
    }
  }, [pid, id]);

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
    Tags: [
      "building1",
      "concrete_pre-pour_checklist",
      "change_order",
      "test",
      "client",
      "rework",
      "punch",
    ],
    "Version sets": ["v1.0", "v2.1", "Final"],
    "Created date": ["Today", "Last 7 Days", "Last 30 Days"],
    "Last modified": ["Newest first", "Oldest first"],
    // "3D view": ["Enabled", "Disabled"],
  };

  return (
    <div className="w-full bg-background text-foreground border-b border-gray-200 dark:border-gray-800 font-sans">
      {/* --- First Row: Main Actions (Image 1) --- */}
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center space-x-2">
          <Link
            href={`/projects/${id}/plans`}
            className="flex items-center border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
          >
            <MdArrowBackIos className="mr-2 text-xs" />
            All plans
          </Link>

          <div className="relative">
            <button
              ref={sortButtonRef}
              onClick={() => {
                isModal === "ACTIONS" ? false : "ACTIONS";
              }}
              className="flex items-center border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
            >
              Actions <FaChevronDown className="ml-2 text-xxs" />
            </button>

            {isModal === "ACTIONS" && (
              <ClickPopup
                optionsList={[
                  { name: "Edit number/description" },
                  { name: "Rotate sheet" },
                  { name: "Manage tags" },
                  { name: "Set scale", lineBreak: true },

                  { name: "Compare" },
                  { name: "Export as PDF" },
                  { name: "Export markup summary" },
                  { name: "Export QR code", lineBreak: true },

                  { name: "Delete plan", css: "text-red-500 hover:bg-red-300" },
                ]}
                startFrom="left"
                buttonRef={sortButtonRef}
                onClose={() => setIsModal(false)}
              />
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
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

          <button
            className="flex items-center border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
            onClick={() => setIsModal("UPLOAD_VERSION")}
          >
            <FaHistory className="mr-2 text-xs" /> Version control
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
        open={isModal === "UPLOAD_VERSION"}
        heading="Upload new version"
        onClose={() => setIsModal(false)}
        width="600px"
      >
        <VersionControlModal />
      </Modal>
    </div>
  );
};

export default SubHeader;
