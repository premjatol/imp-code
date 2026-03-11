import useProfileStore from "@/stores/profile/useProfileStore";
import useTasksStore from "@/stores/tasks/useTasksStore";
import { useState } from "react";
import { FaTrash, FaUserCircle } from "react-icons/fa";
import { MdAttachFile, MdPictureAsPdf, MdSend } from "react-icons/md";
import Btn from "../Btn";

export default function ChatBox() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { userInfo } = useProfileStore();

  const {
    messages,
    uploadAttachMentForComment,
    addComment,
    isCommentApiLoading,
    deleteComment,
    deleteCommentAttachment,
  } = useTasksStore();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage && !selectedFile) return;

    try {
      let attachments = [];

      // 1️⃣ Upload file first if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await uploadAttachMentForComment(formData);

        attachments.push({
          file_url: uploadRes?.data?.file_url,
          file_type: selectedFile.type,
        });
      }

      // 2️⃣ Build payload dynamically
      const payload = {};

      if (currentMessage?.trim()) {
        payload.content = currentMessage.trim();
      }

      if (attachments.length > 0) {
        payload.attachments = attachments;
      }

      await addComment(payload);

      setCurrentMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to send comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
    } catch (err) {
      console.error("Delete comment failed", err);
    }
  };

  const handleDeleteAttachment = async (commentId, attachmentId) => {
    try {
      await deleteCommentAttachment(commentId, attachmentId);
    } catch (err) {
      console.error("Delete attachment failed", err);
    }
  };

  return (
    <>
      <div className="pl-4 pt-4">
        <div className="space-y-4 border-t border-gray-100">
          <h3 className="text-[12px] font-medium text-gray-800">
            Activity & Comments
          </h3>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 group ${msg.user_id === userInfo?.id ? "justify-end" : ""}`}
            >
              {msg.user_id !== userInfo?.id &&
                (msg.avatar ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${msg.avatar}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={32} className="text-gray-300 shrink-0" />
                ))}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-gray-800">
                    {msg.sender}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {msg.timestamp}
                  </span>

                  <button
                    onClick={() => handleDeleteComment(msg.id)}
                    className="opacity-0 group-hover:opacity-100 transition cursor-pointer text-red-500"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
                <div
                  className={` text-gray-700 p-2 rounded-br-lg rounded-bl-lg rounded-tr-lg text-[12px] mt-1 shadow-sm ${msg.user_id === userInfo?.id ? "bg-green-100" : "bg-blue-100"}`}
                >
                  {msg.text && <p>{msg.text}</p>}

                  {msg.attachments?.map((file, i) => {
                    const showAttachmentDelete =
                      msg.text && msg.attachments.length > 0;
                    const fileUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${file.file_url}`;

                    if (file.file_type?.startsWith("image")) {
                      return (
                        <div key={i} className="relative mt-2 group">
                          <img src={fileUrl} className="rounded max-w-50" />

                          {showAttachmentDelete && (
                            <button
                              onClick={() =>
                                handleDeleteAttachment(msg.id, file.id)
                              }
                              className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    }

                    if (file.file_type?.startsWith("video")) {
                      return (
                        <div key={i} className="relative mt-2 group">
                          <video
                            src={fileUrl}
                            controls
                            className="rounded max-w-50"
                          />

                          {showAttachmentDelete && (
                            <button
                              onClick={() =>
                                handleDeleteAttachment(msg.id, file.id)
                              }
                              className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 mt-1 text-blue-600 font-medium group"
                      >
                        <MdPictureAsPdf size={18} />

                        <a href={fileUrl} target="_blank">
                          {file.file_url.split("/").pop()}
                        </a>

                        {showAttachmentDelete && (
                          <button
                            onClick={() =>
                              handleDeleteAttachment(msg.id, file.id)
                            }
                            className="text-red-500 text-[10px] cursor-pointer opacity-0 group-hover:opacity-100 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 bg-white">
          {selectedFile && (
            <div className="text-[10px] text-blue-600 mb-1 px-2 flex justify-between">
              <span>Selected: {selectedFile.name}</span>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-500 underline"
              >
                Remove
              </button>
            </div>
          )}
          <div className="flex items-center border border-gray-300 rounded-lg p-1.5 bg-gray-50 shadow-sm">
            <label className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer">
              <MdAttachFile size={18} className="rotate-45" />
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*,.pdf"
                onChange={handleFileChange}
              />
            </label>
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Add attachment description or comment..."
              className="flex-1 bg-transparent px-3 outline-none text-[12px] font-normal"
            />
            <Btn
              type="button"
              icon={<MdSend size={14} />}
              btnName="Share"
              className="w-fit!"
              onClickFunc={handleSendMessage}
              isLoading={isCommentApiLoading}
              disabled={isCommentApiLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
