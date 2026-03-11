"use client";

import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function InviteToProject() {
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
    <div className="px-6 mt-4">
      <p className="text-xs">{t("VIEW_HELP_CENTER_TEXT")}</p>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(createProject)}
          // encType="multipart/form-data"
          className="custom_form_style mt-3"
        >
          <div>
            <HtmlSelect
              label={t("SELECT_PROJECT")}
              name="project"
              id="project"
              htmlFor="project"
              required={true}
              isMulti={true}
              error={errors.project}
              options={[
                {
                  label: "ABC",
                  value: 1,
                },
                {
                  label: "DEF",
                  value: 2,
                },
              ]}
            />
          </div>

          <div className="w-full mt-3">
            <HtmlInput
              name="email"
              label={"Add users (separate user emails with commas)"}
              htmlFor={"email"}
              id={"email"}
              placeHolder={t("ENTER_YOUR_EMAIL")}
              required={true}
              maxlength="50"
              error={errors.email}
              validCriteria={["email"]}
            />
          </div>

          <div className="mt-5 flex justify-end">
            <div className="flex gap-3">
              <Btn
                type="button"
                btnName={t("IMPORT_CONTACTS")}
                className="min-w-fit!"
                isDarkMode={false}
              />
              <Btn type="submit" btnName={t("SEND_INVITE")} />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
