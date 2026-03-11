"use client";

import { create } from "zustand";
import useContextStore from "../useContextStore";
import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";

const MODULEKEY = "planFolderStore";

export const usePlansStore = create((set, get) => ({
  folders: [],
  plans: [],
  projectData: null,
  planLoading: false,
  isApiLoading: false,
  selectedPlan: null,
  selectedFolder: null,
  isModal: false,
  error: false,
  success: false,
  totalItems: null,
  projectId: null,
  viewType: "grid",

  setIsModal: (isModal) => set({ isModal }),
  setProjectId: (projectId) => set({ projectId }),
  setSelectedFolder: (selectedFolder) => set({ selectedFolder }),
  setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
  setViewType: (viewType) => set({ viewType }),

  // Here have api functions
  createPlanFolders: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      let url = `/projects/${get().projectId}/plan-folders`;

      const res = await apiRequest({
        method: "POST",
        url: url,
        data: payload,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      // const str = useContextStore.getState().createParamsStr({}, MODULEKEY);
      await get().getFolderNPlanDetails(get().projectId);

      toast.success(res.message || "Folder created successfully");
      return res;
    } catch (error) {
      toast.error(error.message || "getting error");
      set({
        error: error?.message || "Failed to fetch tasks",
        isApiLoading: false,
      });
    }
  },

  // rename folder name
  editPlanFolder: async (payload, fid) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      let url = `/projects/${get().projectId}/plan-folders/${fid}`;

      const res = await apiRequest({
        method: "PUT",
        url: url,
        data: payload,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
        totalItems: res.data.total,
      });

      // const str = useContextStore.getState().createParamsStr({}, MODULEKEY);
      await get().getFolderNPlanDetails(get().projectId);

      toast.success(res.message || "Folder details updated successfully");

      return res;
    } catch (error) {
      toast.error(error.message || "getting error");
      set({
        error: error?.message || "Failed to fetch tasks",
        isApiLoading: false,
      });
    }
  },

  // get folder list
  getFolderNPlanDetails: async (id, str) => {
    try {
      set({ planLoading: true, error: null, success: false });

      let url = `/projects/${id}/plans-hierarchy${str || ""}`;

      const res = await apiRequest({
        url,
      });

      set({
        projectData: res.data.project,
        folders: res.data.folders,
        plans: res.data.folders.flatMap((folder) => folder.plans),
        planLoading: false,
        success: true,
        isModal: false,
        // totalItems: res.pagination.total,
      });

      return res;
    } catch (error) {
      set({
        error: error?.message || "Failed to fetch tasks",
        planLoading: false,
      });
    }
  },

  // delete folder
  deleteFolderById: async (id) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      let url = `/projects/${get().projectId}/plan-folders/${id}`;

      const res = await apiRequest({
        method: "DELETE",
        url,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });
      await get().getFolderNPlanDetails(get().projectId);

      toast.success(res.message || "Folder deleted successfully");

      return res;
    } catch (error) {
      toast.error(error.message || "getting error");
      set({
        error: error?.message || "Failed to fetch folder",
        isApiLoading: false,
      });
    }
  },

  // Create plan
  createPlan: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      let url = `/projects/${get().projectId}/plans`;

      const res = await apiRequest({
        method: "POST",
        url: url,
        data: payload,
        isMultipart: true,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      // const str = useContextStore.getState().createParamsStr({}, MODULEKEY);
      await get().getFolderNPlanDetails(get().projectId);

      toast.success(res.message || "Plan created successfully");
      return res;
    } catch (error) {
      toast.error(error.message || "getting error");
      set({
        error: error?.message || "Failed to fetch",
        isApiLoading: false,
      });
    }
  },

  // Edit plan
  editPlan: async (planId, payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      let url = `/projects/${get().projectId}/plans/${planId}`;

      const res = await apiRequest({
        method: "PUT",
        url: url,
        data: payload,
        // isMultipart: true,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      // const str = useContextStore.getState().createParamsStr({}, MODULEKEY);
      await get().getFolderNPlanDetails(get().projectId);

      toast.success(res.message || "Plan created successfully");
      return res;
    } catch (error) {
      toast.error(error.message || "getting error");
      set({
        error: error?.message || "Failed to fetch",
        isApiLoading: false,
      });
    }
  },

  // delete plan
  deletePlan: async (id) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      let url = `/projects/${get().projectId}/plans/${id}`;

      const res = await apiRequest({
        method: "DELETE",
        url,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });
      await get().getFolderNPlanDetails(get().projectId);

      toast.success(res.message || "Plan deleted successfully");

      return res;
    } catch (error) {
      toast.error(error.message || "getting error");
      set({
        error: error?.message || "Failed to fetch folder",
        isApiLoading: false,
      });
    }
  },
}));
