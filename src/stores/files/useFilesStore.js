import { create } from "zustand";
import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";

const useFilesStore = create((set, get) => ({
  files: [],
  loading: false,
  isApiLoading: false,
  error: null,
  success: false,
  isModal: false,
  totalItems: null,
  projectId: null,
  fileId: null,
  fileInfo: null,
  page: 1,
  limit: 10,

  setIsModal: (value) => set({ isModal: value }),
  setProjectId: (value) => set({ projectId: value }),
  setFileId: (id) => set({ fileId: id }),
  setPage: (value) => set({ page: value }),
  setLimit: (value) => set({ limit: value }),

  // Add Files
  addFiles: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: `/projects/${get().projectId}/files`,
        data: payload,
        isMultipart: true,
      });

      set((state) => ({
        files: [res.data, ...state.files],
        isApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "File added successfully");

      // await get().getFiles("");

      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });
      toast.error(error.message || "Failed to add file");
      throw error;
    }
  },

  //Get Files
  getFiles: async (str) => {
    try {
      set({ loading: true, error: null, success: false });

      const res = await apiRequest({
        url: `/projects/${get().projectId}/files${str || ""}`,
      });

      set({
        files: res.data.files,
        loading: false,
        success: true,
        isModal: false,
        totalItems: res.data.pagination.total,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        success: false,
      });

      throw error;
    }
  },

  // Soft delete a project file
  deleteFiles: async () => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/projects/${get().projectId}/files/${get().fileId}`,
      });

      set({
        isApiLoading: false,
        success: true,
      });

      toast.success(res.message || "File deleted successfully");

      await get().getFiles();

      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to delete file");
      throw error;
    }
  },
}));

export default useFilesStore;
