"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, { components } from "react-select";
import useFormValidation from "@/lib/FormValidation";
import { useTranslation } from "react-i18next";

const HtmlSelect = ({
  label,
  name,
  id,
  htmlFor,
  required,
  isMulti,
  options, // [{label: "Active", value: "active"}]
  defaultValue,
  menuPlacement,
  onChangeFunc,
  labelCss,
  inputCss,
  additionalClasses,
  placeholder,
  disabled = false,
  isClearable = false,
  error,
}) => {
  const { control } = useFormContext();

  const allValidations = useFormValidation();
  const { t } = useTranslation();

  const { Option, SingleValue } = components;

  const IconOption = (props) => (
    <Option {...props}>
      <img
        src={`/assets/images/flags/${props.data.icon}`}
        className="react-select-list-icon"
        alt={props.data.label}
      />
      {props.data.label}
    </Option>
  );

  const IconSingleValue = ({ children, ...props }) => (
    <SingleValue {...props}>
      <img
        src={`/assets/images/flags/${props.data.icon}`}
        className="react-select-list-icon"
        alt={props.data.label}
      />
      {children}
    </SingleValue>
  );

  const hasIcon = options?.some((item) => "icon" in item);

  const styles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "6px",
      border: "1px solid",
      borderColor: disabled
        ? "#d1d5db"
        : state.isFocused
          ? "var(--color-primary)"
          : "var(--color-gray)", // default gray
      boxShadow: "none",
      outline: "none",
      backgroundColor: disabled ? "#f5f5f5" : "white",
      cursor: disabled ? "not-allowed" : "pointer",
      "&:hover": {
        borderColor: state.isFocused
          ? "var(--color-primary)"
          : "var(--color-gray)", // keep gray on hover
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "12px",
      backgroundColor: state.isFocused ? "#f3e9f9" : "white",
      color: "black",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: "12px",
    }),
  };

  return (
    <>
      {label && (
        <label
          htmlFor={htmlFor}
          className={`html-label-css ${labelCss ? labelCss : ""}`}
        >
          {label}
          {required && <sup className="text-red-astrisk">*</sup>}
        </label>
      )}
      <div className={additionalClasses ? additionalClasses : ""}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue ?? (isMulti ? [] : null)}
          rules={required ? { required: allValidations.required.message } : {}}
          render={({ field }) => (
            <Select
              {...field}
              isMulti={isMulti ?? false}
              isClearable={!isMulti && isClearable}
              options={options}
              className={inputCss ? inputCss : "custom_select"}
              menuPlacement={menuPlacement}
              placeholder={placeholder || t("SELECT_AN_OPTION")}
              isDisabled={disabled}
              onChange={(selectedOption) => {
                field.onChange(selectedOption);
                if (onChangeFunc) {
                  const value = isMulti
                    ? selectedOption?.map((o) => o.value)
                    : selectedOption?.value;
                  onChangeFunc(value);
                }
              }}
              styles={{
                ...styles,
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
              components={
                hasIcon
                  ? { Option: IconOption, SingleValue: IconSingleValue }
                  : undefined
              }
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          )}
        />
      </div>

      {/* show error */}
      {error && (
        <span className="text-red-500 text-xs mt-1">{error.message}</span>
      )}
    </>
  );
};

export default HtmlSelect;
