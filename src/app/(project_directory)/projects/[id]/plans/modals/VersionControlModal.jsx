"use client";

import Btn from "@/components/common/Btn";
import HtmlImageAttachments from "@/components/form-inputs/HtmlImageAttachments";
import HtmlTextarea from "@/components/form-inputs/HtmlTextarea";
import { imageAndPdfOnly } from "@/lib/utils";
import { useAnnotationStore } from "@/stores/plans/useAnnotationStore";
import { FormProvider, useForm } from "react-hook-form";

const VersionControlModal = () => {
  const { isApiLoading, uploadVersion } = useAnnotationStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const updateVersionFunc = async (data) => {
    const formdata = new FormData();
    formdata.append("description", data.description);
    formdata.append("file", data.file[0].file);

    await uploadVersion(formdata);
  };

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(updateVersionFunc)}
          encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between mt-3"
        >
          <div className="space-y-3">
            <div className="w-full">
              <HtmlTextarea
                label="Description"
                name="description"
                placeHolder="Add about plan"
                htmlFor="description"
                id="description"
                maxlength="300"
                error={errors.description}
              />
            </div>
            <div className="">
              <HtmlImageAttachments
                name="file"
                label="Upload single page pdf/jpeg/jpg/png"
                id="file"
                htmlFor="file"
                required={true}
                accept={imageAndPdfOnly}
                maxFileSize="50"
                error={errors.file}
              />
            </div>
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

export default VersionControlModal;
