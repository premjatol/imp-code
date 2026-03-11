import { useTranslation } from "react-i18next";

const useFormValidation = () => {
  const { t } = useTranslation();

  const validations = {
    required: {
      message: "This field is required",
    },
    whitespace: {
      // pattern: /^(?!\s*$).+/i,
      pattern: /^\s+|\s+$/,
      message: "Please enter a value without leading or trailing whitespace",
    },
    email: {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Please enter a valid email address",
    },
    password: {
      pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
      match_password: "Passwords do not match",
    },
    alphabetOnly: {
      pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ\s']+$/u,
      message: "Please enter only alphabetic characters",
    },
    numbersOnly: {
      pattern: /^[0-9]+$/,
      message: "Please enter only numeric characters",
    },
    matchPassword: {
      message: "Passwords do not match",
    },
    numberNotZero: {
      pattern: /^[1-9]\d*$/,
      message: "Please enter a number greater than zero",
    },
    matchPin: {
      message: "PINs do not match",
    },
    matchUrl: {
      pattern: /^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:\d+)?(\/[^\s]*)?$/,
      message: "Please enter a valid URL",
    },
    numberMaxHundred: {
      pattern: /^(100(\.00?)?|[1-9]?\d(\.\d{1,2})?)$/,
      message: "Please enter a number less than or equal to 100",
    },
    amountExceeds: {
      message: "Amount exceeds the allowed limit",
    },
    numberEqualExceeds: {
      message: "Number exceeds the allowed limit",
    },
    amountMinimum: {
      message: "Amount is less than the minimum allowed",
    },
    decimalNumber: {
      pattern: /^(?!0(\.0+)?$)(\d+(\.\d+)?|\.\d+)$/,
      message: "Please enter a valid decimal number",
    },
  };

  return validations;
};

export default useFormValidation;
