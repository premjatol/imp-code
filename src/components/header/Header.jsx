"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Modal from "../Modal";
import NotificationBell from "../common/NotificationBell";
import ProfileComp from "../common/profile/ProfileComp";
import useProfileStore from "@/stores/profile/useProfileStore";
import EditUserModal from "../common/EditProfile";
import ChangePassoword from "../common/profile/ChangePassoword";

export default function AppHeader() {
  const { isModal, setIsModal } = useProfileStore();
  const pathname = usePathname();

  const navItems = [
    { name: "Projects", path: "/projects" },
    { name: "People", path: "/people" },
    // { name: "Templates", path: "/templates" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-(--background) backdrop-blur-md border-b border-slate-300 shadow-sm">
        <div className="max-w-360 mx-auto px-6 h-16 flex items-center justify-between">
          {/* LEFT SECTION: Logo & Menus */}
          <div className="flex items-center space-x-8">
            {/* Logo Placeholder */}
            <div className="w-37.5 flex items-center">
              <div className="text-xl leading-5 font-bold font-heading tracking-tighter text-(--foreground) flex items-center gap-1">
                <img src="images/fieldwirelogo.svg" alt="" width={40} /> CUSTOM
                FIELDWIRE
              </div>
            </div>

            {/* Nav Items */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`px-4 py-2 text-sm font-semibold transition-all rounded-xl cursor-pointer
                    ${
                      isActive
                        ? "text-primary"
                        : "text-slate-600 hover:text-primary hover:bg-slate-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* RIGHT SECTION: Icons & Profile */}
          <div className="flex items-center space-x-3">
            {/* <LanguageSelector /> */}

            {/* Notification Icon */}
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
