"use client";

import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import useAuthStore from "@/stores/auth/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiLock } from "react-icons/fi";

export default function ResetPassword() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { loading, error, resetPassword } = useAuthStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {},
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const activateAccount = async (data) => {
    try {
      await resetPassword(
        {
          token: token,
          newPassword: data.password,
        },
        router,
      );

      console.log("Password set successfully");
    } catch (err) {
      console.log("Failed:", err.message);
    }
  };

  return (
    <>
      <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-xl border border-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FiLock className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            {t("RESET_PASSWORD")}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {t("ENTER_NEW_PASSWORD_TO_RESET")}
          </p>
        </div>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(activateAccount)}
            // encType="multipart/form-data"
            className="custom_form_style flex flex-col justify-between space-y-5"
          >
            <div>
              <HtmlInput
                inputType="password"
                label={t("PASSWORD")}
                name="password"
                htmlFor="password"
                id="password"
                placeHolder={"***********"}
                required={true}
                error={errors.password}
                eyeButton={true}
                validCriteria={["required", "password"]}
              />
            </div>
            <div>
              <HtmlInput
                inputType="password"
                label={t("CONFIRM_PASSWORD")}
                name="confirm_password"
                htmlFor="confirm_password"
                id="confirm_password"
                disabled={watch("password") ? false : true}
                required={true}
                additionalClass={
                  watch("password")
                    ? "text-input-css"
                    : "text-input-css cursor-not-allowed"
                }
                watchTo="password"
                validCriteria={["matchPassword"]}
                error={errors.confirm_password}
              />
            </div>

            <div className="pt-2">
              <Btn
                type="submit"
                btnName={t("RESET_PASSWORD")}
                className="w-full"
                disabled={loading}
                isLoading={loading}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
