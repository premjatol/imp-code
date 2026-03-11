import { toast } from "react-toastify";
import { create } from "zustand";
import useContextStore from "../useContextStore";
import { apiRequest } from "@/lib/apiHandler/apiRequest";

const MODULEKEY = "statusManager";

const useStatusManagerStore = create((set, get) => ({
  isModal: false,
  isLoading: false,
  isApiLoading: false,
  isTemplateLoading: false,
  error: null,
  success: false,
  templates: [],
  totalItems: null,
  selectedTemplate: null,
  statusList: [],
  transitionList: [],
  selectedStatus: null,

  setIsModal: (value) => set({ isModal: value }),
  setSelectedTemplate: (value) => set({ selectedTemplate: value }),
  setSelectedStatus: (value) => set({ selectedStatus: value }),

  createTemplate: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: "/workflow-templates",
        data: payload,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Template created successfully");
      const str = useContextStore.getState().createParamsStr({}, MODULEKEY);
      await get().getTemplates(str);

      return res;
    } catch (error) {
      toast.error(error.message || "getting error");
      set({
        isApiLoading: false,
        error: error.message,
        success: false,
      });

      throw error;
    }
  },

  //Get templates
  getTemplates: async (str) => {
    try {
      set({ isLoading: true, error: null, success: false });

      let url = `/workflow-templates${str}`;

      const res = await apiRequest({
        url: url,
      });

      const items = res.data.items || [];

      set({
        templates: items,
        isLoading: false,
        success: true,
        isModal: false,
        totalItems: res.data.total,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
        success: false,
      });

      throw error;
    }
  },

  // update template
  updateTemplate: async (payload, id) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: "/workflow-templates/" + id,
        data: payload,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Template updated successfully");
      const str = useContextStore.getState().createParamsStr({}, MODULEKEY);
      await get().getTemplates(str);

      return res;
    } catch (error) {
      toast.error(error.message || "getting error");
      set({
        isApiLoading: false,
        error: error.message,
        success: false,
      });

      throw error;
    }
  },

  // get template details
  fecthWorkflowTemplateDetails: async (id) => {
    try {
      set({ isTemplateLoading: true, error: null, success: false });

      let url = `/workflow-templates/${id}`;

      const res = await apiRequest({
        url: url,
      });

      set({
        selectedTemplate: res.data,
        transitionList: res.data.transitions,
        statusList: res.data.statuses,
        isTemplateLoading: false,
        success: true,
        isModal: false,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        isTemplateLoading: false,
        success: false,
      });

      throw error;
    }
  },

  // addStatus
  addStatus: async (payload, id) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: `/workflow-templates/${id}/statuses`,
        data: payload,
      });

      set({
        statusList: [res.data, ...get().statusList],
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Template created successfully");

      return res;
    } catch (error) {
      toast.error(error.message || "Getting error");

      set({
        isApiLoading: false,
        error: error.message,
        success: false,
      });

      throw error;
    }
  },

  // Edit status
  editStatus: async (payload, id) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/workflow-template-statuses/${id}`,
        data: payload,
      });

      set((state) => ({
        statusList: state.statusList.map((item) =>
          item.id === id ? { ...item, ...res.data } : item,
        ),
        isApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Template updated successfully");
      return res;
    } catch (error) {
      toast.error(error.message || "Getting error");

      set({
        isApiLoading: false,
        error: error.message,
        success: false,
      });

      throw error;
    }
  },

  // delete status
  deleteStatus: async (id) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/workflow-template-statuses/${id}`,
      });

      set((state) => ({
        statusList: state.statusList.filter((item) => item.id !== id),
        isApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Status deleted successfully");

      return res;
    } catch (error) {
      toast.error(error.message || "Getting error");

      set({
        isApiLoading: false,
        error: error.message,
        success: false,
      });

      throw error;
    }
  },

  // add transition
  addTransition: async (payload, id) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: `/workflow-templates/${id}/transitions`,
        data: payload,
      });

      set({
        transitionList: [res.data, ...get().transitionList],
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Transition added successfully");

      return res;
    } catch (error) {
      toast.error(error.message || "Getting error");

      set({
        isApiLoading: false,
        error: error.message,
        success: false,
      });

      throw error;
    }
  },

  // Active/Inactive for transition
  transitionStatusUpdate: async (id, value) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/workflow-template-transitions/${id}`,
        data: {
          is_active: value,
        },
      });

      set((state) => ({
        transitionList: state.transitionList.map((item) =>
          item.id === id ? { ...item, ...res.data } : item,
        ),
        isApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Transition status updated successfully");

      return res;
    } catch (error) {
      toast.error(error.message || "Getting error");

      set({
        isApiLoading: false,
        error: error.message,
        success: false,
      });

      throw error;
    }
  },

  // delete transition
  deleteTransition: async (id) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/workflow-template-transitions/${id}`,
      });

      set((state) => ({
        transitionList: state.transitionList.filter((item) => item.id !== id),
        isApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Transition deleted successfully");

      return res;
    } catch (error) {
      toast.error(error.message || "Getting error");

      set({
        isApiLoading: false,
        error: error.message,
        success: false,
      });

      throw error;
    }
  },
}));

export default useStatusManagerStore;
