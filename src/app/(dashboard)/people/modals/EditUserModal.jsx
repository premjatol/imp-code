"use client";

import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import ProfileImageUpload from "@/components/common/ProfileImageUpload";
import usePeopleStore from "@/stores/people/usePeopleStore";

export default function EditUserModal({ userInfo, setUserInfo }) {
  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      phone: userInfo.phone,
      role: {
        label:
          userInfo.role &&
          userInfo.role
            .toLowerCase()
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        value: userInfo.role,
      },
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;
  const { t } = useTranslation();

  const { editUser, loading, success } = usePeopleStore();

  const editProfile = async (data) => {
    try {
      await editUser(userInfo.id, {
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        profileImage: data.profile_image,
        role: data.role?.value,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-6">
      {/* <ProfileImageUpdate /> */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(editProfile)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="image-container flex justify-center w-full mt-3">
              <ProfileImageUpload
                name="profile_image"
                maxSize={3} // MB
                allowedFormats={["image/jpeg", "image/png"]}
                error={errors.profile_image}
                imageUrl={userInfo?.profile_image_url}
              />
            </div>

            <div className="w-full">
              <HtmlInput
                label={t("FIRST_NAME")}
                name="first_name"
                htmlFor="first_name"
                id="first_name"
                required={true}
                maxlength="50"
                error={errors.first_name}
                validCriteria={["alphabetOnly", "whitespace"]}
              />
            </div>
            <div className="w-full">
              <HtmlInput
                label={t("LAST_NAME")}
                name="last_name"
                htmlFor="last_name"
                id="last_name"
                required={true}
                maxlength="50"
                error={errors.last_name}
                validCriteria={["alphabetOnly", "whitespace"]}
              />
            </div>
            {/* <div className="w-full space-y-2">
              <label className="text-xs mb-1 block">Phone</label>
              <HtmlPhoneInput name="countryCode" />
            </div> */}
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
          <div className="mt-5 space-y-2">
            <Btn
              type="submit"
              btnName={t("SAVE_CHANGES")}
              isLoading={loading}
              disabled={loading}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
