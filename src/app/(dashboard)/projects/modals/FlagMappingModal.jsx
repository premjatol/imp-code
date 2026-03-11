import Btn from "@/components/common/Btn";
import HtmlSelect from "@/components/form-inputs/HtmlSelect";
import useProjectStore from "@/stores/project/useProjectStore";
import useProjectWorkflowStore from "@/stores/project/useProjectWorkflowStore";
import useFlagManagerStore from "@/stores/settings/useFlagManagerStore";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function FlagMappingModal({ projectInfo }) {
  const { getFlagGroups, flagGrouploading, flagGroup } = useFlagManagerStore();

  const {
    getFlagMappingStatusList,
    flagMappingStatusLoading,
    flagMappingStatusList,
    updateFlagGropMapping,
    isApiLoading,
  } = useProjectWorkflowStore();

  const { setIsModal } = useProjectStore();

  const methods = useForm({
    mode: "all",
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const watchAll = methods.watch();

  useEffect(() => {
    getFlagGroups("");
  }, []);

  // useEffect(() => {
  //   if (projectInfo?.id) {
  //     getFlagMappingStatusList({ projectId: projectInfo.id });
  //   }
  // }, [projectInfo?.id]);

  const flagGroupOptions = useMemo(() => {
    if (!flagGroup) return [];

    return flagGroup.map((group) => ({
      label: group.name,
      value: group.id,
    }));
  }, [flagGroup]);

  useEffect(() => {
    if (flagMappingStatusList?.length && flagGroupOptions?.length) {
      const defaults = {};

      flagMappingStatusList.forEach((status) => {
        if (status.flag_group_id) {
          const matchedOption = flagGroupOptions.find(
            (opt) => opt.value === status.flag_group_id,
          );

          defaults[status.statusId] = matchedOption || null;
        } else {
          defaults[status.statusId] = null;
        }
      });

      reset(defaults);
    }
  }, [flagMappingStatusList, flagGroupOptions]);

  const submitFlagMapping = async (data) => {
    try {
      const payload = {
        mappings: flagMappingStatusList.map((status) => ({
          statusKey: status.statusKey,
          flag_group_id: data[status.statusId]?.value || null,
        })),
      };

      await updateFlagGropMapping(payload, projectInfo.id);
      setIsModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-6 pt-3">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(submitFlagMapping)}
          className="custom_form_style"
        >
          <div className="space-y-6">
            {flagMappingStatusList?.map((status) => (
              <div key={status.statusId} className="space-y-2">
                <HtmlSelect
                  id={status.statusId}
                  name={status.statusId}
                  htmlFor={status.statusId}
                  required={true}
                  label={status.statusLabel}
                  placeholder="Select Flag Group"
                  options={flagGroupOptions}
                  error={errors[status.statusId]}
                />
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Btn
              type="submit"
              btnName="Submit"
              isLoading={isApiLoading}
              disabled={isApiLoading}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
