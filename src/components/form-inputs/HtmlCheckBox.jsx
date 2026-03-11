"use client";

import { useFormContext } from "react-hook-form";
import useFormValidation from "@/lib/FormValidation";

const HtmlCheckBox = ({
  label,
  name,
  id,
  required,
  disabled = false,
  value,
  error,
}) => {
  const {
    register,
  } = useFormContext();

  const allValidations = useFormValidation();
  const inputId = id || name;

  return (
    <div className="w-full font-sans">
      <div
        className={`flex items-center justify-between w-full py-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {/* Label Text comes first now */}
        {label && (
          <label
            htmlFor={inputId}
            className={`select-none ${disabled ? "cursor-not-allowed" : "cursor-pointer"} transition-colors text-xs text-(--foreground)`}
          >
            {label}
          </label>
        )}

        {/* Toggle UI container pushed to the right */}
        <div
          className={`relative inline-flex items-center ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <input
            type="checkbox"
            id={inputId}
            value={value}
            className={`sr-only peer ${disabled ? "cursor-not-allowed" : ""}`}
            disabled={disabled}
            {...register(
              name,
              required && {
                required: allValidations.required.message,
              },
            )}
          />

          {/* Visual Track */}
          <label
            htmlFor={inputId}
            className={`
              w-10 h-5 rounded-full
              bg-slate-300
              transition-colors duration-300
              peer-checked:bg-primary 
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          />

          {/* Toggle Knob */}
          <span
            className="
              pointer-events-none
              absolute left-0.5 top-0.5
              w-4 h-4 rounded-full bg-white shadow
              transition-transform duration-300
              peer-checked:translate-x-5
            "
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-1 text-xs text-red-500 font-bold text-right">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default HtmlCheckBox;
