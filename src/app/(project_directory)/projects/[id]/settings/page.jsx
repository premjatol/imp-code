"use client";

import { useState } from "react";
import AnnotationPermissions from "./components/AnnotationPermissions";
import StatusWorkflow from "./components/StatusWorkflow";

export default function ProjectSettings() {
  const [activeTab, setActiveTab] = useState("status");

  const tabs = [
    { key: "status", label: "Status Workflow" },
    { key: "annotation", label: "Annotation Permissions" },
  ];

  return (
    <div className="bg-(--background) text-(--foreground) font-sans overflow-y-auto h-[calc(100vh-64px)]">
      <div className="mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-bold font-heading">
            Project Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage project-specific configurations and status workflows.
          </p>
        </div>

        {/* Header Tab Section */}
        <div className="mb-6 border-b border-slate-300">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 px-1 text-xs font-semibold font-heading border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? "border-(--foreground)"
                    : "border-transparent text-slate-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "status" && <StatusWorkflow />}
          {activeTab === "annotation" && <AnnotationPermissions />}
        </div>
      </div>
    </div>
  );
}
