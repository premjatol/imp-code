export default function ButtonComp({
  children,
  variant = "default",
  className = "",
  onClick,
  ...props
}) {
  const styles = {
    // Default: light mode (slate) -> dark mode (white/5)
    default:
      "bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white",

    // Primary: Blue 600
    primary:
      "bg-blue-600 hover:bg-blue-700 border border-transparent text-white shadow-sm dark:bg-blue-500 dark:hover:bg-blue-600",

    // Danger: Red
    danger:
      "bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:border-red-500/35 dark:text-red-200",

    // Pills
    pill: "rounded-full px-3 h-[34px] text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/85",
    pillActive:
      "rounded-full px-3 h-[34px] text-xs font-bold border border-blue-600/30 bg-blue-50 text-blue-700 dark:border-blue-500/35 dark:bg-blue-500/20 dark:text-blue-200",
  };

  const baseClass = variant.startsWith("pill")
    ? styles[variant]
    : `h-[42px] px-3.5 rounded-2xl inline-flex items-center justify-center gap-2 font-semibold text-sm transition-colors cursor-pointer ${styles[variant]}`;

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
