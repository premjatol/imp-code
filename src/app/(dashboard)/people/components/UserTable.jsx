"use client";

import { HiCheckCircle, HiClock } from "react-icons/hi";
import { useSelectableList } from "@/hooks/useSelectableList";
import usePeopleStore from "@/stores/people/usePeopleStore";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal";
import ChangePassoword from "../modals/ChangePassoword";
import ChangeEmail from "../modals/ChangeEmail";
import Pagination from "@/components/common/pagination/Pagination";
import useContextStore from "@/stores/useContextStore";
import ClickPopup from "@/components/common/ClickPopup";
import {
  HiOutlineDotsVertical,
  HiOutlinePencil,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import EditUserModal from "../modals/EditUserModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { FaFlag } from "react-icons/fa";

export default function UserTable({}) {
  const {
    isModal,
    setIsModal,
    users,
    totalItems,
    isApiLoading,
    loading,
    updateStatus,
    page,
    setPage,
    limit,
    setLimit,
  } = usePeopleStore();

  const { t } = useTranslation();
  const activeButtonRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const MODULEKEY = "people";

  const {
    selected,
    allSelected,
    selectAllRef,
    toggleSelectAll,
    toggleSelectOne,
  } = useSelectableList(users);

  const [userInfo, setUserInfo] = useState(null);

  const toggleDropdown = (userId, buttonRef) => {
    activeButtonRef.current = buttonRef;
    setOpenMenuId((prev) => (prev === userId ? null : userId));
  };

  const handleUpdate = async () => {
    try {
      await updateStatus({
        userId: userInfo.id,
        accountStatus:
          userInfo.account_status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      });
    } catch (error) {}
  };

  return (
    <>
      <div className="overflow-y-auto h-[calc(100vh-226px)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-700 tracking-wider bg-slate-50/30 font-heading">
              <th className="p-4 w-12">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  className="accent-blue-600"
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4">Projects</th>
              <th className="p-4">Account Role</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-15 text-sm text-gray-500"
                >
                  Loading users list...
                </td>
              </tr>
            ) : users?.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="w-full text-center py-15 bg-white rounded-lg border-2 border-dashed border-gray-300"
                >
                  <FaFlag className="mx-auto text-4xl text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm">No user found</p>
                  <button
                    onClick={() => setIsModal("ADD_NEW_USER")}
                    className="mt-4 text-primary hover:text-blue-600 font-medium cursor-pointer"
                  >
                    Add first user
                  </button>
                </td>
              </tr>
            ) : (
              users?.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      checked={selected.includes(user.id)}
                      onChange={() => toggleSelectOne(user.id)}
                    />
                  </td>
                  <td className="p-4 text-xs font-semibold text-slate-900">
                    {`${user.first_name} ${user.last_name}`}
                  </td>
                  <td className="p-4 text-xs text-primary font-medium hover:underline cursor-pointer">
                    {user.email}
                  </td>
                  <td className="p-4 text-xs text-slate-500 font-mono tracking-tighter">
                    {user.phone}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="group relative flex items-center w-fit">
                      {/* Status Badge */}
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-colors
                    ${
                      user.account_status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                      >
                        {user.account_status === "ACTIVE" ? (
                          <HiCheckCircle className="text-sm" />
                        ) : (
                          <HiClock className="text-sm" />
                        )}
                        {user.account_status}
                      </div>
                      <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-gray-800 text-white text-[10px] rounded shadow-xl whitespace-nowrap z-20">
                        {user.account_status === "ACTIVE"
                          ? "Identity and email verified"
                          : "Waiting for user to accept invitation"}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-800" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs ">
                    <button
                      // onClick={() => setIsModal("REMOVE_PROJECTS")}
                      className="text-primary font-bold hover:underline cursor-pointer"
                    >
                      {user.projects || "NA"}
                    </button>
                  </td>
                  <td className="p-4 text-xs text-slate-600 font-medium">
                    {user.role}
                  </td>
                  <td className="p-4 text-right relative">
                    <button
                      onClick={(e) => toggleDropdown(user.id, e.currentTarget)}
                      className="hover:text-(--foreground) cursor-pointer"
                    >
                      <HiOutlineDotsVertical className="w-3.5 h-3.5" />
                    </button>

                    {/* Actions dropdown */}
                    {openMenuId === user.id && (
                      <ClickPopup
                        optionsList={[
                          {
                            name: "Edit Profile",
                            icon: <HiOutlinePencil />,
                            onClick: () => {
                              setUserInfo(user);
                              setIsModal("EDIT_PROFILE");
                            },
                          },
                          // {
                          //   name: "Change Password",
                          //   icon: <TbLockPassword />,
                          //   onClick: () => setIsModal("CHANGE_PASSWORD"),
                          //   lineBreak: true,
                          // },
                          {
                            name: `${user.account_status === "ACTIVE" ? "Inactive" : "Active"}`,
                            icon: <HiOutlineCheckCircle />,
                            onClick: () => {
                              setIsModal("UPDATE_STATUS");
                              setUserInfo(user);
                            },
                            css: `${user.account_status === "ACTIVE" ? "text-red-600! hover:bg-red-200" : "text-green-600! hover:bg-green-200"}`,
                          },
                        ]}
                        startFrom="right"
                        buttonRef={activeButtonRef}
                        onClose={() => setOpenMenuId(null)}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={totalItems}
        currentPage={page}
        itemsPerPage={limit}
        onPageChange={(page) => setPage(page)}
        onItemsPerPageChange={(limit) => setLimit(limit)}
      />

      {/* modals */}
      <Modal
        open={isModal === "EDIT_PROFILE"}
        heading={t("EDIT_PROFILE")}
        onClose={() => setIsModal(false)}
        width="500px"
      >
        <EditUserModal
          onclose={() => setIsModal(false)}
          isEditMode={isModal === "EDIT_PROFILE"}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      </Modal>

      <Modal
        open={isModal === "CHANGE_EMAIL"}
        heading={t("CHANGE_EMAIL")}
        onClose={() => setIsModal(false)}
        width="400px"
      >
        <ChangeEmail />
      </Modal>

      <Modal
        open={isModal === "CHANGE_PASSWORD"}
        heading={t("CHANGE_PASSWORD")}
        onClose={() => setIsModal(false)}
        width="400px"
      >
        <ChangePassoword />
      </Modal>

      <Modal
        open={isModal === "UPDATE_STATUS"}
        heading="Update Status"
        onClose={() => setIsModal(false)}
        width="450px"
      >
        <ConfirmationModal
          title="Update Status"
          message="Are you sure you want to update the status?"
          confirmText="Update"
          cancelText="Cancel"
          variant={userInfo?.account_status === "ACTIVE" ? "danger" : "success"}
          onConfirm={handleUpdate}
          isLoading={isApiLoading}
          // userStatus={userInfo}
        />
      </Modal>
    </>
  );
}
