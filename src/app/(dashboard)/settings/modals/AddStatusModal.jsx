import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import useStatusManagerStore from "@/stores/settings/useStatusManagerStore";
import {
  requestLabelsOfStatusModal,
  roleLabelsOfStatusModal,
  statusModalKeys,
} from "@/lib/getEnum";
import { useTranslation } from "react-i18next";
import useFlagManagerStore from "@/stores/settings/useFlagManagerStore";

export default function AddStatusModal({ isEditMode }) {
  const {
    selectedTemplate,
    addStatus,
    selectedStatus,
    editStatus,
    isApiLoading,
  } = useStatusManagerStore();
  const { getFlagGroups, flagGroup } = useFlagManagerStore();
  const { t } = useTranslation();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: isEditMode && {
      key: { label: t(selectedStatus.key), value: selectedStatus.key },
      label: selectedStatus.label,
      level: { label: selectedStatus.level, value: selectedStatus.level },
      colorCode: selectedStatus.color,
      displayColor: selectedStatus.color,
      role_visibility: selectedStatus.roleVisibility || [],
      requirements: selectedStatus.requirements || [],
      flagGroupKey:
        {
          label: selectedStatus.flagGroupKey,
          value: selectedStatus.flagGroupKey,
        } || {},
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    clearErrors,
    setError,
    setValue,
    formState: { errors },
  } = methods;

  const selectedRoles = watch("role_visibility") || [];
  const displayColor = watch("displayColor");
  const rawRequirements = watch("requirements");

  const requirements = Array.isArray(rawRequirements)
    ? rawRequirements
    : rawRequirements
      ? [rawRequirements]
      : [];

  useEffect(() => {
    if (displayColor) {
      setValue("colorCode", displayColor);
    }
  }, [displayColor, setValue]);

  useEffect(() => {
    if (requirements.includes("FLAGS_REQUIRED")) {
      getFlagGroups();
    }
  }, [rawRequirements]);

  useEffect(() => {
    if (watch("key")?.value === "DRAFT") {
      setValue("requirements", []);
      clearErrors("requirements");
      setValue("flagGroupKey", null);
    }
  }, [watch("key")]);

  const saveStatus = async (formData) => {
    const statusKey = formData?.key?.value;

    // --- Validate role visibility ---
    if (!formData?.role_visibility || formData.role_visibility.length === 0) {
      setError("role_visibility", {
        type: "manual",
        message: "Select at least one role",
      });
      return;
    }

    // --- Validate requirements (except DRAFT) ---
    if (
      (!formData?.requirements || formData.requirements.length === 0) &&
      statusKey !== "DRAFT"
    ) {
      setError("requirements", {
        type: "manual",
        message: "Select at least one requirement",
      });
      return;
    }

    // --- Build status object ---
    const newStatus = {
      key: statusKey || null,
      label: formData.label || t(statusKey),
      level: Number(formData?.level?.value) || 1,
      color: formData.displayColor || "#000000",
      roleVisibility: formData.role_visibility,
      requirements: statusKey !== "DRAFT" ? formData.requirements : [],
      ...(formData?.flagGroupKey && {
        flagGroupKey: formData.flagGroupKey.value,
      }),
    };

    // --- Remove flagGroupKey if FLAGS_REQUIRED is not selected ---
    const requirements = formData?.requirements || [];

    const hasFlagsRequired =
      Array.isArray(requirements) && requirements.includes("FLAGS_REQUIRED");

    if (!hasFlagsRequired && statusKey !== "DRAFT") {
      delete newStatus.flagGroupKey;
    }

    // --- Save or Update ---
    if (!isEditMode) {
      await addStatus(newStatus, selectedTemplate.id);
    } else {
      delete newStatus.key; // key cannot be edited
      await editStatus(newStatus, selectedStatus.id);
    }
  };

  const hasFlagsRequired =
    Array.isArray(requirements) && requirements.includes("FLAGS_REQUIRED");

  const isDraft = watch("key")?.value === "DRAFT";

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(saveStatus)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between mt-3"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="w-full">
                <HtmlSelect
                  label="Status Key"
                  name="key"
                  htmlFor="key"
                  options={statusModalKeys.map((i) => ({
                    value: i,
                    label: t(i),
                  }))}
                  id="key"
                  disabled={isEditMode}
                  required={true}
                  validCriteria={["required", "whitespace"]}
                  error={errors.key}
                  additionalClasses="cursor-not-allowed"
                />
              </div>
              <div className="w-full">
                <HtmlInput
                  label="Display Label"
                  name="label"
                  htmlFor="label"
                  id="label"
                  placeHolder={"Add label name"}
                  maxlength="100"
                  required={true}
                  validCriteria={["required", "whitespace"]}
                  error={errors.label}
                />
              </div>
              <div className="w-full">
                <HtmlSelect
                  label="Progress Level (1-10)"
                  name="level"
                  htmlFor="level"
                  options={[
                    { label: 1, value: 1 },
                    { label: 2, value: 2 },
                    { label: 3, value: 3 },
                    { label: 4, value: 4 },
                    { label: 5, value: 5 },
                    { label: 6, value: 6 },
                    { label: 7, value: 7 },
                    { label: 8, value: 8 },
                    { label: 9, value: 9 },
                    { label: 10, value: 10 },
                  ]}
                  id="level"
                  required={true}
                  error={errors.level}
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
                    required={true}
                    validCriteria={["required", "whitespace"]}
                    error={errors.displayColor}
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
            </div>
            <div className="w-full">
              <label className="text-sm mb-4 block">Role Visibility</label>
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

                        setValue("role_visibility", updatedRoles, {
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
                  {...methods.register("role_visibility", {
                    validate: (value) =>
                      (value && value.length > 0) || "Select at least one role",
                  })}
                />
              </div>
              {errors?.role_visibility && (
                <span className="text-red-500 text-xs">
                  {errors.role_visibility.message}
                </span>
              )}
            </div>
            <div className="w-full">
              <label className="text-sm mb-4 block">Requirements</label>
              <div className="grid grid-cols-2 space-x-5 space-y-3">
                {requestLabelsOfStatusModal.map((r) => (
                  <div
                    key={r}
                    className={`px-3 py-1 border border-gray-300 rounded-lg ${
                      isDraft ? "opacity-50" : ""
                    }`}
                  >
                    <HtmlCheckBox
                      label={t(r)}
                      name={"requirements"}
                      id={r}
                      value={r}
                      disabled={isDraft}
                    />
                  </div>
                ))}
                <div></div>
              </div>
              {errors?.requirements && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.requirements.message}
                </p>
              )}

              {/* flag group required or not */}
              {!isDraft && hasFlagsRequired && (
                <div className="w-full">
                  <HtmlSelect
                    label="Flag group key"
                    name="flagGroupKey"
                    id="flagGroupKey"
                    options={
                      flagGroup?.map((f) => ({
                        label: f.name_norm,
                        value: f.name_norm,
                      })) || []
                    }
                    required
                    error={errors.flagGroupKey}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mt-3">
            <Btn
              type="submit"
              isLoading={isApiLoading}
              disabled={isApiLoading}
              btnName="Add Status"
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
