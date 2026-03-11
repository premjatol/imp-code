import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";
import { create } from "zustand";
import useContextStore from "../useContextStore";

const MODULEKEY1 = "category";
const MODULEKEY2 = "subCategory";

const useCategoryManagerStore = create((set, get) => ({
  isModal: false,
  categories: [],
  subCategories: [],
  categoryLoading: false,
  categoryApiLoading: false,
  subCategoryLoading: false,
  subCategoryApiLoading: false,
  error: null,
  success: false,
  totalItems: null,
  totalSubCateItems: null,
  selectedCategory: null,
  selectedSubCategory: null,

  setIsModal: (value) => set({ isModal: value }),
  setSelectedCategory: (value) => set({ selectedCategory: value }),
  setSelectedSubCategory: (value) => set({ selectedSubCategory: value }),

  // Add Category
  addCategory: async (payload) => {
    try {
      set({ categoryApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: "/masters/categories",
        data: payload,
      });

      set((state) => ({
        categoryApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Category created successfully");
      const str = useContextStore.getState().createParamsStr({}, MODULEKEY1);
      await get().getCategories(str);

      return res;
    } catch (error) {
      set({
        error: error.message,
        categoryApiLoading: false,
        success: false,
      });

      throw error;
    }
  },

  //Get Categories
  getCategories: async (str) => {
    try {
      set({ categoryLoading: true, error: null, success: false });

      let url = `/masters/categories${str}`;

      const res = await apiRequest({
        url: url,
      });

      set({
        categories: res.data.categories,
        categoryLoading: false,
        success: true,
        isModal: false,
        totalItems: res.data.pagination.total,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        categoryLoading: false,
        success: false,
      });

      throw error;
    }
  },

  // Delete Category
  deleteCategory: async ({ cateId }) => {
    try {
      set({ categoryApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/masters/categories/${cateId}`,
      });

      set((state) => ({
        // categories: state.categories.filter((cat) => cat.id !== cateId),
        // totalItems: state.totalItems ? state.totalItems - 1 : state.totalItems,
        categoryApiLoading: false,
        selectedCategory: null,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Category deleted successfully");
      const str = useContextStore.getState().createParamsStr({}, MODULEKEY1);
      await get().getCategories(str);
    } catch (error) {
      set({
        error: error.message,
        categoryApiLoading: false,
        success: false,
      });
      toast.error(error.message || "error");

      throw error;
    }
  },

  //Edit  Category
  editCategory: async (payload, id) => {
    try {
      set({ categoryApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/masters/categories/${id}`,
        data: payload,
      });

      set((state) => ({
        // categories: state.categories.map((cat) =>
        //   cat.id === payload.cid ? res.data : cat,
        // ),
        categoryApiLoading: false,
        success: true,
        isModal: false,
        selectedCategory: null,
      }));

      toast.success(res.message || "Category updated successfully");
      const str = useContextStore.getState().createParamsStr({}, MODULEKEY1);
      await get().getCategories(str);

      return res;
    } catch (error) {
      set({
        error: error.message,
        categoryApiLoading: false,
        success: false,
      });
      toast.error(error.message || "error");

      throw error;
    }
  },

  //addSubCategory
  addSubCategory: async (payload) => {
    try {
      set({ subCategoryApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: `/masters/subcategories`,
        data: payload,
      });

      set((state) => ({
        // subCategories: [res.data, ...state.subCategories],
        subCategoryApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "");

      const str = useContextStore.getState().createParamsStr({}, MODULEKEY2);
      await get().getSubCategories(str);

      return res;
    } catch (error) {
      set({
        error: error.message,
        subCategoryApiLoading: false,
        success: false,
      });

      throw error;
    }
  },

  //UpdateSubCate
  updateSubCate: async (payload, id) => {
    try {
      set({ subCategoryApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/masters/subcategories/${id}`,
        data: payload,
      });

      set((state) => ({
        subCategoryApiLoading: false,
        selectedCategory: null,
        selectedSubCategory: null,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Sub category has updated");
      const str = useContextStore.getState().createParamsStr({}, MODULEKEY2);
      await get().getSubCategories(str);

      return res;
    } catch (error) {
      set({
        error: error.message,
        subCategoryApiLoading: false,
        success: false,
      });

      throw error;
    }
  },

  // Get SubCate list
  getSubCategories: async (str) => {
    try {
      set({ subCategoryLoading: true, error: null, success: false });

      let url = `/masters/subcategories${str}`;

      const res = await apiRequest({
        url: url,
      });

      set({
        subCategories: res.data.subcategories,
        subCategoryLoading: false,
        success: true,
        isModal: false,
        totalSubCateItems: res.data.pagination.total,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        subCategoryLoading: false,
        success: false,
      });

      throw error;
    }
  },

  // delete SubCate
  deleteSubCategory: async (sId) => {
    try {
      set({ subCategoryApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/masters/subcategories/${sId}`,
      });

      set((state) => ({
        // subCategories: state.subCategories.filter((s) => s.id !== sId),
        // totalSubCateItems: state.totalSubCateItems
        //   ? state.totalSubCateItems - 1
        //   : state.totalSubCateItems,
        subCategoryApiLoading: false,
        success: true,
        isModal: false,
        selectedSubCategory: null,
      }));

      toast.success(res.message || "Sub-category deleted successfully");
      const str = useContextStore.getState().createParamsStr({}, MODULEKEY2);
      await get().getSubCategories(str);
    } catch (error) {
      set({
        error: error.message,
        subCategoryApiLoading: false,
        success: false,
      });

      toast.error(error.message || "error");
      throw error;
    }
  },
}));

export default useCategoryManagerStore;
