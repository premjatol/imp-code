"use client";

import ClickPopup from "@/components/common/ClickPopup";
import { useSelectableList } from "@/hooks/useSelectableList";
import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { HiOutlineDotsVertical, HiOutlineTrash } from "react-icons/hi";

const UsersList = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const activeButtonRef = useRef(null);

  // action menu state
  const [openMenuId, setOpenMenuId] = useState(null);

  const users = [
    {
      id: 1,
      name: "Beth Engineer",
      email: "beth@fieldwire.net",
      phone: "—",
      role: "Admin",
    },
    {
      id: 2,
      name: "Bob Super",
      email: "bob@fieldwire.net",
      phone: "1234567890",
      role: "PM",
    },
    {
      id: 3,
      name: "James Foreman",
      email: "james@fieldwire.net",
      phone: "1234567890",
      role: "Lead",
    },
    {
      id: 4,
      name: "John Smith",
      email: "john@fieldwire.net",
      phone: "5555555555",
      role: "Installer",
    },
    {
      id: 5,
      name: "Katie Client",
      email: "katie@fieldwire.net",
      phone: "—",
      role: "Client",
    },
    {
      id: 6,
      name: "Prakriti Jain",
      email: "prakriti.jain@waysandmeanstechnology...",
      phone: "+91 096020 00408",
      role: "Admin",
    },
  ];

  const {
    selected,
    allSelected,
    selectAllRef,
    toggleSelectAll,
    toggleSelectOne,
  } = useSelectableList(users);

  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate =
      selectedUsers.length > 0 && selectedUsers.length < users.length;
  }, [selectedUsers, users.length]);

  const toggleDropdown = (userId, buttonEl) => {
    activeButtonRef.current = buttonEl;
    setOpenMenuId((prev) => (prev === userId ? null : userId));
  };

  return (
    <div className="w-full font-sans">
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-700 text-xs font-semibold">
              <th className="p-3 w-10 text-center">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  className="accent-blue-600"
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-3">
                <div className="flex items-center gap-2 cursor-pointer">
                  Name <FaChevronDown size={10} className="text-gray-400" />
                </div>
              </th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Project Role</th>
              <th className="p-3 w-10" />
            </tr>
          </thead>

          <tbody className="text-xs text-gray-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={selected.includes(user.id)}
                    onChange={() => toggleSelectOne(user.id)}
                  />
                </td>

                <td className="p-3 text-gray-600">{user.name}</td>
                <td className="p-3 text-gray-600">{user.email}</td>
                <td className="p-3 text-gray-600">{user.phone}</td>
                <td className="p-3 text-gray-400">{user.role}</td>

                <td className="p-3 text-center relative">
                  <button
                    onClick={(e) => toggleDropdown(user.id, e.currentTarget)}
                    className="hover:text-gray-700 cursor-pointer"
                  >
                    <HiOutlineDotsVertical className="w-3.5 h-3.5" />
                  </button>

                  {openMenuId === user.id && (
                    <ClickPopup
                      optionsList={[
                        {
                          name: "Delete user",
                          icon: <HiOutlineTrash className="w-4 h-4" />,
                          css: "text-red-600!",
                        },
                      ]}
                      startFrom="right"
                      buttonRef={activeButtonRef}
                      onClose={() => setOpenMenuId(null)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
