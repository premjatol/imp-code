export default function ToggleComp({
  checked,
  onChange,
  label,
  subLabel,
  className = "",
}) {
  return (
    <div
      className={`flex gap-3 items-center p-3 border border-slate-200 rounded-[18px] bg-white/50 dark:border-white/10 dark:bg-[#0f1724]/45 ${className}`}
    >
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative flex-none w-11.5 h-7 rounded-full border transition-all duration-200 cursor-pointer ${
          checked
            ? "bg-blue-600/10 border-blue-600/50 dark:bg-blue-500/35 dark:border-blue-500/50"
            : "bg-slate-100 border-slate-200 dark:bg-white/5 dark:border-white/15"
        }`}
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-sm transition-all duration-200 ${
            checked
              ? "left-5.5 bg-blue-600 dark:bg-blue-100"
              : "left-1 bg-white dark:bg-white/85"
          }`}
        />
      </button>
      <div className="flex-1">
        <div className="font-heading font-bold text-sm text-[#171717] dark:text-[#ededed]">
          {label}
        </div>
        {subLabel && (
          <div className="text-xs text-slate-500 dark:text-white/45 mt-0.5">
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
}
