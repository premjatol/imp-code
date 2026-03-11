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
import Pagination from "@/components/common/pagination/Pagination";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import useContextStore from "@/stores/useContextStore";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import useCategoryManagerStore from "@/stores/settings/useCategoryManagerStore";
import SubCategoryManager from "./SubCategoryManager";
import AddCategoryModal from "../../modals/AddCategoryModal";
import AddSubCategoryModal from "../../modals/AddSubCategoryModal";
import DynamicSelect from "@/components/common/DynamicSelect";

const CategoryManager = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const [includeDelete, setIncludeDeleted] = useState();
  const [isDeleted, setIsDeleted] = useState();

  const MODULEKEY = "category";

  const {
    categories,
    isModal,
    setIsModal,
    getCategories,
    totalItems,
    setSelectedSubCategory,
    deleteCategory,
    selectedCategory,
    setSelectedCategory,
    getSubCategories,
    categoryLoading,
    categoryApiLoading,
  } = useCategoryManagerStore();

  const [categoryId, setCategoryId] = useState(null);

  // Toggle category expansion
  const toggleCategory = async (cateId) => {
    if (cateId === categoryId) {
      setCategoryId(null);
    } else {
      setTimeout(() => {
        const element = document.getElementById(cateId);
        element?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);

      setCategoryId(cateId);
      const str = useContextStore
        .getState()
        .createParamsStr({ category_id: cateId }, MODULEKEY);
      await getSubCategories(str);
    }
  };

  // Delete category
  const deleteCategoryFunc = async () => {
    try {
      await deleteCategory({ cateId: selectedCategory?.id });
    } catch (error) {
      console.error("Failed to delete category:", error.message);
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
    getCategories(str);
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
          onClick={() => setIsModal("ADD_CATEGORY")}
          className="flex items-center px-4 py-2 bg-primary opacity-100 hover:opacity-90 text-white rounded-lg font-bold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <HiPlus className="w-4.5 h-4.5 mr-1" />
          New Category
        </button>
      </div>

      <div className="bg-gray-50">
        {/* categories List */}
        <div className="space-y-4">
          {categoryLoading ? (
            <div className="text-center my-15 text-sm text-gray-500">
              Loading Categories...
            </div>
          ) : categories?.length === 0 ? (
            <div className="text-center my-15 py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <FaFlag className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-500 text-sm">No category found</p>
              <button
                onClick={() => setIsModal("ADD_CATEGORY")}
                className="mt-4 text-primary hover:text-blue-600 font-medium cursor-pointer"
              >
                Create your first category
              </button>
            </div>
          ) : (
            categories.map((cate) => (
              <div
                id={cate.id}
                key={cate.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-2"
              >
                {/* cate Header */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleCategory(cate.id)}
                      className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {categoryId === cate?.id ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800 flex gap-1 items-center">
                        {cate?.name}
                        <span
                          className="w-4 h-4 rounded-full inline-block cursor-pointer border border-gray-300"
                          style={{ backgroundColor: cate.color }}
                        />
                      </h3>
                      <p className="text-xs text-gray-500">
                        {cate?.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(cate);
                        setIsModal("EDIT_CATEGORY");
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg cursor-pointer"
                      title="Edit category"
                    >
                      <RiEdit2Fill size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setIsModal("DELETE_CATEGORY");
                        setSelectedCategory(cate);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete category"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                {/* sub categories List */}
                {categoryId === cate?.id && <SubCategoryManager cate={cate} />}
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
        open={isModal === "ADD_CATEGORY" || isModal === "EDIT_CATEGORY"}
        heading={isModal === "ADD_CATEGORY" ? "Add Category" : "Edit Category"}
        onClose={() => {
          setIsModal(false);
          setSelectedCategory(null);
        }}
        width="400px"
      >
        <AddCategoryModal mode={isModal === "ADD_CATEGORY" ? "ADD" : "EDIT"} />
      </Modal>

      <Modal
        open={isModal === "ADD_SUB_CATEGORY" && selectedCategory}
        onClose={() => {
          setSelectedSubCategory(null);
          setSelectedCategory(null);
          setIsModal(false);
        }}
        heading={`Add sub category to ${selectedCategory ? selectedCategory.name : "N/a"}`}
        width="400px"
      >
        <AddSubCategoryModal mode={"ADD"} />
      </Modal>

      <Modal
        open={isModal === "DELETE_CATEGORY"}
        heading="Delete Category"
        onClose={() => {
          setSelectedCategory(null);
          setIsModal(false);
        }}
        width="450px"
      >
        <ConfirmationModal
          message="Are you sure do you want to delete this category?"
          confirmText="Delete"
          variant={"danger"}
          onConfirm={deleteCategoryFunc}
          isLoading={categoryApiLoading}
        />
      </Modal>
    </>
  );
};

export default CategoryManager;
