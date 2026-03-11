import { create } from "zustand";
import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";
import useContextStore from "../useContextStore";
import useProjectStore from "./useProjectStore";

const MODULEKEY = "projects";

const useProjectWorkflowStore = create((set, get) => ({
  workflows: [],
  workFlowDetails: null,
  statuses: [],
  transitions: [],
  loading: false,
  isApiLoading: false,
  error: null,
  success: false,
  isModal: false,
  totalItems: null,
  flagMappingStatusList: [],
  flagMappingStatusLoading: false,

  setIsModal: (value) => set({ isModal: value }),

  // Seed Project Workflow
  seedWorkflow: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: `/projects/${payload.projectId}/workflow/seed`,
      });

      set((state) => ({
        workflows: [res.data, ...state.workflows],
        isApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Workflow seeded successfully");
      //   await get().getWorkflows();
      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });
      toast.error(error.message || "Failed to seed workflow");
      throw error;
    }
  },

  //Get project workflows
  getWorkflows: async (payload) => {
    try {
      set({ loading: true, error: null, success: false });

      const res = await apiRequest({
        url: `/projects/${payload.projectId}/workflow`,
      });

      set({
        workflows: res.data.workflow,
        workFlowDetails: res.data.workflow,
        statuses: res.data.statuses,
        transitions: res.data.transitions,
        loading: false,
        success: true,
        isModal: false,
      });

      return res.data.workflow;
    } catch (error) {
      set({
        workflows: [],
        error: error.message,
        loading: false,
        success: false,
      });

      throw error;
    }
  },

  //Get Flag mapping status list
  getFlagMappingStatusList: async (payload) => {
    try {
      set({ flagMappingStatusLoading: true, error: null, success: false });

      const res = await apiRequest({
        url: `/projects/${payload.projectId}/workflow/flag-mappings`,
      });

      set({
        flagMappingStatusList: res.data,
        flagMappingStatusLoading: false,
        success: true,
        isModal: false,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        flagMappingStatusLoading: false,
        success: false,
      });

      throw error;
    }
  },

  //Bulk update flag group mappings
  updateFlagGropMapping: async (payload, projectId) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/projects/${projectId}/workflow/flag-mappings`,
        data: payload,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Flag mapping updated successfully");
      await useProjectStore.getState().getProjects();

      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to update Flag mapping");
      throw error;
    }
  },
}));

export default useProjectWorkflowStore;
