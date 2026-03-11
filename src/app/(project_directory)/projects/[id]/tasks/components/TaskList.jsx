import React from "react";
import { FiFileText, FiWifiOff } from "react-icons/fi";
import { TbFavicon } from "react-icons/tb";
import "./TaskList.css";

const TaskList = ({ tasks, onDragStart }) => {
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
            onDragStart={() => onDragStart(task)}
            style={{ borderLeft: `4px solid ${task.color}` }}
          >
            <div className="task-content">
              <div
                className="task-icon"
                style={{ color: task.color }}
              >
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