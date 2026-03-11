"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useProfileStore from "@/stores/profile/useProfileStore";
import { useEffect } from "react";
import Cookies from "js-cookie";
import useAuthStore from "@/stores/auth/useAuthStore";

export default function ClientProvider({ children }) {
  const { accessToken } = useAuthStore();
  const { getUserInfo } = useProfileStore();

  const refresh_token = Cookies.get("refresh_token") || null;
  const device_id = Cookies.get("device_id") || null;

  useEffect(() => {
    if (refresh_token || device_id || accessToken) {
      getUserInfo();
    }
  }, [refresh_token, device_id, accessToken]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}{" "}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={3}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Flip}
        style={{ zIndex: 999999999999 }}
      />
    </I18nextProvider>
  );
}
