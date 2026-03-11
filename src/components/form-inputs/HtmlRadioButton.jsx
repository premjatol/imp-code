import { useFormContext, Controller } from "react-hook-form";
import useFormValidation from "@/lib/FormValidation";

const HtmlRadioButton = ({ name, required, choices }) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  let allValidations = useFormValidation();
  return (
    <>
      <div
        className={`custom_radio d-flex flex-wrap gap-3 ${
          errors[name] ? " is-invalid" : ""
        }`}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) =>
            choices.map((e) => (
              <div key={e.value} className="form-check">
                <input
                  {...field}
                  type="radio"
                  defaultChecked={e.defaultChecked ? e.defaultChecked : false}
                  id={e.value}
                  value={e.value}
                  className="form-check-input"
                />
                <label htmlFor={e.value}>{e.label}</label>
              </div>
            ))
          }
          rules={{ required: required && allValidations.required.message }}
        />
      </div>
      {errors[name] && (
        <div className="invalid-feedback">{errors[name].message}</div>
      )}
    </>
  );
};

export default HtmlRadioButton;
