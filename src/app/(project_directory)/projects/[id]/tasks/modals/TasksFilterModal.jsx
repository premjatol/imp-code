"use client";

import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import useTasksStore from "@/stores/tasks/useTasksStore";
import useContextStore from "@/stores/useContextStore";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

const MODALKEY = "task";

const TasksFilterModal = () => {
  const { filterValues, filterValueObj, getTasks, setFilterObj, filterObj } =
    useTasksStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: filterObj && {
      search: filterObj.search,
      category_id: filterObj.category_id,
      subcategory_id: filterObj.subcategory_id,
      status_key: filterObj.status_key,
      priority: filterObj.priority,
      tag_ids: filterObj.tag_ids,
      plan_id: filterObj.plan_id,
    },
  });

  useEffect(() => {
    filterValues();
  }, []);

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const createPlanFunc = async (data) => {
    setFilterObj(data);

    const newObj = Object.fromEntries(
      Object.entries(data)
        .filter(([_, v]) => v && typeof v === "object" && "value" in v)
        .map(([k, v]) => [k, v.value]),
    );

    newObj.limit = "";
    newObj.page = "";
    if (data.search) {
      newObj.search = data.search;
    }
    if (data.tag_ids?.length > 0) {
      newObj.tag_ids = data.tag_ids.map((t) => t.value);
    }

    await useContextStore.getState().resetParams();
    const str = await useContextStore
      .getState()
      .createParamsStr(newObj, MODALKEY);

    await getTasks(str);
  };

  const resetAllValues = async () => {
    reset({
      search: "",
      category_id: null,
      subcategory_id: null,
      status_key: null,
      priority: null,
      tag_ids: null,
      plan_id: null,
    });

    setFilterObj(null);

    await getTasks("");
  };

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(createPlanFunc)}
          encType="multipart/form-data"
          className="custom_form_style flex flex-col justify-between mt-3"
        >
          <div className="space-y-3">
            <div className="w-full">
              <HtmlInput
                label="Search"
                name="search"
                placeHolder="Enter title and Suite Number"
                htmlFor="search"
                id="search"
                required={false}
                error={errors.search}
              />
            </div>

            <div className="w-full">
              <HtmlSelect
                label={"By Category"}
                name="category_id"
                placeHolder={"Selecte Existing folder"}
                htmlFor="category_id"
                id="category_id"
                isClearable={true}
                options={filterValueObj?.categories || []}
              />
            </div>
            <div className="w-full">
              <HtmlSelect
                label={"By sub-category"}
                name="subcategory_id"
                placeHolder={"Selecte Existing folder"}
                htmlFor="subcategory_id"
                id="subcategory_id"
                isClearable={true}
                options={filterValueObj?.subcategories || []}
              />
            </div>
            <div className="w-full">
              <HtmlSelect
                label={"By Status"}
                name="status_key"
                placeHolder={"Selecte Existing folder"}
                htmlFor="status_key"
                id="status_key"
                isClearable={true}
                options={filterValueObj?.columns || []}
              />
            </div>
            <div className="w-full">
              <HtmlSelect
                label={"By User"}
                name="assigned_to"
                placeHolder={"Selecte Existing folder"}
                htmlFor="assigned_to"
                id="assigned_to"
                isClearable={true}
                options={filterValueObj?.users || []}
              />
            </div>
            <div className="w-full">
              <HtmlSelect
                label={"By Priority"}
                name="priority"
                placeHolder={"Selecte Existing folder"}
                htmlFor="priority"
                id="priority"
                isClearable={true}
                options={[
                  { label: "Low", value: "LOW" },
                  { label: "Medium", value: "MEDIUM" },
                  { label: "High", value: "HIGH" },
                ]}
              />
            </div>
            <div className="w-full">
              <HtmlSelect
                label={"By Tags"}
                name="tag_ids"
                placeHolder={"Selecte Existing folder"}
                htmlFor="tag_ids"
                id="tag_ids"
                isMulti={true}
                options={filterValueObj?.tags || []}
              />
            </div>
            <div className="w-full">
              <HtmlSelect
                label={"By Plan"}
                name="plan_id"
                placeHolder={"Selecte Existing folder"}
                htmlFor="plan_id"
                id="plan_id"
                isClearable={true}
                options={filterValueObj?.plans || []}
              />
            </div>

            {/* <div className="px-3 py-1 border border-gray-300 rounded-lg">
              <HtmlCheckBox
                label={watch("is_active") ? "Active" : "Inactive"}
                name="is_active"
                id="is_active"
              />
            </div> */}
          </div>
          <div className="mt-6 flex gap-2">
            <Btn
              type="button"
              onClickFunc={resetAllValues}
              btnName={"Reset"}
              isDarkMode={false}
            />
            <Btn type="submit" btnName={"Apply"} />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default TasksFilterModal;
