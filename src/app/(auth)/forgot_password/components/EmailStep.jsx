"use client";

import { useEffect, useState } from "react";
import { HiOutlineMail, HiArrowRight } from "react-icons/hi";
import { BiLoaderAlt } from "react-icons/bi";
import { FormProvider, useForm } from "react-hook-form";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import { useTranslation } from "react-i18next";
import useAuthStore from "@/stores/auth/useAuthStore";

export default function EmailStep({ onSubmit }) {
  const { t } = useTranslation();

  const { loading, forgotPassword, success, clearError } = useAuthStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = methods;

  const handleForgotPassword = async (data) => {
    try {
      await forgotPassword({ email: data.email });
    } catch (error) {
      // error already handled in store
    }
  };

  useEffect(() => {
    if (success) {
      const email = getValues("email");
      onSubmit(email);
      clearError();
    }
  }, [success]);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-slate-900">
          Forgot Password?
        </h2>
        <p className="text-slate-500 text-sm">
          Enter your email and we'll send you a code to reset your password.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(handleForgotPassword)}
              className="custom_form_style"
            >
              <div className="w-full">
                <HtmlInput
                  label={t("EMAIL_ADDRESS")}
                  name="email"
                  htmlFor="email"
                  id="email"
                  required={true}
                  placeHolder={t("ENTER_YOUR_EMAIL")}
                  validCriteria={["required", "email"]}
                  error={errors.email}
                />
              </div>
              <div className="w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full py-4 px-6 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold 
            flex items-center justify-center transition-all shadow-xl shadow-slate-200 
            disabled:opacity-70 cursor-pointer text-sm"
                >
                  {loading ? (
                    <BiLoaderAlt className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {" "}
                      Submit <HiArrowRight className="ml-2 w-5 h-5" />{" "}
                    </>
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
