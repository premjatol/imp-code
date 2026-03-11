"use client";

import { useState } from "react";
import StatusManager from "./components/status-manager/StatusManager";
import useSettingStore from "@/stores/settings/useSettingStore";
import FlagGroupManager from "./components/flag-manager/FlagGroupManager";
import CategoryManager from "./components/category-manager/CategoryManager";
import TagsManager from "./components/tags-manager/TagsManager";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Category");

  const tabs = ["Category", "Flag Groups", "Status Manager", "Tags"];
  return (
    <>
      <div className="bg-(--background) text-(--foreground) font-sans">
        <div className="max-w-290 mx-auto px-6 pt-4">
          {/* Header Tab Section */}
          <div className="mb-6 border-b border-slate-300">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-1 text-xs font-semibold font-heading border-b-2 transition-all cursor-pointer ${
                    activeTab === tab
                      ? "border-(--foreground)"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "Category" && <CategoryManager />}
          {activeTab === "Flag Groups" && <FlagGroupManager />}
          {activeTab === "Status Manager" && <StatusManager />}
          {activeTab === "Tags" && <TagsManager />}
        </div>
      </div>
    </>
  );
}
