import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";
import { create } from "zustand";
import useContextStore from "../useContextStore";

const MODULEKEY1 = "flagGroup";

const useFlagManagerStore = create((set, get) => ({
  flagGroup: [],
  flags: [],
  flagGrouploading: false,
  flagGroupApiLoading: false,
  flagListLoading: false,
  flagListApiLoading: false,
  error: null,
  success: false,
  isModal: false,
  totalItems: null,
  totalFlagsItems: null,
  searchTerm: "",
  selectedGroup: null,
  selectedFlag: null,
  flagGroupId: null,

  setIsModal: (value) => set({ isModal: value }),
  setFlagGroupId: (value) => set({ flagGroupId: value }),
  setSelectedGroup: (value) => set({ selectedGroup: value }),
  setSelectedFlag: (value) => set({ selectedFlag: value }),

  // Add Flag Group
  addFlagGroup: async (payload) => {
    try {
      set({ flagGroupApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: "/flag-groups",
        data: payload,
      });

      set((state) => ({
        // flagGroup: [...state.flagGroup, res.data],
        flagGroupApiLoading: false,
        success: true,
        isModal: false,
      }));

      const str = useContextStore
        .getState()
        .createParamsStr({ page: 1, limit: 10 }, MODULEKEY1);
      get().getFlagGroups(str);

      toast.success(res.message || "Flag group created successfully");

      return res;
    } catch (error) {
      set({
        error: error.message,
        flagGroupApiLoading: false,
        success: false,
      });

      throw error;
    }
  },

  //Get Flag Groups
  getFlagGroups: async (str) => {
    try {
      set({ flagGrouploading: true, error: null, success: false });

      let url = `/flag-groups${str || ""}`;

      const res = await apiRequest({
        url: url,
      });

      set({
        flagGroup: res.data.items,
        flagGrouploading: false,
        success: true,
        isModal: false,
        totalItems: res.data.total,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        flagGrouploading: false,
        success: false,
      });

      throw error;
    }
  },

  // Delete Flag Group
  deleteFlagGroup: async ({ groupId }) => {
    try {
      set({ flagGroupApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/flag-groups/${groupId}`,
      });

      set((state) => ({
        flagGroup: state.flagGroup.filter((group) => group.id !== groupId),
        totalItems: state.totalItems ? state.totalItems - 1 : state.totalItems,
        flagGroupApiLoading: false,
        success: true,
        isModal: false,
        selectedGroup: null,
      }));

      toast.success(res.message || "Flag group deleted successfully");
    } catch (error) {
      set({
        error: error.message,
        flagGroupApiLoading: false,
        success: false,
      });
      toast.error(error.message || "error");

      throw error;
    }
  },

  //Edit Flag Group
  editFlagGroup: async (payload, id) => {
    try {
      set({ flagGroupApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/flag-groups/${id}`,
        data: payload,
      });

      set((state) => ({
        // flagGroup: state.flagGroup.map((group) =>
        //   group.id === payload.groupId ? res.data : group,
        // ),
        flagGroupApiLoading: false,
        success: true,
        isModal: false,
        selectedGroup: null,
      }));

      const str = useContextStore
        .getState()
        .createParamsStr({ page: 1, limit: 10 }, MODULEKEY1);
      get().getFlagGroups(str);

      toast.success(res.message || "Flag group updated successfully");
      return res;
    } catch (error) {
      set({
        error: error.message,
        flagGroupApiLoading: false,
        success: false,
      });
      toast.error(error.message || "error");

      throw error;
    }
  },

  //addFlag
  addFlag: async (payload, id) => {
    try {
      set({ flagListApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: `/flag-groups/${id}/flags`,
        data: payload,
      });

      set((state) => ({
        // flags: [res.data, ...state.flags],
        flagListApiLoading: false,
        success: true,
        isModal: false,
      }));

      const str = useContextStore
        .getState()
        .createParamsStr({ page: 1, limit: 10 }, MODULEKEY1);
      get().getFlags({ groupId: get().flagGroupId, str });

      toast.success(res.message || "");

      return res;
    } catch (error) {
      set({
        error: error.message,
        flagListApiLoading: false,
        success: false,
      });

      throw error;
    }
  },

  //UpdateFlag
  updateFlag: async (payload, flagId) => {
    try {
      set({ flagListApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/flags/${flagId}`,
        data: payload,
      });

      set((state) => ({
        // flags: state.flags.map((flag) =>
        //   flag.id === payload.flagId ? res.data : flag,
        // ),
        flagListApiLoading: false,
        selectedFlag: null,
        success: true,
        isModal: false,
        selectedFlag: null,
      }));

      const str = useContextStore
        .getState()
        .createParamsStr({ page: 1, limit: 10 }, MODULEKEY1);
      get().getFlags({ groupId: get().flagGroupId, str });

      toast.success(res.message || "");

      return res;
    } catch (error) {
      set({
        error: error.message,
        flagListApiLoading: false,
        success: false,
      });

      throw error;
    }
  },

  // Get Flag list
  getFlags: async (payload) => {
    try {
      set({ flagListLoading: true, error: null, success: false });

      let url = `/flag-groups/${payload.groupId}/flags${payload.str}`;

      if (payload.label) {
        url += `&label=${payload.label}`;
      }

      const res = await apiRequest({
        url: url,
      });

      set({
        flags: res.data.items,
        flagListLoading: false,
        success: true,
        isModal: false,
        totalFlagsItems: res.data.total,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        flagListLoading: false,
        success: false,
      });

      throw error;
    }
  },

  // delete flag
  deleteFlag: async (flagId) => {
    try {
      set({ flagListApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/flags/${flagId}`,
      });

      set((state) => ({
        flags: state.flags.filter((flag) => flag.id !== flagId),
        totalFlagsItems: state.totalFlagsItems
          ? state.totalFlagsItems - 1
          : state.totalFlagsItems,
        flagListApiLoading: false,
        success: true,
        isModal: false,
        selectedFlag: null,
      }));

      toast.success(res.message || "Flag deleted successfully");
    } catch (error) {
      set({
        error: error.message,
        flagListApiLoading: false,
        success: false,
      });
      toast.error(error.message || "error");

      throw error;
    }
  },
}));

export default useFlagManagerStore;
