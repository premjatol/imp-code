"use client";

import Btn from "@/components/common/Btn";
import HtmlImageAttachments from "@/components/form-inputs/HtmlImageAttachments";
import { allFileAcceptList } from "@/lib/utils";
import useFilesStore from "@/stores/files/useFilesStore";
import { FormProvider, useForm } from "react-hook-form";

const UploadMediaModal = () => {
  const { addFiles, isApiLoading } = useFilesStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const uploadMedia = async (data) => {
    try {
      const formData = new FormData();

      const file = data?.file?.[0]?.file;

      if (file) {
        formData.append("file", file);
      }

      await addFiles(formData);
    } catch (error) {
      console.error("Media upload failed:", error);
    }
  };

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(uploadMedia)}
          className="custom_form_style flex flex-col justify-between mt-3"
        >
          <div className="">
            <HtmlImageAttachments
              name="file"
              label="Upload Media"
              id="file"
              htmlFor="file"
              required={true}
              accept={allFileAcceptList}
              maxFileSize="25"
              error={errors.file}
              placeholder="Allowed: .jpg, .jpeg, .png, .gif, .webp, .mp4, .mov, .avi, .pdf, .doc, .docx, .xls, .xlsx"
            />
          </div>
          <div className="mt-6">
            <Btn
              type="submit"
              isLoading={isApiLoading}
              disabled={isApiLoading}
              btnName="Upload"
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default UploadMediaModal;
