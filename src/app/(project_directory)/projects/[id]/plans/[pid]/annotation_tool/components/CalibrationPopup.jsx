import React, { useState } from "react";

export default function CalibrationPopup({
  onSubmit,
  onCancel,
  pixelDistance,
}) {
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const f = parseFloat(feet) || 0;
    const i = parseFloat(inches) || 0;

    if (f === 0 && i === 0) return;

    const formattedValue = `${f}' ${i}"`;

    const totalInches = f * 12 + i;

    onSubmit({
      value: formattedValue,
      feet: f,
      inches: i,
      pixelDistance,
      scale: totalInches / pixelDistance,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xl p-6 w-96">
        <h3 className="text-gray-900 text-lg font-semibold mb-4">
          Calibrate Measurement
        </h3>

        <p className="text-gray-600 text-sm mb-4">
          Enter the real-world distance for the line you just drew.
          <br />
          <span className="text-gray-400">
            Pixel distance: {pixelDistance?.toFixed(2)} px
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Feet */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Feet
            </label>
            <input
              type="number"
              min="0"
              value={feet}
              onChange={(e) => setFeet(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Feet"
              autoFocus
            />
          </div>

          {/* Inches */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Inches
            </label>
            <input
              type="number"
              min="0"
              max="11.99"
              step="0.01"
              value={inches}
              onChange={(e) => setInches(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Inches"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!feet && !inches}
              className="px-4 py-2 bg-primary hover:opacity-90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded transition-colors font-semibold"
            >
              Calibrate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}