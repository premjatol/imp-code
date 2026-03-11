"use client";

import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ProfileImageUpload from "@/components/common/ProfileImageUpload";
import useProfileStore from "@/stores/profile/useProfileStore";

export default function EditUserModal() {
  const { userInfo, updateProfile, isProfileApiLoading } = useProfileStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      first_name: userInfo?.first_name,
      last_name: userInfo?.last_name,
      phone: userInfo?.phone,
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

  const editProfile = async (data) => {
    try {
      const formData = new FormData();

      formData.append("firstName", data.first_name);
      formData.append("lastName", data.last_name);
      formData.append("phone", data.phone);

      if (data.profile_image instanceof File) {
        formData.append("profileImage", data.profile_image);
      }

      await updateProfile(formData);
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
          encType="multipart/form-data"
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
                validCriteria={["alphabetOnly", "whitespace", "required"]}
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
                validCriteria={["alphabetOnly", "whitespace", "required"]}
              />
            </div>
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
          </div>
          <div className="mt-5 space-y-2">
            <Btn
              type="submit"
              btnName={t("SAVE_CHANGES")}
              isLoading={isProfileApiLoading}
              disabled={isProfileApiLoading}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
