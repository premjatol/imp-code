import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";
import { create } from "zustand";

const useProfileStore = create((set, get) => ({
  isProfileApiLoading: false,
  userInfo: null,
  isModal: false,
  error: null,
  success: false,

  setIsModal: (value) => set({ isModal: value }),

  getUserInfo: async () => {
    try {
      set({ isProfileApiLoading: true, error: null });

      const res = await apiRequest({
        url: "profile",
      });

      set({
        userInfo: res.data,
        isProfileApiLoading: false,
      });
    } catch (error) {
      set({
        isProfileApiLoading: false,
        error: error.message,
      });
    }
  },

  updateProfile: async (formData) => {
    try {
      set({ isProfileApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PATCH",
        url: `/profile`,
        data: formData,
        isMultipart: true,
      });

      set((state) => ({
        userInfo: res.data,
        isProfileApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Profile updated successfully");

      return res;
    } catch (error) {
      set({
        error: error.message,
        isProfileApiLoading: false,
        success: false,
      });

      toast.error(error.message || "error");
      throw error;
    }
  },

  changePassoword: async (payload) => {
    try {
      set({ isProfileApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PATCH",
        url: `/profile/password`,
        data: payload,
      });

      set((state) => ({
        isProfileApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Password has updated successfully");

      return res;
    } catch (error) {
      set({
        error: error.message,
        isProfileApiLoading: false,
        success: false,
      });

      toast.error(error.message || "error");
      throw error;
    }
  },
}));

export default useProfileStore;
