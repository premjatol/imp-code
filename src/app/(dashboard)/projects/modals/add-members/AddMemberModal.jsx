"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal";
import Pagination from "@/components/common/pagination/Pagination";
import ClickPopup from "@/components/common/ClickPopup";
import { HiOutlineDotsVertical, HiOutlinePencil } from "react-icons/hi";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { FaFlag } from "react-icons/fa";
import Btn from "@/components/common/Btn";
import AddMember from "./AddMember";
import useProjectStore from "@/stores/project/useProjectStore";
import UpdateRoleModal from "./UpdateRoleModal";
import { MdOutlineDeleteSweep } from "react-icons/md";

export default function AddMemberModal({ projectId }) {
  const { t } = useTranslation();
  const activeButtonRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    isModalChild,
    setIsModalChild,
    members,
    getProjectMembers,
    isApiLoading,
    deleteMember,
    membersLoading,
  } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      getProjectMembers(projectId);
    }
  }, [projectId]);

  const [memberInfo, setMemberInfo] = useState(null);

  const toggleDropdown = (userId, buttonRef) => {
    activeButtonRef.current = buttonRef;
    setOpenMenuId((prev) => (prev === userId ? null : userId));
  };

  const deleteMemberFunc = async () => {
    await deleteMember(projectId, memberInfo?.id);
  };

  return (
    <>
      {/* <div className="overflow-y-auto h-[calc(100vh-226px)]"> */}
      <div className="px-4">
        <div className="flex justify-end">
          <Btn
            type="button"
            btnName="Add Members"
            className="w-fit! mt-2!"
            onClickFunc={() => setIsModalChild("ADD_MEMBER")}
          />
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-700 tracking-wider bg-slate-50/30 font-heading">
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {membersLoading ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-15 text-sm text-gray-500"
                >
                  Loading users list...
                </td>
              </tr>
            ) : members?.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="w-full text-center py-15 bg-white rounded-lg border-2 border-dashed border-gray-300"
                >
                  <FaFlag className="mx-auto text-4xl text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm">No user found</p>
                  <button
                    onClick={() => setIsModalChild("ADD_NEW_USER")}
                    className="mt-4 text-primary hover:text-blue-600 font-medium cursor-pointer"
                  >
                    Add first user
                  </button>
                </td>
              </tr>
            ) : (
              members?.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 text-xs font-semibold text-slate-900">
                    {`${m.user.first_name} ${m.user.last_name}`}
                  </td>
                  <td className="p-4 text-xs text-slate-600 font-medium">
                    {t(m.role)}
                  </td>
                  <td className="p-4 text-right relative">
                    <button
                      onClick={(e) => toggleDropdown(m.id, e.currentTarget)}
                      className="hover:text-(--foreground) cursor-pointer"
                    >
                      <HiOutlineDotsVertical className="w-3.5 h-3.5" />
                    </button>

                    {/* Actions dropdown */}
                    {openMenuId === m.id && (
                      <ClickPopup
                        optionsList={[
                          {
                            name: "Edit Role",
                            icon: <HiOutlinePencil />,
                            onClick: () => {
                              setMemberInfo(m);
                              setIsModalChild("EDIT_ROLE");
                            },
                          },
                          {
                            name: "Remove User",
                            icon: <MdOutlineDeleteSweep />,
                            onClick: () => {
                              setMemberInfo(m);
                              setIsModalChild("REMOVE_USER");
                            },
                            css: "text-red-600! hover:bg-red-200",
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

      {/* <Pagination
        totalItems={totalItems}
        currentPage={page}
        itemsPerPage={limit}
        onPageChange={(page) => setPage(page)}
        onItemsPerPageChange={(limit) => setLimit(limit)}
      /> */}

      {/* modals */}
      <Modal
        open={isModalChild === "ADD_MEMBER"}
        heading={"Add Members"}
        onClose={() => setIsModalChild(false)}
        width="600px"
      >
        <AddMember projectId={projectId} />
      </Modal>

      <Modal
        open={isModalChild === "EDIT_ROLE"}
        heading={"Edit Role"}
        onClose={() => setIsModalChild(false)}
        width="600px"
      >
        <UpdateRoleModal projectId={projectId} memberDetails={memberInfo} />
      </Modal>

      <Modal
        open={isModalChild === "REMOVE_USER"}
        heading="Remove user"
        onClose={() => setIsModalChild(false)}
        width="450px"
      >
        <ConfirmationModal
          title="Remove user"
          message="Are you sure you want to remove this user?"
          confirmText="Delete"
          cancelText="Cancel"
          variant={"danger"}
          onConfirm={deleteMemberFunc}
          isLoading={isApiLoading}
        />
      </Modal>
    </>
  );
}
