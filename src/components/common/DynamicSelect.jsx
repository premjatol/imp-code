"use client";

import React from "react";
import dynamic from "next/dynamic";
import { components } from "react-select";

// ✅ disable SSR
const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

const DynamicSelect = ({
  options = [],
  value = null,
  defaultValue = null,
  onChange = () => {},
  isDisabled = false,
  isMulti = false,
  placeholder = "Select...",
  isLoading = false,
  className = "",
}) => {
  // Custom small caret icon
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.5 7.5L10 12l4.5-4.5" />
        </svg>
      </components.DropdownIndicator>
    );
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      fontSize: "12px",
      borderWidth: "1px",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: "none",
      minHeight: "34px",
      height: "34px",
      borderRadius: "8px",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
    }),

    input: (base) => ({
      ...base,
      margin: "0px",
      padding: "0px",
    }),

    menu: (base) => ({
      ...base,
      fontSize: "12px",
      borderRadius: "8px",
      cusror: "pointer",
    }),

    singleValue: (base) => ({
      ...base,
      fontSize: "12px",
      cusror: "pointer",
    }),

    indicatorSeparator: () => ({
      display: "none", // remove middle line
    }),
  };

  return (
    <div className={className}>
      <Select
        options={options}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        isDisabled={isDisabled}
        isMulti={isMulti}
        placeholder={placeholder}
        isLoading={isLoading}
        isClearable={false}
        styles={customStyles}
        components={{
          DropdownIndicator,
        }}
      />
    </div>
  );
};

export default DynamicSelect;
