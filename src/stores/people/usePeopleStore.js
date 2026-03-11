import { create } from "zustand";
import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";

const usePeopleStore = create((set, get) => ({
  users: [],
  loading: false,
  isApiLoading: false,
  error: null,
  success: false,
  isModal: false,
  totalItems: null,
  page: 1,
  limit: 10,

  setIsModal: (value) => set({ isModal: value }),
  setPage: (value) => set({ page: value }),
  setLimit: (value) => set({ limit: value }),

  // Add User
  addUser: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: "/users",
        data: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phone: payload.phone,
          role: payload.role || "ACCOUNT_OWNER",
        },
      });

      set((state) => ({
        users: [res.data, ...state.users],
        isApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "User added successfully");

      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });
      toast.error(error.message || "Failed to add user");
      throw error;
    }
  },

  //Get users
  getUsers: async (str) => {
    try {
      set({ loading: true, error: null, success: false });

      const res = await apiRequest({
        url: `/users${str || ""}`,
      });

      set({
        users: res.data.items,
        loading: false,
        success: true,
        isModal: false,
        totalItems: res.data.total,
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

  //Edit user
  editUser: async (userId, payload) => {
    try {
      set({ loading: true, error: null, success: false });

      const formData = new FormData();

      if (payload.firstName) formData.append("firstName", payload.firstName);
      if (payload.lastName) formData.append("lastName", payload.lastName);
      if (payload.phone) formData.append("phone", payload.phone);
      if (payload.role) formData.append("role", payload.role);

      if (payload.profileImage instanceof File) {
        formData.append("profileImage", payload.profileImage);
      }

      const res = await apiRequest({
        method: "PATCH",
        url: `/users/${userId}`,
        data: formData,
        isMultipart: true,
      });

      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? res.data : user,
        ),
        loading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "User updated successfully");
      return res;
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        success: false,
      });

      toast.error(error.message || "Failed to edit user");
      throw error;
    }
  },

  //update user status
  updateStatus: async ({ userId, accountStatus }) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PATCH",
        url: `/users/${userId}/status`,
        data: { accountStatus },
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Status updated successfully");

      await get().getUsers();
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
}));

export default usePeopleStore;
