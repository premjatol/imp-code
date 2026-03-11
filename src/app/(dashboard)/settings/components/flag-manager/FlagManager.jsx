import Modal from "@/components/Modal";
import React, { useEffect, useState } from "react";
import { FaFlag, FaPlus, FaTimes } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import AddFlagModal from "../../modals/AddFlagModal";
import Pagination from "@/components/common/pagination/Pagination";
import useFlagManagerStore from "@/stores/settings/useFlagManagerStore";
import useContextStore from "@/stores/useContextStore";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import DynamicSelect from "@/components/common/DynamicSelect";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import Btn from "@/components/common/Btn";

export default function FlagManager({ group }) {
  const {
    flags,
    isModal,
    getFlags,
    setIsModal,
    deleteFlag,
    selectedFlag,
    setSelectedFlag,
    selectedGroup,
    setSelectedGroup,
    totalFlagsItems,
    flagListApiLoading,
    flagListLoading,
  } = useFlagManagerStore();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const [includeDelete, setIncludeDeleted] = useState();
  const [sortBy, setSortBy] = useState({ value: "asc", label: "Ascending" });

  const MODULEKEY = "flag";

  // Delete flag
  const deleteFlagFunc = async () => {
    try {
      await deleteFlag(selectedFlag?.id);
    } catch (error) {
      console.error("Failed to delete group:", error.message);
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
        include_deleted:
          includeDelete?.value === "ALL" ? "" : includeDelete?.value.toString(),
        include_inactive:
          selectedStatus?.value === "ALL"
            ? ""
            : selectedStatus?.value.toString(),
        sortBy: sortBy?.value,
      },
      MODULEKEY,
    );
    getFlags({ groupId: group.id, str });
  }, [page, limit, debouncedSearch, includeDelete, selectedStatus, sortBy]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mx-6">
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

          {/* Sort by */}
          <DynamicSelect
            options={[
              { value: "asc", label: "Ascending" },
              { value: "desc", label: "Descending" },
            ]}
            value={sortBy || { value: "asc", label: "Ascending" }}
            onChange={(option) => setSortBy(option)}
            className="w-35 cursor-pointer"
          />
        </div>

        <Btn
          onClickFunc={() => {
            setSelectedGroup(group);
            setIsModal("Add_FLAG");
          }}
          className="w-fit!"
          btnName="Add Flag"
          icon={<FaPlus size={16} />}
        />
      </div>

      {/* list */}
      <div className="border-t border-gray-100">
        {/* flag list */}
        {flagListLoading ? (
          <div className="text-center my-15 text-sm text-gray-500">
            Loading flags...
          </div>
        ) : flags?.length === 0 ? (
          <div className="text-center my-15">
            <p className="text-gray-400 text-xs">No flags in this group</p>
            <button
              onClick={() => {
                setSelectedGroup(group);
                setIsModal("ADD_FLAG");
              }}
              className="mt-2 text-sm text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              Add your first flag
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 my-2">
            {flags?.map((flag) => (
              <div
                key={flag.id}
                className="flex items-center justify-between py-1 px-8 hover:bg-gray-50"
              >
                <h4 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                  <FaFlag size={12} className="text-green-500" />
                  {flag.label}
                </h4>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedGroup(group);
                      setSelectedFlag(flag);
                      setIsModal("EDIT_FLAG");
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg cursor-pointer"
                    title="Edit Flag"
                  >
                    <RiEdit2Fill size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setIsModal("DELETE_FLAGE");
                      setSelectedFlag(flag);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete flag"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* pagination */}
        <Pagination
          totalItems={totalFlagsItems}
          currentPage={page}
          itemsPerPage={limit}
          onPageChange={(page) => {
            setPage(page);
          }}
          onItemsPerPageChange={(limit) => {
            setLimit(limit);
            setPage(1);
          }}
        />
      </div>

      {/* Modal */}
      <Modal
        open={
          isModal === "ADD_FLAG" || (isModal === "EDIT_FLAG" && selectedGroup)
        }
        onClose={() => {
          setSelectedFlag(null);
          setIsModal(false);
        }}
        heading={`${isModal === "ADD_FLAG" ? "Add flag to" : "Update flag of"} ${selectedGroup ? selectedGroup.name : "N/a"}`}
        width="400px"
      >
        <AddFlagModal mode={isModal === "ADD_FLAG" ? "ADD" : "EDIT"} />
      </Modal>

      <Modal
        open={isModal === "DELETE_FLAGE"}
        heading="Delete Flag"
        onClose={() => {
          setSelectedFlag(null);
          setIsModal(false);
        }}
        width="450px"
      >
        <ConfirmationModal
          message="Are you sure do you want to delete this flag?"
          confirmText="Delete"
          variant={"danger"}
          onConfirm={deleteFlagFunc}
          isLoading={flagListApiLoading}
        />
      </Modal>
    </>
  );
}
