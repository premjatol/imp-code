"use client";

import Btn from "@/components/common/Btn";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import HtmlTextarea from "@/components/form-inputs/HtmlTextarea";
import { usePlansStore } from "@/stores/plans/usePlansStore";
import useProjectStore from "@/stores/project/useProjectStore";
import useCategoryManagerStore from "@/stores/settings/useCategoryManagerStore";
import useTagsManagerStore from "@/stores/settings/useTagsManagerStore";
import useTasksStore from "@/stores/tasks/useTasksStore";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import HtmlCalendar from "../../form-inputs/HtmlCalendar";
import ChatBox from "./ChatBox";
import Checklist from "./Checklist";
import HtmlImageAttachments from "@/components/form-inputs/HtmlImageAttachments";
import { imageAcceptList, imageAndPdfOnly, videoAcceptList } from "@/lib/utils";
import {
  MdDeleteForever,
  MdFolderDelete,
  MdPictureAsPdf,
} from "react-icons/md";
import { TiInfoOutline } from "react-icons/ti";
import Modal from "@/components/Modal";
import StatusUpdateModal from "@/app/(project_directory)/projects/[id]/tasks/modals/StatusUpdateModal";
import Activities from "./Activities";

const CreateTaskModal = ({
  onClose,
  isEditMode,
  imageDimensions,
  onSubmit,
}) => {
  const {
    addTask,
    isApiLoading,
    taskInfo,
    projectId,
    taskId,
    getTasksById,
    taskByIdLoading,
    checklist,
    setChecklist,
    editTask,
    isModal,
    setIsModal,
    addAttachment,
    isAttachmentApiLoading,
    attachmentData,
    serialNumberAttachmentData,
    getTaskRelationById,
    taskRelationList,
    tasks,
    linkRelatedTask,
    setTaskRelationList,
    deleteAttachmenet,
    setMessages,
    clearTaskInfo,
  } = useTasksStore();

  const { categories, subCategories, getCategories, getSubCategories } =
    useCategoryManagerStore();
  const { tags, getTags } = useTagsManagerStore();

  const { members, getProjectMembers } = useProjectStore();

  const { plans, getFolderNPlanDetails } = usePlansStore();
  const [relationalTasks, setRelationalTasks] = useState([]);

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      title: "",
      description: "",
      category: null,
      subCategory: null,
      priority: null,
      floorPlan: null,
      assignedTo: null,
      tags: [],
      dateRange: [],
      x_coordinate: null,
      y_coordinate: null,
    },
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const selectedCategoryValue = watch("category")?.value;

  useEffect(() => {
    if (selectedCategoryValue) {
      getSubCategories(`?category_id=${selectedCategoryValue}`);
    }
  }, [selectedCategoryValue]);

  useEffect(() => {
    const loadEditDependencies = async () => {
      try {
        if (!isEditMode || !taskId) return;

        // 1️⃣ First get task details
        const taskRes = await getTasksById();

        if (!taskRes?.data) return;

        // 2️⃣ Then load all dependent dropdown data
        await Promise.all([
          getCategories(""),
          getTags(""),
          getProjectMembers(projectId),
          getFolderNPlanDetails(projectId, ""),
        ]);
      } catch (error) {
        console.error("Failed to load edit data:", error);
      }
    };

    loadEditDependencies();
  }, [isEditMode, taskId]);

  // upload task attachment
  useEffect(() => {
    const att = watch("taskAttachment");

    const uploadAttachmentFunc = async (att) => {
      const formData = new FormData();
      formData.append("file", att[0].file);
      await addAttachment(formData);
    };

    if (att) {
      uploadAttachmentFunc(att);
    }
  }, [watch("taskAttachment")]);

  // upload serial number photo or video
  useEffect(() => {
    const att = watch("taskSearialNumberAttachment");

    const uploadAttachmentFunc = async (att) => {
      const formData = new FormData();
      formData.append("file", att[0].file);
      formData.append("is_serial", true);
      await addAttachment(formData);
    };

    if (att) {
      uploadAttachmentFunc(att);
    }
  }, [watch("taskSearialNumberAttachment")]);

  useEffect(() => {
    if (isEditMode) {
      getTaskRelationById();
    }
  }, [isEditMode]);

  useEffect(() => {
    if (tasks.length > 0) {
      const allTasks =
        tasks
          ?.filter((f) => f.id !== taskInfo?.id)
          ?.map((t) => ({ label: t.title, value: t.id })) || [];

      setRelationalTasks(allTasks);
    }

    if (taskRelationList.length > 0) {
      const linkedTasks = taskRelationList?.map((t) => ({
        label: t.title,
        value: t.id,
      }));

      setValue("taskRelation", linkedTasks);
    } else {
      setValue("taskRelation", []);
    }
  }, [tasks, taskRelationList]);

  // data reset on form edit mode
  useEffect(() => {
    if (taskInfo) {
      const assignedUser = members.find(
        (member) => member.user_id === taskInfo.assigned_to,
      );

      const selectedPlan = plans.find((plan) => plan.id === taskInfo.plan_id);

      reset({
        title: taskInfo.title ?? "",
        description: taskInfo.description ?? "",
        category: taskInfo?.category
          ? {
              label: taskInfo.category.name,
              value: taskInfo.category.id,
            }
          : null,
        subCategory: taskInfo?.subcategory
          ? {
              label: taskInfo.subcategory.name,
              value: taskInfo.subcategory.id,
            }
          : null,
        priority: taskInfo.priority
          ? {
              label:
                taskInfo.priority.charAt(0) +
                taskInfo.priority.slice(1).toLowerCase(),
              value: taskInfo.priority,
            }
          : null,
        floorPlan: selectedPlan
          ? {
              label: selectedPlan.name,
              value: selectedPlan.id,
            }
          : null,
        assignedTo: assignedUser
          ? {
              label: `${assignedUser.user.first_name} ${assignedUser.user.last_name}`,
              value: assignedUser.user_id,
            }
          : null,
        tags:
          taskInfo?.tags?.map((tag) => ({
            label: tag.name,
            value: tag.id,
          })) ?? [],
        dateRange:
          taskInfo?.start_date && taskInfo?.end_date
            ? [new Date(taskInfo.start_date), new Date(taskInfo.end_date)]
            : [],
        x_coordinate: taskInfo.x_coordinate ?? null,
        y_coordinate: taskInfo.y_coordinate ?? null,
      });
    }
  }, [isEditMode, taskInfo, reset]);

  const deleteAttachmenetFunc = async (data) => {
    await deleteAttachmenet(data.id);
  };

  const linkRelatedTaskFunc = async () => {
    const relatedTasks = watch("taskRelation");
    const related_task_ids = relatedTasks.map((t) => t.value);
    await linkRelatedTask({ related_task_ids });
  };

  const submitTask = async (data) => {
    const [start, end] = data.dateRange || [];
    const startDate = start ? DateTime.fromJSDate(start).toMillis() : null;
    const endDate = end ? DateTime.fromJSDate(end).toMillis() : null;

    let checklistPayload;

    if (checklist?.length) {
      const items = isEditMode
        ? checklist.filter((c) => c.customValue)
        : checklist;

      checklistPayload = items.map((item, index) => ({
        label: item.label,
        sort_order: index + 1,
      }));
    }

    try {
      const payload = Object.fromEntries(
        Object.entries({
          title: data.title?.trim(),
          description: data.description?.trim(),
          priority: data.priority?.value,
          category_id: data.category?.value,
          subcategory_id: data.subCategory?.value,
          plan_id: data.floorPlan?.value,
          x_coordinate: data.x_coordinate
            ? parseFloat(data.x_coordinate) / imageDimensions?.width
            : null,
          y_coordinate: data.y_coordinate
            ? parseFloat(data.y_coordinate) / imageDimensions?.height
            : null,
          start_date: startDate,
          end_date: endDate,
          tag_ids: data.tags.map((tag) => tag.value),
          assigned_to: data.assignedTo?.value,
          checklist: checklistPayload,
        }).filter(
          ([_, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0),
        ),
      );

      if (isEditMode) {
        const res = await editTask(payload);
        onSubmit?.({ task_id: res.data.id, ...res.data });
      } else {
        const res = await addTask(payload);
        onSubmit?.({ task_id: res.data.id, ...res.data });
      }

      clearTaskInfo();
      onClose?.();
    } catch (error) {
      console.error("Task creation failed:", error);
    }
  };

  if (isEditMode && taskByIdLoading && !taskInfo) {
    return <TaskModalSkeleton />;
  }

  return (
    <div className="flex px-6 gap-5">
      {/* status update button */}
      <div className="space-y-6 flex flex-col mt-4 w-80">
        {isEditMode && (
          <div className="flex justify-end w-full">
            <Btn
              btnName="Update Status"
              type="button"
              onClickFunc={() => setIsModal("STATUS_UPDATE")}
              className="w-fit!"
              isDarkMode={false}
            />
          </div>
        )}

        {/* LEFT SIDE */}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(submitTask)}
            className="custom_form_style flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Title */}
              <div>
                <HtmlInput
                  name="title"
                  label="Task Title"
                  placeHolder="Enter task title"
                  required={true}
                  validCriteria={["required", "whitespace"]}
                  error={errors.title}
                />
              </div>

              {/* Description */}
              <div>
                <HtmlTextarea
                  name="description"
                  id="description"
                  htmlFor="description"
                  label="Description"
                  placeHolder="Add detailed notes here..."
                  maxlength={300}
                  additionalClass={"m-0!"}
                  error={errors.description}
                  // required={true}
                />
              </div>

              {/* Category */}
              <div>
                <HtmlSelect
                  name="category"
                  label="Category"
                  options={
                    categories?.map((f) => ({
                      label: f.name,
                      value: f.id,
                    })) || []
                  }
                  error={errors.category}
                />
              </div>

              {/* Sub Category */}
              <div>
                <HtmlSelect
                  name="subCategory"
                  label="Sub Category"
                  disabled={!selectedCategoryValue}
                  options={
                    subCategories?.map((f) => ({
                      label: f.name,
                      value: f.id,
                    })) || []
                  }
                  error={errors.subCategory}
                  additionalClasses="cursor-not-allowed"
                />
              </div>

              {/* Priority */}
              <div>
                <HtmlSelect
                  name="priority"
                  label="Priority"
                  options={[
                    { label: "Low", value: "LOW" },
                    { label: "Medium", value: "MEDIUM" },
                    { label: "High", value: "HIGH" },
                  ]}
                />
              </div>

              {/* Add Attachment if EditMode is true */}
              {isEditMode && (
                <>
                  {isAttachmentApiLoading ? (
                    <div className="mt-2 animate-pulse">
                      <div className="h-3 w-32 bg-gray-300 rounded mb-2"></div>
                      <div className="w-48 h-28 bg-gray-300 rounded"></div>
                    </div>
                  ) : attachmentData?.length > 0 ? (
                    <>
                      <div>
                        <label className="text-xs">Uploaded Attachment</label>
                        <div className="grid grid-cols-2 gap-2">
                          {attachmentData?.map((att) =>
                            att?.file_type?.startsWith("image") ? (
                              <div key={att?.id} className="relative">
                                <img
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${att?.file_url}`}
                                  className="mt-2 rounded"
                                  alt="attachment"
                                />

                                <button
                                  onClick={() => deleteAttachmenetFunc(att)}
                                  className="absolute top-0 right-0 bg-red-200 rounded-sm p-0.5 cursor-pointer text-red-500 hover:bg-red-300 hover:text-red-600"
                                >
                                  <MdDeleteForever size={12} />
                                </button>
                              </div>
                            ) : (
                              <div
                                key={att?.id}
                                className="relative flex items-center gap-2 mt-1 text-blue-600 text-xs"
                              >
                                <MdPictureAsPdf size={18} />
                                <a
                                  href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${att?.file_url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xxs"
                                >
                                  {att?.file_url?.split(/[\\/]/).pop()}
                                </a>

                                <button
                                  onClick={() => deleteAttachmenetFunc(att)}
                                  className="absolute top-0 right-0 bg-red-200 rounded-sm p-0.5 cursor-pointer text-red-500 hover:bg-red-300 hover:text-red-600"
                                >
                                  <MdDeleteForever size={12} />
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      <HtmlImageAttachments
                        name="taskAttachment"
                        // label="Add Attachment"
                        accept={imageAndPdfOnly.concat(videoAcceptList)}
                        fileView="none"
                        maxFileSize={25}
                      />
                    </>
                  ) : (
                    <HtmlImageAttachments
                      name="taskAttachment"
                      label="Add Attachment"
                      accept={imageAndPdfOnly.concat(videoAcceptList)}
                      fileView="none"
                      maxFileSize={25}
                    />
                  )}

                  {/* Serial Number Photo */}
                  {isAttachmentApiLoading ? (
                    <div className="mt-2 animate-pulse">
                      <div className="h-3 w-32 bg-gray-300 rounded mb-2"></div>
                      <div className="w-48 h-28 bg-gray-300 rounded"></div>
                    </div>
                  ) : serialNumberAttachmentData?.length > 0 ? (
                    <>
                      <div>
                        <label className="text-xs">
                          Serial Number Photo or Video
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                          {serialNumberAttachmentData?.map((sAtt) =>
                            sAtt?.file_type?.startsWith("image") ? (
                              <div key={sAtt?.id} className="relative">
                                <img
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${sAtt?.file_url}`}
                                  className="mt-2 rounded"
                                  alt="attachment"
                                />

                                <button
                                  onClick={() => deleteAttachmenetFunc(sAtt)}
                                  className="absolute top-0 right-0 bg-red-200 rounded-sm p-0.5 cursor-pointer text-red-500 hover:bg-red-300 hover:text-red-600"
                                >
                                  <MdDeleteForever size={12} />
                                </button>
                              </div>
                            ) : (
                              <div
                                key={sAtt?.id}
                                className="relative flex items-center gap-2 mt-1 text-blue-600 text-xs"
                              >
                                <MdPictureAsPdf size={18} />
                                <a
                                  href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${sAtt?.file_url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xxs"
                                >
                                  {sAtt?.file_url?.split(/[\\/]/).pop()}
                                </a>

                                <button
                                  onClick={() => deleteAttachmenetFunc(sAtt)}
                                  className="absolute top-0 right-0 bg-red-200 rounded-sm p-0.5 cursor-pointer text-red-500 hover:bg-red-300 hover:text-red-600"
                                >
                                  <MdDeleteForever size={12} />
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <HtmlImageAttachments
                        name="taskSearialNumberAttachment"
                        // label="Add Serial Number Photo or Video"
                        accept={imageAcceptList.concat(videoAcceptList)}
                        placeholder="Upload any Photo or Video in given format (JPG, JPEG, PNG, MP4, WEBM, OGG)"
                        fileView="none"
                        maxFileSize={25}
                      />
                    </>
                  ) : (
                    <HtmlImageAttachments
                      name="taskSearialNumberAttachment"
                      label="Add Serial Number Photo or Video"
                      accept={imageAcceptList.concat(videoAcceptList)}
                      placeholder="Upload any Photo or Video in given format (JPG, JPEG, PNG, MP4, WEBM, OGG)"
                      fileView="none"
                      maxFileSize={25}
                    />
                  )}
                </>
              )}

              {/* Floor Plan */}
              <div>
                <HtmlSelect
                  name="floorPlan"
                  label="Floor / Plan"
                  placeHolder="Select plan"
                  options={
                    plans?.map((f) => ({
                      label: f.name,
                      value: f.id,
                    })) || []
                  }
                />
              </div>

              {/* Coordinates */}
              <div>
                <label className="html-label-css">Coordinates</label>
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <HtmlInput
                      name="x_coordinate"
                      // label="Coordinates"
                      placeHolder="x - coordinate"
                      readOnly={true}
                    />
                  </div>
                  <div>
                    <HtmlInput
                      name="y_coordinate"
                      // label="Coordinates"
                      placeHolder="y - coordinate"
                      readOnly={true}
                    />
                  </div>
                </div>
              </div>

              {/* Assigned To */}
              <div>
                <HtmlSelect
                  name="assignedTo"
                  label="Assigned To"
                  options={
                    members.map((member) => ({
                      label: `${member?.user?.first_name} ${member?.user?.last_name}`,
                      value: member.user_id,
                    })) || []
                  }
                />
              </div>

              {/* Tags */}
              <div>
                <HtmlSelect
                  name="tags"
                  label="Tags"
                  placeHolder="Enter tags"
                  options={
                    tags.map((tag) => ({
                      label: tag.name,
                      value: tag.id,
                    })) || []
                  }
                  isMulti={true}
                />
              </div>

              {/* {StartDate - EndDate} */}
              <div>
                <HtmlCalendar
                  label="Start - End date"
                  id="dateRange"
                  name="dateRange"
                  isDateRange={true}
                  parentCss="w-auto"
                  placeholderText="Enter date range"
                />
              </div>

              {/* Realted task */}
              {
                <div>
                  <div>
                    <HtmlSelect
                      name="taskRelation"
                      label="Task Relation"
                      placeHolder="Enter task relation"
                      options={relationalTasks}
                      isMulti={true}
                    />
                  </div>

                  {watch("taskRelation")?.length > 0 && (
                    <div className="flex justify-between items-center pt-3">
                      <p className="text-xs flex gap-1 items-center text-orange-400">
                        <TiInfoOutline /> Link all selected task to this task
                      </p>
                      <button
                        type="button"
                        onClick={linkRelatedTaskFunc}
                        className="text-xs cursor-pointer py-1 px-3 border border-gray-200 hover:bg-primary hover:text-white rounded-sm"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              }
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <Btn
                type="submit"
                btnName="Submit Task"
                isLoading={isApiLoading}
                disabled={isApiLoading}
              />
            </div>
          </form>
        </FormProvider>

        {/* footer */}
        {isEditMode && (
          <div className="py-4 bg-white border-t border-gray-300 text-[11px] font-normal text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Created Date:</span>
              <span className="font-normal text-gray-700">
                {taskInfo?.created_at &&
                  DateTime.fromMillis(Number(taskInfo.created_at))
                    .setZone("Asia/Kolkata")
                    .toFormat("dd/MM/yyyy, hh:mm a")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE (UNCHANGED) */}
      <div className="border-l border-gray-300 bg-gray-50/50 flex flex-col flex-1">
        <div className="h-full flex flex-col justify-between">
          <div>
            <Checklist checklist={checklist} setChecklist={setChecklist} />
            <Activities />
          </div>
          <ChatBox />
        </div>
      </div>

      {/* modal */}
      <Modal
        open={isModal === "STATUS_UPDATE"}
        heading={"Status Update"}
        onClose={() => {
          clearTaskInfo();
          setIsModal(false);
        }}
        width="700px"
      >
        <StatusUpdateModal />
      </Modal>
    </div>
  );
};

const TaskModalSkeleton = () => {
  return (
    <div className="flex px-6 gap-5 animate-pulse">
      {/* LEFT SIDE */}
      <div className="space-y-4 w-80 mt-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-9 bg-gray-200 rounded" />
          </div>
        ))}

        <div className="h-10 bg-gray-300 rounded mt-4" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 border-l border-gray-200 pl-5">
        <div className="h-12 bg-gray-200 rounded mb-4" />

        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-32" />
              <div className="h-6 bg-gray-200 rounded" />
            </div>
          </div>
        ))}

        <div className="h-10 bg-gray-200 rounded mt-4" />
      </div>
    </div>
  );
};

export default CreateTaskModal;
