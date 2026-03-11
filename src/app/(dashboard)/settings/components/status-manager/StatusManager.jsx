"use client";

import React, { useState, useEffect, useMemo } from "react";
import "./StatusStyle.css";
import Modal from "@/components/Modal";
import useStatusManagerStore from "@/stores/settings/useStatusManagerStore";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import useContextStore from "@/stores/useContextStore";
import { MdEditNote } from "react-icons/md";
import DynamicSelect from "@/components/common/DynamicSelect";
import WorkflowDetails from "./components/WorkflowDetails";
import BadgeComp from "./components/BadgeComp";
import AddStatusModal from "../../modals/AddStatusModal";
import CreateTemplateModal from "../../modals/CreateTemplateModal";

const ModalKey = "statusManager";

export default function StatusManager() {
  const {
    templates,
    setIsModal,
    isModal,
    getTemplates,
    totalItems,
    isLoading,
  } = useStatusManagerStore();

  const [limit, setLimit] = useState(10);
  const [includeDelete, setIncludeDeleted] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState({ value: "asc", label: "Ascending" });
  const [templateId, setTemplateId] = useState(null);

  useEffect(() => {
    const str = useContextStore.getState().createParamsStr(
      {
        page: 1,
        limit,
        name: debouncedSearch,
        include_deleted:
          includeDelete?.value === "ALL" ? "" : includeDelete?.value.toString(),
        sortBy: sortBy?.value,
      },
      ModalKey,
    );
    getTemplates(str);
  }, [limit, debouncedSearch, includeDelete, sortBy]);

  useEffect(() => {
    if (templates.length > 0) setTemplateId(templates[0].id);
  }, [templates]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search Status`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-(--background) border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary w-64 transition-all text-(--foreground)"
            />
          </div>
          {/* Include Deleted */}
          <DynamicSelect
            options={[
              { value: "ALL", label: "All" },
              { value: true, label: "Deleted Only" },
              { value: false, label: "Non-deleted Only" },
            ]}
            value={includeDelete || { value: "ALL", label: "All" }}
            onChange={(option) => setIncludeDeleted(option)}
            className="w-fit cursor-pointer"
          />

          {/* Sort by */}
          <DynamicSelect
            options={[
              { value: "asc", label: "Ascending" },
              { value: "desc", label: "Descending" },
            ]}
            value={sortBy || { value: "asc", label: "Ascending" }}
            onChange={(option) => setSortBy(option)}
            className="w-fit cursor-pointer"
          />
        </div>

        <button
          onClick={() => {
            setIsModal("ADD_TEMPLATE");
          }}
          className="flex items-center px-4 py-2 bg-primary opacity-100 hover:opacity-90 text-white rounded-lg font-bold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <HiPlus className="w-4.5 h-4.5 mr-1" />
          Create Workflow
        </button>
      </div>

      {/* Main */}
      <div className="bg-[#ffffff] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] font-sans selection:bg-blue-500/30">
        {/* Decorative Background (Subtle in this theme) */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-200 h-150 bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
          <div className="absolute bottom-0 left-0 w-150 h-125 bg-green-100/40 dark:bg-green-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          {/* Left: Template List */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-[#101826]/40 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-[22px] overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/2">
                <h2 className="font-heading font-bold text-sm text-slate-700 dark:text-slate-200">
                  Templates
                </h2>
                <BadgeComp>{totalItems || "n/a"}</BadgeComp>
              </div>
              <div className="p-3 flex flex-col gap-2 max-h-150 overflow-y-auto">
                {isLoading ? (
                  <LoadingEffectComp num={3} />
                ) : templates?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No workflow templates yet.
                    </p>

                    <button
                      onClick={() => setIsModal("ADD_TEMPLATE")}
                      className="mt-3 text-sm font-medium text-primary hover:underline cursor-pointer"
                    >
                      Create one
                    </button>
                  </div>
                ) : (
                  templates?.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setTemplateId(t.id);
                      }}
                      className={`p-3 rounded-[18px] border cursor-pointer transition-all duration-200 group ${
                        templateId === t.id
                          ? "bg-blue-100 border-blue-200 shadow-sm dark:bg-blue-500/10 dark:border-blue-500/40"
                          : "bg-white  border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-transparent dark:border-transparent dark:hover:bg-white/5 dark:hover:border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm transition-colors ${templateId === t.id ? "text-blue-700 dark:text-blue-100" : "text-slate-700 dark:text-slate-200"}`}
                          >
                            {t.name}
                          </span>
                          {t.is_default && (
                            <BadgeComp
                              variant="solid"
                              className="py-0.5 px-2 text-[10px]"
                            >
                              Default
                            </BadgeComp>
                          )}
                          {!t.is_active && (
                            <BadgeComp
                              variant="off"
                              className="py-0.5 px-2 text-[10px]"
                            >
                              Inactive
                            </BadgeComp>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setIsModal("EDIT_TEMPLATE");
                          }}
                          title="Edit Workflow"
                          className="bg-primary-100 hover:bg-primary hover:text-white p-1 rounded-md cursor-pointer"
                        >
                          <MdEditNote />
                        </button>
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mb-2">
                        Version: {t.version}
                      </div>
                      {t.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {t.description}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
              {totalItems !== 0 && totalItems > limit && (
                <div
                  onClick={() => {
                    if (totalItems > limit) {
                      setLimit((v) => v + 10);
                    }
                  }}
                  className="text-center my-2 text-xs text-gray-600 hover:text-primary hover:font-semibold cursor-pointer"
                >
                  Load more...
                </div>
              )}
            </div>
          </div>

          {/* Right: Detail View */}
          <WorkflowDetails templateId={templateId} />
        </div>

        {/* Modals */}
        <Modal
          open={isModal === "ADD_STATUS" || isModal === "EDIT_STATUS"}
          heading={isModal === "EDIT_STATUS" ? "Edit Status" : "Add Status"}
          onClose={() => {
            setIsModal(false);
          }}
          width="600px"
        >
          <AddStatusModal isEditMode={isModal === "EDIT_STATUS"} />
        </Modal>

        <Modal
          open={isModal === "ADD_TEMPLATE" || isModal === "EDIT_TEMPLATE"}
          heading={
            isModal === "ADD_TEMPLATE" ? "Create Workflow" : "Edit Workflow"
          }
          onClose={() => setIsModal(false)}
          width="600px"
        >
          <CreateTemplateModal isEditMode={isModal === "EDIT_TEMPLATE"} />
        </Modal>
      </div>
    </>
  );
}

export const LoadingEffectComp = ({ num = 6 }) =>
  Array.from({ length: num }).map((_, i) => (
    <div
      key={i}
      className="p-3 rounded-[18px] border border-slate-300 dark:border-white/10 
                 bg-white dark:bg-transparent animate-pulse"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 w-full">
          {/* Title */}
          <div className="h-4 w-32 bg-slate-300 dark:bg-white/10 rounded-md" />

          {/* Badge */}
          <div className="h-4 w-14 bg-slate-300 dark:bg-white/10 rounded-full" />
        </div>

        {/* Edit Icon */}
        <div className="h-6 w-6 bg-slate-300 dark:bg-white/10 rounded-md" />
      </div>

      {/* Version */}
      <div className="h-3 w-24 bg-slate-300 dark:bg-white/10 rounded mb-3" />

      {/* Description lines */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-300 dark:bg-white/10 rounded" />
        <div className="h-3 w-5/6 bg-slate-300 dark:bg-white/10 rounded" />
      </div>
    </div>
  ));
