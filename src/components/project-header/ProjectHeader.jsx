"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import NotificationBell from "../common/NotificationBell";
import Modal from "../Modal";
import { useTranslation } from "react-i18next";
import ProfileComp from "../common/profile/ProfileComp";
import EditUserModal from "../common/EditProfile";
import useProfileStore from "@/stores/profile/useProfileStore";
import ChangePassoword from "../common/profile/ChangePassoword";

export default function ProjectHeader() {
  const { isModal, setIsModal } = useProfileStore();

  const { t } = useTranslation();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-(--background) backdrop-blur-md border-b border-slate-200">
        <div className="w-full px-6 h-15 flex items-center justify-between">
          {/* LEFT SECTION: Logo & Menus */}
          <div className="flex items-center space-x-8">
            {/* Search bar */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-md border border-gray-300 py-1.5 pl-3 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <FiSearch
                size={12}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* RIGHT SECTION: Icons & Profile */}
          <div className="flex items-center space-x-3">
            <NotificationBell />

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {/* Profile Dropdown */}
            <ProfileComp />
          </div>
        </div>
      </header>

      {/* Modals */}
      <Modal
        open={isModal === "EDIT_PROFILE"}
        heading={"Edit profile"}
        onClose={() => setIsModal(false)}
        width="400px"
      >
        <EditUserModal />
      </Modal>

      <Modal
        open={isModal === "CHANGE_PASSWORD"}
        heading={"Change Password"}
        onClose={() => setIsModal(false)}
        width="400px"
      >
        <ChangePassoword />
      </Modal>
    </>
  );
}
