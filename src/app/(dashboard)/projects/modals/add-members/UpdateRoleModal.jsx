import Btn from "@/components/common/Btn";
import useProjectStore from "@/stores/project/useProjectStore";
import React, { useState } from "react";

export default function UpdateRoleModal({ onClose, projectId, memberDetails }) {
  const { updateMemberRole, isApiLoading } = useProjectStore();

  const [selectedRole, setSelectedRole] = useState(
    memberDetails?.role || "MEMBER",
  );

  const roleEnums = [
    {
      value: "PM",
      label: "Project Manager",
      description: "Full project control and management",
    },
    {
      value: "SUPERVISOR",
      label: "Supervisor",
      description: "Can review and approve tasks",
    },
    { value: "MEMBER", label: "Member", description: "Regular team member" },
  ];

  const handleUpdateRole = async () => {
    if (selectedRole === memberDetails.role) {
      onClose();
      return;
    }

    await updateMemberRole(projectId, memberDetails.id, selectedRole);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full">
        {/* Member Info */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
              {memberDetails.user.first_name?.[0]}
              {memberDetails.user.last_name?.[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {memberDetails.user.first_name} {memberDetails.user.last_name}
              </p>
              <p className="text-xxs text-gray-500">
                {memberDetails.user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="px-6 py-4">
          <label className="text-xs font-medium text-gray-700 block mb-3">
            Select New Role
          </label>
          <div className="space-y-2">
            {roleEnums.map((role) => (
              <label
                key={role.value}
                className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all
                    ${
                      selectedRole === role.value
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                    }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={selectedRole === role.value}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-0.5 w-4 h-4 text-blue-600"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-900">
                      {role.label}
                    </span>
                    {memberDetails.role === role.value && (
                      <span className="text-xxs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xxs text-gray-500 mt-0.5">
                    {role.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end px-4">
          <Btn
            type="button"
            onClickFunc={handleUpdateRole}
            btnName={"Update role"}
            className="w-fit!"
            disabled={isApiLoading || selectedRole === memberDetails.role}
            isLoading={isApiLoading}
          />
        </div>
      </div>
    </div>
  );
}
