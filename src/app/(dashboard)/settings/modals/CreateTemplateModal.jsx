import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import useStatusManagerStore from "@/stores/settings/useStatusManagerStore";
import HtmlTextarea from "@/components/form-inputs/HtmlTextarea";

export default function CreateTemplateModal({ isEditMode }) {
  const { createTemplate, isApiLoading, selectedTemplate, updateTemplate } =
    useStatusManagerStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: isEditMode && {
      name: selectedTemplate.name || "",
      version: selectedTemplate.version || "",
      description: selectedTemplate.description || "",
      is_active: selectedTemplate.is_active ?? false,
      is_default: selectedTemplate.is_default ?? false,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const saveStatus = async (data) => {
    const body = {
      ...data,
      version: data.version ? Number(data.version) : null,
    };

    if (!isEditMode) {
      await createTemplate(body);
    } else {
      await updateTemplate(body, selectedTemplate.id);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(saveStatus)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between px-6 mt-3"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-2">
              <div className="w-full">
                <HtmlInput
                  label="Template Name"
                  name="name"
                  htmlFor="name"
                  id="name"
                  placeHolder={"Add template name"}
                  maxlength="60"
                  required={true}
                  validCriteria={["whitespace"]}
                  error={errors.name}
                />
              </div>
              <div className="w-full">
                <HtmlInput
                  label="Version"
                  name="version"
                  htmlFor="version"
                  id="version"
                  required={true}
                  placeHolder={"Add version name"}
                  validCriteria={["whitespace", "numbersOnly"]}
                  error={errors.version}
                />
              </div>
            </div>
            <div className="w-full">
              <HtmlTextarea
                label="Description"
                name="description"
                htmlFor="description"
                id="description"
                placeHolder={"Add description here"}
                error={errors.description}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 space-x-5">
            <div className="border border-gray-300 rounded-lg p-2">
              <div>
                <HtmlCheckBox
                  label="Template Active"
                  name="is_active"
                  id="is_active"
                />
              </div>
              <p className="text-xxs text-gray-600">
                Inactive templates cannot be used for new projects.
              </p>
            </div>
            <div className="border border-gray-300 rounded-lg p-2">
              <div>
                <HtmlCheckBox
                  label="Default Template"
                  name="is_default"
                  id="is_default"
                />
              </div>
              <p className="text-xxs text-gray-600">
                Used to seed new projects automatically.
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <Btn
              type="submit"
              btnName={isEditMode ? "Edit Workflow" : "Create Workflow"}
              className="w-fit! h-fit!"
              disabled={isApiLoading}
              isLoading={isApiLoading}
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
}
