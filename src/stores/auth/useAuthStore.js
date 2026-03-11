import { create } from "zustand";
import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  loading: false,
  error: null,

  // 🔹 LOGIN
  login: async ({ email, password, device_id }, router) => {
    try {
      set({ loading: true, error: null });

      const res = await apiRequest({
        method: "POST",
        url: "/auth/login",
        data: { email, password, device_id },
      });

      // Store access token in memory
      set({
        user: res.data.user,
        accessToken: res.data.access_token,
        loading: false,
      });

      // Set access and refresh tokens
      Cookies.set("access_token", res.data.access_token, { path: "/" });
      Cookies.set("refresh_token", res.data.refresh_token, { path: "/" });

      // Optional: store user info (not sensitive) in cookie
      Cookies.set("user", res.data.user ? JSON.stringify(res.data.user) : "", {
        path: "/",
      });

      // Optional: device_id
      Cookies.set("device_id", device_id, { path: "/" });

      toast.success(res.message || "Login Successful");

      router.push("/projects");
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Login failed",
      });
      toast.error(error.message || "Login failed");
    }
  },

  // 🔹 LOGOUT
  logout: (router) => {
    // Clear all cookies

    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });
    Cookies.remove("user", { path: "/" });
    Cookies.remove("device_id", { path: "/" });

    // Reset auth state
    set({
      user: null,
      accessToken: null,
      error: null,
    });

    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  //Current User Details
  currentUserDetails: async () => {
    try {
      set({ loading: true, error: null });

      const res = await apiRequest({
        url: "/auth/me",
      });

      set({
        user: res.data.user,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message,
      });
    }
  },

  //Verify Email
  verifyEmail: async ({ token }) => {
    try {
      set({ loading: true, error: null });

      const res = await apiRequest({
        method: "POST",
        url: "/auth/verify-email",
        data: { token },
      });

      set({ loading: false });
      toast.success(res.message || "Email verified successfully");
    } catch (error) {
      set({
        loading: false,
        error: error.message,
      });
      toast.error(error.message || "Email verification failed");
    }
  },

  //set-password
  setPassword: async (payload, router) => {
    try {
      set({ loading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: "/users/set-password",
        data: {
          token: payload.token,
          password: payload.password,
        },
      });

      set({
        loading: false,
        success: true,
        isModal: false,
      });
      toast.success(res.message || "Password set successfully");
      router.push("/login");
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        success: false,
      });
      toast.error(error.message || "Failed to set password");

      throw error;
    }
  },

  //forgot password
  forgotPassword: async (payload, router) => {
    try {
      set({ loading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: "/auth/forgot-password",
        data: {
          email: payload.email,
        },
      });

      set({
        loading: false,
        success: true,
        isModal: false,
      });
      toast.success(res.message || "Password reset successfully");
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        success: false,
      });
      toast.error(error.message || "Failed to reset password");

      throw error;
    }
  },

  //reset password
  resetPassword: async (payload, router) => {
    try {
      set({ loading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: "/auth/reset-password",
        data: {
          token: payload.token,
          newPassword: payload.newPassword,
        },
      });

      set({
        loading: false,
        success: true,
        isModal: false,
      });
      toast.success(res.message || "Password reset successfully");
      router.push("/login");
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        success: false,
      });
      toast.error(error.message || "Failed to reset password");

      throw error;
    }
  },

  // 🔹 Clear Error (optional helper)
  clearError: () => set({ error: null, success: false }),
}));

export default useAuthStore;
