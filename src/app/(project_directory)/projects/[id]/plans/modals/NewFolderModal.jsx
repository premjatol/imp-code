import Btn from "@/components/common/Btn";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import { usePlansStore } from "@/stores/plans/usePlansStore";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function NewFolderModal({ isEditMode }) {
  const {
    folderApiLoading,
    createPlanFolders,
    editPlanFolder,
    selectedFolder,
  } = usePlansStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      name: selectedFolder?.name || "",
      sort_order: selectedFolder?.sort_order || "",
      is_active: selectedFolder?.is_active || true,
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = methods;
  const { t } = useTranslation();

  const createNewFolder = async (data) => {
    const body = { ...data, sort_order: Number(data.sort_order) };
    if (!isEditMode) {
      delete body.is_active;
      await createPlanFolders(body);
    } else {
      await editPlanFolder(body, selectedFolder?.id);
    }
  };

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(createNewFolder)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between mt-4"
        >
          <div className="w-full">
            <HtmlInput
              label={"Folder name"}
              name="name"
              placeHolder={"Enter folder name"}
              htmlFor="name"
              id="name"
              required={true}
              maxlength="20"
              validCriteria={["whitespace"]}
              error={errors.name}
            />
          </div>

          <div className="w-full">
            <HtmlInput
              label={"Sort by order"}
              name="sort_order"
              placeHolder={"Enter number"}
              htmlFor="sort_order"
              id="sort_order"
              validCriteria={["numbersOnly"]}
              error={errors.sort_order}
            />
          </div>
          {isEditMode && (
            <div className="px-3 border border-gray-400 rounded-lg mt-3">
              <HtmlCheckBox
                label={watch("is_active") ? "Active" : "Inative"}
                name="is_active"
                id="is_active"
              />
            </div>
          )}
          <div className="mt-5">
            <Btn
              type="submit"
              disabled={folderApiLoading}
              isLoading={folderApiLoading}
              btnName={isEditMode ? "Edit folder details" : "Create new folder"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
