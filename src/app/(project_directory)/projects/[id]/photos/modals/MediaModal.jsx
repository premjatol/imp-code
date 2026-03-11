import { downloadFile, formatBytes } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
  FaUndo,
  FaTimes,
  FaMapMarkerAlt,
  FaLink,
  FaTag,
  FaDownload,
} from "react-icons/fa";

const MediaModal = ({
  item,
  onClose,
  onNavigate,
  currentIndex,
  totalItems,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  // const [newTag, setNewTag] = useState("");
  // const [tags, setTags] = useState(item.tags || []);
  const mediaRef = useRef(null);

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50));
  const handleRotate = () => setRotation((rotation + 90) % 360);

  // const handleAddTag = (e) => {
  //   e.preventDefault();
  //   if (newTag.trim() && !tags.includes(newTag.trim())) {
  //     setTags([...tags, newTag.trim()]);
  //     setNewTag("");
  //   }
  // };

  // const handleRemoveTag = (tagToRemove) => {
  //   setTags(tags.filter(tag => tag !== tagToRemove));
  // };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate("prev");
      if (e.key === "ArrowRight") onNavigate("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate]);

  return (
    <div className="fixed inset-0 bg-black/70 z-90 flex">
      {/* Left Panel - Media Viewer */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Navigation Arrows */}
        {totalItems > 1 && (
          <>
            <button
              onClick={() => onNavigate("prev")}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm z-10 cursor-pointer"
              title="Previous (←)"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate("next")}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm z-10 cursor-pointer"
              title="Next (→)"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Media Container */}
        <div className="max-w-4xl max-h-[80vh] flex items-center justify-center p-8">
          {item.type === "video" ? (
            <video
              ref={mediaRef}
              controls
              className="max-w-full max-h-full shadow-2xl"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: "transform 0.3s ease",
              }}
            >
              <source src={item.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              ref={mediaRef}
              src={item.src}
              alt=""
              className="max-w-full max-h-full object-contain shadow-2xl"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: "transform 0.3s ease",
              }}
            />
          )}
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {/* Download Button */}
            <div className="relative">
              <button
                onClick={() => downloadFile(item.original)}
                className="bg-gray-800/80 hover:bg-gray-800 text-white px-3 py-2 rounded flex items-center gap-2 transition-all duration-200 backdrop-blur-sm shadow-lg cursor-pointer"
              >
                <FaDownload className="w-3 h-3" />
              </button>
            </div>

            {/* Zoom Controls */}
            {item.type === "image" && (
              <>
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="bg-gray-800/80 hover:bg-gray-800 text-white p-2.5 rounded transition-all duration-200 backdrop-blur-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom Out"
                >
                  <FaSearchMinus className="w-3 h-3" />
                </button>
                <span className="text-white text-xs bg-gray-800/80 px-3 py-2 rounded backdrop-blur-sm shadow-lg font-medium min-w-15 text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  className="bg-gray-800/80 hover:bg-gray-800 text-white p-2.5 rounded transition-all duration-200 backdrop-blur-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom In"
                >
                  <FaSearchPlus className="w-3 h-3" />
                </button>
              </>
            )}

            {/* Rotate Button */}
            <button
              onClick={handleRotate}
              className="bg-gray-800/80 hover:bg-gray-800 text-white px-3 py-2 rounded flex items-center gap-2 transition-all duration-200 backdrop-blur-sm shadow-lg"
              title="Rotate 90°"
            >
              <FaUndo className="w-3 h-3" />
              <span className="text-xs font-medium">Rotate</span>
            </button>
          </div>

          {/* Photo Counter */}
          {totalItems > 1 && (
            <div className="text-white text-xs bg-gray-800/80 px-4 py-2 rounded backdrop-blur-sm shadow-lg font-medium">
              Photo {currentIndex + 1} of {totalItems}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Details */}
      <div className="w-96 bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Media Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded"
            title="Close (Esc)"
          >
            <FaTimes className="w-4 h-4 cursor-pointer" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 px-4 py-3 text-xs font-medium transition-colors relative ${
              activeTab === "details"
                ? "text-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            Details
            {activeTab === "details" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Upload Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Upload Information
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-gray-500 text-xs">File name</span>
                    <p className="text-gray-800 font-medium mt-1">
                      {item.fileName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">File size</span>
                    <p className="text-gray-800 mt-1">{item.fileSize}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Uploaded by</span>
                    <p className="text-gray-800 mt-1">{item.uploadedBy}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Upload Date</span>
                    <p className="text-gray-800 mt-1">{item.uploadedDate}</p>
                  </div>
                  {/* {item.capturedDate && (
                    <div>
                      <span className="text-gray-500 text-xs">Captured Date</span>
                      <p className="text-gray-800 mt-1">{item.capturedDate}</p>
                    </div>
                  )} */}
                  {/* {!item.capturedDate && (
                    <div className="flex items-start gap-2 text-gray-500 text-xs">
                      <span className="text-gray-400 cursor-help" title="Camera metadata not available">ⓘ</span>
                      <span>Captured date and time unavailable</span>
                    </div>
                  )} */}
                </div>
              </div>

              {/* GPS Coordinates */}
              {/* <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  GPS Coordinates
                </h3>
                {item.gpsCoordinates ? (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Latitude:</span>
                        <span className="text-gray-800 font-mono">{item.gpsCoordinates.lat.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Longitude:</span>
                        <span className="text-gray-800 font-mono">{item.gpsCoordinates.lng.toFixed(6)}</span>
                      </div>
                    </div>
                    <button className="mt-3 text-blue-600 hover:text-blue-700 text-xs cursor-pointer font-medium underline">
                      View on Map
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-gray-200">
                    No GPS data available for this media
                  </p>
                )}
              </div> */}

              {/* Links */}
              {/* <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaLink className="text-blue-600" />
                  Links
                </h3>
                {item.links && item.links.length > 0 ? (
                  <ul className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {item.links.map((link, idx) => (
                      <li key={idx}>
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2"
                        >
                          <FaLink className="w-3 h-3" />
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p>No links found.</p>
                    <p className="mt-1 text-xxs">Attach this photo to a plan, task, or form to create a link.</p>
                  </div>
                )}
              </div> */}

              {/* Tags */}
              {/* <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaTag className="text-green-600" />
                  Tags
                </h3>
                <div className="space-y-3">
                  <form onSubmit={handleAddTag} className="relative">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Search or add tags..."
                      className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {newTag && (
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    )}
                  </form>

                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="group px-3 py-1.5 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="opacity-70 hover:opacity-100 transition-opacity"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-200">
                      No tags yet. Add some to organize your media.
                    </p>
                  )}
                </div>
              </div> */}

              {/* File Type Badge */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>File Type</span>
                  <span className="bg-gray-100 px-3 py-1 rounded font-medium uppercase">
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaModal;
