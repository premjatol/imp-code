"use client";

import ClickPopup from "@/components/common/ClickPopup";
import { usePlansStore } from "@/stores/plans/usePlansStore";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPencilAlt, FaPlus, FaTrashAlt, FaUpload } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
// import PdfPreview from "./PdfPreview";
import Modal from "@/components/Modal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import PlanUploadModal from "../modals/PlanUploadModal";
import { redirect } from "next/navigation";
import { useAnnotationStore } from "@/stores/plans/useAnnotationStore";
import dynamic from "next/dynamic";

const PdfPreview = dynamic(() => import("./PdfPreview"), {
  ssr: false,
});

export default function PlanListView({ folder, plans }) {
  const {
    isModal,
    setIsModal,
    setSelectedFolder,
    viewType,
    projectId,
    setSelectedPlan,
    isApiLoading,
    deletePlan,
    selectedPlan,
  } = usePlansStore();

  const { setPlanDetails } = useAnnotationStore();

  const [activePlanId, setActivePlanId] = useState(null);

  const activeButtonRef = useRef();

  //   show action popup
  const toggleDropdown = (planId, buttonEl) => {
    activeButtonRef.current = buttonEl;
    setActivePlanId((prev) => (prev === planId ? null : planId));
  };

  const deletePlanFunc = async () => {
    await deletePlan(selectedPlan?.id);
  };

  const goOnPlan = (data) => {
    // setPlanDetails(data);
    redirect(`/projects/${projectId}/plans/${data.id}`);
  };

  return (
    <>
      <div
        className={`px-4 ${
          viewType === "grid"
            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
            : "flex flex-col"
        }`}
      >
        {plans?.length > 0 ? (
          <>
            {plans?.map((plan) =>
              viewType === "grid" ? (
                <div
                  key={plan.id}
                  className="relative group border border-gray-200 dark:border-gray-700 rounded hover:shadow-md transition-shadow"
                >
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      className="w-3 h-3 cursor-pointer accent-blue-600"
                      // checked={selected.includes(plan.id)}
                      // onChange={() => toggleSelectOne(plan.id)}
                    />
                  </div>
                  <div
                    onClick={() => goOnPlan(plan)}
                    className="cursor-pointer"
                  >
                    <div className="aspect-4/3 bg-gray-100 dark:bg-gray-800 overflow-hidden ">
                      <PdfPreview
                        fileUrl={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${plan.file_path}`}
                      />
                    </div>
                  </div>

                  <div className="p-2 flex justify-between bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                    <Link
                      href={`/projects/${projectId}/plans/${plan.id}`}
                      className="truncate block cursor-pointer group-hover:text-primary text-xs text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {plan?.name}
                    </Link>

                    {/* actions */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) =>
                          toggleDropdown(plan.id, e.currentTarget)
                        }
                        className="ml-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {activePlanId === plan.id && (
                        <ClickPopup
                          optionsList={[
                            {
                              name: "Edit Plan",
                              lineBreak: true,
                              icon: (
                                <MdEdit size={14} className="text-gray-500" />
                              ),
                              onClick: () => {
                                setSelectedFolder(folder);
                                setSelectedPlan(plan);
                                setIsModal("EDIT_PLAN");
                              },
                            },
                            {
                              name: "Delete Plan",
                              icon: <MdDelete size={14} />,
                              onClick: () => {
                                setSelectedFolder(folder);
                                setSelectedPlan(plan);
                                setIsModal("DELETE_PLAN");
                              },
                              css: "hover:bg-red-100! text-red-600",
                            },
                          ]}
                          startFrom="left"
                          onClose={() => setActivePlanId(null)}
                          buttonRef={activeButtonRef}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={plan.id}
                  className="flex items-center py-2 px-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 group"
                >
                  <input
                    type="checkbox"
                    // checked={plan.selected || false}
                    //   onChange={() => togglePlanSelection(folder.id, plan.id)}
                    className="mr-4 w-3 h-3 cursor-pointer"
                  />
                  <div className="flex-1 grid grid-cols-4 items-center">
                    <Link
                      href={`/projects/${projectId}/plans/${plan.id}`}
                      className="text-gray-700 hover:text-primary cursor-pointer dark:text-gray-300 truncate pr-4"
                    >
                      {plan?.name}
                    </Link>
                    <span className="text-gray-500">{plan.tasks}</span>
                    <span className="text-gray-500">{plan.date}</span>
                    <span className="text-gray-400 italic truncate text-[10px]">
                      {plan.tags}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span
                      onClick={() => {
                        setSelectedFolder(folder);
                        setSelectedPlan(plan);
                        setIsModal("EDIT_PLAN");
                      }}
                      className="p-1 hover:bg-green-200 rounded-md hover:text-secondary cursor-pointer"
                    >
                      <FaPencilAlt title="Edit" />
                    </span>
                    <span
                      onClick={() => {
                        setSelectedFolder(folder);
                        setSelectedPlan(plan);
                        setIsModal("DELETE_PLAN");
                      }}
                      className="p-1 hover:bg-red-200 rounded-md hover:text-red-500 cursor-pointer"
                    >
                      <FaTrashAlt title="Delete" />
                    </span>
                  </div>
                </div>
              ),
            )}

            <NewPlanCreateButton
              viewType={viewType}
              setSelectedFolder={setSelectedFolder}
              setIsModal={setIsModal}
              folder={folder}
            />
          </>
        ) : (
          <NewPlanCreateButton
            viewType={viewType}
            setSelectedFolder={setSelectedFolder}
            setIsModal={setIsModal}
            folder={folder}
            isNoPlan={true}
          />
        )}
      </div>

      {/* modal */}
      <Modal
        open={isModal === "EDIT_PLAN"}
        heading={"Edit plan details"}
        onClose={() => {
          setIsModal(false);
          setSelectedPlan(null);
          setSelectedFolder(null);
        }}
        width="500px"
      >
        <PlanUploadModal isEditMode={true} />
      </Modal>

      <Modal
        open={isModal === "DELETE_PLAN"}
        heading="Delete Plan"
        onClose={() => {
          setIsModal(false);
          setSelectedPlan(null);
          setSelectedFolder(null);
        }}
        width="450px"
      >
        <ConfirmationModal
          title="Delete Plan"
          message="Are you sure you want to delete this plan?"
          confirmText="Delete"
          cancelText="Cancel"
          variant={"danger"}
          onConfirm={deletePlanFunc}
          isLoading={isApiLoading}
        />
      </Modal>
    </>
  );
}

const NewPlanCreateButton = ({
  viewType,
  setSelectedFolder,
  setIsModal,
  folder,
  isNoPlan,
}) => {
  return viewType === "grid" ? (
    <div
      onClick={() => {
        setSelectedFolder(folder);
        setIsModal("UPDATE_PLAN_BY_ID");
      }}
      className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded aspect-4/3 flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary cursor-pointer transition-colors"
    >
      <FaPlus className="mb-2" />
      <span className="text-xs font-medium">Add plan</span>
    </div>
  ) : (
    <div className="flex justify-between items-center">
      {isNoPlan && <p className="text-red-400">Please add a plan</p>}
      <button
        className="py-1 px-2 rounded-md border border-gray-400 cursor-pointer w-fit text-gray-700 mt-2 ml-4"
        onClick={() => {
          setSelectedFolder(folder);
          setIsModal("UPDATE_PLAN_BY_ID");
        }}
      >
        Add Plan
      </button>
    </div>
  );
};
