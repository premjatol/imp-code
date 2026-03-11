import { IoWarning } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";

export default function ConfirmationModal({
  message = "Are you sure you want to proceed?",
  confirmText = "Update",
  onConfirm,
  isLoading = false,
  variant = "warning", // warning | danger | success
}) {
  const variantStyles = {
    warning: {
      bg: "bg-yellow-100",
      icon: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    danger: {
      bg: "bg-red-100",
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    success: {
      bg: "bg-green-100",
      icon: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
    },
    primary: {
      bg: "bg-blue-100",
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="flex flex-col">
      {/* Content */}
      <div className="px-6 py-6">
        <div className="flex items-center flex-col">
          {/* Icon */}
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full ${styles.bg}`}
          >
            <IoWarning size={40} className={styles.icon} />
          </div>

          {/* Text */}
          <div className="flex-1">
            {/* <h3 className="text-base font-semibold text-gray-900">{title}</h3> */}
            <p className="mt-2 text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 rounded-b-xl">
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`cursor-pointer w-full rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition flex items-center justify-center gap-2 ${styles.button} disabled:opacity-60`}
        >
          {isLoading && <ImSpinner2 className="animate-spin h-4 w-4" />}
          {confirmText}
        </button>
      </div>
    </div>
  );
}
