import React, { useState } from "react";
import { FiFileText, FiWifiOff } from "react-icons/fi";
import { TbFavicon } from "react-icons/tb";
import "./TaskList.css";

const INITIAL_TASKS = [
  {
    id: "1",
    title: "First project task...",
    type: "task",
    color: "#FF9800",
    status: "pending",
    description: "Complete documentation",
    assignee: "PIA",
    priority: "medium",
  },
  {
    id: "2",
    title: "Tape & finish gy...",
    type: "document",
    color: "#F44336",
    status: "pending",
    description: "Finish gypsum board",
    assignee: "PIA",
    priority: "high",
  },
  {
    id: "3",
    title: "AAA",
    type: "task",
    color: "#FF9800",
    status: "pending",
    description: "AAA task description",
    assignee: "PIA",
    priority: "low",
  },
];

const TaskList = ({ onDragStart }) => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const getTaskIcon = (type) => {
    switch (type) {
      case "document":
        return <FiFileText size={16} />;
      case "offline":
        return <FiWifiOff size={16} />;
      default:
        return <TbFavicon size={16} />;
    }
  };

  const getTaskBadge = (task) => {
    if (task.status === "offline") {
      return <span className="task-badge offline">CU</span>;
    }
    if (task.type === "task") {
      return <span className="task-badge">@PIA</span>;
    }
    return null;
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h3 className="task-list-title">Tasks ({tasks.length})</h3>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="task-item"
            draggable
            // onDragStart={() => onDragStart(task)}
            style={{ borderLeft: `4px solid ${task.color}` }}
          >
            <div className="task-content">
              <div className="task-icon" style={{ color: task.color }}>
                {getTaskIcon(task.type)}
              </div>

              <div className="task-info">
                {getTaskBadge(task)}
                <span className="task-title">{task.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
