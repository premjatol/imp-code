import { useTranslation } from "react-i18next";

export default function Btn({
  type = "button",
  icon,
  btnName,
  onClickFunc,
  className = "",
  isDarkMode = true,
  disabled = false,
  isLoading = false,
}) {
  const { t } = useTranslation();

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={() => onClickFunc && !isLoading && onClickFunc()}
      className={`flex items-center justify-center gap-2 w-full min-w-25 py-2 px-2 rounded-md transition-colors duration-200 border text-xs ${
        isDarkMode
          ? "bg-primary text-white border-transparent hover:bg-primary/90"
          : "bg-white text-primary border-primary hover:text-primary-hover"
      } ${disabled || isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
        ${className ? className : ""}
      `}
    >
      {/* Spinner when loading */}
      {isLoading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}

      {/* Icon when not loading */}
      {!isLoading && icon && <span>{icon}</span>}

      {/* Text always beside icon/spinner */}
      <span className="text-xs font-semibold w-fit">
        {isLoading ? `${t("PROCESSING")}...` : btnName || "write name"}
      </span>
    </button>
  );
}
