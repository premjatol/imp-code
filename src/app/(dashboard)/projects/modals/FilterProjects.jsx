import Btn from "@/components/common/Btn";
import HtmlCalendar from "@/components/form-inputs/HtmlCalendar";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function FilterProjects() {
  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {},
  });

  const { handleSubmit, watch, reset, setValue } = methods;
  const { t } = useTranslation();

  const createProject = (data) => {
    console.log(data);
  };

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(createProject)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div>
              <HtmlSelect
                label={t("LABELS")}
                name="labels"
                id="labels"
                htmlFor="labels"
                required={true}
                options={[
                  {
                    label: t("BLANK_PROJECT"),
                    value: 1,
                  },
                  {
                    label: t("CLONE_EXISTING_PROJECT"),
                    value: 2,
                  },
                ]}
                placeholder={t("SEARCH_LABELS")}
              />
            </div>
            <div>
              <HtmlSelect
                label={t("PROJECTS_ACCOUNT_OWNER")}
                name="acc_owner"
                id="acc_owner"
                htmlFor="acc_owner"
                required={true}
                isMulti={true}
                options={[
                  {
                    label: t("BLANK_PROJECT"),
                    value: 1,
                  },
                  {
                    label: t("CLONE_EXISTING_PROJECT"),
                    value: 2,
                  },
                ]}
                placeholder={t("ALL")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs block">{t("TIME_FILTERS")}</label>
              <HtmlSelect
                name="time_filters"
                required={true}
                options={[
                  {
                    label: t("LAST_MODIFIED"),
                    value: 1,
                  },
                  {
                    label: t("CREATED"),
                    value: 2,
                  },
                ]}
              />
              <HtmlSelect
                name="t-filter"
                required={true}
                options={[
                  {
                    label: t("All_time"),
                    value: 1,
                  },
                  {
                    label: t("TODAY"),
                    value: 2,
                  },
                  {
                    label: t("LAST_FULL_WEEK"),
                    value: 3,
                  },
                  {
                    label: t("LAST_FULL_MONTH"),
                    value: 4,
                  },
                  {
                    label: t("COMPLETE_DATE_RANGE"),
                    value: 5,
                  },
                ]}
              />

              {[2, 3, 4, 5].includes(watch("t-filter")?.value) ? (
                <div>
                  <HtmlCalendar
                    name="range"
                    isDateRange={true}
                    required={true}
                    parentCss="w-full"
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <label className="text-xs">{t("ARCHIVED")}</label>
              <HtmlCheckBox
                name="archived"
                label={t("VIEW_ARCHIVED_PROJECTS_ONLY")}
                id="archived"
                htmlFor="archived"
              />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <Btn type="submit" btnName={t("APPLY_FILTER")} />
            <Btn type="button" btnName={t("CLEAR_FILTER")} isDarkMode={false} />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
