import Modal from "@/components/Modal";
import React, { useEffect, useState } from "react";
import { FaFlag, FaPlus, FaTimes } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import Pagination from "@/components/common/pagination/Pagination";
import useContextStore from "@/stores/useContextStore";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import useCategoryManagerStore from "@/stores/settings/useCategoryManagerStore";
import AddSubCategoryModal from "../../modals/AddSubCategoryModal";
import DynamicSelect from "@/components/common/DynamicSelect";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import Btn from "@/components/common/Btn";

export default function SubCategoryManager({ cate }) {
  const {
    subCategories,
    isModal,
    getSubCategories,
    setIsModal,
    deleteSubCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedCategory,
    setSelectedCategory,
    totalSubCateItems,
    subCategoryApiLoading,
    subCategoryLoading,
  } = useCategoryManagerStore();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [subCategoryTerm, setSubCateSearchTerm] = useState("");
  const [debouncedSearchSubCat, setDebouncedSearchSubCat] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const [includeDelete, setIncludeDeleted] = useState();
  const [isDeleted, setIsDeleted] = useState();

  const MODULEKEY = "subCategory";

  // Delete flag
  const deleteSubCateFunc = async () => {
    try {
      await deleteSubCategory(selectedSubCategory?.id);
    } catch (error) {
      console.error("Failed to delete sub cate:", error.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchSubCat(subCategoryTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [subCategoryTerm]);

  useEffect(() => {
    const str = useContextStore.getState().createParamsStr(
      {
        category_id: cate.id,
        name: debouncedSearchSubCat,
        page,
        limit,
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
    getSubCategories(str);
  }, [
    cate,
    debouncedSearchSubCat,
    page,
    limit,
    isDeleted,
    selectedStatus,
    includeDelete,
  ]);

  return (
    <>
      {/* Header */}
      <div className="flex gap-2 justify-between px-6">
        <div className="flex gap-2">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search sub-category`}
              value={subCategoryTerm}
              onChange={(e) => {
                setSubCateSearchTerm(e.target.value);
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
        <Btn
          onClickFunc={() => {
            setSelectedCategory(cate);
            setIsModal("ADD_SUB_CATEGORY");
          }}
          className="w-fit!"
          btnName={"Add Sub-category"}
          icon={<FaPlus size={16} />}
        />
      </div>

      {/* sub-catelist */}
      <div className="border-t border-gray-100">
        {/* sub cate list */}
        {subCategoryLoading ? (
          <div className="text-center my-15 text-sm text-gray-500">
            Loading sub-categories...
          </div>
        ) : subCategories?.length === 0 ? (
          <div className="text-center my-15">
            <p className="text-gray-400 text-xs">
              No sub-categories in category
            </p>
            <button
              onClick={() => {
                setSelectedCategory(cate);
                setIsModal("ADD_SUB_CATEGORY");
              }}
              className="mt-2 text-sm text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              Add your first sub-category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 my-2">
            {subCategories?.map((sc) => (
              <div
                key={sc.id}
                className="flex items-center justify-between py-1 px-8 hover:bg-gray-50"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    <FaFlag size={12} className="text-green-500" />
                    {sc?.name}
                  </h4>
                  <p className="text-xs text-gray-500">{sc?.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(cate);
                      setSelectedSubCategory(sc);
                      setIsModal("EDIT_SUB_CATEGORY");
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg cursor-pointer"
                    title="Edit sub category"
                  >
                    <RiEdit2Fill size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setIsModal("DELETE_SUB_CATEGORY");
                      setSelectedSubCategory(sc);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete sub category"
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
          totalItems={totalSubCateItems}
          currentPage={page}
          itemsPerPage={limit}
          onPageChange={(page) => {
            setPage(page);
            filteredSubCategoriesList({ page: page });
          }}
          onItemsPerPageChange={(limit) => {
            setLimit(limit);
            filteredSubCategoriesList({ limit: limit, page: 1 });
          }}
        />
      </div>

      {/* Modal */}
      <Modal
        open={
          isModal === "ADD_SUB_CATEGORY" ||
          (isModal === "EDIT_SUB_CATEGORY" && selectedCategory)
        }
        onClose={() => {
          setSelectedSubCategory(null);
          setIsModal(false);
        }}
        heading={`${isModal === "ADD_SUB_CATEGORY" ? "Add sub-category to" : "Update sub-category of"} ${selectedCategory ? selectedCategory.name : "N/a"}`}
        width="400px"
      >
        <AddSubCategoryModal
          mode={isModal === "ADD_SUB_CATEGORY" ? "ADD" : "EDIT"}
        />
      </Modal>

      <Modal
        open={isModal === "DELETE_SUB_CATEGORY"}
        heading="Delete Sub-category"
        onClose={() => {
          setSelectedSubCategory(null);
          setIsModal(false);
        }}
        width="450px"
      >
        <ConfirmationModal
          message="Are you sure do you want to delete this sub-category?"
          confirmText="Delete"
          variant={"danger"}
          onConfirm={deleteSubCateFunc}
          isLoading={subCategoryApiLoading}
        />
      </Modal>
    </>
  );
}
