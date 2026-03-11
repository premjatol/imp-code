import useFormValidation from "@/lib/FormValidation";
import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const HtmlTextEditor = ({ placeholder, label, name, required, id }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "Start typings...",
    }),
    [placeholder]
  );

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const isEditorEmpty = (value) => {
    return !value || value === "<p><br></p>" || value.trim() === "";
  };

  const allValidations = useFormValidation();


  return (
    <>
      <label className="form-label text-black">
        {label}
        {required && <sup className="text-danger">*</sup>}
      </label>
      <div className={`${errors[name] ? " is-invalid" : ""}`}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <JoditEditor
              {...field}
              id={id}
              ref={editor}
              value={content}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={(newContent) => {
                setContent(newContent);
                field.onChange(newContent);
              }}
              onChange={(newContent) => {
                setContent(newContent);
                field.onChange(newContent);
              }}
            />
          )}
          rules={
            required && {
              required: allValidations.required.message,
              validate: (value) =>
                !isEditorEmpty(value) || allValidations.required.message,
            }
          }
        />
      </div>
      {errors[name]?.message && (
        <div className="invalid-feedback">{errors[name].message}</div>
      )}
    </>
  );
};

export default HtmlTextEditor;
