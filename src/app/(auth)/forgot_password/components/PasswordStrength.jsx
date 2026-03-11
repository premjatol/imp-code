export default function PasswordStrength({ password }) {
  if (!password) return null;

  const getStrength = () => {
    if (password.length < 6)
      return { label: "Weak", color: "bg-red-400", textColor: "text-red-400", width: "w-1/4" };
    if (password.length < 10 || !/[A-Z]/.test(password))
      return { label: "Fair", color: "bg-yellow-400", textColor: "text-yellow-500", width: "w-2/4" };
    if (!/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password))
      return { label: "Good", color: "bg-blue-400", textColor: "text-blue-500", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", textColor: "text-green-500", width: "w-full" };
  };

  const { label, color, textColor, width } = getStrength();

  return (
    <div className="space-y-1 px-1">
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${color} ${width}`} />
      </div>
      <p className={`text-xs font-semibold ${textColor}`}>{label}</p>
    </div>
  );
}