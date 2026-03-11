"use client";

import { useEffect, useRef, useState } from "react";
import { HiOutlineSearch, HiOutlineDownload, HiPlus } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal";
import RemoveProject from "../modals/RemoveProject";
import AddUserModal from "../modals/AddUserModal";
import InviteToProject from "../modals/InviteToProject";
import usePeopleStore from "@/stores/people/usePeopleStore";
import DynamicSelect from "@/components/common/DynamicSelect";
import useContextStore from "@/stores/useContextStore";

export default function TableToolbar() {
  const { isModal, setIsModal, getUsers, page, limit } = usePeopleStore();

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const MODULEKEY = "people";

  const { t } = useTranslation();

  const createParamsStr = useContextStore((state) => state.createParamsStr);

  useEffect(() => {
    const filters = {
      page,
      limit,
    };

    // Handle Status
    if (selectedStatus?.value && selectedStatus.value !== "ALL") {
      filters.accountStatus = selectedStatus.value;
    } else {
      filters.accountStatus = "";
    }

    // Handle Role
    if (selectedRole?.value && selectedRole.value !== "ALL") {
      filters.role = selectedRole.value;
    } else {
      filters.role = "";
    }

    // Handle Search
    if (searchTerm) {
      filters.q = searchTerm;
    } else {
      filters.q = "";
    }

    const query = createParamsStr(filters, MODULEKEY);

    if (query) {
      getUsers(query);
    }
  }, [page, limit, selectedStatus, selectedRole, searchTerm]);

  return (
    <>
      <div className="p-4 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 border-b border-slate-300">
        <div className="flex items-center gap-2">
          {/* <NewUserDropdown setIsModal={setIsModal} />*/}

          <button
            onClick={() => setIsModal("ADD_NEW_USER")}
            className="flex items-center px-4 py-2 bg-primary hover:opacity-90 text-white rounded-lg font-bold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <HiPlus className="w-4.5 h-4.5 mr-1" />
            New users
          </button>

          {/* <button
            onClick={() => setIsModal("INVITE_TO_PROJECT")}
            className="flex items-center border border-gray-300 hover:border-primary dark:border-gray-600 px-4 py-2 rounded-lg text-xs hover:bg-primary-100 dark:hover:bg-gray-900 cursor-pointer hover:text-primary"
          >
            Invite to project
          </button> */}
        </div>

        <div className="flex items-center gap-2">
          {/* status */}
          <DynamicSelect
            options={[
              { value: "ALL", label: "All" },
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
            ]}
            value={selectedStatus || { value: "ALL", label: "All" }}
            onChange={(option) => setSelectedStatus(option)}
            placeholder="Select Status"
          />

          {/* Role */}
          <DynamicSelect
            options={[
              { label: "All Users", value: "ALL" },
              { label: "Account Owner", value: "ACCOUNT_OWNER" },
              { label: "Admin", value: "ADMIN" },
              { label: "Project Manager", value: "PROJECT_MANAGER" },
              { label: "Member", value: "MEMBER" },
              { label: "Viewer", value: "VIEWER" },
            ]}
            placeholder="All users (0)"
            value={selectedRole || { label: "All Users", value: "ALL" }}
            onChange={(option) => setSelectedRole(option)}
            className="min-w-30 cursor-pointer"
          />

          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-(--background) border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-100 w-60 text-slate-900"
            />
          </div>
          {/* <button className="flex items-center px-4 py-2 bg-(--background) border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
            <HiOutlineDownload className="w-4 h-4 mr-2 text-slate-400" />
            Export user list
          </button> */}
        </div>
      </div>

      {/* modals */}
      <Modal
        open={isModal === "REMOVE_PROJECTS"}
        heading={`${t("REMOVE_PROJECTS")}: PPrakriti Jain`}
        onClose={() => setIsModal(false)}
        width="500px"
      >
        <RemoveProject />
      </Modal>

      <Modal
        open={isModal === "ADD_NEW_USER"}
        heading={t("ADD_NEW_USER")}
        onClose={() => setIsModal(false)}
        width="500px"
      >
        <AddUserModal onclose={() => setIsModal(false)} />
      </Modal>

      <Modal
        open={isModal === "INVITE_TO_PROJECT"}
        heading={t("INVITE_TO_PROJECT")}
        onClose={() => setIsModal(false)}
        width="500px"
      >
        <InviteToProject />
      </Modal>
    </>
  );
}
