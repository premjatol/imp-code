import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import useFormValidation from "@/lib/FormValidation";

const HtmlTextarea = ({
  name,
  label,
  id,
  required = false, // Add a default value
  htmlFor,
  placeHolder,
  rows,
  maxlength,
  labelCss,
  readOnly,
  error,
  additionalClass,
}) => {
  const { register } = useFormContext();

  let allValidations = useFormValidation();
  const { t } = useTranslation();

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
      <textarea
        readOnly={readOnly || false}
        rows={rows}
        name={name}
        id={id}
        placeholder={placeHolder ? placeHolder : null}
        maxLength={maxlength}
        autoComplete="off"
        className={`${
          additionalClass ? additionalClass : ""
        } html-textarea-css h-full`}
        {...register(name, {
          required: required ? allValidations.required.message : false,
          ...(maxlength && {
            maxLength: {
              value: maxlength,
              message: `Max characters limit is ${maxlength}`,
            },
          }),
        })}
      />

      {/* error */}
      {error && (
        <span className="text-red-500 text-xs mt-1">{error.message}</span>
      )}
    </>
  );
};

export default HtmlTextarea;
