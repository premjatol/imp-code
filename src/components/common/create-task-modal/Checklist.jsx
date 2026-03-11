import useTasksStore from "@/stores/tasks/useTasksStore";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import {
    MdAdd,
    MdDeleteOutline
} from "react-icons/md";
import { TiInfoOutline } from "react-icons/ti";
import Btn from "../Btn";

export default function ({ checklist, setChecklist }) {
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [editItem, setEditItem] = useState(null);

  const { deleteCheckListItem, editChecklistItem, isChecklistLoading } =
    useTasksStore();

  const addChecklistItem = () => {
    // debugger;
    if (!newChecklistItem.trim()) return;
    const newItem = {
      id: new Date().getTime().toString(),
      label: newChecklistItem,
      is_completed: false,
      customValue: true,
    };
    setChecklist([...checklist, newItem]);
    setNewChecklistItem("");
  };

  const editChecklistItemFunc = async () => {
    if (!editItem?.customValue) {
      await editChecklistItem(editItem.id, {
        ...editItem,
        label: newChecklistItem,
      });
    }

    const arr = checklist.map((item) =>
      item.id === editItem.id ? { ...item, label: newChecklistItem } : item,
    );

    setChecklist(arr);
    setEditItem(null);
    setNewChecklistItem("");
  };

  const deleteItem = async (item) => {
    if (item?.customValue) {
      setChecklist(checklist.filter((i) => i.id !== item.id));
    } else {
      await deleteCheckListItem(item.id);
      setChecklist(checklist.filter((c) => c.id !== item.id));
    }
  };

  const editItemFunc = (item) => {
    setEditItem(item);
    setNewChecklistItem(item.label);
  };

  const taskIsCompletedFunc = async (item) => {
    if (!item?.customValue) {
      await editChecklistItem(item.id, {
        ...item,
        is_completed: !item.is_completed,
      });
    }
    const arr = checklist.map((c) =>
      c.id === item.id ? { ...c, is_completed: !c.is_completed } : c,
    );
    setChecklist(arr);
  };

  return (
    <div className="p-4">
      <h3 className="text-[12px] font-medium text-gray-800 mb-3">Checklist</h3>
      <div className="space-y-2 mb-4">
        {isChecklistLoading ? (
          <TodoLoading />
        ) : checklist?.length === 0 ? (
          <p className="text-xs text-gray-500 flex gap-1">
            {" "}
            <TiInfoOutline /> Please add any to-do item
          </p>
        ) : (
          checklist?.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between group bg-gray-50 p-2 rounded-md"
            >
              <div className="flex items-center gap-3">
                {editItem?.id !== item.id && (
                  <input
                    type="checkbox"
                    checked={item.is_completed}
                    onChange={() => taskIsCompletedFunc(item)}
                    disabled={item?.customValue}
                    className={`w-3.5 h-3.5 accent-blue-600 ${item?.customValue ? "cursor-not-allowed" : "cursor-pointer"}`}
                  />
                )}
                <span
                  className={`text-[12px] font-normal ${item.is_completed ? "line-through text-gray-400" : "text-gray-700"}`}
                >
                  {item.label}
                </span>
              </div>
              {editItem?.id !== item.id && (
                <div className="flex gap-2">
                  {item.customValue}
                  <button
                    onClick={() => editItemFunc(item)}
                    className="text-gray-600 cursor-pointer p-1 bg-green-100 hover:text-white hover:bg-green-500 rounded-sm transition"
                  >
                    <CiEdit size={16} />
                  </button>
                  <button
                    onClick={() => deleteItem(item)}
                    className="text-gray-600 cursor-pointer p-1 bg-red-100 hover:text-white hover:bg-red-500 rounded-sm transition"
                  >
                    <MdDeleteOutline size={16} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newChecklistItem}
          onChange={(e) => setNewChecklistItem(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addChecklistItem()}
          placeholder="Add new checklist item..."
          className="text-[12px] font-normal border-b border-gray-300 outline-none focus:border-blue-500 pb-1 flex-1"
        />
        <Btn
          btnName={editItem ? "Edit" : "Add"}
          icon={<MdAdd size={16} />}
          className="w-fit! hover:bg-primary-100!"
          onClickFunc={editItem ? editChecklistItemFunc : addChecklistItem}
          isDarkMode={false}
        />
      </div>
    </div>
  );
}

const TodoLoading = ({ count = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-gray-50 p-2 rounded-md animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 bg-gray-300 rounded-sm"></div>

            <div className="h-3 w-40 bg-gray-300 rounded"></div>
          </div>

          <div className="flex gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
