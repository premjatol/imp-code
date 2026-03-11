"use client";

import ProfileImage from "@/components/common/ProfileImage";
import { logoBasedOnFullName } from "@/lib/helper";
import { allImageTypesWithSlash } from "@/lib/utils";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaUpload } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

export default function ProfileImageUpdate({
  onClose,
  data,
  fetchProfileDetails,
}) {
  // Refs
  const fileInputRef = useRef(null);
  const [tempProfilePic, setTempProfilePic] = useState(null);

  const { t } = useTranslation();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
  });

  const { handleSubmit, watch, reset, setValue } = methods;

  // Update Profile picture
  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    const size = 1; // 1MB
    const maxSize = size * 1024 * 1024;

    if (!allImageTypesWithSlash.includes(file.type)) {
      toast.error(t("INVALID_FILE_TYPE"));
      event.target.files = "";
      return;
    }

    if (file.size > maxSize) {
      toast.error(`${t("FILE_SIZE_MUST_BE_LESS_THAN")} ${size}MB`);
      event.target.files = "";
      return;
    }

    // Create local preview URL
    const previewUrl = URL.createObjectURL(file);

    // Revoke previous preview URL if any
    if (tempProfilePic && typeof tempProfilePic === "string") {
      URL.revokeObjectURL(tempProfilePic);
    }

    setTempProfilePic(previewUrl);
    event.target.value = "";

    return; // keep your existing logic below commented for now
    /*
  const formData = new FormData();
  formData.append("file", file);

  const obj = {
    method: "POST",
    url: "",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    toastMessage: { isShow: false },
    setIsLoading,
    isPrimaryUrl: true,
  };

  const res = await callApi(obj);

  if (res.status === "SUCCESS") {
    setTempProfilePic(res.data);
    event.target.value = "";
  }
  */
  };

  // Update first and last name
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Form handlers
  const editProfileHandler = async (d) => {
    return;
    if (tempProfilePic) {
      d.profileAttachmentId = tempProfilePic;
    }

    const obj = {
      method: "PUT",
      url: editProfile.replace("{id}", data?.id),
      body: d,
      toastMessage: { isShow: true },
      setIsLoading,
      isPrimaryUrl: true,
    };

    const res = await callApi(obj);

    if (res.status === "SUCCESS") {
      useLoginStore.getState().fetchLoggedInUser();
      fetchProfileDetails();
      onClose();
    }
  };
  console.log(tempProfilePic);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(editProfileHandler)}
        encType="multipart/form-data"
        className="custom_form_style my-5"
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            {data?.profileImageId && !tempProfilePic ? (
              // show existing profile image if no temp upload
              <ProfileImage imageUrl={data.profileImageId} />
            ) : tempProfilePic ? (
              // show preview image from local upload
              <img
                src={tempProfilePic}
                alt="Profile Preview"
                className="rounded-full w-18 h-18 object-cover"
              />
            ) : (
              <div className="w-18 h-18 rounded-full object-cover bg-green-600 flex justify-center items-center text-3xl font-bold text-white">
                {logoBasedOnFullName("Prem", "Jatol")}
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePicUpload}
            accept="image/*"
            className="hidden"
          />

          {tempProfilePic ? (
            <div className="text-sm text-primary font-medium flex items-center gap-1">
              {t("IMAGE_SELECTED")}{" "}
              <span
                onClick={() => {
                  if (tempProfilePic && typeof tempProfilePic === "string") {
                    URL.revokeObjectURL(tempProfilePic);
                  }
                  setTempProfilePic(null);
                }}
                className="cursor-pointer hover:rotate-90 hover:scale-110 transition duration-500 hover:text-primary"
              >
                <RxCross2 fontSize={18} />
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={triggerFileInput}
              className="text-sm text-purple-600 font-medium hover:text-purple-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FaUpload /> {t("UPLOAD_NEW_PICTURE")}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
