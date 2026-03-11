import Btn from "@/components/common/Btn";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import useTagsManagerStore from "@/stores/settings/useTagsManagerStore";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function AddTagModal({ mode = "ADD" }) {
  const { addTag, selectedTag, updateTag, tagListApiLoading } =
    useTagsManagerStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      name: selectedTag?.name || "",
      displayColor: selectedTag?.color || "#000000",
      colorCode: selectedTag?.color || "#000000",
      isActive: selectedTag ? selectedTag.is_active : true,
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const displayColor = watch("displayColor");
    if (displayColor) {
      setValue("colorCode", displayColor);
    }
  }, [watch("displayColor")]);

  const addTags = async (data) => {
    if (mode === "ADD") {
      try {
        await addTag({
          name: data.name,
          is_active: data.isActive,
        });
      } catch (error) {
        console.error("Add Tag failed:", error);
      }
    } else {
      try {
        await updateTag(
          {
            name: data.name,
            is_active: data.isActive,
          },
          selectedTag.id,
        );
      } catch (error) {
        console.error("Edit Tag failed:", error);
      }
    }
  };

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(addTags)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between mt-3"
        >
          <div className="space-y-3">
            <div className="w-full">
              <HtmlInput
                label="Tag Name"
                name="name"
                placeHolder="Enter tag name"
                htmlFor="name"
                id="name"
                required={true}
                maxlength=""
                validCriteria={["required"]}
                error={errors.name}
              />
            </div>
            <div className="px-3 py-1 border border-gray-300 rounded-lg">
              <HtmlCheckBox label="Active" name="isActive" id="isActive" />
            </div>
          </div>
          <div className="mt-6">
            <Btn
              type="submit"
              isLoading={tagListApiLoading}
              disabled={tagListApiLoading}
              btnName={mode === "ADD" ? "Add New Tag" : "Update Tag"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
