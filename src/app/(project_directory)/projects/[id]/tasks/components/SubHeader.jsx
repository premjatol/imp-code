"use client";

import ClickPopup from "@/components/common/ClickPopup";
import Modal from "@/components/Modal";
import useTasksStore from "@/stores/tasks/useTasksStore";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { BiSolidGrid } from "react-icons/bi";
import { BsPrinter } from "react-icons/bs";
import {
  FaChevronDown,
  FaFilter,
  FaPlus,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { MdOutlineSort } from "react-icons/md";
import TasksFilterModal from "../modals/TasksFilterModal";
import useContextStore from "@/stores/useContextStore";

const MODULEKEY = "tasks";

const SubHeader = ({ type }) => {
  const popupRef = useRef(null);
  const actionButtonRef = useRef(null);
  const sortButtonRef = useRef(null);

  const params = useParams();
  const projectId = params?.id;

  const { getTasks, setProjectId, setIsModal, isModal, filterObj, limit } =
    useTasksStore();

  useEffect(() => {
    if (projectId) {
      setProjectId(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    // const str = useContextStore
    //   .getState()
    //   .createParamsStr({ page: 1, limit }, MODULEKEY);
    getTasks("");
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsModal(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-background text-foreground border-b border-gray-200 dark:border-gray-800 font-sans">
      {/* --- First Row: Main Actions (Image 1) --- */}
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsModal("CREATE_TASK")}
            className="flex items-center bg-primary text-white px-4 py-1.5 rounded text-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            <FaPlus className="mr-2 text-xs" /> New task
          </button>

          <button className="flex items-center border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <FaPlus className="mr-2 text-xs" /> Import tasks
          </button>

          <button className="flex items-center border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <BsPrinter className="mr-2 text-xs" /> Generate reports
          </button>

          <div className="relative">
            <button
              ref={actionButtonRef}
              onClick={() =>
                setIsModal(
                  isModal === "ACTIONS_OPTIONS" ? false : "ACTIONS_OPTIONS",
                )
              }
              className="flex items-center border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
            >
              Actions <FaChevronDown className="ml-2 text-xxs" />
            </button>

            {isModal === "ACTIONS_OPTIONS" && (
              <ClickPopup
                optionsList={[
                  { name: "Select all" },
                  { name: "Deselect all", lineBreak: true },
                  { name: "Re-open", lineBreak: true, disabled: true },
                  { name: "Manage tags", disabled: true },
                  { name: "Add checklist", lineBreak: true, disabled: true },
                  { name: "Move to plan", lineBreak: true, disabled: true },
                  { name: "Export QR code", lineBreak: true, disabled: true },
                  { name: "Delete", css: "text-red-600! hover:bg-red-200" },
                ]}
                startFrom="left"
                buttonRef={actionButtonRef}
                onClose={() => setIsModal(false)}
              />
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search by task titles & id"
              className="w-full rounded-md border border-gray-300 py-1.5 pl-3 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <FiSearch
              size={12}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="relative">
            <button
              ref={sortButtonRef}
              onClick={() =>
                setIsModal(isModal === "SORT_OPTIONS" ? false : "SORT_OPTIONS")
              }
              className="flex items-center border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
            >
              <MdOutlineSort className="mr-2 text-xs" /> Sort
            </button>

            {isModal === "SORT_OPTIONS" && (
              <ClickPopup
                optionsList={[
                  { name: "Category" },
                  { name: "Assignee" },
                  { name: "Plan", lineBreak: true },
                  { name: "Title" },
                  { name: "Task", lineBreak: true },
                  { name: "Start Date" },
                  { name: "End Date", lineBreak: true },
                  { name: "Last Modified" },
                ]}
                startFrom="left"
                buttonRef={sortButtonRef}
                onClose={() => setIsModal(false)}
              />
            )}
          </div>

          <button
            onClick={() => setIsModal("FILTERS")}
            className={`relative flex items-center border px-4 py-1.5 rounded text-xs transition-all cursor-pointer ${
              filterObj
                ? "border-primary text-primary bg-primary-100 dark:bg-opacity-10"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            <FaFilter className="mr-2 text-xs" /> Filters
            {filterObj && (
              <span className="absolute -top-1 right-1 bg-red-600 rounded-full w-2 h-2 inline-block"></span>
            )}
          </button>

          <div className="flex border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
            <button
              onClick={() => type.setType("grid")}
              className={`p-2 cursor-pointer ${type.type === "grid" ? "bg-primary text-white" : ""}`}
            >
              <BiSolidGrid className="text-xs" />
            </button>
            <button
              onClick={() => type.setType("calendar")}
              className={`p-2 cursor-pointer ${type.type === "calendar" ? "bg-primary text-white" : ""}`}
            >
              <FaRegCalendarAlt className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        heading={"Filter"}
        onClose={() => setIsModal(false)}
        open={isModal === "FILTERS"}
        width="500px"
      >
        <TasksFilterModal />
      </Modal>
    </div>
  );
};

export default SubHeader;
