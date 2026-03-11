import Btn from "@/components/common/Btn";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlTextarea from "@/components/form-inputs/HtmlTextarea";
import useCategoryManagerStore from "@/stores/settings/useCategoryManagerStore";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function AddCategoryModal({ mode = "ADD" }) {
  const { addCategory, editCategory, selectedCategory, categoryApiLoading } =
    useCategoryManagerStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      name: selectedCategory?.name || "",
      description: selectedCategory?.description || "",
      displayColor: selectedCategory?.color || "#000000",
      colorCode: selectedCategory?.color || "#000000",
      isActive: selectedCategory ? selectedCategory.is_active : true,
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const addCategoryFunc = async (data) => {
    if (mode === "ADD") {
      try {
        await addCategory({
          name: data.name,
          description: data.description,
          color: data.displayColor,
          is_active: data.isActive,
        });
      } catch (error) {
        console.error("Add Category failed:", error);
      }
    } else {
      try {
        await editCategory(
          {
            name: data.name,
            description: data.description,
            color: data.displayColor,
            is_active: data.isActive,
          },
          selectedCategory.id,
        );
      } catch (error) {
        console.error("Edit Category failed:", error);
      }
    }
  };

  useEffect(() => {
    const displayColor = watch("displayColor");
    if (displayColor) {
      setValue("colorCode", displayColor);
    }
  }, [watch("displayColor")]);

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(addCategoryFunc)}
          className="custom_form_style flex flex-col justify-between mt-3"
        >
          <div className="space-y-2">
            <div className="w-full">
              <HtmlInput
                label="Category Name"
                name="name"
                placeHolder="Enter Category name"
                htmlFor="name"
                id="name"
                required={true}
                maxlength="30"
                validCriteria={["required", "whitespace"]}
                error={errors.name}
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-20">
                <HtmlInput
                  name="displayColor"
                  id="displayColor"
                  htmlFor="displayColor"
                  label={"Color"}
                  inputType="color"
                  additionalClass="h-[38px]"
                  validCriteria={["whitespace"]}
                />
              </div>
              <div className="mt-7 w-full">
                <HtmlInput
                  name="colorCode"
                  id="colorCode"
                  htmlFor="colorCode"
                  inputType="text"
                  disabled={true}
                  readOnly={true}
                />
              </div>
            </div>
            <div className="w-full">
              <HtmlTextarea
                label="Description"
                name="description"
                placeHolder="Enter description"
                htmlFor="description"
                id="description"
                maxlength="300"
                error={errors.description}
              />
            </div>
            <div className="px-3 border border-gray-300 rounded-lg">
              <HtmlCheckBox label="Active" name="isActive" id="isActive" />
            </div>
          </div>
          <div className="mt-3">
            <Btn
              type="submit"
              isLoading={categoryApiLoading}
              disabled={categoryApiLoading}
              btnName={mode === "ADD" ? "Add New Category" : "Update Category"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
