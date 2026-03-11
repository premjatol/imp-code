"use client";

import Btn from "@/components/common/Btn";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiTrash2 } from "react-icons/fi";

export default function RemoveProject() {
  const [projects, setProjects] = useState([
    "Project Alpha",
    "Project Beta",
    "Project Gamma",
  ]);

  const { t } = useTranslation();

  const removeProject = (indexToRemove) => {
    setProjects((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="px-6 bg-white shadow-md rounded-md text-xs">
      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No projects available.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((project, idx) => (
            <li key={idx} className="flex justify-between items-center py-2">
              <span className="text-gray-900 font-medium">{project}</span>
              <button
                onClick={() => removeProject(idx)}
                aria-label={`Remove ${project}`}
                className="text-red-600 transition-colors cursor-pointer"
              >
                <FiTrash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5">
        <Btn btnName={t("REMOVE_FROM_ALL_DETAILS")} />
      </div>
    </div>
  );
}
