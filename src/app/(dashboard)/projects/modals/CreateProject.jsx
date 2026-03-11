import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import HtmlTextarea from "@/components/form-inputs/HtmlTextarea";
import useProjectStore from "@/stores/project/useProjectStore";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function CreateProject({
  isEditMode = false,
  projectInfo = null,
}) {
  const { isApiLoading, addProject, editProject } = useProjectStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      name: projectInfo ? projectInfo.name : "",
      description: projectInfo ? projectInfo.description : "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  const { t } = useTranslation();

  const createProject = async (data) => {
    if (!isEditMode) {
      try {
        await addProject({
          name: data.name,
          description: data.description,
        });
      } catch (error) {
        console.error("Edit project failed:", error);
      }
    } else {
      try {
        await editProject({
          id: projectInfo.id,
          name: data.name,
          description: data.description,
        });
      } catch (error) {
        console.error("Edit project failed:", error);
      }
    }
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
            <div className="w-full">
              <HtmlInput
                label={t("NAME")}
                name="name"
                placeHolder={t("ENTER_PROJECT_NAME")}
                htmlFor="name"
                id="name"
                required={true}
                maxlength=""
                validCriteria={["whitespace"]}
                error={errors?.name}
              />
            </div>
            <div className="w-full">
              <HtmlTextarea
                label="Description"
                name="description"
                placeHolder="Enter description"
                htmlFor="description"
                id="description"
                maxlength="300"
                error={errors.description}
              />
            </div>
            {/* <div className="w-full">
              <HtmlInput
                label={t("CODE")}
                name="code"
                placeHolder={t("ENTER_PROJECT_CODE")}
                htmlFor="code"
                id="code"
                maxlength=""
                validCriteria={["alphabetOnly", "whitespace"]}
              />
            </div> */}
            {/* <div>
              <HtmlSelect
                label={t("START_WITH")}
                name="startWith"
                id="startWith"
                htmlFor="startWith"
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
              />
            </div> */}
          </div>
          <Btn
            type="submit"
            btnName={isEditMode ? "Update project" : "Create new project"}
            isLoading={isApiLoading}
            disabled={isApiLoading}
          />
        </form>
      </FormProvider>
    </div>
  );
}
