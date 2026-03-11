"use client";

import React from "react";
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiFileText } from "react-icons/fi";
import { MdPictureAsPdf } from "react-icons/md";
import useReportsStore from "@/stores/reports/useReportsStore";
import ReportEditor from "./ReportEditor";
import ViewReport from "./ViewReport";
import Modal from "@/components/Modal";

export default function ReportList() {
  const {
    reports,
    selectedReport,
    showEditor,
    setSelectedReport,
    setShowEditor,
    handleDelete,
  } = useReportsStore();

  return (
    <>
      <div className="flex gap-5 h-full w-full bg-background text-foreground transition-colors duration-200">
        {/* Sidebar */}
        <div className="w-80 bg-background border-r border-gray-200 dark:border-gray-800 flex flex-col">
          {/* Search */}
          <div className="p-4 pt-0">
            <div className="flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus-within:ring focus-within:ring-primary transition-all">
              <FiSearch className="text-gray-400" />
              <input
                className="ml-2 w-full bg-transparent outline-none text-xs placeholder:text-gray-500"
                placeholder="Search reports..."
              />
            </div>
          </div>

          {/* Report List */}
          <div className="flex-1 overflow-y-auto px-3 space-y-1">
            {reports.map((report) => {
              const isSelected = selectedReport?.id === report.id;
              return (
                <div
                  key={report.id}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary-100 dark:bg-primary/20 text-primary"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${isSelected ? "bg-white dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-900"}`}
                    >
                      <MdPictureAsPdf
                        className={
                          isSelected ? "text-primary" : "text-gray-400"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-none">
                        {report.name}
                      </p>
                      <p className="text-xxs opacity-70 mt-1 font-medium tracking-wider">
                        {report.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report);
                        setShowEditor(true);
                      }}
                      className="p-1.5 hover:text-secondary transition-colors cursor-pointer"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(report.id);
                      }}
                      className="p-1.5 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Button */}
          <div className="p-4 mt-auto">
            <button
              onClick={() => {
                setSelectedReport(null);
                setShowEditor(true);
              }}
              className="w-full text-sm bg-primary hover:opacity-90 text-white py-1.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              <FiPlus strokeWidth={3} />
              New Report
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grow flex items-center justify-center bg-gray-50/50 dark:bg-background">
          {/* <main className="flex-1 p-8 flex items-center justify-center"> */}
          {!selectedReport && !showEditor && (
            <div className="flex flex-col items-center text-center max-w-sm">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <FiFileText className="text-gray-300" size={32} />
              </div>
              <h3 className="text-sm font-semibold">No Report Selected</h3>
              <p className="text-xs text-gray-500 mt-2">
                Select a report from the sidebar to view details or create a new
                one to get started.
              </p>
            </div>
          )}

          {selectedReport && !showEditor && (
            <div className="w-full h-full bg-background dark:border-gray-800 overflow-hidden">
              <ViewReport report={selectedReport} />
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal Overlay */}
      <Modal
        open={showEditor}
        onClose={() => setShowEditor(false)}
        heading="Report Editor"
        width="800px"
      >
        <ReportEditor
          report={selectedReport}
          onClose={() => setShowEditor(false)}
        />
      </Modal>
    </>
  );
}
