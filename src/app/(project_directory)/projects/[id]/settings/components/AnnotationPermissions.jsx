import React, { useState } from "react";

const PermissionSelector = () => {
  const [selectedPermission, setSelectedPermission] = useState("PM Only");

  const permissionOptions = [
    { id: 1, label: "PM Only" },
    { id: 2, label: "PM + Lead" },
    { id: 3, label: "Everyone" },
    { id: 4, label: "Off" },
  ];

  return (
    <div className="max-w-200 w-full mx-auto bg-(--background) text-(--foreground)">
      <div className="max-w-260 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-sm font-bold font-heading">
            Annotation Permissions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Control who can create and manage annotations.
          </p>
        </div>

        {/* Permission Options */}
        <div className="space-y-3 mb-8">
          {permissionOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition ${
                selectedPermission === option.label
                  ? "border-(--foreground) bg-slate-50"
                  : "border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="permission"
                  value={option.label}
                  checked={selectedPermission === option.label}
                  onChange={(e) => setSelectedPermission(e.target.value)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <span className="text-xs font-semibold font-heading">
                  {option.label}
                </span>
              </div>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-6 border-t border-slate-300">
          <button
            type="button"
            className="flex items-center px-6 py-2 bg-primary hover:opacity-90 text-white rounded-lg font-bold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionSelector;
