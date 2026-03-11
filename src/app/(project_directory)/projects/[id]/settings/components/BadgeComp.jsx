export default function BadgeComp({
  children,
  variant = "default",
  className = "",
}) {
  // Mapping theme variants
  const styles = {
    // Light: slate-100/slate-700 | Dark: white/5 white/85
    default:
      "bg-slate-100 border border-slate-200 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-white/85",

    // Solid: using primary blue
    solid:
      "bg-blue-600/10 border-transparent text-blue-700 dark:bg-blue-500/20 dark:text-blue-200",

    // Ok: using secondary green
    ok: "bg-green-600/10 border-green-600/20 text-green-700 dark:bg-green-500/20 dark:border-green-500/25 dark:text-green-300",

    // Off: muted slate
    off: "bg-slate-100 border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-white/40",

    // Outline: subtle
    outline:
      "bg-transparent border border-slate-200 text-slate-600 dark:border-white/10 dark:text-white/60",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
