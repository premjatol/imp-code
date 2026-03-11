"use client";

import React, { useState } from "react";
import SubHeader from "./components/SubHeader";
import TaskViewer from "./components/TaskViewer";
import Modal from "@/components/Modal";
import CreateTaskModal from "@/components/common/create-task-modal/CreateTaskModal";
import CalendarView from "./components/CalendarView";
import "./components/CalendarView.css";
import "./components/Calendarviewextra.css";
import useTasksStore from "@/stores/tasks/useTasksStore";

export default function Tasks() {
  const { clearTaskInfo } = useTasksStore();
  const [type, setType] = useState("grid");
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <SubHeader type={{ type, setType }} modal={{ isModal, setIsModal }} />
      <div className="px-6 py-4 h-[calc(100vh-106px)] overflow-auto">
        {type === "grid" ? (
          <TaskViewer />
        ) : type === "calendar" ? (
          <CalendarView />
        ) : (
          ""
        )}
      </div>

      {/* Modals */}
      <Modal
        open={isModal === "NEW_TASK"}
        heading={"New Task"}
        onClose={() => {
          setIsModal(false);
          clearTaskInfo();
        }}
        width="800px"
      >
        <CreateTaskModal />
      </Modal>
    </>
  );
}
