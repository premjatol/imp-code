"use client";

import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function ChangeEmail() {
  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {},
  });

  const { handleSubmit, watch, reset, setValue } = methods;
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
                label={t("EMAIL")}
                name="email"
                placeHolder={t("ENTER_YOUR_EMAIL")}
                htmlFor="email"
                id="email"
                required={true}
                maxlength="50"
                validCriteria={["alphabetOnly", "whitespace", "email"]}
              />
            </div>
            <div className="w-full">
              <HtmlInput
                label={t("CONFIRM_FIELDWIRE_PASSWORD")}
                name="password"
                placeHolder={t("ENTER_PASSWORD")}
                htmlFor="password"
                id="password"
                maxlength=""
                validCriteria={["alphabetOnly", "whitespace", "password"]}
              />
            </div>
          </div>
          <div className="mt-5">
            <Btn type="submit" btnName={t("SUBMIT")} />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
