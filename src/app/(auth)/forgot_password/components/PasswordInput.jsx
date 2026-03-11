"use client";

import { useState } from "react";
import { HiOutlineLockClosed } from "react-icons/hi";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

export default function PasswordInput({ label, value, onChange, placeholder, error, hint }) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label className="flex items-center text-xs font-semibold text-slate-700 ml-1">
        <HiOutlineLockClosed className="w-4 h-4 mr-2 text-blue-600" /> {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-4 pr-12 bg-slate-50 border rounded-2xl 
            focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 
            transition-all text-sm ${error ? "border-red-400" : "border-slate-300"}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
      {hint && <p className="text-xs text-green-500 ml-1 font-semibold">{hint}</p>}
    </div>
  );
}