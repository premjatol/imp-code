"use client";

import { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

export default function ProfileImageUpload({
  name = "profile_image",
  maxSize = 2,
  allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  required = false,
  error = null,
  imageUrl = null,
}) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const maxSizeInBytes = maxSize * 1024 * 1024;
  // const error = errors?.[name];

  const handleClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
    if (!allowedFormats.includes(file.type)) {
      setError(name, {
        type: "fileType",
        message: `Allowed formats: ${allowedFormats.map((f) => f.split("/")[1]).join(", ")}`,
      });
      e.target.value = "";
      return;
    }

    // Validate size
    if (file.size > maxSizeInBytes) {
      setError(name, {
        type: "fileSize",
        message: `Image must be smaller than ${maxSize}MB`,
      });
      e.target.value = "";
      return;
    }

    // Valid — store file in RHF, clear errors, show preview
    setValue(name, file, { shouldValidate: true, shouldDirty: true });
    clearErrors(name);
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    // Revoke only blob URLs
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    // Clear preview
    setPreview(null);

    // Clear RHF value
    setValue(name, null, { shouldDirty: true });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Show required error if needed
    if (required) {
      setError(name, {
        type: "required",
        message: "Profile image is required",
      });
    } else {
      clearErrors(name);
    }
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    if (imageUrl) {
      let url = `${process.env.NEXT_PUBLIC_IMAGE_URL}${imageUrl}`;
      setPreview(url);

      // Important: register existing image in RHF
      setValue(name, url, { shouldDirty: false });
    }
  }, [imageUrl, name, setValue]);

  console.log("imageUrl", preview);
  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleClick}
        className="relative w-28 h-28 rounded-full overflow-hidden cursor-pointer border-2 border-gray-300 hover:border-blue-500 transition"
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile Preview"
            className="object-cover w-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
            Upload
          </div>
        )}
      </div>

      {/* Hidden input registered with RHF so submit validation works */}
      <input
        type="hidden"
        {...register(name, {
          required: required ? "Profile image is required" : false,
        })}
      />

      {/* Actual file input — uncontrolled, validation handled manually */}
      <input
        type="file"
        accept={allowedFormats.join(",")}
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
      />

      {preview && (
        <button
          type="button"
          onClick={handleRemove}
          className="mt-2 text-sm text-red-500 hover:underline cursor-pointer"
        >
          Remove Image
        </button>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-2 text-center">{error.message}</p>
      )}
    </div>
  );
}
