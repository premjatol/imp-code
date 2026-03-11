import Btn from "@/components/common/Btn";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import useFlagManagerStore from "@/stores/settings/useFlagManagerStore";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function AddFlagModal({ mode = "ADD" }) {
  const {
    addFlag,
    selectedFlag,
    updateFlag,
    selectedGroup,
    flagListApiLoading,
  } = useFlagManagerStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      name: selectedFlag?.label || "",
      is_active: selectedFlag?.is_active ?? true,
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const addFlags = async (data) => {
    if (mode === "ADD") {
      try {
        await addFlag(
          {
            label: data.name,
            is_active: data.is_active,
          },
          selectedGroup.id,
        );
      } catch (error) {
        console.error("Add Flags failed:", error);
      }
    } else {
      try {
        await updateFlag(
          {
            label: data.name,
            is_active: data.is_active,
          },
          selectedFlag.id,
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
          onSubmit={handleSubmit(addFlags)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between mt-3"
        >
          <div className="space-y-3">
            <div className="w-full">
              <HtmlInput
                label="Flag Name"
                name="name"
                placeHolder="Enter flag name"
                htmlFor="name"
                id="name"
                required={true}
                maxlength="40"
                validCriteria={["required"]}
                error={errors.name}
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
          <div className="mt-6">
            <Btn
              type="submit"
              isLoading={flagListApiLoading}
              disabled={flagListApiLoading}
              btnName={mode === "ADD" ? "Add New Flag" : "Update Flag"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
