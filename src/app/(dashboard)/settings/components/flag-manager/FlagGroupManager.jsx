// components/FlagManager.jsx
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaFlag,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import AddFlagModal from "../../modals/AddFlagModal";
import Pagination from "@/components/common/pagination/Pagination";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import useContextStore from "@/stores/useContextStore";
import FlagManager from "./FlagManager";
import AddFlagGroupsModal from "../../modals/AddFlagGroupsModal";
import useFlagManagerStore from "@/stores/settings/useFlagManagerStore";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import DynamicSelect from "@/components/common/DynamicSelect";

const FlagGroupManager = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const [includeDelete, setIncludeDeleted] = useState();
  const [sortBy, setSortBy] = useState({ value: "asc", label: "Ascending" });

  const MODULEKEY = "flagGroup";

  const {
    flagGroup,
    isModal,
    setIsModal,
    getFlagGroups,
    flagGrouploading,
    totalItems,
    setSelectedFlag,
    deleteFlagGroup,
    selectedGroup,
    setSelectedGroup,
    getFlags,
    flagGroupApiLoading,
    flagGroupId,
    setFlagGroupId,
  } = useFlagManagerStore();

  // Toggle group expansion
  const toggleGroup = async (groupId) => {
    if (groupId === flagGroupId) {
      setFlagGroupId(null);
    } else {
      setTimeout(() => {
        const element = document.getElementById(groupId);
        element?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);

      setFlagGroupId(groupId);
      const str = useContextStore
        .getState()
        .createParamsStr({ page: 1, limit: 10 }, MODULEKEY);
      await getFlags({ groupId: groupId, str });
    }
  };

  // Delete group
  const deleteFlagGroupFunc = async () => {
    try {
      await deleteFlagGroup({ groupId: selectedGroup?.id });
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
    getFlagGroups(str);
  }, [page, limit, debouncedSearch, includeDelete, selectedStatus, sortBy]);

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

        <button
          onClick={() => setIsModal("ADD_FLAG_GROUPS")}
          className="flex items-center px-4 py-2 bg-primary opacity-100 hover:opacity-90 text-white rounded-lg font-bold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <HiPlus className="w-4.5 h-4.5 mr-1" />
          New Flag Group
        </button>
      </div>

      <div className="bg-gray-50">
        {/* Groups List */}
        <div className="space-y-4">
          {flagGrouploading ? (
            <div className="text-center my-15 text-sm text-gray-500">
              Loading flag groups...
            </div>
          ) : flagGroup?.length === 0 ? (
            <div className="text-center my-15 py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <FaFlag className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-500 text-sm">No flag groups found</p>
              <button
                onClick={() => setIsModal("ADD_FLAG_GROUPS")}
                className="mt-4 text-primary hover:text-blue-600 font-medium cursor-pointer"
              >
                Create your first group
              </button>
            </div>
          ) : (
            flagGroup.map((group) => (
              <div
                id={group.id}
                key={group.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-2"
              >
                {/* Group Header */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {flagGroupId === group?.id ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {group.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {group.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedGroup(group);
                        setIsModal("EDIT_FLAG_GROUP");
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg cursor-pointer"
                      title="Edit group"
                    >
                      <RiEdit2Fill size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setIsModal("DELETE_FLAGE_GROUP");
                        setSelectedGroup(group);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete group"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                {/* Flags List */}
                {flagGroupId === group?.id && <FlagManager group={group} />}
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
        open={isModal === "ADD_FLAG_GROUPS" || isModal === "EDIT_FLAG_GROUP"}
        heading={
          isModal === "ADD_FLAG_GROUPS" ? "Add Flag Group" : "Edit Flag Group"
        }
        onClose={() => {
          setIsModal(false);
          setSelectedGroup(null);
        }}
        width="400px"
      >
        <AddFlagGroupsModal
          mode={isModal === "ADD_FLAG_GROUPS" ? "ADD" : "EDIT"}
        />
      </Modal>

      <Modal
        open={isModal === "Add_FLAG" && selectedGroup}
        onClose={() => {
          setSelectedFlag(null);
          setIsModal(false);
        }}
        heading={`Add flag to ${selectedGroup ? selectedGroup.name : "N/a"}`}
        width="400px"
      >
        <AddFlagModal mode={"ADD"} />
      </Modal>

      <Modal
        open={isModal === "DELETE_FLAGE_GROUP"}
        heading="Delete Flag Group"
        onClose={() => {
          setSelectedGroup(null);
          setIsModal(false);
        }}
        width="450px"
      >
        <ConfirmationModal
          message="Are you sure do you want to delete this flag group?"
          confirmText="Delete"
          variant={"danger"}
          onConfirm={deleteFlagGroupFunc}
          isLoading={flagGroupApiLoading}
        />
      </Modal>
    </>
  );
};

export default FlagGroupManager;
