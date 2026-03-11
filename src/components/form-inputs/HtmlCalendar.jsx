import { Controller, useFormContext } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import useFormValidation from "@/lib/FormValidation";

const HtmlCalendar = ({
  htmlFor,
  label,
  name,
  id,
  required,
  setDefaultDateInPicker,
  parentCss,
  additionClass,
  HtmllabelCss,
  placeholderText,
  minDate,
  maxDate,
  isDateRange = false,
  disabled,
  disableToday,
  yearPicker,
}) => {
  let allValidations = useFormValidation();
  const {
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <>
      <div className={parentCss ? parentCss : "grid grid-cols-2 items-center"}>
        {label && (
          <label
            htmlFor={htmlFor}
            className={`${
              HtmllabelCss ? HtmllabelCss : ""
            } html-label-css pb-0.5`}
          >
            {label}
            {required && <sup className="text-red-astrisk">*</sup>}
          </label>
        )}
        <Controller
          name={name}
          control={control}
          id={id}
          defaultValue={
            setDefaultDateInPicker || (isDateRange ? [null, null] : null)
          }
          render={({ field }) =>
            isDateRange ? (
              <DatePicker
                {...field}
                selectsRange
                startDate={field.value ? field.value[0] : null}
                endDate={field.value ? field.value[1] : null}
                onChange={(update) => {
                  field.onChange(update);
                }}
                onChangeRaw={(e) => e.preventDefault()}
                className={`date-picker ${additionClass ? additionClass : ""}`}
                dateFormat={yearPicker ? "yyyy" : "dd/MM/yyyy"}
                showYearPicker={yearPicker}
                showIcon
                icon={<FaRegCalendarAlt fill="black" />}
                toggleCalendarOnIconClick
                minDate={minDate ? new Date(minDate) : null}
                maxDate={maxDate ? new Date(maxDate) : null}
                excludeDates={disableToday ? [new Date()] : []}
                placeholderText={placeholderText}
                disabled={disabled}
                autoComplete="off"
              />
            ) : (
              <DatePicker
                {...field}
                selected={field.value}
                onChange={(date) => {
                  field.onChange(date);
                }}
                onChangeRaw={(e) => e.preventDefault()}
                className={`date-picker w-full p-1 ${
                  additionClass ? additionClass : ""
                }`}
                dateFormat={yearPicker ? "yyyy" : "dd/MM/yyyy"}
                showYearPicker={yearPicker}
                showIcon
                icon={<FaRegCalendarAlt fill="black" />}
                toggleCalendarOnIconClick
                minDate={minDate ? new Date(minDate) : null}
                maxDate={maxDate ? new Date(maxDate) : null}
                excludeDates={disableToday ? [new Date()] : []}
                placeholderText={placeholderText}
                disabled={disabled}
                autoComplete="off"
              />
            )
          }
          rules={
            required && {
              required: allValidations.required.message,
            }
          }
        />
      </div>

      {errors[name] && (
        <div>
          <small className="invalid-feedback">{errors[name].message}</small>
        </div>
      )}
    </>
  );
};

export default HtmlCalendar;
