import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function AddNewCategory({
  onClose,
  tasksSection,
  setTasksSection,
}) {
  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {},
  });

  const { handleSubmit, watch, reset, setValue } = methods;
  const { t } = useTranslation();
  const createNewFolder = (data) => {
    const oldCategories = [...tasksSection];

    const newCategory = {
      title: data.category,
      slug: data.category,
      icon: (
        <span className="text-[10px] leading-none border border-gray-500 rounded-xs px-0.5">
          CT
        </span>
      ),

      ...(data.subcategory && {
        subCat: {
          title: data.subcategory,
          slug: data.subcategory,
        },
      }),

      count: 1,
    };

    const updatedCategories = [...oldCategories, newCategory];
    setTasksSection(updatedCategories);
    onClose();
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
              label={"Category"}
              name="category"
              placeHolder={"Enter category name"}
              htmlFor="category"
              id="category"
              required={true}
              maxlength="20"
              validCriteria={["whitespace"]}
            />
            <HtmlInput
              label={"Sub-category"}
              name="subcategory"
              placeHolder={"Enter sub-category name"}
              htmlFor="subcategory"
              id="subcategory"
              maxlength="20"
              validCriteria={["whitespace"]}
            />
          </div>
          <div className="mt-5">
            <Btn type="submit" btnName={"Submit"} />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
