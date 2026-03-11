"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Btn from "../Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import useProfileStore from "@/stores/profile/useProfileStore";

export default function ChangePassoword() {
  const { isProfileApiLoading, changePassoword } = useProfileStore();

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

  const { t } = useTranslation();

  const createProject = async (data) => {
    await changePassoword(data);
  };

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(createProject)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-full">
              <HtmlInput
                label={t("currentPassword")}
                name="currentPassword"
                htmlFor="currentPassword"
                id="currentPassword"
                required={true}
                maxlength="50"
                error={errors.currentPassword}
                validCriteria={["password", "required"]}
              />
            </div>
            <div className="w-full">
              <HtmlInput
                inputType="password"
                label={t("CONFIRM_PASSWORD")}
                name="newPassword"
                placeHolder={"********"}
                htmlFor="newPassword"
                id="newPassword"
                required={true}
                maxlength="12"
                minLength="6"
                eyeButton={true}
                error={errors.newPassword}
                validCriteria={["password"]}
              />
            </div>
            <div className="w-full">
              <HtmlInput
                inputType="password"
                label={t("CONFIRM_NEW_PASSWORD")}
                name="confirm_new_password"
                htmlFor="confirm_new_password"
                placeHolder={"********"}
                id="confirm_new_password"
                required={true}
                disabled={watch("newPassword") ? false : true}
                additionalClass={
                  watch("newPassword")
                    ? "text-input-css"
                    : "text-input-css cursor-not-allowed"
                }
                watchTo={"newPassword"}
                error={errors.confirm_new_password}
                validCriteria={["whitespace", "matchPassword"]}
              />
            </div>
          </div>
          <div className="mt-5">
            <Btn
              type="submit"
              disabled={isProfileApiLoading}
              isLoading={isProfileApiLoading}
              btnName={t("SAVE")}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
