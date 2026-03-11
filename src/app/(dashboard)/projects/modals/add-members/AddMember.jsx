import Btn from "@/components/common/Btn";
import useProjectStore from "@/stores/project/useProjectStore";
import React, { useEffect, useState } from "react";
import { FaUserPlus, FaCheck, FaUsers, FaUserCheck } from "react-icons/fa";

export default function AddMember({ projectId }) {
  const {
    users,
    getUsers,
    addProjectMembers,
    isApiLoading,
    userListLoading,
    members,
  } = useProjectStore();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const roleEnums = ["PM", "SUPERVISOR", "MEMBER"];

  useEffect(() => {
    getUsers();
  }, []);

  const handleAddMembers = async () => {
    if (!selectedUsers.length) return;
    await addProjectMembers(projectId, selectedUsers);
    setSelectedUsers([]);
  };

  const handleSelectUser = (user) => {
    if (selectedUsers.some((u) => u.user_id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.user_id !== user.id));
    } else {
      setSelectedUsers([
        ...selectedUsers,
        { user_id: user.id, role: "MEMBER" },
      ]);
    }
  };

  const handleRoleChange = (userId, role) => {
    setSelectedUsers(
      selectedUsers.map((u) =>
        u.user_id === userId ? { ...u, role: role } : u,
      ),
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Content */}
      <div className="px-4">
        {/* Selected Count */}
        {selectedUsers.length > 0 && (
          <div className="mb-3 flex items-center justify-between bg-blue-50 p-2 rounded-lg">
            <span className="text-xs text-blue-700 font-medium flex items-center gap-1">
              <FaUserCheck className="text-blue-600" />
              {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""}{" "}
              selected
            </span>
            <button
              onClick={() => setSelectedUsers([])}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Users List */}
        <div>
          {userListLoading ? (
            <div className="text-center py-15 text-sm text-gray-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FaUsers className="text-2xl mb-2 opacity-30" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {users.map((user) => {
                const selectedUser = selectedUsers.find(
                  (u) => u.user_id === user.id,
                );
                const isSelected = !!selectedUser;
                const isMember =
                  members?.some((m) => m.user?.id === user?.id) ?? false;
                if (isMember) return;

                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 hover:bg-gray-50 transition-colors ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {/* Avatar */}
                      <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xxs">
                        {user.first_name?.[0]}
                        {user.last_name?.[0]}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xxs text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div className="flex items-center space-x-2 mr-4">
                      {roleEnums.map((role) => (
                        <label
                          key={role}
                          className="flex items-center space-x-1"
                        >
                          <input
                            type="radio"
                            name={`role-${user.id}`}
                            value={role}
                            checked={isSelected && selectedUser?.role === role}
                            onChange={() => {
                              if (!isSelected) {
                                handleSelectUser(user);
                              }
                              handleRoleChange(user.id, role);
                            }}
                            className={`w-3 h-3 text-blue-600 ${!isSelected ? "cursor-not-allowed" : "cursor-pointer"}`}
                            disabled={!isSelected}
                          />
                          <span
                            className={`text-xxs ${isSelected ? "text-gray-700 cursor-pointer" : "text-gray-400 cursor-not-allowed"}`}
                          >
                            {role.charAt(0) + role.slice(1).toLowerCase()}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Checkbox */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        onChange={() => handleSelectUser(user)}
                        checked={isSelected}
                      />
                      <div
                        className={`w-4 h-4 border rounded-md transition-all duration-200 flex items-center justify-center
                        ${
                          isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {isSelected && (
                          <FaCheck className="text-white text-sm" />
                        )}
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end space-x-3">
          <Btn
            type="button"
            btnName={`Add ${selectedUsers.length > 0 ? "(" + selectedUsers.length + ")" : ""} Members`}
            icon={<FaUserPlus fontFamily="14" />}
            onClickFunc={handleAddMembers}
            disabled={!selectedUsers.length || isApiLoading}
            className="w-fit!"
            isLoading={isApiLoading}
          />
        </div>
      </div>
    </div>
  );
}
