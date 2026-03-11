import Btn from "@/components/common/Btn";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlTextarea from "@/components/form-inputs/HtmlTextarea";
import useCategoryManagerStore from "@/stores/settings/useCategoryManagerStore";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function AddSubCategoryModal({ mode = "ADD" }) {
  const {
    addSubCategory,
    selectedSubCategory,
    updateSubCate,
    selectedCategory,
    subCategoryApiLoading,
  } = useCategoryManagerStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      name: selectedSubCategory?.name || "",
      description: selectedSubCategory?.description || "",
      isActive: selectedSubCategory ? selectedSubCategory.is_active : true,
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const addSubCategoryFunc = async (data) => {
    if (mode === "ADD") {
      try {
        await addSubCategory({
          category_id: selectedCategory.id,
          name: data.name,
          description: data.description,
          is_active: data.isActive,
        });
      } catch (error) {
        console.error("Add Flags failed:", error);
      }
    } else {
      try {
        await updateSubCate(
          {
            name: data.name,
            description: data.description,
            is_active: data.isActive,
          },
          selectedSubCategory.id,
        );
      } catch (error) {
        console.error("Edit Flag Group failed:", error);
      }
    }
  };

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(addSubCategoryFunc)}
          className="custom_form_style flex flex-col justify-between mt-3"
        >
          <div className="space-y-2">
            <div className="w-full">
              <HtmlInput
                label="Sub-category Name"
                name="name"
                placeHolder="Enter sub-category name"
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
                placeHolder="Enter sub-category name"
                htmlFor="description"
                id="description"
                required={true}
                maxlength="300"
                error={errors.description}
              />
            </div>

            <div className="px-3 mb-3 border border-gray-300 rounded-lg">
              <HtmlCheckBox label="Active" name="isActive" id="isActive" />
            </div>
          </div>
          <div className="mt-2">
            <Btn
              type="submit"
              isLoading={subCategoryApiLoading}
              disabled={subCategoryApiLoading}
              btnName={
                mode === "ADD" ? "Add Sub-category" : "Update Sub-category"
              }
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
