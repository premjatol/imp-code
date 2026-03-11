"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import HtmlCheckBox from "@/components/form-inputs/HtmlCheckBox";
import SectionTitle from "./SectionTitle";

export default function ReportEditor({ report, onClose }) {
  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      reportName: report?.reportName || "",
      type: report?.type
        ? { label: report.type, value: report.type }
        : { label: "PDF Summary", value: "PDF Summary" },
      description: report?.description || "",
      sortBy: { label: "Category", value: "Category" },
      status: { label: "All", value: "All" },
      categories: { label: "All", value: "All" },
      assignee: { label: "All", value: "All" },
      lastModified: { label: "Last modified", value: "Last modified" },
      timeRange: { label: "All time", value: "All time" },
      schedule: { label: "Send Now", value: "Send Now" },
      recipients: "",
      tags: "",
    },
  });

  const { handleSubmit, watch } = methods;

  const selectedType = watch("type")?.value;

  const saveReport = (formData) => {
    const finalData = {
      ...formData,
      type: formData.type?.value,
      schedule: formData.schedule?.value,
      sortBy: formData.sortBy?.value,
      status: formData.status?.value,
      categories: formData.categories?.value,
      assignee: formData.assignee?.value,
      lastModified: formData.lastModified?.value,
      timeRange: formData.timeRange?.value,
    };

    console.log("Final Report Data:", finalData);
    onClose();
  };

  return (
    <div className="mx-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(saveReport)}
          className="custom_form_style flex flex-col justify-between mt-3"
        >
          <div className="grid grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              <HtmlInput
                label="Report Name"
                name="reportName"
                htmlFor="reportName"
                id="reportName"
                placeHolder="Enter report name"
              />

              <HtmlSelect
                label="Report Type"
                name="type"
                htmlFor="type"
                id="type"
                options={[
                  { label: "PDF Summary", value: "PDF Summary" },
                  { label: "PDF Detailed", value: "PDF Detailed" },
                ]}
              />

              <HtmlInput
                label="Description"
                name="description"
                htmlFor="description"
                id="description"
                inputType="textarea"
                placeHolder="Enter description"
              />

              {/* INCLUDE OPTIONS */}
              <div>
                <label className="text-sm mb-3 block">Include</label>
                <div className="grid grid-cols-2 gap-3 text-wrap">
                  {(selectedType === "PDF Summary"
                    ? ["Plans", "Page numbers", "Deleted tasks"]
                    : [
                        "Created/Completed / Verified date",
                        "Start/End date",
                        "Related tasks",
                        "Checklists",
                        "Messages",
                        "Photos",
                        "Files",
                        "Plans",
                        "Table of contents",
                        "Page numbers",
                        "Section headings",
                        "Inline photos",
                        "Deleted tasks",
                      ]
                  ).map((item) => (
                    <div
                      key={item}
                      className="px-3 py-1 border border-gray-300 rounded-lg"
                    >
                      <HtmlCheckBox
                        label={item}
                        name={`include_${item}`}
                        id={`include_${item}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <HtmlSelect
                label="Sort by"
                name="sortBy"
                htmlFor="sortBy"
                id="sortBy"
                options={[
                  { label: "Category", value: "Category" },
                  { label: "Assignee", value: "Assignee" },
                  { label: "Status", value: "Status" },
                ]}
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
              <SectionTitle title="Task Filters" />

              <HtmlSelect
                label="Status"
                name="status"
                htmlFor="status"
                id="status"
                options={[
                  { label: "All", value: "All" },
                  { label: "Open", value: "Open" },
                  { label: "Closed", value: "Closed" },
                ]}
              />

              <HtmlSelect
                label="Categories"
                name="categories"
                htmlFor="categories"
                id="categories"
                options={[{ label: "All", value: "All" }]}
              />

              <HtmlSelect
                label="Assignee"
                name="assignee"
                htmlFor="assignee"
                id="assignee"
                options={[{ label: "All", value: "All" }]}
              />

              <HtmlInput
                label="Tags"
                name="tags"
                htmlFor="tags"
                id="tags"
                placeHolder="Type tag name"
              />

              <SectionTitle title="Time Filters" />

              <HtmlSelect
                label="Last Modified"
                name="lastModified"
                htmlFor="lastModified"
                id="lastModified"
                options={[{ label: "Last modified", value: "Last modified" }]}
              />

              <HtmlSelect
                label="Time Range"
                name="timeRange"
                htmlFor="timeRange"
                id="timeRange"
                options={[{ label: "All time", value: "All time" }]}
              />

              <HtmlInput
                label="Recipients"
                name="recipients"
                htmlFor="recipients"
                id="recipients"
                placeHolder="Enter email"
              />

              <HtmlSelect
                label="Schedule Report"
                name="schedule"
                htmlFor="schedule"
                id="schedule"
                options={[
                  { label: "Send Now", value: "Send Now" },
                  { label: "Weekly", value: "Weekly" },
                  { label: "Monthly", value: "Monthly" },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Btn type="button" btnName="Download" className="w-12!" />
            <Btn type="submit" btnName="Save & Share" className="w-12!" />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
