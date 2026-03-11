import React from "react";
import {
  FiFileText,
  FiCalendar,
  FiMail,
  FiLayers,
  FiSettings,
} from "react-icons/fi";

export default function ViewReport({ report }) {
  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <div className="bg-white dark:bg-transparent">
        <div className="flex items-center gap-4 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary/20 text-primary text-xxs font-bold">
            {report.type}
          </span>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <span className="text-xxs text-gray-500 font-medium">
            ID: {report.id?.toString().slice(0, 8) || "N/A"}
          </span>
        </div>
        <h2 className="text-lg font-heading font-bold text-foreground">
          {report.name}
        </h2>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-8 overflow-y-auto">
        <section>
          <h3 className="text-xxs font-bold text-gray-400 mb-4">
            General Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <Detail
              icon={<FiLayers className="text-primary" />}
              label="Report Type"
              value={report.type}
            />
            <Detail
              icon={<FiFileText className="text-secondary" />}
              label="Description"
              value="Project progress overview"
            />
            <Detail
              icon={<FiSettings className="text-tertiary" />}
              label="Sort By"
              value="Category, Assignee, Status"
            />
            <Detail
              icon={<FiCalendar className="text-blue-400" />}
              label="Schedule"
              value="Weekly"
            />
          </div>
        </section>

        <section>
          <h3 className="text-xxs font-bold text-gray-400 mb-4">
            Distribution
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
            <Detail
              icon={<FiMail className="text-primary" />}
              label="Recipients"
              value="example@email.com"
              noBorder
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export function Detail({ label, value, icon, noBorder = false }) {
  return (
    <div
      className={`flex items-center justify-between p-4 bg-white dark:bg-[#0d0d0d] transition-colors ${!noBorder ? "" : ""}`}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-lg opacity-80">{icon}</span>}
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {label}
        </span>
      </div>
      <span className="text-sm font-semibold text-foreground text-right ml-4">
        {value}
      </span>
    </div>
  );
}
