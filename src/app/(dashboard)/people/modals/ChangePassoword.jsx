"use client";

import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function ChangePassoword() {
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

  const createProject = (data) => {
    console.log(data);
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
                label={t("CURRENT_PASSWORD")}
                name="current_password"
                htmlFor="current_password"
                id="current_password"
                required={true}
                maxlength="50"
                error={errors.current_password}
                validCriteria={["password", "required"]}
              />
            </div>
            <div className="w-full">
              <HtmlInput
                inputType="password"
                label={t("CONFIRM_PASSWORD")}
                name="confirm_password"
                placeHolder={"********"}
                htmlFor="confirm_password"
                id="confirm_password"
                required={true}
                maxlength="12"
                minLength="6"
                eyeButton={true}
                error={errors.confirm_password}
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
                disabled={watch("confirm_password") ? false : true}
                additionalClass={
                  watch("confirm_password")
                    ? "text-input-css"
                    : "text-input-css cursor-not-allowed"
                }
                watchTo={"confirm_password"}
                error={errors.confirm_new_password}
                validCriteria={["whitespace", "matchPassword"]}
              />
            </div>
          </div>
          <div className="mt-5">
            <Btn type="submit" btnName={t("SAVE")} />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
