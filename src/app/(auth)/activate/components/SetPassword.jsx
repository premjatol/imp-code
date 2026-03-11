"use client";

import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import useAuthStore from "@/stores/auth/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiLock } from "react-icons/fi";

export default function SetPassword() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { verifyEmail, loading, setPassword } = useAuthStore();

  useEffect(() => {
    if (token) {
      verifyEmail({ token });
    }
  }, [token]);

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const activateAccount = async (data) => {
    try {
      await setPassword(
        {
          token: token,
          password: data.password,
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
            {t("ACTIVATE_ACCOUNT")}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {t("SET_PASSWORD_TO_ACTIVATE")}
          </p>
        </div>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(activateAccount)}
            className="custom_form_style space-y-5"
          >
            <div>
              <HtmlInput
                label={t("PASSWORD")}
                name="password"
                htmlFor="password"
                id="password"
                eyeButton={true}
                required={true}
                validCriteria={["required", "password"]}
                error={errors.password}
              />
            </div>

            <div>
              <HtmlInput
                label={t("CONFIRM_PASSWORD")}
                name="confirm_password"
                htmlFor="confirm_password"
                id="confirm_password"
                disabled={watch("password") ? false : true}
                additionalClass={
                  watch("password")
                    ? "text-input-css"
                    : "text-input-css cursor-not-allowed"
                }
                required={true}
                watchTo="password"
                validCriteria={["matchPassword"]}
                error={errors.confirm_password}
              />
            </div>

            <div className="pt-2">
              <Btn
                type="submit"
                btnName={t("ACTIVATE_ACCOUNT")}
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
