import React, { useEffect, useState } from "react";
import Statuses from "../panelContent/Statuses";
import Transitions from "../panelContent/Transitions";
import useStatusManagerStore from "@/stores/settings/useStatusManagerStore";
import Modal from "@/components/Modal";
import AddTransition from "../../../modals/AddTransition";

export default function WorkflowDetails({ templateId }) {
  const [activeTab, setActiveTab] = useState("statuses");

  const {
    fecthWorkflowTemplateDetails,
    isTemplateLoading,
    selectedTemplate,
    isModal,
    setIsModal,
  } = useStatusManagerStore();

  useEffect(() => {
    if (templateId) {
      fecthWorkflowTemplateDetails(templateId);
    }
  }, [templateId]);

  return (
    <>
      {isTemplateLoading ? (
        <TemplateDetailsSkeleton />
      ) : (
        <div className="bg-white dark:bg-[#101826]/40 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-[22px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 pt-0">
            <div className="flex flex-col  dark:border-white/5 bg-slate-50/50 dark:bg-white/2 mt-4">
              <h2 className="font-heading font-bold text-sm text-slate-700 dark:text-slate-200">
                Template Details
              </h2>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Last updated:{" "}
                {new Date(selectedTemplate?.updated_at).toLocaleString()}
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-white/5 mb-6" />

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {["statuses", "transitions"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`h-9 px-4 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-blue-600 border-blue-600 text-white shadow-md dark:bg-blue-500 dark:border-blue-500"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() +
                    tab
                      .slice(1)
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div className="animate-in fade-in duration-300">
              {activeTab === "statuses" && <Statuses />}

              {activeTab === "transitions" && <Transitions />}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal
        open={isModal === "ADD_TRANSITION"}
        onClose={() => setIsModal(false)}
        width="500px"
      >
        <AddTransition />
      </Modal>
    </>
  );
}

export const TemplateDetailsSkeleton = () => {
  return (
    <div className="animate-pulse p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-5 w-40 bg-slate-300 dark:bg-white/10 rounded-md" />
        <div className="h-3 w-64 bg-slate-300 dark:bg-white/10 rounded-md" />
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <div className="h-9 w-24 bg-slate-300 dark:bg-white/10 rounded-full" />
        <div className="h-9 w-28 bg-slate-300 dark:bg-white/10 rounded-full" />
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-300 dark:bg-white/10 rounded" />
          <div className="h-3 w-72 bg-slate-300 dark:bg-white/10 rounded" />
        </div>
        <div className="h-9 w-32 bg-slate-300 dark:bg-white/10 rounded-lg" />
      </div>

      {/* Status Cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-slate-300 dark:border-white/10 rounded-2xl p-4 space-y-4"
          >
            {/* Title Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-white/10" />
                <div className="h-4 w-28 bg-slate-300 dark:bg-white/10 rounded" />
                <div className="h-5 w-14 bg-slate-300 dark:bg-white/10 rounded-full" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-slate-300 dark:bg-white/10 rounded-md" />
                <div className="h-8 w-20 bg-slate-300 dark:bg-white/10 rounded-md" />
              </div>
            </div>

            {/* Visibility */}
            <div className="h-3 w-72 bg-slate-300 dark:bg-white/10 rounded" />

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-36 bg-slate-300 dark:bg-white/10 rounded-full" />
              <div className="h-6 w-40 bg-slate-300 dark:bg-white/10 rounded-full" />
              <div className="h-6 w-28 bg-slate-300 dark:bg-white/10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
