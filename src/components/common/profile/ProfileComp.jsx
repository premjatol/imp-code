"use client";

import useAuthStore from "@/stores/auth/useAuthStore";
import useProfileStore from "@/stores/profile/useProfileStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HiOutlineChevronDown,
  HiOutlineLogout,
  HiOutlineUser,
} from "react-icons/hi";
import { MdPassword } from "react-icons/md";

export default function ProfileComp() {
  const { setIsModal, userInfo } = useProfileStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const { logout } = useAuthStore();

  const { t } = useTranslation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-2 p-1 pl-2 pr-1 rounded-full border border-slate-200 hover:border-slate-400 bg-(--background) transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-linear-to-tr from--primary) to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {userInfo?.profile_image_url ? (
              <img
                src={
                  process.env.NEXT_PUBLIC_IMAGE_URL +
                  userInfo?.profile_image_url
                }
                alt=""
                className="w-full"
              />
            ) : (
              <span>
                {(userInfo?.first_name?.charAt(0) || "") +
                  (userInfo?.last_name?.charAt(0) || "")}
              </span>
            )}
          </div>
          <HiOutlineChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute top-full right-0 mt-1 w-64 bg-(--background) border border-slate-300 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <div className="p-6 pb-0 bg-slate-50/50 border-b border-slate-100">
              <p className="text-xs font-bold text-(--foreground)">
                {userInfo?.first_name || "Your Name"}
              </p>
              <p
                className="text-xs text-slate-500 mb-2 truncate"
                title={userInfo?.email || "yourEmail@email.com"}
              >
                {userInfo?.email || "yourEmail@email.com"}
              </p>
            </div>

            <div className="p-2 pt-0 border-t border-slate-100 bg-slate-50/30">
              <button
                onClick={() => setIsModal("EDIT_PROFILE")}
                className="w-full flex items-center px-3 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors cursor-pointer"
              >
                <HiOutlineUser className="w-4 h-4 mr-3" />
                Edit Profile
              </button>

              <button
                onClick={() => setIsModal("CHANGE_PASSWORD")}
                className="w-full flex items-center px-3 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors cursor-pointer"
              >
                <MdPassword className="w-4 h-4 mr-3" />
                Change Password
              </button>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  logout(router);
                }}
                className="w-full flex items-center px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <HiOutlineLogout className="w-4 h-4 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
