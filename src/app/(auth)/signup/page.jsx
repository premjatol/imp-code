"use client";

import { useState } from "react";
// Ensure react-icons is installed: npm install react-icons
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiArrowRight,
} from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Signup attempt with:", formData);
      setIsLoading(false);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-blue-50 text-slate-900 overflow-hidden font-sans">
      {/* Background Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 border border-blue-200 rounded-full transform rotate-45"></div>
        <div className="absolute bottom-1/4 right-20 w-96 h-96 border border-purple-200 rounded-full transform -rotate-12"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <main className="flex flex-col lg:flex-row items-center justify-center min-h-[80vh]">
          {/* Signup Form Card */}
          <div className="w-full lg:w-1/2 max-w-md p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] mb-10 lg:mb-0 lg:mr-12 transform transition-all duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold mb-2 tracking-tight text-slate-900">
                Create Account
              </h2>
              <p className="text-slate-500">Join the future of 3D navigation</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="flex items-center text-xs font-semibold text-slate-700 ml-1"
                  >
                    <HiOutlineUser className="w-4 h-4 mr-2 text-blue-600" />
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="flex items-center text-xs font-semibold text-slate-700 ml-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center text-xs font-semibold text-slate-700 ml-1"
                >
                  <HiOutlineMail className="w-4 h-4 mr-2 text-blue-600" />
                  Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  placeholder="jane@company.com"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="flex items-center text-xs font-semibold text-slate-700 ml-1"
                >
                  <HiOutlineLockClosed className="w-4 h-4 mr-2 text-blue-600" />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  placeholder="Create a strong password"
                />
              </div>

              {/* Legal Footer Text Section 1 */}
              <div className="text-[11px] leading-relaxed text-slate-400 text-center px-2">
                By clicking "Continue" above, you acknowledge that you have read
                and understood, and agree to Fieldwire’s{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Notice
                </a>
                .
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center transition-all transform active:scale-[0.98] shadow-lg disabled:opacity-70"
              >
                {isLoading ? (
                  <BiLoaderAlt className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Continue
                    <HiArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-600 text-xs">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:underline font-bold"
                >
                  Log in
                </a>
              </p>
            </div>

            {/* reCAPTCHA Text */}
            <div className="mt-6 text-[10px] text-slate-400 text-center leading-tight">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              apply.
            </div>
          </div>

          {/* Visualization Section (Matching Login) */}
          <div className="hidden lg:flex w-full lg:w-1/2 justify-center">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0">
                <div className="absolute w-full h-full bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] flex items-center justify-center z-20">
                  <div className="text-center">
                    <div className="text-5xl font-black text-slate-900">
                      START
                    </div>
                    <div className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-2">
                      Your Journey
                    </div>
                  </div>
                </div>
                <div className="absolute w-full h-full bg-blue-600 rounded-[2.5rem] transform rotate-6 translate-x-8 translate-y-8 z-10 opacity-20"></div>
                <div className="absolute w-full h-full bg-slate-200 rounded-[2.5rem] transform -rotate-3 -translate-x-4 -translate-y-4 -z-10"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
