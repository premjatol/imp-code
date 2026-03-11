"use client";

import useTasksStore from "@/stores/tasks/useTasksStore";
import { formatDistanceToNow } from "date-fns";

export default function Activities() {
  const { activities } = useTasksStore();

  const getUserName = (user) => {
    if (!user) return "Unknown user";
    return `${user.first_name || ""} ${user.last_name || ""}`.trim();
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "";
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const truncate = (text, length = 60) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  const getActivityText = (activity) => {
    const { action_type, old_value, new_value, user } = activity;
    const userName = getUserName(user);

    switch (action_type) {
      case "TASK_CREATED":
        return `${userName} created this task`;

      case "TASK_UPDATED": {
        if (!new_value) return `${userName} updated the task`;

        const fieldLabels = {
          title: "task name",
          description: "description",
          priority: "priority",
          category_id: "category",
          subcategory_id: "subcategory",
          suite_number: "suite number",
          plan_id: "plan",
          start_date: "start date",
          end_date: "due date",
          assigned_to: "assignee",
          tag_ids: "tags",
          checklist: "checklist",
          x_coordinate: "location",
          y_coordinate: "location",
        };

        const messages = [];

        Object.keys(new_value).forEach((key) => {
          const oldVal = old_value?.[key];
          const newVal = new_value?.[key];

          if (oldVal === newVal) return;

          const label = fieldLabels[key] || key;

          // never show ids or raw values
          if (
            key.includes("_id") ||
            key === "assigned_to" ||
            key === "tag_ids" ||
            key === "checklist"
          ) {
            messages.push(`${label} updated`);
            return;
          }

          // simple change message
          messages.push(`${label} updated`);
        });

        if (!messages.length) return `${userName} updated the task`;

        return `${userName} ${messages.join(", ")}`;
      }

      case "STATUS_CHANGED":
        return `${userName} moved the task from ${old_value?.status_key} → ${new_value?.status_key}`;

      case "COMMENT_ADDED": {
        const content = truncate(new_value?.content);
        const attachments = new_value?.attachments_count;

        let sentence = `${userName} added a comment`;

        if (content) sentence += `: "${content}"`;

        if (attachments > 0)
          sentence += ` with ${attachments} attachment${attachments > 1 ? "s" : ""}`;

        return sentence;
      }

      case "COMMENT_DELETED":
        return `${userName} deleted a comment`;

      case "ATTACHMENT_ADDED":
        if (new_value?.is_serial)
          return `${userName} uploaded a serial number photo`;
        return `${userName} uploaded an attachment`;

      case "ATTACHMENT_DELETED":
        return `${userName} removed an attachment`;

      case "CHECKLIST_UPDATED": {
        const action = new_value?.action;

        if (action === "item_added")
          return `${userName} added checklist item "${new_value?.label}"`;

        if (action === "item_deleted")
          return `${userName} removed checklist item "${old_value?.label}"`;

        return `${userName} updated checklist item "${old_value?.label}"`;
      }

      case "CHECKLIST_ITEM_TOGGLED":
        if (new_value?.is_completed)
          return `${userName} marked "${old_value?.label}" as complete`;

        return `${userName} marked "${old_value?.label}" as incomplete`;

      case "RELATED_TASKS_UPDATED": {
        const count = new_value?.related_task_ids?.length || 0;

        if (count === 0) return `${userName} removed all related tasks`;

        return `${userName} updated related tasks (${count} linked)`;
      }

      default:
        return `${userName} performed ${action_type}`;
    }
  };

  if (!activities?.length) {
    return (
      <div className="text-xs text-gray-400 text-center py-6">
        No activities yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-h-125 overflow-y-auto">
      <h2 className="text-xs">Activities</h2>
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-3 text-xs">
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1"></div>

            {index !== activities.length - 1 && (
              <div className="flex-1 w-px bg-gray-200"></div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-gray-800">{getActivityText(activity)}</span>

            <span className="text-gray-400 text-[11px]">
              {formatRelativeTime(activity.created_at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
