"use client";

import Btn from "@/components/common/Btn";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import HtmlImageAttachments from "@/components/form-inputs/HtmlImageAttachments";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import HtmlTextarea from "@/components/form-inputs/HtmlTextarea";
import { imageAndPdfOnly } from "@/lib/utils";
import { usePlansStore } from "@/stores/plans/usePlansStore";
import { FormProvider, useForm } from "react-hook-form";

const PlanUploadModal = ({ isEditMode = false, createPlanById = false }) => {
  const {
    selectedFolder,
    createPlan,
    isApiLoading,
    editPlan,
    selectedPlan,
    folders,
  } = usePlansStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: isEditMode && {
      name: selectedPlan?.name || "",
      description: selectedPlan?.description || "",
      is_active: selectedPlan?.is_active,
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const createPlanFunc = async (data) => {
    if (!isEditMode) {
      const formdata = new FormData();

      if (createPlanById) {
        formdata.append("folder_id", selectedFolder.id);
      } else {
        formdata.append("folder_id", data.folder_id.value);
      }

      formdata.append("name", data.name);
      formdata.append("description", data.description);
      formdata.append("file", data.file[0].file);

      await createPlan(formdata);
    } else {
      delete data.file;
      data.folder_id = selectedFolder?.id;

      await editPlan(selectedPlan?.id, data);
    }
  };

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(createPlanFunc)}
          encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between mt-3"
        >
          <div className="space-y-3">
            {!createPlanById && !isEditMode && (
              <div className="w-full">
                <HtmlSelect
                  label={"Select Folder"}
                  name="folder_id"
                  placeHolder={"Selecte Existing folder"}
                  htmlFor="folder_id"
                  id="folder_id"
                  options={
                    folders?.map((f) => ({ label: f.name, value: f.id })) || []
                  }
                  required={true}
                  error={errors.folder_id}
                />
              </div>
            )}
            <div className="w-full">
              <HtmlInput
                label="Name"
                name="name"
                placeHolder="Enter name"
                htmlFor="name"
                id="name"
                required={true}
                maxlength=""
                validCriteria={["required"]}
                error={errors.name}
              />
            </div>
            <div className="w-full">
              <HtmlTextarea
                label="Description"
                name="description"
                placeHolder="Add about plan"
                htmlFor="description"
                id="description"
                required={true}
                maxlength="300"
                error={errors.description}
              />
            </div>
            {!isEditMode && (
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
            )}
            {isEditMode && (
              <div className="px-3 py-1 border border-gray-300 rounded-lg">
                <HtmlCheckBox
                  label={watch("is_active") ? "Active" : "Inactive"}
                  name="is_active"
                  id="is_active"
                />
              </div>
            )}
          </div>
          <div className="mt-6">
            <Btn
              type="submit"
              isLoading={isApiLoading}
              disabled={isApiLoading}
              btnName={isEditMode ? "Update plan" : "Add New plan"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default PlanUploadModal;
