// code of HtmlImageAttachments

import React, { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { FaUpload, FaTrashCan, FaFile } from "react-icons/fa6";
import useFormValidation from "@/lib/FormValidation";
import {
  checkFileFormat,
  convertFileFormatToString,
  formatBytes,
  imageAcceptList,
  mbToBytes,
} from "@/lib/utils";

const HtmlImageAttachments = ({
  name,
  label,
  id,
  htmlFor,
  required,
  multiple,
  accept,
  fileView,
  disable,
  maxFileSize, // in MB
  placeholder,
  error,
}) => {
  const { control } = useFormContext();

  let allValidations = useFormValidation();

  const {
    field: { onChange, value },
    fieldState: { errors },
  } = useController({
    name,
    control,
    rules: { required: required ? allValidations.required.message : false },
  });

  const [localError, setLocalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy"; //for firefox
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (!multiple && files.length > 1) {
      setLocalError("Only one file accepted");
      return;
    }
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    setLocalError("");
    setIsLoading(true);

    try {
      files.forEach(validateFile);
      const newAttachments = await Promise.all(files.map(readFile));
      let updatedAttachments;
      if (multiple) {
        updatedAttachments = [...(value || []), ...newAttachments];
      } else {
        updatedAttachments = [newAttachments[0]]; // Only keep the last uploaded file
      }
      onChange(updatedAttachments);
    } catch (err) {
      setLocalError(err.message);
      onChange([]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateFile = (file) => {
    if (!checkFileFormat(file.name, accept)) {
      throw new Error(`File formate not valid: ${file.name}`);
    }
    if (file.size > mbToBytes(maxFileSize)) {
      throw new Error(
        `File size too large: ${file.name}. maximum size ${maxFileSize}MB.`,
      );
    }
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ file, url: e.target.result });
      reader.onerror = () =>
        reject(new Error(`Error to read file : ${file.name}`));
      reader.readAsDataURL(file);
    });
  };

  const selectAttachment = async (event) => {
    const files = Array.from(event.target.files);
    if (!multiple && files.length > 1) {
      setLocalError("Only one file accepted");
      event.target.value = "";
      onChange([]);
      return;
    }
    handleFiles(files);
    event.target.value = "";
  };

  const handleDelete = (indexToDelete) => {
    if (multiple) {
      const updatedAttachments = [...(value || [])];
      updatedAttachments.splice(indexToDelete, 1);
      onChange(updatedAttachments);
    } else {
      onChange([]); // Clear the single file
    }
  };

  return (
    <>
      <div className="image-attachment-parent relative">
        <label htmlFor={htmlFor} className="form-label w-full mb-0 text-xs">
          <div className="mb-3">
            {label}
            {required && label && <sup className="text-red-600">*</sup>}
          </div>

          <input
            name={name}
            id={id}
            type="file"
            className="image-file"
            multiple={multiple}
            onChange={selectAttachment}
            accept={convertFileFormatToString(accept, true)}
            style={{ display: "none" }}
          />
          {!disable && (
            <div
              className={`files-dropzone flex justify-center items-center border border-dashed rounded p-5 border-gray-400 h-37.5 text-gray-700 bg-gray-50 ${
                isDragging ? "dragging" : ""
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isLoading ? (
                <div className="loading-indicator">
                  <div className="spinner-border text-gray-600" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 mb-0">File uploading...</p>
                </div>
              ) : (
                <div className="upload-instructions text-center flex flex-col items-center">
                  <span className="upload-icon">
                    <FaUpload size={25} />
                  </span>
                  <small className="mt-2 mb-0 block font-semibold">
                    {multiple ? "Drag and Drop files" : "Drag and Drop file"}
                  </small>
                  <small className="my-2 block font-semibold">OR</small>
                  <span className="bg-gray-600 text-white py-1 px-2 text-xs hover:bg-gray-500 transition rounded w-max cursor-pointer">
                    Browse
                  </span>
                  {placeholder && (
                    <p className="text-xxs text-gray-500 mt-2">{placeholder}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </label>

        {localError ? (
          <small className="text-red-600 mt-2 block text-xs">
            {localError}
          </small>
        ) : (
          error && (
            <small className="text-red-600 mt-2 text-xs">{error.message}</small>
          )
        )}

        {fileView !== "none" && value && value.length > 0 && (
          <div
            className={`file-preview max-h-62.5 overflow-y-auto ${
              fileView === "grid" ? "flex flex-wrap" : ""
            } gap-3 p-2 bg-gray-100 rounded-md mt-3`}
          >
            {value.map((file, index) =>
              fileView === "grid" ? (
                <div
                  key={index}
                  className="grid-view bg-gray-100 rounded border border-gray-300 relative p-1 size-25"
                >
                  {checkFileFormat(file.file.name, imageAcceptList) ? (
                    <figure className="mb-0 size-full">
                      <img
                        src={file.url}
                        alt={file.file.name}
                        className="size-full"
                      />
                    </figure>
                  ) : (
                    <span className="grid-file-view">
                      <FaFile size={25} />
                      <span className="grid-file-name line-clamp-2 max-w-100 text-xs text-ellipsis">
                        {file.file.name}
                      </span>
                    </span>
                  )}
                  {!disable && (
                    <button
                      className="cursor-pointer delete-btn absolute top-0 right-0 bg-white text-red-600 rounded-full p-1 transition leading-3 hover:text-white hover:bg-red-600"
                      type="button"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrashCan size={15} />
                    </button>
                  )}
                </div>
              ) : (
                <div
                  key={index}
                  className="list-view rounded border border-gray-300 relative flex items-center justify-between p-2 mb-2 bg-gray-50 last:mb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-black">
                      <FaFile size={30} />
                    </span>
                    <div>
                      <span className="block font-semibold list-file-name whitespace-nowrap text-ellipsis w-full min-w-85 overflow-hidden">
                        {file.file.name}
                      </span>
                      <small>{formatBytes(file.file.size)}</small>
                    </div>
                  </div>
                  {!disable && (
                    <button
                      className="cursor-pointer delete-btn rounded-full p-1 text-red-600 bg-white hover:bg-red-600 hover:text-white transition leading-4"
                      type="button"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrashCan size={15} />
                    </button>
                  )}
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default HtmlImageAttachments;
