import Btn from "@/components/common/Btn";
import Pagination from "@/components/common/pagination/Pagination";
import HtmlInput from "@/components/form-inputs/HtmlInput";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import HtmlTextarea from "@/components/form-inputs/HtmlTextarea";
import useProfileStore from "@/stores/profile/useProfileStore";
import useProjectWorkflowStore from "@/stores/project/useProjectWorkflowStore";
import useFlagManagerStore from "@/stores/settings/useFlagManagerStore";
import useTasksStore from "@/stores/tasks/useTasksStore";
import useContextStore from "@/stores/useContextStore";
import { useEffect, useState } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const MODULEKEY = "STATUS_UPDATE_MODAL";

export default function StatusUpdateModal({ transition }) {
  const { updateTaskStatus, isApiLoading, taskInfo } = useTasksStore();
  const { statuses, transitions } = useProjectWorkflowStore();
  const { getFlags, flags, totalFlagsItems } = useFlagManagerStore();
  const { userInfo } = useProfileStore();

  const [statusWithFlags, setStatusWithFlags] = useState(false);
  const [commentIsRequiredOrNot, setCommentIsRequiredOrNot] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      to_status_key: "",
      from_status_key: "",
      comment: "",
      flag_value_ids: [],
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  /* -------------------------
     Helper: Get status label
  ------------------------- */

  const getStatusLabel = (key) =>
    statuses?.find((s) => s.key === key)?.label || "";

  /* -------------------------
     Reset on unmount
  ------------------------- */

  useEffect(() => {
    return () => {
      reset({
        to_status_key: "",
        from_status_key: "",
        comment: "",
        flag_value_ids: [],
      });

      setStatusWithFlags(false);
      setGroupId(null);
      setSearch("");
      setPage(1);
    };
  }, [reset]);

  /* -------------------------
     Set form default values
  ------------------------- */

  useEffect(() => {
    const fromKey = transition?.fromStatus || taskInfo?.status_key;
    const toKey = transition?.toStatus || "";

    reset({
      from_status_key: getStatusLabel(fromKey),
      to_status_key: transition ? getStatusLabel(toKey) : "",
      comment: "",
      flag_value_ids: [],
    });
  }, [transition, taskInfo, statuses, reset]);

  // comment box is required or not
  const toStatusValue = watch("to_status_key");
  const getStatus = (key) => statuses?.find((s) => s.key === key);

  useEffect(() => {
    const statusKey = transition ? transition.toStatus : toStatusValue?.value;

    const status = getStatus(statusKey);

    setCommentIsRequiredOrNot(
      status?.requirements?.includes("COMMENT_FORMAT") || false,
    );
  }, [transition, toStatusValue, statuses]);

  /* -------------------------
     Fetch Flags
  ------------------------- */

  const fetchFlags = async (groupId) => {
    const str = useContextStore
      .getState()
      .createParamsStr({ page, label: search }, MODULEKEY);

    await getFlags({ groupId, str });
  };

  /* -------------------------
     Detect Status Flags
  ------------------------- */

  const toStatus = watch("to_status_key");

  useEffect(() => {
    if (!statuses?.length) return;

    const statusKey = transition
      ? transition.toStatus
      : (toStatus?.value ?? toStatus);

    const selectedStatus = statuses.find((s) => s.key === statusKey);

    if (!selectedStatus) return;

    const flagRequired =
      selectedStatus?.requirements?.includes("FLAGS_REQUIRED");

    if (flagRequired) {
      setGroupId(selectedStatus?.flagMapping?.flag_group_id);
      setStatusWithFlags(true);
    } else {
      setStatusWithFlags(false);
      setGroupId(null);
    }
  }, [statuses, transition, toStatus]);

  /* -------------------------
     Load flags
  ------------------------- */

  useEffect(() => {
    if (!groupId) return;
    fetchFlags(groupId);
  }, [groupId, page, search]);

  /* -------------------------
     Update Task Status
  ------------------------- */

  const updateStatus = async (data) => {
    let flagIds = data.flag_value_ids;

    if (statusWithFlags && flagIds?.length) {
      flagIds = flagIds.map((f) => f.id);
    }

    const toStatusKey = transition
      ? transition.toStatus
      : data.to_status_key.value;

    await updateTaskStatus({
      comment: data.comment,
      to_status_key: toStatusKey,
      ...(flagIds?.length > 0 && { flag_value_ids: flagIds }),
    });
  };

  /* -------------------------
     Status transitions options
  ------------------------- */

  const fromStatus = transition ? transition.fromStatus : taskInfo?.status_key;

  const toStatusOptions =
    transitions
      ?.filter(
        (t) =>
          t.from_status_key === fromStatus &&
          t.isActive &&
          t.allowedRoles?.includes(userInfo?.role),
      )
      ?.map((t) => ({
        label: t.to_status_label,
        value: t.to_status_key,
      })) || [];

  return (
    <div className="px-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(updateStatus)}
          className="custom_form_style flex flex-col justify-between mt-3 space-y-3"
        >
          {transition ? (
            <>
              <HtmlInput
                label="From Status"
                readOnly
                name="from_status_key"
                required={true}
                validCriteria={["required"]}
                error={errors.from_status_key}
              />

              <HtmlInput
                label="To Status"
                readOnly
                name="to_status_key"
                required={true}
                validCriteria={["required"]}
                error={errors.to_status_key}
              />
            </>
          ) : (
            <>
              <HtmlInput
                label="From Status"
                readOnly
                name="from_status_key"
                required={true}
                validCriteria={["required"]}
                error={errors.from_status_key}
              />

              <HtmlSelect
                name="to_status_key"
                htmlFor="to_status_key"
                label="To Status"
                required={true}
                options={toStatusOptions}
                error={errors.to_status_key}
              />
            </>
          )}

          <HtmlTextarea
            label="Comment"
            name="comment"
            placeHolder="Enter comment"
            htmlFor="comment"
            id="comment"
            maxlength="300"
            required={commentIsRequiredOrNot}
            error={errors.comment}
          />

          {statusWithFlags && (
            <Controller
              name="flag_value_ids"
              rules={{
                required: statusWithFlags ? "Flags are required" : false,
              }}
              render={({ field }) => {
                const selected = field.value || [];

                const toggleFlag = (flag) => {
                  const exists = selected.find((f) => f.id === flag.id);

                  if (exists) {
                    field.onChange(selected.filter((f) => f.id !== flag.id));
                  } else {
                    field.onChange([...selected, flag]);
                  }
                };

                return (
                  <div>
                    <label className="text-xs mb-2 inline-block">
                      Add Flags <span className="text-red-600">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="Search flags..."
                      className="w-full border border-gray-400 p-2 rounded mb-3 text-xs"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                    />

                    {selected.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selected.map((flag) => (
                          <div
                            key={flag.id}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center gap-1"
                          >
                            {flag.label}
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  selected.filter((f) => f.id !== flag.id),
                                )
                              }
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="max-h-80 overflow-y-auto border rounded">
                      {flags?.map((flag) => {
                        const isSelected = selected.some(
                          (f) => f.id === flag.id,
                        );

                        return (
                          <div
                            key={flag.id}
                            onClick={() => toggleFlag(flag)}
                            className={`px-3 py-1.5 text-xs cursor-pointer flex justify-between hover:bg-gray-200 ${
                              isSelected ? "bg-blue-100 text-blue-800" : ""
                            }`}
                          >
                            <span>{flag.label}</span>
                            {isSelected && <span>✔</span>}
                          </div>
                        );
                      })}
                    </div>

                    {errors.flag_value_ids && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.flag_value_ids.message}
                      </p>
                    )}

                    <div className="flex justify-center">
                      <Pagination
                        totalItems={totalFlagsItems}
                        currentPage={page}
                        onPageChange={(page) => setPage(page)}
                        showPageInfo={false}
                        showItemsPerPage={false}
                      />
                    </div>
                  </div>
                );
              }}
            />
          )}

          <Btn
            type="submit"
            isLoading={isApiLoading}
            disabled={isApiLoading}
            btnName="Update"
            className="mt-3"
          />
        </form>
      </FormProvider>
    </div>
  );
}
