"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineChevronLeft } from "react-icons/hi";
import EmailStep from "./components/EmailStep";
import SuccessStep from "./components/SuccessStep";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState("email"); // "email" | "success"
  const [email, setEmail] = useState("");

  const goToLogin = () => router.push("/login");

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-blue-50 text-slate-900 overflow-y-auto h-[calc(100vh-4rem)] font-sans">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-10 w-72 h-72 border border-blue-100 rounded-full transform rotate-45" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <main className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-md p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">

            {/* Back button */}
            {step !== "success" && (
              <button
                onClick={goToLogin}
                className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8 group"
              >
                <HiOutlineChevronLeft className="w-4 h-4 mr-1" />
                Back to Log in
              </button>
            )}

            {step === "email" && (
              <EmailStep
                onSubmit={(submittedEmail) => {
                  setEmail(submittedEmail);
                  setStep("success"); // ✅ Directly go to success
                }}
              />
            )}

            {step === "success" && (
              <SuccessStep onLogin={goToLogin} />
            )}

            {/* Bottom login link */}
            {step !== "success" && (
              <div className="pt-6 border-t border-slate-100 text-center">
                <button
                  onClick={goToLogin}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                  Log in
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
