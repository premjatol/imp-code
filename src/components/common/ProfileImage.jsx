"use client";

import { useState } from "react";

export default function ProfileImage({ imageUrl, fallbackText }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-15 h-15 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-15 h-15 border-[3px] border-gray-200 border-t-blue-400 bg-gray-300 rounded-full animate-spin" />
        </div>
      )}

      <img
        src={imageUrl}
        className={`rounded-full w-15 h-15 object-cover transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        alt="profile-image"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />

      {/* If no image at all → show fallback letters */}
      {!imageUrl && (
        <span className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-full">
          {fallbackText}
        </span>
      )}
    </div>
  );
}
