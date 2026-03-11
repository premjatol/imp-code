import Btn from "@/components/common/Btn";
import React from "react";
import BadgeComp from "../components/BadgeComp";
import { FiPlus, FiEdit2, FiSlash } from "react-icons/fi";
import useStatusManagerStore from "@/stores/settings/useStatusManagerStore";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { FiCircle } from "react-icons/fi";
import { HiPlus } from "react-icons/hi";

export default function Statuses() {
  const { setIsModal, statusList, deleteStatus, setSelectedStatus } =
    useStatusManagerStore();

  const { t } = useTranslation();

  const deleteStatusFunc = async (id) => {
    deleteStatus(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-heading font-bold text-[#171717] dark:text-white">
            Statuses
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure labels, levels, requirements, and role visibility.
          </p>
        </div>
        <Btn
          btnName="Add Status"
          icon={<FiPlus className="w-3.5 h-3.5" />}
          onClickFunc={() => {
            setIsModal("ADD_STATUS");
          }}
          className="w-fit!"
        />
      </div>

      <div className="grid gap-3">
        {statusList?.length > 0 ? (
          statusList?.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-[18px] bg-slate-50 border border-slate-200 dark:bg-[#0f1724]/40 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex gap-4">
                <div
                  className="mt-1.5 w-3 h-3 rounded-full shadow-sm ring-1 ring-black/5 flex-none"
                  style={{ background: s.color }}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {s.label}
                    </span>
                    <BadgeComp className="text-[10px] px-1.5 h-5 bg-white dark:bg-white/10">
                      Lvl {s.level}
                    </BadgeComp>
                    <BadgeComp
                      variant="outline"
                      className="text-[10px] px-1.5 h-5 font-mono"
                    >
                      {t(s.key)}
                    </BadgeComp>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    Vis: {s.roleVisibility.map((r) => t(r)).join(", ")}
                  </div>
                  {(s.requirements.length > 0 || s.flagGroupKey) && (
                    <div className="flex flex-wrap gap-1.5">
                      {s.requirements.map((r) => (
                        <BadgeComp
                          key={r}
                          variant="default"
                          className="text-[9px]"
                        >
                          {t(r)}
                        </BadgeComp>
                      ))}
                      {s.requirements.includes("FLAGS_REQUIRED") &&
                        s.flagGroupKey && (
                          <BadgeComp
                            variant="outline"
                            className="text-[9px] border-dashed text-slate-500 dark:text-slate-400"
                          >
                            key: {s.flagGroupKey}
                          </BadgeComp>
                        )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 self-start md:self-center">
                <Btn
                  btnName="Edit"
                  type="button"
                  icon={<FiEdit2 className="w-3.5 h-3.5" />}
                  onClickFunc={() => {
                    setIsModal("EDIT_STATUS");
                    setSelectedStatus(s);
                  }}
                  className="w-fit! min-w-15! bg-white! text-gray-700! hover:bg-gray-300! border! border-gray-300! h-8!"
                />
                <Btn
                  btnName="Disable"
                  type="button"
                  icon={<FiSlash className="w-3.5 h-3.5" />}
                  onClickFunc={() => deleteStatusFunc(s.id)}
                  className="w-fit! min-w-15! bg-white! hover:bg-red-300! text-red-700! border! border-red-300! h-8!"
                />
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
              No statuses yet
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Create a status to start building your workflow.
            </p>

            {/* CTA */}
            <button
              onClick={() => setIsModal("ADD_STATUS")}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm"
            >
              <HiPlus className="text-base" />
              Add Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
