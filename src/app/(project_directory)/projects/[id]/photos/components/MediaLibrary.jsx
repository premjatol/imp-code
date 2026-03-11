import Modal from "@/components/Modal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { downloadFile, formatBytes } from "@/lib/utils";
import useFilesStore from "@/stores/files/useFilesStore";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { FaDownload, FaPlay, FaTrash } from "react-icons/fa";
import MediaModal from "../modals/MediaModal";
import Pagination from "@/components/common/pagination/Pagination";

const MediaLibrary = () => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allItems, setAllItems] = useState([]);

  const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

  const {
    loading,
    files,
    deleteFiles,
    setFileId,
    isModal,
    setIsModal,
    isApiLoading,
    page,
    limit,
    setPage,
    setLimit,
    totalItems,
  } = useFilesStore();

  const openModal = (item, groupItems) => {
    setCurrentItem(item);
    setAllItems(groupItems);
    const index = groupItems.findIndex((i) => i.id === item.id);
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentItem(null);
  };

  const navigateModal = (direction) => {
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % allItems.length
        : (currentIndex - 1 + allItems.length) % allItems.length;

    setCurrentIndex(newIndex);
    setCurrentItem(allItems[newIndex]);
  };

  const groupedFiles = useMemo(() => {
    if (!files || files.length === 0) return [];

    const groups = {};

    files.forEach((file) => {
      const date = DateTime.fromMillis(file.created_at).toFormat(
        "EEEE, LLLL dd, yyyy",
      );

      if (!groups[date]) {
        groups[date] = {
          id: date,
          date,
          items: [],
        };
      }

      groups[date].items.push({
        id: file.id,
        type: file.file_type.startsWith("video") ? "video" : "image",
        src: `${BASE_URL}${file.file_url}`,
        uploadedBy: `${file?.uploaded_by?.first_name} ${file?.uploaded_by?.last_name}`,
        uploadedDate: DateTime.fromMillis(file.created_at).toFormat(
          "MM/dd/yy - hh:mm a",
        ),
        capturedDate: DateTime.fromMillis(file.created_at).toFormat(
          "MM/dd/yy - hh:mm a",
        ),
        fileSize: formatBytes(file.file_size),
        fileName: file.file_name,
        gpsCoordinates: null,
        links: [],
        tags: [],
        original: file,
      });
    });

    return Object.values(groups);
  }, [files]);

  if (loading) {
    return (
      <div className="bg-white select-none font-sans text-xs p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <MediaSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white select-none font-sans text-xs">
      {groupedFiles.map((file) => {
        const fileIsSelected = file.items.every((item) =>
          selectedIds.has(item.id),
        );

        return (
          <section key={file.id} className="mb-10">
            {/* Group Header */}
            <div className="flex items-center gap-3 mb-4 w-fit">
              {/* <input
                type="checkbox"
                checked={fileIsSelected}
                onChange={() => toggleGroup(file.items)}
                className="w-3 h-3 rounded border-gray-300 accent-blue-600 cursor-pointer"
              /> */}
              <h2 className="font-semibold text-gray-700">{file.date}</h2>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              {file.items.map((item) => {
                const isSelected = selectedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`relative aspect-square overflow-hidden bg-gray-200 group transition-all duration-200 border border-gray-400 shadow-lg ${isSelected ? "ring-4 ring-blue-500 ring-inset" : ""}`}
                  >
                    {/* Media Content - Clickable to open modal */}
                    <div
                      className="w-full h-full cursor-pointer"
                      onClick={(e) => {
                        // Prevent opening modal if clicking on checkbox
                        if (
                          !e.target.closest('input[type="checkbox"]') &&
                          !e.target.closest(".download-btn")
                        ) {
                          openModal(item, file.items);
                        }
                      }}
                    >
                      {item.type === "video" ? (
                        <>
                          <video className="object-cover w-full h-full pointer-events-none">
                            <source src={item.src} type="video/mp4" />
                          </video>
                          {/* Center Play Button with Animation */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all duration-300">
                            <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <FaPlay className="w-6 h-6 text-gray-800 ml-1" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.src}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>

                    {/* Download Button */}
                    <div className="absolute top-2 right-2 download-btn">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            setFileId(item.id);
                            setIsModal("DELETE_FILE");
                          }}
                          className="bg-gray-800/70 hover:bg-red-600/90 text-white p-2 rounded shadow-lg transition-all duration-200 backdrop-blur-sm inline-flex cursor-pointer"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => downloadFile(item.original)}
                          className="bg-gray-800/70 hover:bg-gray-800/90 text-white p-2 rounded shadow-lg transition-all duration-200 backdrop-blur-sm inline-flex cursor-pointer"
                        >
                          <FaDownload className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Badge (bottom right) */}
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                      {item.capturedDate}
                    </div>

                    {/* Checkbox Overlay */}
                    {/* <div
                      className={`absolute top-0 left-0 w-full h-full transition-opacity duration-200 pointer-events-none
                        ${isSelected ? "bg-black/10" : "bg-transparent group-hover:bg-black/5"}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItem(item.id)}
                        className="absolute top-3 left-3 w-3 h-3 accent-blue-600 cursor-pointer shadow-md pointer-events-auto"
                      />
                    </div> */}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Pagination */}
      <Pagination
        totalItems={totalItems}
        itemsPerPage={limit}
        currentPage={page}
        onPageChange={(page) => setPage(page)}
        onItemsPerPageChange={(limit) => setLimit(limit)}
      />

      {/* Modal Component */}
      {modalOpen && currentItem && (
        <MediaModal
          item={currentItem}
          onClose={closeModal}
          onNavigate={navigateModal}
          currentIndex={currentIndex}
          totalItems={allItems.length}
        />
      )}

      <Modal
        open={isModal === "DELETE_FILE"}
        heading="Delete File"
        onClose={() => setIsModal(false)}
        width="450px"
      >
        <ConfirmationModal
          title="Delete File"
          message="Are you sure you want to delete this file?"
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={async () => {
            await deleteFiles();
            setIsModal(false);
          }}
          isLoading={isApiLoading}
        />
      </Modal>
    </div>
  );
};

const MediaSkeleton = () => {
  return (
    <div className="mb-10">
      {/* Header Skeleton */}
      <div className="h-4 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 animate-pulse rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default MediaLibrary;
