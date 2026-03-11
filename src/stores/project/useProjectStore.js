import { create } from "zustand";
import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";
import useContextStore from "../useContextStore";

const MODULEKEY = "projects";

const useProjectStore = create((set, get) => ({
  projects: [],
  loading: false,
  isApiLoading: false,
  error: null,
  success: false,
  isModal: false,
  totalItems: null,

  members: [],
  users: [],
  userListLoading: false,
  isModalChild: false,

  setIsModal: (value) => set({ isModal: value }),
  setIsModalChild: (value) => set({ isModalChild: value }),

  // Add Project
  addProject: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: "/projects",
        data: {
          name: payload.name,
          description: payload.description,
        },
      });

      set((state) => ({
        projects: [res.data, ...state.projects],
        isApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Project added successfully");
      await get().getProjects();
      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });
      toast.error(error.message || "Failed to add project");
      throw error;
    }
  },

  //Get projects
  getProjects: async (str) => {
    try {
      set({ loading: true, error: null, success: false });

      const res = await apiRequest({
        url: `/projects${str || ""}`,
      });

      set({
        projects: res.data,
        loading: false,
        success: true,
        isModal: false,
        totalItems: res.pagination.total,
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

  //Edit Project
  editProject: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/projects/${payload.id}`,
        data: {
          name: payload.name,
          description: payload.description,
        },
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      const str = useContextStore.getState().createParamsStr({}, MODULEKEY);

      await get().getProjects(str);

      toast.success(res.message || "Project updated successfully");
      return res;
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        success: false,
      });

      toast.error(error.message || "Failed to edit project");
      throw error;
    }
  },

  //Update project status
  updateStatus: async ({ projectId, is_active }) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PATCH",
        url: `/projects/${projectId}/status`,
        data: { is_active },
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Status updated successfully");

      await get().getProjects();
      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to update status");
      throw error;
    }
  },

  //Delete project
  deleteProject: async ({ projectId }) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/projects/${projectId}`,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Status updated successfully");

      await get().getProjects();
      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to update status");
      throw error;
    }
  },

  // Get All Users
  getUsers: async (page = 1, limit = 10) => {
    try {
      set({ userListLoading: true });

      const res = await apiRequest({
        url: `/users?page=${page}&limit=${limit}`,
      });

      set({
        users: res.data.items,
        userListLoading: false,
      });

      return res;
    } catch (error) {
      set({ userListLoading: false });
      toast.error(error.message);
      throw error;
    }
  },

  // Get Project Members
  getProjectMembers: async (projectId) => {
    try {
      set({ membersLoading: true });

      const res = await apiRequest({
        url: `/projects/${projectId}/members`,
      });

      set({
        members: res.data,
        membersLoading: false,
      });

      return res;
    } catch (error) {
      set({ membersLoading: false });
      toast.error(error.message);
      throw error;
    }
  },

  // Add Members
  addProjectMembers: async (projectId, members) => {
    try {
      set({ isApiLoading: true });

      const res = await apiRequest({
        method: "POST",
        url: `/projects/${projectId}/members`,
        data: { members },
      });

      toast.success("Members added successfully");
      set({ isApiLoading: false, isModalChild: false });

      await get().getProjectMembers(projectId);
      return res;
    } catch (error) {
      set({ isApiLoading: false, isModalChild: false });
      toast.error(error.message);
      throw error;
    }
  },

  // Update Member Role
  updateMemberRole: async (projectId, memberId, role) => {
    try {
      set({ isApiLoading: true });
      const res = await apiRequest({
        method: "PUT",
        url: `/projects/${projectId}/members/${memberId}`,
        data: { role },
      });

      toast.success("Role updated");
      set({ isApiLoading: false, isModalChild: false });
      await get().getProjectMembers(projectId);
      return res;
    } catch (error) {
      toast.error(error.message);
      set({ isApiLoading: false, isModalChild: false });
      throw error;
    }
  },

  // Delete Member
  deleteMember: async (projectId, memberId) => {
    try {
      set({ isApiLoading: true });

      const res = await apiRequest({
        method: "DELETE",
        url: `/projects/${projectId}/members/${memberId}`,
      });

      toast.success("Member removed");
      set({ isApiLoading: false, isModalChild: false });
      await get().getProjectMembers(projectId);
      return res;
    } catch (error) {
      toast.error(error.message);
      set({ isApiLoading: false, isModalChild: false });
      throw error;
    }
  },
}));

export default useProjectStore;
