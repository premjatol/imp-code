import React, { useEffect } from "react";
import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function NewUsersModal() {
  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {},
  });

  const { handleSubmit, watch, reset, setValue } = methods;
  const { t } = useTranslation();

  const watchEmail = watch("email");

  const inviteNewUsers = (data) => {
    console.log(data);
  };

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(inviteNewUsers)}
          // encType="multipart/form-data"
          className="custom_form_style mt-3"
        >
          <div className="w-full mt-3">
            <HtmlSelect
              name="email"
              label={"Add users"}
              htmlFor={"email"}
              id={"email"}
              placeHolder={t("ENTER_YOUR_EMAIL")}
              required={true}
              isMulti={true}
              options={[
                { value: "admin", label: "Admin" },
                { value: "PM", label: "PM" },
              ]}
            />
          </div>

          <div className={`w-full mt-3 ${watchEmail ? "block" : "hidden"}`}>
            <HtmlSelect
              name="role"
              label={"Assign role"}
              htmlFor={"role"}
              id={"role"}
              placeHolder={t("Assign role")}
              required={true}
              options={[
                { value: "admin", label: "Admin" },
                { value: "PM", label: "PM" },
              ]}
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
