"use client";

import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import useFormValidation from "@/lib/FormValidation";

const HtmlInput = ({
  label,
  id,
  htmlFor,
  inputType = "text",
  name,
  required,
  additionalClass,
  labelCss,
  maxlength,
  minLength,
  onChange,
  pattern,
  placeHolder,
  validCriteria,
  watchTo,
  autoFocus,
  disabled,
  defaultValue = "",
  readOnly,
  eyeButton = false,
  error,
}) => {
  const { register, watch } = useFormContext();

  const allValidations = useFormValidation();
  const [passwordView, setPasswordView] = useState(false);

  return (
    <>
      {label && (
        <label
          htmlFor={htmlFor}
          className={`${labelCss ? labelCss : "html-label-css"}`}
        >
          {label}
          {required && label && <sup className="text-red-astrisk">*</sup>}
        </label>
      )}
      <div className="relative">
        <input
          readOnly={readOnly || false}
          type={eyeButton ? (passwordView ? "text" : "password") : inputType}
          name={name}
          placeholder={placeHolder}
          autoComplete="false"
          autoFocus={autoFocus}
          className={`${
            additionalClass ? additionalClass : ""
          } text-input-css ${
            disabled || readOnly ? "text-gray-500 cursor-not-allowed" : ""
          }`}
          id={id}
          label={label}
          maxLength={maxlength}
          minLength={minLength}
          onChange={onChange}
          disabled={disabled}
          defaultValue={defaultValue}
          {...register(
            name,
            required
              ? {
                  required: allValidations.required.message,
                  pattern: pattern && {
                    value: new RegExp(pattern),
                    message: "Invailid value",
                  },
                  maxLength: maxlength && {
                    value: maxlength,
                    message: `This field should have maximum ${maxlength} limit`,
                  },
                  minLength: minLength && {
                    value: minLength,
                    message: `This field should have minimum ${minLength} limit`,
                  },

                  validate: {
                    whitespace: (val) => {
                      if (
                        typeof val === "string" &&
                        val !== "" &&
                        validCriteria?.includes("whitespace")
                      ) {
                        return (
                          val.trim().length > 0 ||
                          allValidations.whitespace.message
                        );
                      }
                      return true;
                    },

                    numbersOnly: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex((p) => p === "numbersOnly") !=
                          -1
                      ) {
                        return (
                          allValidations.numbersOnly.pattern.test(val) ||
                          allValidations.numbersOnly.message
                        );
                      }
                      return true;
                    },
                    email: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex((p) => p === "email") != -1
                      ) {
                        return (
                          allValidations.email.pattern.test(val) ||
                          allValidations.email.message
                        );
                      }
                      return true;
                    },
                    alphabetOnly: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex((p) => p === "alphabetOnly") !=
                          -1
                      ) {
                        return (
                          allValidations.alphabetOnly.pattern.test(val) ||
                          allValidations.alphabetOnly.message
                        );
                      }
                      return true;
                    },
                    password: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex((p) => p === "password") != -1
                      ) {
                        return (
                          allValidations.password.pattern.test(val) ||
                          allValidations.password.message
                        );
                      }
                      return true;
                    },
                    matchPassword: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex(
                          (p) => p === "matchPassword",
                        ) != -1
                      ) {
                        const passwordValue = watch(watchTo);
                        return (
                          val === passwordValue ||
                          allValidations.matchPassword.message
                        );
                      }
                      return true;
                    },
                    numberNotZero: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex(
                          (p) => p === "numberNotZero",
                        ) != -1
                      ) {
                        return (
                          allValidations.numberNotZero.pattern.test(val) ||
                          allValidations.numberNotZero.message
                        );
                      }
                      return true;
                    },
                    matchPin: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex((p) => p === "matchPin") != -1
                      ) {
                        const pinValue = watch(watchTo);
                        return (
                          val === pinValue || allValidations.matchPin.message
                        );
                      }
                      return true;
                    },
                    numberMaxHundred: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex(
                          (p) => p === "numberMaxHundred",
                        ) != -1
                      ) {
                        return (
                          allValidations?.numberMaxHundred.pattern.test(val) ||
                          allValidations?.numberMaxHundred.message
                        );
                      }
                      return true;
                    },
                    amountExceeds: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex(
                          (p) => p === "amountExceeds",
                        ) != -1
                      ) {
                        const amountValue = parseFloat(watch(watchTo));
                        val = parseFloat(val);
                        return (
                          val > amountValue ||
                          allValidations?.amountExceeds.message
                        );
                      }
                      return true;
                    },
                    numberEqualExceeds: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex(
                          (p) => p === "numberEqualExceeds",
                        ) != -1
                      ) {
                        const amountValue = parseFloat(watch(watchTo));
                        val = parseFloat(val);
                        return (
                          val >= amountValue ||
                          allValidations?.numberEqualExceeds.message
                        );
                      }
                      return true;
                    },
                    amountMinimum: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex(
                          (p) => p === "amountMinimum",
                        ) != -1
                      ) {
                        const amountValue = parseFloat(watch(watchTo));
                        val = parseFloat(val);
                        return (
                          val < amountValue ||
                          allValidations?.amountMinimum.message
                        );
                      }
                      return true;
                    },
                    decimalNumber: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex(
                          (p) => p === "decimalNumber",
                        ) != -1
                      ) {
                        return (
                          allValidations?.decimalNumber.pattern.test(val) ||
                          allValidations?.decimalNumber.message
                        );
                      }
                      return true;
                    },
                    matchUrl: (val) => {
                      if (
                        val !== "" &&
                        validCriteria?.findIndex((p) => p === "matchUrl") != -1
                      ) {
                        return (
                          allValidations?.matchUrl.pattern.test(val) ||
                          allValidations?.matchUrl.message
                        );
                      }
                      return true;
                    },
                  },
                }
              : {},
          )}
        />
        {eyeButton &&
          (passwordView ? (
            <span
              onClick={() => setPasswordView(false)}
              className="absolute top-1/2 -translate-1/2 right-2 cursor-pointer"
            >
              <AiOutlineEyeInvisible fontSize={18} />
            </span>
          ) : (
            <span
              onClick={() => setPasswordView(true)}
              className="absolute top-1/2 -translate-1/2 right-2 cursor-pointer"
            >
              <AiOutlineEye fontSize={18} />
            </span>
          ))}
      </div>

      {/* show error */}
      {error && (
        <span className="text-red-500 text-xs mt-1">{error.message}</span>
      )}
    </>
  );
};

export default HtmlInput;
