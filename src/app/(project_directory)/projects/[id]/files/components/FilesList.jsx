"use client";

import React, { useState, useRef } from "react";
import { MdOutlineNoteAdd, MdMoreVert } from "react-icons/md";
import {
  FaFolder,
  FaFileExcel,
  FaChevronDown,
  FaFileImage,
  FaFileVideo,
  FaFilePdf,
  FaFileWord,
} from "react-icons/fa";
import ClickPopup from "@/components/common/ClickPopup";
import useFilesStore from "@/stores/files/useFilesStore";
import { DateTime } from "luxon";
import Modal from "@/components/Modal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import Pagination from "@/components/common/pagination/Pagination";
import NoDataAvailable from "@/components/common/NoDataAvailable";
import { downloadFile } from "@/lib/utils";

export default function FilesList() {
  const {
    files,
    isModal,
    setIsModal,
    setFileId,
    isApiLoading,
    loading,
    deleteFiles,
    page,
    limit,
    setPage,
    setLimit,
    totalItems,
  } = useFilesStore();
  const [openMenuId, setOpenMenuId] = useState(null);
  const activeButtonRef = useRef(null);

  const toggleDropdown = (userId, buttonEl) => {
    activeButtonRef.current = buttonEl;
    setOpenMenuId((prev) => (prev === userId ? null : userId));
  };

  const renderIcon = (type) => {
    if (!type) {
      return <MdOutlineNoteAdd className="text-gray-400 text-xl" />;
    }

    if (type === "folder") {
      return <FaFolder className="text-gray-700 text-xl" />;
    }

    // Images
    if (type.includes("image")) {
      return <FaFileImage className="text-blue-500 text-xl" />;
    }

    // Videos
    if (type.includes("video")) {
      return <FaFileVideo className="text-purple-500 text-xl" />;
    }

    // PDF
    if (type.includes("pdf")) {
      return <FaFilePdf className="text-red-600 text-xl" />;
    }

    // Excel
    if (type.includes("spreadsheet") || type.includes("excel")) {
      return <FaFileExcel className="text-green-600 text-xl" />;
    }

    // Word
    if (
      type.includes("word") ||
      type.includes("wordprocessingml") ||
      type.includes("msword")
    ) {
      return <FaFileWord className="text-blue-700 text-xl" />;
    }

    return <MdOutlineNoteAdd className="text-gray-400 text-xl" />;
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  const deleteFileFunc = () => {
    deleteFiles();
  };

  return (
    <div className="w-full bg-white">
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-700 font-semibold">
              <th className="p-3 w-14">Type</th>
              <th className="p-3">
                <div className="flex items-center gap-2">
                  Name <FaChevronDown size={10} className="text-gray-400" />
                </div>
              </th>
              <th className="p-3">File Size</th>
              <th className="p-3">Last updated</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr className="w-full">
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-10 w-full">
                    Loading...
                  </div>
                </td>
              </tr>
            ) : files.length === 0 ? (
              <NoDataAvailable colSpan={5} />
            ) : (
              files?.map((file) => (
                <tr
                  key={file.id}
                  className="border-b border-gray-100 hover:bg-gray-50 group"
                >
                  <td className="p-3">
                    <div className="flex justify-center">
                      {renderIcon(file.file_type)}
                    </div>
                  </td>

                  <td className="p-3">
                    <a
                      href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${file.file_url}`}
                      target="_blank"
                    >
                      {file.file_name || "Not available"}
                    </a>
                  </td>

                  <td className="p-3 text-gray-600">
                    {formatBytes(file.file_size)}
                  </td>
                  <td className="p-3 text-gray-600">
                    {DateTime.fromMillis(file.created_at).toFormat(
                      "dd/MM/yyyy",
                    )}
                  </td>

                  <td className="p-3 text-center text-gray-400 relative">
                    <span
                      onClick={(e) => toggleDropdown(file.id, e.currentTarget)}
                      className="cursor-pointer"
                    >
                      <MdMoreVert size={20} />
                    </span>

                    {openMenuId === file.id && (
                      <ClickPopup
                        optionsList={[
                          // { name: "Edit name" },
                          // { name: "Change access" },
                          // { name: "Move" },
                          {
                            name: "Download file",
                            lineBreak: true,
                            onClick: () => {
                              downloadFile(file);
                            },
                          },
                          {
                            name: "Delete",
                            css: "text-red-600 hover:bg-red-200",
                            onClick: () => {
                              setIsModal("DELETE_FILE");
                              setFileId(file.id);
                            },
                          },
                        ]}
                        startFrom="right"
                        onClose={() => setOpenMenuId(null)}
                        buttonRef={activeButtonRef}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <Pagination
        totalItems={totalItems}
        itemsPerPage={limit}
        currentPage={page}
        onPageChange={(page) => setPage(page)}
        onItemsPerPageChange={(limit) => setLimit(limit)}
      />

      {/* modal */}
      <Modal
        open={isModal === "DELETE_FILE"}
        heading={"Delete file"}
        onClose={() => setIsModal(false)}
      >
        <ConfirmationModal
          onConfirm={() => deleteFileFunc()}
          message="Are you sure want to delete this file?"
          confirmText="Delete"
          variant="danger"
          isLoading={isApiLoading}
        />
      </Modal>
    </div>
  );
}
