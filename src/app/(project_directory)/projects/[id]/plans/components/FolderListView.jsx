"use client";

import Modal from "@/components/Modal";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import PlanUploadModal from "../modals/PlanUploadModal";
import { usePlansStore } from "@/stores/plans/usePlansStore";
import ClickPopup from "@/components/common/ClickPopup";
import NewFolderModal from "../modals/NewFolderModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import PlanListView from "./PlanListView";

const MODULEKEY = "planFolderStore";

const FolderListView = () => {
  const [activeFolderId, setActiveFolderId] = useState(null);

  const {
    isModal,
    viewType,
    folders,
    setIsModal,
    setSelectedFolder,
    selectedFolder,
    deleteFolderById,
    isApiLoading,
    planLoading,
  } = usePlansStore();

  const activeButtonRef = useRef();

  const { t } = useTranslation();
  const { id } = useParams();

  // Show folder popup
  const toggleDropdown = (folderId, buttonEl) => {
    activeButtonRef.current = buttonEl;
    setActiveFolderId((prev) => (prev === folderId ? null : folderId));
  };

  // delete folder
  const deleteFolderFunc = async () => {
    if (!selectedFolder) return;
    await deleteFolderById(selectedFolder?.id);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 min-h-screen font-sans text-xs">
      {planLoading ? (
        <div>Loading folders</div>
      ) : folders?.length > 0 ? (
        folders?.map((folder) => (
          <div key={folder.id} className="mb-1">
            {/* Folder Header */}
            <div className="flex items-center gap-1 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-transparent group">
              <input
                type="checkbox"
                className="accent-blue-600"
                // checked={allSelected}
                // onChange={(e) => toggleSelectAll(e.target.checked)}
              />

              {/* Collaps/Expend */}
              <div className="flex items-center cursor-pointer">
                <FaFolder className="text-gray-600 dark:text-gray-400 mr-2" />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {folder.name} ({folder?.plans_count || 0} plans)
                </span>
                {/* <div className="ml-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                  {toggleFolderId === folder.id ? (
                    <FaCaretDown />
                  ) : (
                    <FaCaretRight />
                  )}
                </div> */}
              </div>

              {/* Actions */}
              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(folder.id, e.currentTarget)}
                  className="ml-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <BsThreeDotsVertical />
                </button>

                {activeFolderId === folder.id && (
                  <ClickPopup
                    optionsList={[
                      {
                        name: "Edit folder",
                        lineBreak: true,
                        icon: <MdEdit size={14} className="text-gray-500" />,
                        onClick: () => {
                          setSelectedFolder(folder);
                          setIsModal("EDIT_FOLDER");
                        },
                      },
                      {
                        name: "Delete Folder",
                        icon: <MdDelete size={14} />,
                        onClick: () => {
                          setSelectedFolder(folder);
                          setIsModal("DELETE_FOLDER");
                        },
                        closeOnClick: false,
                        css: "hover:bg-red-100! text-red-600",
                      },
                    ]}
                    startFrom="left"
                    onClose={() => setActiveFolderId(null)}
                    buttonRef={activeButtonRef}
                  />
                )}
              </div>

              {viewType === "list" && folder.isOpen && (
                <div className="flex-1 grid grid-cols-4 ml-20 text-gray-400 text-xs font-normal">
                  <span>Tasks</span>
                  <span>Current version</span>
                  <span>Tags</span>
                  <span className="text-right"></span>
                </div>
              )}
            </div>

            {/* plan list */}
            <PlanListView folder={folder} plans={folder?.plans || []} />
          </div>
        ))
      ) : (
        <div>Please create a folder</div>
      )}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-gray-500 text-xs mt-4">
        {folders.reduce((acc, f) => acc + (f.plans?.length || 0), 0)} plans
      </div>

      <Modal
        open={isModal === "UPDATE_PLAN_BY_ID" || isModal === "CREATE_NEW_PLAN"}
        heading={"Add New Plans"}
        onClose={() => {
          setIsModal(false);
          setSelectedFolder(null);
        }}
        width={"600px"}
      >
        <PlanUploadModal createPlanById={isModal === "UPDATE_PLAN_BY_ID"} />
      </Modal>

      <Modal
        open={isModal === "ADD_NEW_FOLDER" || isModal === "EDIT_FOLDER"}
        heading={
          isModal === "EDIT_FOLDER"
            ? "Edit folder details"
            : "Create new folder"
        }
        onClose={() => {
          setIsModal(false);
          setSelectedFolder(null);
        }}
        width="350px"
      >
        <NewFolderModal isEditMode={isModal === "EDIT_FOLDER"} />
      </Modal>

      <Modal
        open={isModal === "DELETE_FOLDER"}
        heading="Update Status"
        onClose={() => setIsModal(false)}
        width="450px"
      >
        <ConfirmationModal
          title="Delete Folder"
          message="Are you sure you want to delete folder and it's plan?"
          confirmText="Delete"
          cancelText="Cancel"
          variant={"danger"}
          onConfirm={deleteFolderFunc}
          isLoading={isApiLoading}
        />
      </Modal>
    </div>
  );
};

export default FolderListView;
