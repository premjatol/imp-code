"use client";

import { useRef } from "react";
import { HiOutlineKey } from "react-icons/hi";

export default function OtpInput({ otp, setOtp, error }) {
  const inputRefs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      setOtp(pasted.split("").concat(Array(6).fill("")).slice(0, 6));
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center text-xs font-semibold text-slate-700 ml-1">
        <HiOutlineKey className="w-4 h-4 mr-2 text-blue-600" /> Verification Code
      </label>
      <div className="flex gap-2 justify-between" onPaste={handlePaste}>
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-11 h-12 text-center text-lg font-bold bg-slate-50 border rounded-xl 
              focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all
              ${error ? "border-red-400" : "border-slate-300"}`}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
      <p className="text-xs text-slate-400 ml-1">
        Didn't receive a code?{" "}
        <button type="button" className="text-blue-600 font-semibold hover:underline">
          Resend
        </button>
      </p>
    </div>
  );
}