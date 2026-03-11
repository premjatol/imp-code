import Btn from "@/components/common/Btn";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import HtmlTextarea from "@/components/form-inputs/HtmlTextarea";
import React, { useEffect } from "react";
import { FormProvider, set, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function StatusCreateModal({ mode }) {
  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {},
  });
  const [showFlagGroup, setShowFlagGroup] = React.useState(false);

  const { handleSubmit, watch, reset, setValue } = methods;
  const { t } = useTranslation();

  const createProject = (data) => {
    console.log(data);
  };

  useEffect(() => {
    const displayColor = watch("displayColor");
    if (displayColor) {
      setValue("colorCode", displayColor);
    }
  }, [watch("displayColor")]);

  useEffect(() => {
    const requireFlags = watch("requireFlags");
    setShowFlagGroup(requireFlags);
  }, [watch("requireFlags")]);

  useEffect(() => {
    const status = watch("statusLevel");
    if (status?.value === 4 || status?.value === 6) {
      setShowFlagGroup(true);
      setValue("requireFlags", true);
    } else {
      setShowFlagGroup(false);
      setValue("requireFlags", false);
    }
  }, [watch("statusLevel")]);

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(createProject)}
          // encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-full">
              <HtmlInput
                label={"Status Name"}
                name="statusName"
                htmlFor="statusName"
                id="statusName"
                required={true}
                maxlength="30"
                validCriteria={["alphabetOnly", "whitespace"]}
              />
            </div>
            <div>
              <HtmlSelect
                label={"Status Level"}
                name="statusLevel"
                id="statusLevel"
                htmlFor="statusLevel"
                required={true}
                options={[
                  {
                    label: "Level 3 - Assigned / In-Progress",
                    value: 3,
                  },
                  {
                    label: "Level 4 - Trade/Appliance Issues",
                    value: 4,
                  },
                  {
                    label: "Level 5 - Completed Pending Review",
                    value: 5,
                  },
                  {
                    label: "Level 6 - Deficiency",
                    value: 6,
                  },
                  {
                    label: "Level 7 - Completed",
                    value: 7,
                  },
                ]}
              />
            </div>

            <div className="flex gap-2 items-center">
              <div className="w-30">
                <HtmlInput
                  name="displayColor"
                  id="displayColor"
                  htmlFor="displayColor"
                  label={"Color"}
                  inputType="color"
                  additionalClass="h-[38px]"
                  required={true}
                  validCriteria={["whitespace"]}
                />
              </div>
              <div className="mt-7 w-full">
                <HtmlInput
                  name="colorCode"
                  id="colorCode"
                  htmlFor="colorCode"
                  inputType="text"
                  disabled={true}
                  readOnly={true}
                />
              </div>
            </div>
            <div>
              <HtmlTextarea
                name="description"
                label="Description"
                id="description"
                required={false}
                htmlFor="description"
                rows="3"
              />
            </div>
            <div>
              <HtmlCheckBox
                label="Require Photos/Videos"
                name="requirePhotosVideos"
                id="requirePhotosVideos"
              />
              <HtmlCheckBox
                label="Require Description"
                name="requireDescription"
                id="requireDescription"
              />
              <HtmlCheckBox
                label="Require Flags"
                name="requireFlags"
                id="requireFlags"
                disabled={
                  watch("statusLevel")?.value === 4 ||
                  watch("statusLevel")?.value === 6
                }
              />
            </div>
          </div>
          {(showFlagGroup || watch("requireFlags")) && (
            <div>
              <HtmlSelect
                label={"Flag group"}
                name="flagGroup"
                id="flagGroup"
                htmlFor="flagGroup"
                required={true}
                options={[]}
              />
            </div>
          )}
          <div className="mt-5">
            <Btn
              type="submit"
              btnName={
                mode === "CREATE_STATUS" ? "Create Status" : "Update Status"
              }
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
