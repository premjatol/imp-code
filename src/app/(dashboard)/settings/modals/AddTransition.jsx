import Btn from "@/components/common/Btn";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useStatusManagerStore from "@/stores/settings/useStatusManagerStore";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import { roleLabelsOfStatusModal, statusModalKeys } from "@/lib/getEnum";
import { useTranslation } from "react-i18next";

export default function AddTransition({ isEditMode }) {
  const { isApiLoading, addTransition, selectedTemplate } =
    useStatusManagerStore();
  const { t } = useTranslation();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    // defaultValues: isEditMode && {
    //   name: selectedTemplate.name || "",
    //   version: selectedTemplate.version || "",
    //   description: selectedTemplate.description || "",
    //   is_active: selectedTemplate.is_active ?? false,
    //   is_default: selectedTemplate.is_default ?? false,
    // },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const selectedRoles = watch("allowedRoles") || [];

  const saveTransition = async (data) => {
    const body = {
      ...data,
      from_status_key: data.from_status_key.value,
      to_status_key: data.to_status_key.value,
    };

    await addTransition(body, selectedTemplate?.id);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(saveTransition)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between px-6 mt-3"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-2">
              <div className="w-full">
                <HtmlSelect
                  label="From status key"
                  name="from_status_key"
                  htmlFor="from_status_key"
                  id="from_status_key"
                  options={statusModalKeys.map((s) => ({
                    label: t(s),
                    value: s,
                  }))}
                  required={true}
                  error={errors.from_status_key}
                />
              </div>
              <div className="w-full">
                <HtmlSelect
                  label="To status key"
                  name="to_status_key"
                  htmlFor="to_status_key"
                  id="to_status_key"
                  options={statusModalKeys.map((s) => ({
                    label: t(s),
                    value: s,
                  }))}
                  required={true}
                  error={errors.to_status_key}
                />
              </div>
            </div>

            <div className="w-full">
              <label className="text-sm mb-4 block">Allow Role</label>
              <div className="flex flex-wrap gap-3">
                {roleLabelsOfStatusModal.map((role) => {
                  const isSelected = selectedRoles?.includes(role);

                  return (
                    <button
                      type="button"
                      key={role}
                      onClick={() => {
                        let updatedRoles;

                        if (isSelected) {
                          updatedRoles = selectedRoles?.filter(
                            (r) => r !== role,
                          );
                        } else {
                          updatedRoles = [...selectedRoles, role];
                        }

                        setValue("allowedRoles", updatedRoles, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer
                        ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                    >
                      {t(role)}
                    </button>
                  );
                })}

                {/* Hidden input to register with RHF */}
                <input
                  type="hidden"
                  {...methods.register("allowedRoles", {
                    validate: (value) =>
                      (value && value.length > 0) || "Select at least one role",
                  })}
                />
              </div>
              {errors?.allowedRoles && (
                <span className="text-red-500 text-xs">
                  {errors.allowedRoles.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <Btn
              type="submit"
              btnName={"Add transtion"}
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
