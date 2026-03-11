"use client";

import ClickPopup from "@/components/common/ClickPopup";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import DynamicSelect from "@/components/common/DynamicSelect";
import Pagination from "@/components/common/pagination/Pagination";
import Modal from "@/components/Modal";
import useProjectStore from "@/stores/project/useProjectStore";
import useProjectWorkflowStore from "@/stores/project/useProjectWorkflowStore";
import useContextStore from "@/stores/useContextStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import { FaFlag, FaSeedling } from "react-icons/fa6";
import {
  HiOutlineCheckCircle,
  HiOutlineDotsVertical,
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineUsers,
  HiPlus,
} from "react-icons/hi";
import ProjectCardSkeleton from "./components/ProjectCardSkeleton";
import CreateProject from "./modals/CreateProject";
import FilterProjects from "./modals/FilterProjects";
import FlagMappingModal from "./modals/FlagMappingModal";
import { TiUserAddOutline } from "react-icons/ti";
import Link from "next/link";
import { toast } from "react-toastify";
import AddMemberModal from "./modals/add-members/AddMemberModal";

export default function ProjectsDashboard() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    loading,
    projects,
    getProjects,
    isModal,
    setIsModal,
    totalItems,
    isApiLoading,
    updateStatus,
    deleteProject,
  } = useProjectStore();

  const {
    isApiLoading: seedLoading,
    seedWorkflow,
    flagMappingStatusList,
    getFlagMappingStatusList,
    getWorkflows,
    workflows,
  } = useProjectWorkflowStore();

  const MODULEKEY = "projects";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [projectInfo, setProjectInfo] = useState(null);
  const [sortBy, setSortBy] = useState();
  const activeButtonRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleDropdown = async (projectId, buttonRef) => {
    activeButtonRef.current = buttonRef;
    setOpenMenuId((prev) => (prev === projectId ? null : projectId));

    try {
      const workflowData = await getWorkflows({ projectId });
      if (workflowData) {
        await getFlagMappingStatusList({ projectId });
      }
    } catch (error) {
      console.log("Workflow not found, skipping flag mapping call");
    }
  };

  useEffect(() => {
    const str = useContextStore.getState().createParamsStr(
      {
        page,
        limit,
        name: debouncedSearch,
        sort: sortBy?.value === "ALL" ? "" : sortBy?.value.toString(),
      },
      MODULEKEY,
    );
    getProjects(str);
  }, [page, limit, debouncedSearch, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleProjectAction = async (type) => {
    if (!projectInfo?.id) return;

    try {
      switch (type) {
        case "UPDATE_STATUS":
          await updateStatus({
            projectId: projectInfo.id,
            is_active: !projectInfo.is_active,
          });
          break;

        case "DELETE_PROJECT":
          await deleteProject({
            projectId: projectInfo.id,
          });
          break;

        case "SEED_WORKFLOW":
          await seedWorkflow({
            projectId: projectInfo.id,
          });
          break;

        default:
          break;
      }

      // close modal after success
      setIsModal(false);
      setProjectInfo(null);
    } catch (error) {
      console.log(`Failed to ${type}:`, error);
    }
  };

  const openProject = (project) => {
    if (project?.isFlagMappingComplete && project?.isSeeded) {
      router.push(`/projects/${project.id}/plans`);
    } else {
      toast.error("Please Complete Flag Mapping and seeding process.");
    }
  };

  return (
    <div className="bg-(--background) text-(--foreground) font-sans">
      <div className="max-w-260 mx-auto py-4">
        {/* Header Tab Section */}
        <div className="mb-6 border-b border-slate-300">
          <div className="inline-block border-b-2 border-(--foreground) pb-2 px-1">
            <h1 className="text-xs font-semibold font-heading">
              My projects ({totalItems || 0})
            </h1>
          </div>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            {/* Sorting */}
            <DynamicSelect
              options={[
                { value: "asc", label: "Ascending" },
                { value: "desc", label: "Descending" },
              ]}
              value={sortBy || { value: "asc", label: "Ascending" }}
              onChange={(option) => setSortBy(option)}
              className="w-30 cursor-pointer"
            />
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-(--background) border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary w-64 transition-all text-(--foreground)"
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Empty "New Project" Dotted Card */}
          <button
            onClick={() => setIsModal("NEW_PROJECT")}
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-5 h-full bg-slate-50/30 hover:bg-white hover:border-primary transition-all group"
          >
            <div className="flex items-center text-primary font-semibold text-xs cursor-pointer">
              <HiPlus className="w-5 h-5 mr-1 group-hover:scale-110 transition-transform" />
              New project
            </div>
          </button>

          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ProjectCardSkeleton key={index} />
              ))
            : projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-(--background) border border-slate-300 rounded-xl p-4 hover:shadow-xl hover:shadow-slate-200/50 transition-all relative flex flex-col justify-between"
                >
                  <div className="flex items-start mb-6">
                    <div
                      onClick={() => openProject(project)}
                      className="grow min-w-0 cursor-pointer group"
                    >
                      <h3 className="font-semibold text-xs font-heading text-(--foreground) group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>

                      {project?.description && (
                        <p className="text-xxs text-slate-400 mt-1 truncate">
                          {project.description}
                        </p>
                      )}
                    </div>

                    {/* <ProjectActionsDropdown /> */}

                    <div className="relative">
                      <button
                        onClick={(e) =>
                          toggleDropdown(project.id, e.currentTarget)
                        }
                        className="cursor-pointer p-1 rounded-full bg-gray-100 hover:bg-gray-300 text-gray-400 hover:text-gray-700"
                      >
                        <HiOutlineDotsVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Actions dropdown */}
                      {openMenuId === project.id && (
                        <ClickPopup
                          optionsList={[
                            {
                              name: "Edit Project",
                              icon: <HiOutlinePencil />,
                              onClick: () => {
                                setProjectInfo(project);
                                setIsModal("EDIT_PROJECT");
                              },
                            },
                            {
                              name: "Add Member",
                              icon: <TiUserAddOutline fontSize={15} />,
                              onClick: () => {
                                setProjectInfo(project);
                                setIsModal("ADD_MEMBER");
                              },
                            },
                            {
                              name: "Map Flag Group",
                              icon: <FaFlag />,
                              onClick: () => {
                                setProjectInfo(project);
                                setIsModal("FLAG_MAPPING");
                              },
                              disabled:
                                flagMappingStatusList?.length > 0 &&
                                Object.keys(workflows).length > 0
                                  ? false
                                  : true,
                            },
                            {
                              name: "Seed Workflow",
                              icon: <FaSeedling />,
                              onClick: () => {
                                setProjectInfo(project);
                                setIsModal("SEED_WORKFLOW");
                              },
                            },
                            {
                              name: `${project.is_active === true ? "Inactive" : "Active"}`,
                              icon: <HiOutlineCheckCircle />,
                              onClick: () => {
                                setIsModal("UPDATE_STATUS");
                                setProjectInfo(project);
                              },
                              css: `${project.is_active === true ? "text-red-600! hover:bg-red-200" : "text-green-600! hover:bg-green-200"}`,
                              lineBreak: true,
                            },
                            {
                              name: "Delete Project",
                              icon: <FaTrash />,
                              onClick: () => {
                                setIsModal("DELETE_PROJECT");
                                setProjectInfo(project);
                              },
                              css: "text-red-600! hover:bg-red-200",
                            },
                          ]}
                          startFrom="right"
                          buttonRef={activeButtonRef}
                          onClose={() => setOpenMenuId(null)}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold">
                        {project.members}
                      </span>
                      <HiOutlineUsers className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <Pagination
          totalItems={totalItems}
          currentPage={page}
          itemsPerPage={limit}
          onPageChange={(page) => setPage(page)}
          onItemsPerPageChange={(limit) => setLimit(limit)}
        />
      </div>

      {/* Modals */}
      <Modal
        open={isModal === "NEW_PROJECT" || isModal === "EDIT_PROJECT"}
        heading={
          isModal === "NEW_PROJECT" ? "Create New Project" : "Edit Project"
        }
        onClose={() => {
          setIsModal(false);
          setProjectInfo(null);
        }}
        width="400px"
      >
        <CreateProject
          isEditMode={isModal === "EDIT_PROJECT"}
          projectInfo={projectInfo}
        />
      </Modal>

      <Modal
        open={isModal === "FLITER_PROJECTS"}
        heading={"Filter Projects"}
        onClose={() => setIsModal(false)}
        width="500px"
      >
        <FilterProjects />
      </Modal>

      <Modal
        open={isModal === "ADD_MEMBER"}
        heading={"Add Member"}
        onClose={() => setIsModal(false)}
        width="700px"
      >
        <AddMemberModal
          projectId={projectInfo?.id}
          onClose={() => setIsOpen(false)}
        />
      </Modal>

      <Modal
        open={isModal === "UPDATE_STATUS"}
        heading="Update Status"
        onClose={() => setIsModal(false)}
        width="450px"
      >
        <ConfirmationModal
          title="Update Status"
          message="Are you sure you want to update the status?"
          confirmText="Update"
          cancelText="Cancel"
          variant={projectInfo?.is_active ? "danger" : "success"}
          onConfirm={() => handleProjectAction("UPDATE_STATUS")}
          isLoading={isApiLoading}
        />
      </Modal>

      <Modal
        open={isModal === "DELETE_PROJECT"}
        heading="Delete Project"
        onClose={() => setIsModal(false)}
        width="450px"
      >
        <ConfirmationModal
          title="Delete Project"
          message="Are you sure you want to delete the project?"
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={() => handleProjectAction("DELETE_PROJECT")}
          isLoading={isApiLoading}
        />
      </Modal>

      <Modal
        open={isModal === "SEED_WORKFLOW"}
        heading="Seed Workflow"
        onClose={() => setIsModal(false)}
        width="450px"
      >
        <ConfirmationModal
          title="Seed Workflow"
          message="Are you sure you want to seed this project?"
          confirmText="Seed"
          cancelText="Cancel"
          variant="primary"
          onConfirm={() => handleProjectAction("SEED_WORKFLOW")}
          isLoading={seedLoading}
        />
      </Modal>

      <Modal
        open={isModal === "FLAG_MAPPING"}
        heading="Map Flag Groups"
        onClose={() => setIsModal(false)}
        width="500px"
      >
        <FlagMappingModal projectInfo={projectInfo} />
      </Modal>
    </div>
  );
}
