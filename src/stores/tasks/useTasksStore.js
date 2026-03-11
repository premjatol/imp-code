import { create } from "zustand";
import { apiRequest } from "@/lib/apiHandler/apiRequest";
import { toast } from "react-toastify";
import useCategoryManagerStore from "../settings/useCategoryManagerStore";
import { usePlansStore } from "../plans/usePlansStore";
import useTagsManagerStore from "../settings/useTagsManagerStore";
import useProjectStore from "../project/useProjectStore";
import useProfileStore from "../profile/useProfileStore";

const useTasksStore = create((set, get) => ({
  tasks: [],
  loading: false,
  isApiLoading: false,
  error: null,
  success: false,
  isModal: false,
  totalItems: null,
  projectId: null,
  taskId: null,
  taskInfo: null,
  checklist: [],
  activities: [],
  isCommentApiLoading: false,
  isChecklistLoading: false,
  isAttachmentApiLoading: false,
  attachmentData: [],
  serialNumberAttachmentData: [],
  taskRelationList: [],
  isRelatedTaskLoading: false,
  messages: [],
  columns: [],
  filterValueObj: null,
  filterObj: null,
  limit: 20,

  setLimit: (limit) => set({ limit }),
  setTaskInfo: (taskInfo) => set({ taskInfo }),
  setIsModal: (value) => set({ isModal: value }),
  setProjectId: (value) => set({ projectId: value }),
  setTaskId: (value) => set({ taskId: value }),
  setChecklist: (value) => set({ checklist: value }),
  setTaskRelationList: (value) => set({ taskRelationList: value }),
  setAttachmentData: (value) => set({ attachmentData: value }),
  setSerialNumberAttachmentData: (serialNumberAttachmentData) =>
    set({ serialNumberAttachmentData }),
  setMessages: (value) => set({ messages: value }),
  setColumns: (value) => set({ columns: value }),
  setFilterObj: (value) => set({ filterObj: value }),

  // clear tasInfo, messages, checklist, attachmentData
  clearTaskInfo: () =>
    set({
      taskInfo: null,
      checklist: [],
      attachmentData: null,
      messages: [],
      activities: [],
    }),

  // set filter values
  filterValues: async () => {
    const { projectId, columns } = get();

    const filterObj = {};

    const cateRes = await useCategoryManagerStore.getState().getCategories("");
    if (cateRes) {
      filterObj.categories = cateRes.data.categories.map((c) => ({
        label: c.name,
        value: c.id,
      }));
    }

    const subCatRes = await useCategoryManagerStore
      .getState()
      .getSubCategories("");
    if (subCatRes) {
      filterObj.subcategories = subCatRes.data.subcategories.map((c) => ({
        label: c.name,
        value: c.id,
      }));
    }

    const tagRes = await useTagsManagerStore.getState().getTags("");
    if (tagRes) {
      filterObj.tags = tagRes.data.tags.map((t) => ({
        label: t.name,
        value: t.id,
      }));
    }

    const planRes = await usePlansStore
      .getState()
      .getFolderNPlanDetails(projectId, "");

    if (planRes) {
      const data = planRes.data.folders.flatMap((folder) => folder.plans);
      filterObj.plans = data.map((p) => ({
        label: p.name,
        value: p.id,
      }));
    }

    const userRes = await useProjectStore
      .getState()
      .getProjectMembers(projectId);

    if (userRes) {
      filterObj.users = userRes.data.map((p) => ({
        label: p.user.first_name + " " + p.user.last_name,
        value: p.id,
      }));
    }

    if (columns) {
      filterObj.columns = Object.values(columns).map((col) => ({
        value: col.id,
        label: col.title,
      }));
    }

    set({ filterValueObj: filterObj });
  },

  // Add Task
  addTask: async (payload) => {
    try {
      const { projectId } = get();
      const currentProjectId = payload?.projectId ?? projectId;

      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: `/projects/${currentProjectId}/tasks`,
        data: payload,
      });

      set((state) => ({
        tasks: [res.data, ...state.tasks],
        isApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Task added successfully");

      await get().getTasks("");

      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });
      toast.error(error.message || "Failed to add task");
      throw error;
    }
  },

  //Get tasks
  getTasks: async (str) => {
    try {
      set({
        loading: true,
        error: null,
        success: false,
      });

      const res = await apiRequest({
        url: `/projects/${get().projectId}/tasks${str || ""}`,
      });

      set({
        tasks: res.data.items,
        checklist: [],
        loading: false,
        success: true,
        isModal: false,
        totalItems: res.data.total,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        success: false,
      });

      throw error;
    }
  },

  // Get task details with all enhancements
  getTasksById: async (payload) => {
    try {
      const { projectId, taskId } = get();
      const currentProjectId = payload?.projectId ?? projectId;
      const currentTaskId = payload?.taskId ?? taskId;

      set({
        taskByIdLoading: true,
        error: null,
        success: false,
        taskInfo: null,
      });

      const res = await apiRequest({
        url: `/projects/${currentProjectId}/tasks/${currentTaskId}`,
      });

      const attachments = res.data.attachments || [];

      const attachmentData = attachments.filter((a) => !a.is_serial) || [];
      const serialNumberAttachmentData =
        attachments.filter((a) => a.is_serial) || [];

      set({
        taskInfo: res.data,
        checklist: res.data.checklist,
        attachmentData,
        serialNumberAttachmentData,
        activities: res.data.activities,
        messages: res.data.comments.map((c) => ({
          id: c.id,
          user_id: c.user_id,
          sender: `${c.user?.first_name ?? ""} ${c.user?.last_name ?? ""}`,
          avatar: c.user?.profile_image_url,
          timestamp: new Date(c.created_at).toLocaleString(),
          text: c.content,
          attachments: (c.attachments || []).map((a) => ({
            id: a.id,
            file_url: a.file_url,
            file_type: a.file_type,
          })),
        })),
        taskByIdLoading: false,
        success: true,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        taskByIdLoading: false,
        success: false,
      });

      throw error;
    }
  },

  //Edit task
  editTask: async (payload) => {
    try {
      const { projectId, taskId } = get();
      const currentProjectId = payload?.projectId ?? projectId;
      const currentTaskId = payload?.taskId ?? taskId;

      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/projects/${currentProjectId}/tasks/${currentTaskId}`,
        data: payload,
      });

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === res.data.id ? res.data : task,
        ),
        checklist: [],
        isApiLoading: false,
        success: true,
        isModal: false,
      }));

      toast.success(res.message || "Task updated successfully");
      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to edit task");
      throw error;
    }
  },

  //update task status
  updateTaskStatus: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/projects/${get().projectId}/tasks/${get().taskId}/status`,
        data: payload,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Status updated successfully");

      await get().getTasks("");
      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to update status");
      throw error;
    }
  },

  //update task tags
  updateTaskTags: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/projects/${get().projectId}/tasks/${get().taskId}/tags`,
        data: payload,
      });

      set({
        isApiLoading: false,
        success: true,
        isModal: false,
      });

      toast.success(res.message || "Task Tags updated successfully");

      await get().getUsers();
      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to update task tags");
      throw error;
    }
  },

  //Add comment to task
  addComment: async (payload) => {
    try {
      set({ isCommentApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: `/projects/${get().projectId}/tasks/${get().taskId}/comments`,
        data: payload,
      });

      const { userInfo } = useProfileStore.getState();

      if (res?.data) {
        const newMessage = {
          id: res.data.id,
          user_id: res.data.user_id,
          sender: `${res.data?.user?.first_name ?? userInfo?.first_name} ${res.data?.user?.last_name ?? userInfo?.last_name}`,
          avatar: res.data?.user?.profile_image_url,
          timestamp: new Date(res.data?.created_at).toLocaleString(),
          text: res.data?.content,
          attachments: res.data?.attachments || [],
        };

        set({
          isCommentApiLoading: false,
          success: true,
          messages: [...get().messages, newMessage],
        });
      }

      toast.success(res.message || "Comment added successfully");

      // await get().getTasksById();
      return res;
    } catch (error) {
      set({
        error: error.message,
        isCommentApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to add comment to task");
      throw error;
    }
  },

  //Add attchment to task
  addAttachment: async (payload) => {
    try {
      set({ isAttachmentApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: `/projects/${get().projectId}/tasks/${get().taskId}/attachments`,
        data: payload,
        isMultipart: true,
      });

      set({
        isAttachmentApiLoading: false,
        success: true,
      });

      toast.success(res.message || "Attachment added successfully");

      await get().getTasksById();
      return res;
    } catch (error) {
      set({
        error: error.message,
        isAttachmentApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to add attachment to task");
      throw error;
    }
  },

  // Delete attachment
  deleteAttachmenet: async (attachmentId) => {
    try {
      const { projectId, taskId } = get();
      if (!projectId && !taskId) return;

      set({ isAttachmentApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/projects/${projectId}/tasks/${taskId}/attachments/${attachmentId}`,
      });

      set({
        isAttachmentApiLoading: false,
        success: true,
      });

      toast.success(res.message || "Cheklist item deleted successfully");
      await get().getTasksById();

      return res;
    } catch (error) {
      set({
        error: error.message,
        isAttachmentApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to delete checklist item");
      throw error;
    }
  },

  //Upload attachment for comment (temporary - before posting comment)
  uploadAttachMentForComment: async (payload) => {
    try {
      set({ isApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "POST",
        url: `/projects/${get().projectId}/tasks/${get().taskId}/comments/attachments`,
        data: payload,
        isMultipart: true,
      });

      set({
        isApiLoading: false,
        success: true,
      });

      toast.success(res.message || "Attachment added successfully");

      return res;
    } catch (error) {
      set({
        error: error.message,
        isApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to add attachment to task");
      throw error;
    }
  },

  // Get task checklist items
  getCheckListByTaskId: async () => {
    try {
      set({
        isChecklistLoading: true,
        error: null,
        success: false,
        taskInfo: null,
      });

      const res = await apiRequest({
        url: `/projects/${get().projectId}/tasks/${get().taskId}/checklist`,
      });

      set({
        checklist: res.data,
        isChecklistLoading: false,
        success: true,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        isChecklistLoading: false,
        success: false,
      });

      throw error;
    }
  },

  // Delete checklist item (soft delete)
  deleteCheckListItem: async (itemId) => {
    try {
      set({ isChecklistLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/projects/${get().projectId}/tasks/${get().taskId}/checklist/${itemId}`,
      });

      set({
        isChecklistLoading: false,
        success: true,
      });

      toast.success(res.message || "Cheklist item deleted successfully");

      await get().getCheckListByTaskId();

      return res;
    } catch (error) {
      set({
        error: error.message,
        isChecklistLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to delete checklist item");
      throw error;
    }
  },

  // editChecklist Item
  editChecklistItem: async (itemId, payload) => {
    try {
      set({ isChecklistLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/projects/${get().projectId}/tasks/${get().taskId}/checklist/${itemId}`,
        data: {
          label: payload.label,
          sort_order: payload.sort_order,
          is_completed: payload.is_completed,
        },
      });

      set({
        isChecklistLoading: false,
        success: true,
      });

      toast.success(res.message || "Cheklist item updated successfully");

      await get().getCheckListByTaskId();

      return res;
    } catch (error) {
      set({
        error: error.message,
        isChecklistLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to delete checklist item");
      throw error;
    }
  },

  // get Task relation list
  getTaskRelationById: async () => {
    try {
      const { projectId, taskId } = get();

      if (!projectId || !taskId) return;

      set({
        error: null,
        success: false,
        taskRelationList: [],
      });

      const res = await apiRequest({
        url: `/projects/${projectId}/tasks/${taskId}/related`,
      });

      set({
        taskRelationList: res.data,
        success: true,
      });

      return res;
    } catch (error) {
      set({
        error: error.message,
        success: false,
      });

      throw error;
    }
  },

  // Link related task
  linkRelatedTask: async (payload) => {
    try {
      set({ isRelatedTaskLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "PUT",
        url: `/projects/${get().projectId}/tasks/${get().taskId}/related`,
        data: payload,
      });

      set({
        isRelatedTaskLoading: false,
        success: true,
      });

      toast.success(res.message || "Tasks linked successfully");

      await get().getTaskRelationById();

      return res;
    } catch (error) {
      set({
        error: error.message,
        isRelatedTaskLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to fetch api");
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (commentId) => {
    try {
      set({ isCommentApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/projects/${get().projectId}/tasks/${get().taskId}/comments/${commentId}`,
      });

      set({
        isCommentApiLoading: false,
        success: true,
        messages: get().messages.filter((msg) => msg.id !== commentId),
      });

      toast.success(res.message || "comment deleted");

      return res;
    } catch (error) {
      set({
        error: error.message,
        isCommentApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to delete comment");
      throw error;
    }
  },

  // delete attachment from comment
  deleteCommentAttachment: async (commentId, attachmentId) => {
    try {
      set({ isCommentApiLoading: true, error: null, success: false });

      const res = await apiRequest({
        method: "DELETE",
        url: `/projects/${get().projectId}/tasks/${get().taskId}/comments/${commentId}/attachments/${attachmentId}`,
      });

      set({
        isCommentApiLoading: false,
        success: true,
        messages: get().messages.map((msg) =>
          msg.id === commentId
            ? {
                ...msg,
                attachments: msg.attachments.filter(
                  (a) => a.id !== attachmentId,
                ),
              }
            : msg,
        ),
      });

      toast.success(res.message || "comment deleted");

      return res;
    } catch (error) {
      set({
        error: error.message,
        isCommentApiLoading: false,
        success: false,
      });

      toast.error(error.message || "Failed to delete comment");
      throw error;
    }
  },
}));

export default useTasksStore;
