import React, { useState } from "react";
import {
  FiSlash,
  FiCheck,
  FiTrash2,
  FiArrowRight,
  FiPlus,
  FiCircle,
} from "react-icons/fi";
import BadgeComp from "../components/BadgeComp";
import Btn from "@/components/common/Btn";
import { useTranslation } from "react-i18next";
import { HiPlus } from "react-icons/hi";
import useStatusManagerStore from "@/stores/settings/useStatusManagerStore";

export default function Transitions() {
  const {
    transitionList,
    setIsModal,
    transitionStatusUpdate,
    deleteTransition,
  } = useStatusManagerStore();
  const { t } = useTranslation();

  const toggleTransition = (id, label) => {
    if (label === "delete") {
      deleteTransition(id);
    } else {
      transitionStatusUpdate(id, label);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-heading font-bold text-[#171717] dark:text-white">
            Add Transition
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define allowed movements between statuses.
          </p>
        </div>
        <Btn
          btnName="Add Transition"
          icon={<FiPlus className="w-3.5 h-3.5" />}
          onClickFunc={() => {
            setIsModal("ADD_TRANSITION");
          }}
          className="w-fit!"
        />
      </div>

      <div className="grid gap-3">
        <h4 className="font-bold text-sm text-slate-600 dark:text-slate-300">
          Existing Rules
        </h4>
        {transitionList?.length > 0 ? (
          transitionList?.map((tr) => (
            <div
              key={tr.id}
              className={`p-4 rounded-[18px] bg-white border border-slate-200 dark:bg-[#0f1724]/40 dark:border-white/10 flex items-center justify-between ${!tr.is_active ? "opacity-50 grayscale" : ""}`}
            >
              <div>
                <div className="flex items-center gap-3 font-bold text-sm mb-2 text-slate-800 dark:text-white">
                  <span>{t(tr.from_status_key)}</span>
                  <FiArrowRight className="w-4 h-4 text-slate-400" />
                  <span>{t(tr.to_status_key)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tr.allowedRoles.map((r) => (
                    <BadgeComp key={r} className="bg-slate-50 dark:bg-white/5">
                      {t(r) || r}
                    </BadgeComp>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Btn
                  type="button"
                  btnName={tr.is_active ? "Inactive" : "Active"}
                  onClickFunc={() => toggleTransition(tr.id, !tr.is_active)}
                  icon={
                    tr.is_active ? (
                      <FiSlash className="w-3.5 h-3.5" />
                    ) : (
                      <FiCheck className="w-3.5 h-3.5" />
                    )
                  }
                  className={`w-fit! ${tr.is_active ? "bg-white! hover:bg-gray-300! border! border-gray-300! text-gray-600!" : "bg-primary! border! border-primary-300! text-white!"} h-fit! min-w-15!`}
                />
                {tr.is_active && (
                  <Btn
                    type="button"
                    btnName="Delete"
                    onClickFunc={() => toggleTransition(tr.id, "delete")}
                    icon={<FiTrash2 className="w-3.5 h-3.5" />}
                    className="w-fit! bg-white! hover:bg-red-300! border! border-red-300! text-red-600! h-fit! min-w-15!"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            {/* Icon */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 mb-4">
              <FiCircle className="text-slate-400 dark:text-slate-500 text-xl" />
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              No transitions yet
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Create a transition to start building your workflow.
            </p>

            {/* CTA */}
            <button
              onClick={() => setIsModal("ADD_TRANSITION")}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                   bg-primary text-white text-sm font-medium 
                   hover:bg-primary/90 transition-all duration-200 shadow-sm"
            >
              <HiPlus className="text-base" />
              Add Transition
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
