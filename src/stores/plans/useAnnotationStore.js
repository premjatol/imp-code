"use client";

import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";
import { create } from "zustand";
import { usePlansStore } from "./usePlansStore";

const MODULEKEY = "annotationModule";

export const useAnnotationStore = create((set, get) => ({
  planDetails: null,
  projectId: null,
  planId: null,
  isLoading: false,
  isApiLoading: false,
  isModal: false,
  success: null,
  error: null,
  shapes: [],

  setIsModal: (isModal) => set({ isModal }),
  setProjectId: (projectId) => set({ projectId }),
  setPlanId: (planId) => set({ planId }),
  setPlanDetails: (planDetails) => set({ planDetails }),

  clearAllStates: () =>
    set({
      shapes: [],
      planDetails: null,
    }),

  // get a single plan details
  getPlanDetails: async (id, str) => {
    try {
      set({ isLoading: true, error: null, success: false, planDetails: null });

      let url = `/projects/${id}/plans-hierarchy${str || ""}`;

      const res = await apiRequest({
        url,
      });

      set({
        planDetails: res.data.folders[0].plans[0],
        isLoading: false,
        success: true,
        isModal: false,
      });

      return res;
    } catch (error) {
      set({
        error: error?.message || "Failed to fetch",
        isLoading: false,
      });
    }
  },

  // save all shpes in bulk
  createAnnotationMap: async (payload) => {
    try {
      const { projectId, planId } = get();

      set({
        isApiLoading: true,
        error: null,
        success: false,
        planDetails: null,
      });

      let url = `/projects/${projectId}/plans/${planId}/annotations/bulk-sync`;

      const res = await apiRequest({
        method: "POST",
        url,
        data: payload,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Plan submitted");

      return res;
    } catch (error) {
      toast.error(error.message || "Failed to fetch");
      set({
        error: error?.message || "Failed to fetch",
        isApiLoading: false,
      });
    }
  },

  // save a single shape
  createSingleAnnation: async (id, pid, payload) => {
    try {
      // debugger;
      // const { projectId, planId } = usePlansStore.getState();
      // if (!projectId && !planId) throw Error("Project Id and Plan Id must");

      set({
        isLoading: true,
        error: null,
        success: false,
      });

      let url = `/projects/${id}/plans/${pid}/annotations`;

      const res = await apiRequest({
        method: "POST",
        url,
        data: payload,
      });

      set({
        isLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Annotation Submitted");

      return res;
    } catch (error) {
      toast.error(error.message || "Failed to fetch");
      set({
        error: error?.message || "Failed to fetch",
        isLoading: false,
      });
    }
  },

  // get all shapes
  getAnnotationShapes: async (projectId, planId, str) => {
    try {
      set({ isLoading: true, error: null, success: false });

      let url = `/projects/${projectId}/plans/${planId}/annotations${str || ""}`;

      const res = await apiRequest({
        url,
      });

      set({
        shapes: res.data,
        isLoading: false,
        success: true,
        isModal: false,
      });

      return res;
    } catch (error) {
      set({
        error: error?.message || "Failed to fetch",
        isLoading: false,
      });
    }
  },

  // delete shape
  deleteShape: async (id) => {
    try {
      const { projectId, planId } = get();
      const customId = id.startsWith("shape-");
      if (customId) return;

      set({ isApiLoading: true, error: null, success: false });

      let url = `/projects/${projectId}/plans/${planId}/annotations/${id}`;

      const res = await apiRequest({
        method: "DELETE",
        url,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });
      // await get().getFolderNPlanDetails(get().projectId);

      toast.success(res.message || "Shape deleted successfully");

      return res;
    } catch (error) {
      toast.error(error.message || "getting error");
      set({
        error: error?.message || "Failed to fetch folder",
        isApiLoading: false,
      });
    }
  },

  //Upload Version
  uploadVersion: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      let url = `/projects/${get().projectId}/plans/${get().planId}/version`;

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

      await get().getPlanDetails(get().projectId, `?planId=${get().planId}`);

      toast.success(res.message || "Version uploaded successfully");
      return res;
    } catch (error) {
      toast.error(error.message || "getting error");
      set({
        error: error?.message || "Failed to fetch",
        isApiLoading: false,
      });
    }
  },
}));
