import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";
import { create } from "zustand";
import useContextStore from "../useContextStore";

const MODULEKEY1 = "tag";

const useTagsManagerStore = create((set, get) => ({
  isModal: false,
  tags: [],
  tagLoading: false,
  tagApiLoading: false,
  error: null,
  success: false,
  totalItems: null,
  selectedTag: null,

  setIsModal: (value) => set({ isModal: value }),
  setSelectedTag: (value) => set({ selectedTag: value }),

  // Add Tag
  addTag: async (payload) => {
    try {
      set({ tagApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: "/masters/tags",
        data: payload,
      });

      set((state) => ({
        tagApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Tag created successfully");
      const str = useContextStore.getState().createParamsStr({}, MODULEKEY1);
      await get().getTags(str);

      return res;
    } catch (error) {
      set({
        error: error.message,
        tagApiLoading: false,
        success: false,
      });
      toast.error(error.message || "error");

      throw error;
    }
  },

  //Get Categories
  getTags: async (str) => {
    try {
      set({ tagLoading: true, error: null, success: false });

      let url = `/masters/tags${str}`;

      const res = await apiRequest({
        url: url,
      });

      set({
        tags: res.data.tags,
        tagLoading: false,
        success: true,
        isModal: false,
        totalItems: res.data.pagination.total,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        tagLoading: false,
        success: false,
      });

      throw error;
    }
  },

  // Delete Tag
  deleteTag: async ({ id }) => {
    try {
      set({ tagApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/masters/tags/${id}`,
      });

      set((state) => ({
        // tags: state.tags.filter((cat) => cat.id !== cateId),
        // totalItems: state.totalItems ? state.totalItems - 1 : state.totalItems,
        tagApiLoading: false,
        selectedTag: null,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Tag deleted successfully");
      const str = useContextStore.getState().createParamsStr({}, MODULEKEY1);
      await get().getTags(str);
    } catch (error) {
      set({
        error: error.message,
        tagApiLoading: false,
        success: false,
      });
      toast.error(error.message || "error");

      throw error;
    }
  },

  //Edit  Tag
  updateTag: async (payload, id) => {
    try {
      set({ tagApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/masters/tags/${id}`,
        data: payload,
      });

      set((state) => ({
        // tags: state.tags.map((cat) =>
        //   cat.id === payload.cid ? res.data : cat,
        // ),
        tagApiLoading: false,
        success: true,
        isModal: false,
        selectedTag: null,
      }));

      toast.success(res.message || "Tag updated successfully");
      const str = useContextStore.getState().createParamsStr({}, MODULEKEY1);
      await get().getTags(str);

      return res;
    } catch (error) {
      set({
        error: error.message,
        tagApiLoading: false,
        success: false,
      });
      toast.error(error.message || "error");

      throw error;
    }
  },
}));

export default useTagsManagerStore;
