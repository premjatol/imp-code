"use client";

import React, { useState, useEffect } from "react";
import MediaLibrary from "./MediaLibrary";


export default function MediaGalleryPage() {
  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch media data from your API
    const fetchMediaData = async () => {
      try {
        setLoading(true);

        // Replace with your actual API endpoint
        const response = await fetch("/api/media/gallery");

        if (!response.ok) {
          throw new Error("Failed to fetch media");
        }

        const data = await response.json();
        setMediaData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching media:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading media library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Media
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Media Library</h1>
          <p className="text-sm text-gray-600 mt-1">
            View, organize, and download your media files
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <MediaLibrary data={mediaData} />
      </main>
    </div>
  );
}
