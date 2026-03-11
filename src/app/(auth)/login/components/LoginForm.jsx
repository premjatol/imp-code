"use client";

import HtmlInput from "@/components/form-inputs/HtmlInput";
import { FormProvider, useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import { HiArrowRight } from "react-icons/hi";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/auth/useAuthStore";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const { login, loading, error, clearError } = useAuthStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const submitLogin = async (data) => {
    clearError();
    await login(
      { ...data, device_id: process.env.NEXT_PUBLIC_DEVICE_ID || "web" },
      router,
    );
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(submitLogin)}
          className="custom_form_style space-y-5"
        >
          {/* Email Field */}
          <div className="space-y-2">
            <HtmlInput
              id="email"
              type="email"
              htmlFor="email"
              name="email"
              label="Email Address"
              required={true}
              autoFocus={true}
              placeHolder="name@company.com"
              validCriteria={["email"]}
              error={errors.email}
              //   additionalClass="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <HtmlInput
              id="password"
              type="password"
              htmlFor="password"
              label="Password"
              name="password"
              required={true}
              eyeButton={true}
              placeHolder="••••••••"
              validCriteria={["required"]}
              error={errors.password}
            />
          </div>

          <div className="flex justify-end mb-3">
            <Link
              href="/forgot_password"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center transition-all transform active:scale-[0.98] shadow-xl shadow-slate-200 disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <>
                <BiLoaderAlt className="w-5 h-5 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                Sign In
                <HiArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </FormProvider>
    </>
  );
}
