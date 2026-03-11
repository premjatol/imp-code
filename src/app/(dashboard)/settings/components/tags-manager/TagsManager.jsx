import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaTag,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import AddTagModal from "../../modals/AddTagModal";
import Pagination from "@/components/common/pagination/Pagination";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import useContextStore from "@/stores/useContextStore";
import useTagsManagerStore from "@/stores/settings/useTagsManagerStore";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import DynamicSelect from "@/components/common/DynamicSelect";

const TagsManager = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const [includeDelete, setIncludeDeleted] = useState();
  const [isDeleted, setIsDeleted] = useState();

  const MODULEKEY = "tags";

  const {
    tags,
    isModal,
    setIsModal,
    getTags,
    tagLoading,
    totalItems,
    selectedTag,
    setSelectedTag,
    deleteTag,
    tagsApiLoading,
  } = useTagsManagerStore();

  // Delete tag
  const deleteTagFunc = async () => {
    try {
      await deleteTag({ id: selectedTag?.id });
    } catch (error) {
      console.error("Failed to delete tag:", error.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const str = useContextStore.getState().createParamsStr(
      {
        page,
        limit,
        name: debouncedSearch,
        include_inactive:
          selectedStatus?.value === "ALL"
            ? ""
            : selectedStatus?.value.toString(),
        include_deleted:
          includeDelete?.value === "ALL" ? "" : includeDelete?.value.toString(),
        is_deleted:
          isDeleted?.value === "ALL" ? "" : isDeleted?.value.toString(),
      },
      MODULEKEY,
    );
    getTags(str);
  }, [page, limit, debouncedSearch, isDeleted, selectedStatus, includeDelete]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex gap-2">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search category`}
              value={searchTerm}
              onChange={(e) => {
                setPage(1);
                setSearchTerm(e.target.value);
              }}
              className="pl-10 pr-4 py-2 bg-(--background) border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary w-64 transition-all text-(--foreground)"
            />
          </div>
          {/* IsActive */}
          <DynamicSelect
            options={[
              { value: "ALL", label: "All" },
              { value: true, label: "Select Active Only" },
              { value: false, label: "Select Inactive Only" },
            ]}
            value={selectedStatus || { value: "ALL", label: "All" }}
            onChange={(option) => setSelectedStatus(option)}
            className="w-35 cursor-pointer"
          />

          {/* Include Deleted */}
          <DynamicSelect
            options={[
              { value: "ALL", label: "All" },
              { value: true, label: "Deleted Only" },
              { value: false, label: "Non-deleted Only" },
            ]}
            value={includeDelete || { value: "ALL", label: "All" }}
            onChange={(option) => setIncludeDeleted(option)}
            className="w-35 cursor-pointer"
          />

          {/* IsDeleted */}
          <DynamicSelect
            options={[
              { value: "ALL", label: "All" },
              { value: true, label: "Only Deleted" },
              { value: false, label: "Only Active" },
            ]}
            value={isDeleted || { value: "ALL", label: "All" }}
            onChange={(option) => setIsDeleted(option)}
            className="w-35 cursor-pointer"
          />
        </div>

        <button
          onClick={() => setIsModal("ADD_TAG")}
          className="flex items-center px-4 py-2 bg-primary opacity-100 hover:opacity-90 text-white rounded-lg font-bold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <HiPlus className="w-4.5 h-4.5 mr-1" />
          New Tag
        </button>
      </div>

      <div className="bg-gray-50">
        {/* Tags List */}
        <div className="space-y-4">
          {tagLoading ? (
            <div className="text-center my-15 text-sm text-gray-500">
              Loading tags...
            </div>
          ) : tags?.length === 0 ? (
            <div className="text-center my-15 py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <FaTag className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-500 text-sm">No tags found</p>
              <button
                onClick={() => setIsModal("ADD_TAG")}
                className="mt-4 text-primary hover:text-blue-600 font-medium cursor-pointer"
              >
                Create your first tag
              </button>
            </div>
          ) : (
            tags.map((tag) => (
              <div
                id={tag.id}
                key={tag.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-2"
              >
                {/* tag Header */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {tag.name}
                      </h3>
                      <p className="text-xs text-gray-500">{tag.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedTag(tag);
                        setIsModal("EDIT_TAG");
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg cursor-pointer"
                      title="Edit tag"
                    >
                      <RiEdit2Fill size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setIsModal("DELETE_TAG");
                        setSelectedTag(tag);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete tag"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Pagination
          totalItems={totalItems}
          currentPage={page}
          itemsPerPage={limit}
          onPageChange={(page) => setPage(page)}
          onItemsPerPageChange={(limit) => setLimit(limit)}
        />
      </div>

      {/* Modals */}
      <Modal
        open={isModal === "ADD_TAG" || isModal === "EDIT_TAG"}
        heading={isModal === "ADD_TAG" ? "Add Tag" : "Edit Tag"}
        onClose={() => {
          setIsModal(false);
          setSelectedTag(null);
        }}
        width="400px"
      >
        <AddTagModal mode={isModal === "ADD_TAG" ? "ADD" : "EDIT"} />
      </Modal>

      <Modal
        open={isModal === "ADD_TAG" && selectedTag}
        onClose={() => {
          setSelectedTag(null);
          setIsModal(false);
        }}
        heading={`Add tag to ${selectedTag ? selectedTag.name : "N/a"}`}
        width="400px"
      >
        <AddTagModal mode={"ADD"} />
      </Modal>

      <Modal
        open={isModal === "DELETE_TAG"}
        heading="Delete Tag"
        onClose={() => {
          setSelectedTag(null);
          setIsModal(false);
        }}
        width="450px"
      >
        <ConfirmationModal
          message="Are you sure do you want to delete this tag?"
          confirmText="Delete"
          variant={"danger"}
          onConfirm={deleteTagFunc}
          isLoading={tagsApiLoading}
        />
      </Modal>
    </>
  );
};

export default TagsManager;
