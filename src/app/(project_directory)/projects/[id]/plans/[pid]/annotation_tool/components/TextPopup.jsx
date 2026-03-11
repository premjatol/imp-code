import React, { useState, useEffect, useRef } from "react";

export default function TextPopup({ position, onSubmit, onCancel }) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (text.trim()) {
      onSubmit({
        text,
        fontSize: Number(fontSize),
      });
    } else {
      onCancel();
    }
  };

  const fontSizes = [8, 12, 16, 22, 30];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
      <div
        className="bg-white border border-gray-200 p-5 rounded-xl shadow-xl w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-gray-800 text-sm font-semibold mb-3">Add Text</h3>

        <form onSubmit={handleSubmit}>
          {/* Text Area */}
          <textarea
            ref={inputRef}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-25"
            placeholder="Type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Font Size Buttons */}
          <div className="mt-4">
            <label className="text-xs text-gray-500 mb-2 block">
              Font Size
            </label>

            <div className="flex flex-wrap gap-2">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`px-2 py-1 text-xs rounded-md border transition cursor-pointer ${
                    fontSize === size
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-5">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium cursor-pointer"
            >
              Add to Image
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
