"use client";

import Link from "next/link";
import "./sidebar.css";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FaThLarge,
  FaRegFileAlt,
  FaTasks,
  FaRegImage,
  FaRegFolderOpen,
  FaRegClipboard,
  FaUsers,
  FaCog,
  FaTrashAlt,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaEye,
  FaPlus,
} from "react-icons/fa";
import { MdOutlineLock } from "react-icons/md";
import useContextStore from "@/stores/useContextStore";
import Modal from "../Modal";
import AddNewCategory from "./modal/AddNewCategory";

const Sidebar = () => {
  const { isCollapsed, toggleCollapsed } = useContextStore();
  const [isModal, setIsModal] = useState(false);

  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const fieldManagement = [
    { title: "Plans", slug: "plans", icon: <FaThLarge /> },
    { title: "Tasks", slug: "tasks", icon: <FaTasks /> },
    { title: "Photos & Videos", slug: "photos", icon: <FaRegImage /> },
    { title: "Files", slug: "files", icon: <FaRegFolderOpen /> },
  ];

  const [tasksSection, setTasksSection] = useState([
    {
      title: "My tasks",
      slug: "my-tasks",
      icon: <FaStar />,
      count: 6,
    },
    {
      title: "Watched tasks",
      slug: "watched-tasks",
      icon: <FaEye />,
      count: 6,
    },
    { title: "All tasks", slug: "all-tasks", icon: <FaThLarge />, count: 6 },
  ]);

  // 3. Helper function to check if the item is active based on URL
  const isItemActive = (slug) => {
    return pathname.includes(`/${slug}`);
  };

  return (
    <div className="relative h-screen flex overflow-visible">
      <button
        onClick={() => toggleCollapsed(isCollapsed)}
        className={`absolute top-5 z-60 bg-[#222222] border border-gray-600 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary transition-all duration-300 shadow-xl cursor-pointer
          ${isCollapsed ? "left-13" : "left-57"}
        `}
      >
        {isCollapsed ? (
          <FaChevronRight size={10} />
        ) : (
          <FaChevronLeft size={10} />
        )}
      </button>

      <aside
        className={`h-full bg-[#222222] text-white flex flex-col transition-all duration-300 ease-in-out border-r border-gray-800 relative shadow-2xl ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex items-center min-h-15 pl-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Link
              href="/projects"
              className="bg-tertiary p-0.5 rounded-md min-w-4 flex items-center justify-center cursor-pointer"
            >
              <img src="/../images/fieldwirelogo.svg" alt="" width={30} />
            </Link>
            {!isCollapsed && (
              <div className="flex items-center gap-2 cursor-pointer group">
                <span className="font-heading leading-tight font-bold text-md text-white group-hover:text-white tracking-widest uppercase">
                 CUSTOM FIELDWIRE
                </span>
                <FaChevronDown
                  size={10}
                  className="text-gray-400 group-hover:text-white"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-2">
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="text-[10px] font-bold text-gray-400 pl-4 mb-2 tracking-widest uppercase">
                Field Management
              </h3>
            )}
            <nav>
              {fieldManagement.map((item) => (
                <SidebarItem
                  key={item.title}
                  icon={item.icon}
                  label={item.title}
                  isCollapsed={isCollapsed}
                  active={isItemActive(item.slug)}
                  locked={item.locked}
                  slug={item.slug}
                  id={id}
                />
              ))}
            </nav>
          </div>

          <div className="mb-4">
            {!isCollapsed && (
              <div className="pl-4 mb-2 flex items-center gap-1">
                <h3 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  Project Management
                </h3>
                <div className="w-3 h-3 border border-gray-500 rounded-full flex items-center justify-center text-[8px] text-gray-500">
                  ?
                </div>
              </div>
            )}

            {!isCollapsed && (
              <div className="pl-4 py-2 font-bold text-[12px] text-gray-100 uppercase tracking-tighter">
                Tasks
              </div>
            )}

            <nav>
              {tasksSection.map((item) => (
                <SidebarItem
                  key={item.title}
                  icon={item.icon}
                  label={item.title}
                  isCollapsed={isCollapsed}
                  count={item.count}
                  active={isItemActive(item.slug)}
                  slug={item.slug}
                  id={id}
                />
              ))}
              {!isCollapsed && (
                <button
                  onClick={() => setIsModal("NEW_CATEGORY")}
                  className="flex items-center gap-4 pl-4 py-2 text-gray-400 hover:text-white cursor-pointer text-[12px]"
                >
                  <FaPlus size={10} className="min-w-4" />
                  <span>New category</span>
                </button>
              )}
            </nav>
          </div>
        </div>

        <div className="px-4 py-2 border-t border-gray-800 flex items-center justify-around bg-[#1c1c1c]">
          <button
            type="button"
            className={`p-2 rounded-full text-gray-400  hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer 
              ${pathname.includes("/users") ? "bg-primary text-white" : "hover:bg-gray-600"}`}
            aria-label="Users"
            onClick={() => router.push(`/projects/${id}/users`)}
          >
            <FaUsers size={16} />
          </button>

          <button
            type="button"
            className={`p-2 rounded-full text-gray-400  hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer 
              ${pathname.includes("/settings") ? "bg-primary text-white" : "hover:bg-gray-600"}`}
            aria-label="Settings"
            onClick={() => router.push(`/projects/${id}/settings`)}
          >
            <FaCog size={16} />
          </button>

          <button
            type="button"
            className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded cursor-pointer"
            aria-label="Delete"
          >
            <FaTrashAlt size={16} />
          </button>
        </div>
      </aside>

      {/* Modals */}
      <Modal
        open={isModal === "NEW_CATEGORY"}
        onClose={() => setIsModal(false)}
        heading="Add New Category"
        width="500px"
      >
        <AddNewCategory
          onClose={() => setIsModal(false)}
          tasksSection={tasksSection}
          setTasksSection={setTasksSection}
        />
      </Modal>
    </div>
  );
};

const SidebarItem = ({
  icon,
  label,
  isCollapsed,
  active = false,
  count,
  locked = false,
  slug,
  id,
}) => {
  return (
    <Link
      href={`/projects/${id}/${slug}`}
      className={`
        flex items-center py-2.5 cursor-pointer transition-colors relative
        ${active ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"}
        ${isCollapsed ? "justify-center px-0" : "pl-4 pr-4"}
      `}
    >
      {active && !isCollapsed && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
      )}

      <div className="flex items-center gap-4">
        <span
          className={`text-[12px] ${active ? "text-white" : "text-gray-400"} shrink-0 min-w-4 flex justify-center`}
        >
          {icon}
        </span>
        {!isCollapsed && (
          <span className="text-[12px] whitespace-nowrap">{label}</span>
        )}
      </div>

      {!isCollapsed && (
        <div className="flex items-center gap-2 ml-auto">
          {locked && <MdOutlineLock className="text-gray-500" size={14} />}
          {count !== undefined && (
            <span className="text-[11px] font-medium opacity-80">{count}</span>
          )}
        </div>
      )}
    </Link>
  );
};

export default Sidebar;
