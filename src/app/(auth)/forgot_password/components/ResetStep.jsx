"use client";

import { useState } from "react";
import { HiOutlineShieldCheck, HiArrowRight } from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";
import OtpInput from "./OtpInput";
import PasswordInput from "./PasswordInput";
import PasswordStrength from "./PasswordStrength";

export default function ResetStep({ email, onSuccess, onRetry }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (otp.join("").length < 6) errs.otp = "Please enter the full 6-digit code.";
    if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (password !== confirm) errs.confirm = "Passwords do not match.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onSuccess(); }, 1500);
    // Replace setTimeout with your actual API call:
    // await resetPassword({ otp: otp.join(""), password });
  };

  const confirmHint =
    confirm && confirm === password ? "✓ Passwords match" : null;

  return (
    <>
      <div className="mb-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-5">
          <HiOutlineShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold mb-2 tracking-tight text-slate-900">
          Check your email
        </h2>
        <p className="text-slate-500 text-xs leading-relaxed">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-slate-700">{email}</span>. Enter
          it below with your new password.
        </p>
      </div>

      <div className="space-y-5">
        <OtpInput otp={otp} setOtp={setOtp} error={errors.otp} />

        <PasswordInput
          label="New Password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          error={errors.password}
        />
        <PasswordStrength password={password} />

        <PasswordInput
          label="Confirm New Password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Re-enter your password"
          error={errors.confirm}
          hint={confirmHint}
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold 
            flex items-center justify-center transition-all shadow-xl shadow-slate-200 
            disabled:opacity-70 cursor-pointer text-sm"
        >
          {isLoading ? <BiLoaderAlt className="w-6 h-6 animate-spin" /> : <> Reset Password <HiArrowRight className="ml-2 w-5 h-5" /> </>}
        </button>

        <div className="text-center">
          <button
            onClick={onRetry}
            className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
          >
            Try a different email address
          </button>
        </div>
      </div>
    </>
  );
}