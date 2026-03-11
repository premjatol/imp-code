import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const MARKER_CATEGORIES = [
  { id: "info", label: "Information", color: "#3B82F6" },
  { id: "warning", label: "Warning", color: "#F59E0B" },
  { id: "error", label: "Error", color: "#EF4444" },
  { id: "success", label: "Success", color: "#10B981" },
  { id: "note", label: "Note", color: "#8B5CF6" },
  { id: "question", label: "Question", color: "#EC4899" },
];

export default function MarkerPopup({ position, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("info");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title for the marker");
      return;
    }
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      color: MARKER_CATEGORIES.find(c => c.id === category)?.color || "#3B82F6",
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory("info");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10000">
      <div 
        className="bg-zinc-900 rounded-lg shadow-2xl border border-zinc-700 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h3 className="text-white font-semibold text-lg">Add TAsk</h3>
          <button
            onClick={onCancel}
            className="text-zinc-400 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter marker title"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter marker description (optional)"
              rows={3}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-zinc-300 text-sm font-medium mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MARKER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded border transition-all ${
                    category === cat.id
                      ? "border-2"
                      : "border border-zinc-700 hover:border-zinc-600"
                  }`}
                  style={{
                    borderColor: category === cat.id ? cat.color : undefined,
                    backgroundColor: category === cat.id ? `${cat.color}20` : "transparent",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-white text-sm">{cat.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
            >
              Add Marker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}