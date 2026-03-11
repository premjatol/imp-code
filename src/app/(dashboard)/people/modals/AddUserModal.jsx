"use client";

import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import usePeopleStore from "@/stores/people/usePeopleStore";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function AddUserModal({ onclose, isEditMode = false }) {
  const { t } = useTranslation();

  const methods = useForm({
    mode: "all",
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const { addUser, isApiLoading } = usePeopleStore();

  const handleAddUser = async (data) => {
    try {
      await addUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role.value,
      });

      console.log("User added successfully");
    } catch (err) {
      console.log("Failed:", err.message);
    }
  };

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleAddUser)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between"
        >
          <div className="w-full">
            <div className="w-full mt-3 flex gap-2">
              <div className="w-1/2">
                <HtmlInput
                  inputType="text"
                  label={t("FIRST_NAME")}
                  name="firstName"
                  id="firstName"
                  htmlFor="firstName"
                  placeHolder={t("FIRST_NAME")}
                  required={true}
                  maxlength={30}
                  validCriteria={["required", "alphabetOnly", "whitespace"]}
                  error={errors.firstName}
                />
              </div>
              <div className="w-1/2">
                <HtmlInput
                  inputType="text"
                  label={t("LAST_NAME")}
                  name="lastName"
                  id="lastName"
                  htmlFor="lastName"
                  placeHolder={t("LAST_NAME")}
                  required={true}
                  maxlength={30}
                  validCriteria={["required", "alphabetOnly", "whitespace"]}
                  error={errors.lastName}
                />
              </div>
            </div>

            {!isEditMode && (
              <div className="w-full mt-3">
                <HtmlInput
                  inputType="text"
                  label={t("EMAIL_ADDRESS")}
                  name="email"
                  id="email"
                  htmlFor="email"
                  placeHolder={t("EMAIL_ADDRESS")}
                  required={true}
                  // maxlength="50"
                  error={errors.email}
                  validCriteria={["required", "email", "whitespace"]}
                />
              </div>
            )}

            <div className="w-full mt-3">
              <HtmlInput
                label={t("PHONE_NUMBER")}
                name="phone"
                id="phone"
                htmlFor="phone"
                placeHolder={t("PHONE_NUMBER")}
                required={true}
                maxlength="10"
                minLength="10"
                error={errors.phone}
                validCriteria={["numbersOnly", "required"]}
              />
            </div>

            <div className="w-full mt-3">
              <HtmlSelect
                label={t("ROLE")}
                name="role"
                id="role"
                htmlFor="role"
                placeholder={t("SELECT_ROLE")}
                required={true}
                error={errors.role}
                options={[
                  { label: "Admin", value: "ADMIN" },
                  { label: "Viewer", value: "VIEWER" },
                  { label: "Project manager", value: "PROJECT_MANAGER" },
                  { label: "Lead Hand", value: "LeadHand" },
                  { label: "Installer", value: "MEMBER" },
                ]}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <div className="flex gap-3">
              <Btn
                type="button"
                btnName={t("CANCEL")}
                className="min-w-fit!"
                isDarkMode={false}
                onClickFunc={onclose}
              />
              <Btn
                isLoading={isApiLoading}
                disabled={isApiLoading}
                type="submit"
                btnName={"Register"}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
