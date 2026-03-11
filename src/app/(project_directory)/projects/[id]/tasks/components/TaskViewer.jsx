"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaCheck, FaXmark } from "react-icons/fa6";
import Modal from "@/components/Modal";
import CreateTaskModal from "@/components/common/create-task-modal/CreateTaskModal";
import useProjectWorkflowStore from "@/stores/project/useProjectWorkflowStore";
import { useParams } from "next/navigation";
import useTasksStore from "@/stores/tasks/useTasksStore";
import StatusUpdateModal from "../modals/StatusUpdateModal";
import { toast } from "react-toastify";
import useProfileStore from "@/stores/profile/useProfileStore";

const StatusIcon = ({ label }) => {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      {/* Circle */}
      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold shadow-md">
        {label?.charAt(0)?.toUpperCase() || "T"}
      </div>

      {/* Pin Tail */}
      <div className="absolute -bottom-1 w-3 h-3 bg-primary rotate-45"></div>
    </div>
  );
};

const ColumnSkeleton = () => {
  return (
    <div className="flex flex-col flex-1 min-w-62.5">
      {/* Header Skeleton */}
      <div className="h-10 bg-gray-200 rounded-md animate-pulse mb-3" />

      {/* Cards Skeleton */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TaskViewer() {
  const [data, setData] = useState({
    columns: {},
    columnOrder: [],
    tasks: {},
  });
  const [addingTo, setAddingTo] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const params = useParams();
  const projectId = params?.id;

  const { getWorkflows, statuses, transitions } = useProjectWorkflowStore();
  const {
    tasks,
    loading,
    isModal,
    setTaskId,
    setIsModal,
    setColumns,
    setLimit,
    limit,
    clearTaskInfo,
    success,
  } = useTasksStore();

  const { userInfo } = useProfileStore();
  const [statusTransition, setStatusTransition] = useState(null);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    const fromStatusKey = start.key;
    const toStatusKey = finish.key;

    const transition = transitions?.find(
      (t) =>
        t.isActive &&
        t.from_status_key === fromStatusKey &&
        t.to_status_key === toStatusKey,
    );

    if (!transition) {
      toast.error(
        `Status cannot be moved from ${start.title} → ${finish.title}`,
      );
      return;
    }

    if (!transition.allowedRoles.includes(userInfo?.role)) {
      toast.error(
        `Your role (${userInfo.role}) is not allowed to update this status`,
      );
      return;
    }

    setStatusTransition({
      taskId: draggableId,
      fromStatus: start.key,
      toStatus: finish.key,
      fromTitle: start.title,
      toTitle: finish.title,
      fromColumnId: start.id,
      toColumnId: finish.id,
    });

    setTaskId(draggableId);
    setIsModal("STATUS_UPDATE");
  };

  const addTask = (columnId) => {
    if (!newTaskTitle.trim()) return;
    const newId = `task-${Math.random()}`;
    const newTask = {
      id: newId,
      code: "EL",
      color: "bg-gray-400",
      shape: "square",
      ref: `#${Math.floor(Math.random() * 100)} | @PJA`,
      title: newTaskTitle,
    };

    setData({
      ...data,
      tasks: { ...data.tasks, [newId]: newTask },
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          taskIds: [...data.columns[columnId].taskIds, newId],
        },
      },
    });
    setNewTaskTitle("");
    setAddingTo(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    getWorkflows({ projectId });
  }, [projectId]);

  useEffect(() => {
    if (!statuses?.length) return;

    const sortedStatuses = [...statuses].sort((a, b) => a.level - b.level);

    const dynamicColumns = {};
    const dynamicColumnOrder = [];
    const tasksMap = {};

    // 1️⃣ Create empty columns first
    sortedStatuses.forEach((status) => {
      dynamicColumns[status.id] = {
        id: status.id,
        title: status.label,
        color: status.color,
        key: status.key,
        taskIds: [],
      };

      dynamicColumnOrder.push(status.id);
    });

    // 2️⃣ Convert API tasks array into object map
    if (tasks?.length) {
      tasks.forEach((task) => {
        tasksMap[task.id] = task;

        // 3️⃣ Find matching column using status_key
        const matchingStatus = sortedStatuses.find(
          (status) => status.key === task.status_key,
        );

        if (matchingStatus) {
          dynamicColumns[matchingStatus.id].taskIds.push(task.id);
        }
      });
    }

    // 4️⃣ Update board state
    setData({
      columns: dynamicColumns,
      columnOrder: dynamicColumnOrder,
      tasks: tasksMap,
    });

    setColumns(dynamicColumns);
  }, [statuses, tasks]);

  return (
    <>
      <div className="flex w-full gap-4">
        {loading ? (
          <div className="flex w-full gap-4">
            {[1, 2, 3].map((i) => (
              <ColumnSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 w-60">
            <DragDropContext onDragEnd={onDragEnd}>
              {data.columnOrder.map((colId) => {
                const column = data.columns[colId];
                const tasks = column.taskIds.map((tid) => data.tasks[tid]);

                return (
                  <div
                    key={colId}
                    className="flex flex-col border-gray-300 text-xs grow min-w-60"
                  >
                    {/* Header */}
                    <div className="p-3 text-center border-b border-gray-300 font-medium text-gray-700">
                      {column.title} ({tasks.length})
                    </div>

                    {/* Task List */}
                    <Droppable droppableId={colId}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="flex-1 min-h-12.5"
                        >
                          {tasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex items-start gap-3 p-3 bg-white border border-gray-200 hover:border-blue-400 cursor-pointer"
                                  onClick={() => {
                                    setTaskId(task.id);
                                    setIsModal("UPDATE_TASK");
                                  }}
                                >
                                  <StatusIcon
                                    shape={task.shape}
                                    code={task.code}
                                    color={task.color}
                                  />
                                  <div className="flex flex-col overflow-hidden">
                                    <span className="text-gray-800 font-medium leading-tight">
                                      {task.title}
                                    </span>
                                    <span className="text-[11px] text-gray-400 truncate">
                                      {task.description}
                                    </span>
                                    {task?.created_at && (
                                      <span className="text-[11px] text-gray-400 truncate">
                                        {formatDate(task.created_at)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {/* Add Task Input Area */}
                          {addingTo === colId && (
                            <div className="border border-blue-300 shadow-sm">
                              <div className="p-3">
                                <input
                                  autoFocus
                                  className="w-full border border-blue-400 rounded-sm p-2 text-xs focus:outline-none"
                                  placeholder="Enter title"
                                  value={newTaskTitle}
                                  onChange={(e) =>
                                    setNewTaskTitle(e.target.value)
                                  }
                                />
                              </div>
                              <div className="flex justify-end gap-2 p-2 bg-gray-50">
                                <button
                                  onClick={() => addTask(colId)}
                                  className="bg-blue-400 p-1 rounded shadow-sm"
                                >
                                  <FaCheck className="text-white" />
                                </button>
                                <button
                                  onClick={() => setAddingTo(null)}
                                  className="bg-red-600 p-1 rounded shadow-sm"
                                >
                                  <FaXmark className="text-white" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </DragDropContext>
          </div>
        )}
      </div>

      {/* modals */}
      <Modal
        open={isModal === "CREATE_TASK" || isModal === "UPDATE_TASK"}
        heading={isModal === "CREATE_TASK" ? "Create Task" : "Update Task"}
        onClose={() => {
          clearTaskInfo();
          setIsModal(false);
        }}
        width="800px"
      >
        <CreateTaskModal isEditMode={isModal === "UPDATE_TASK"} />
      </Modal>

      <Modal
        open={isModal === "STATUS_UPDATE"}
        heading={"Status Update"}
        onClose={() => {
          clearTaskInfo();
          setStatusTransition(null);
          setIsModal(false);
        }}
        width="700px"
      >
        <StatusUpdateModal transition={statusTransition} />
      </Modal>
    </>
  );
}
