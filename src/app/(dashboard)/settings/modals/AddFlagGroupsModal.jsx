import Btn from "@/components/common/Btn";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlTextarea from "@/components/form-inputs/HtmlTextarea";
import useFlagManagerStore from "@/stores/settings/useFlagManagerStore";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function AddFlagGroupsModal({ mode = "ADD" }) {
  const { addFlagGroup, editFlagGroup, selectedGroup, flagGroupApiLoading } =
    useFlagManagerStore();

  console.log(selectedGroup);

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      name: selectedGroup?.name || "",
      description: selectedGroup?.description || "",
      is_active: selectedGroup?.is_active ?? true,
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const addFlagGroups = async (data) => {
    if (mode === "ADD") {
      try {
        await addFlagGroup({
          name: data.name,
          description: data.description,
          is_active: data.is_active,
        });
      } catch (error) {
        console.error("Add Flag Group failed:", error);
      }
    } else {
      try {
        await editFlagGroup(
          {
            name: data.name,
            description: data.description,
            is_active: data.is_active,
          },
          selectedGroup.id,
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
          onSubmit={handleSubmit(addFlagGroups)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between mt-3"
        >
          <div className="space-y-3">
            <div className="w-full">
              <HtmlInput
                label="Flag Group Name"
                name="name"
                placeHolder="Enter flag group name"
                htmlFor="name"
                id="name"
                required={true}
                maxlength="30"
                validCriteria={["whitespace"]}
                error={errors.name}
              />
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
              <HtmlCheckBox
                label={watch("is_active") ? "Active" : "Inactive"}
                name="is_active"
                id="is_active"
              />
            </div>
          </div>
          <div className="mt-3">
            <Btn
              type="submit"
              isLoading={flagGroupApiLoading}
              disabled={flagGroupApiLoading}
              btnName={
                mode === "ADD" ? "Add New Flag Group" : "Update Flag Group"
              }
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
