import useProjectWorkflowStore from "@/stores/project/useProjectWorkflowStore";
import { useMemo } from "react";

export const imageAcceptList = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
export const onlyJpg = ["jpg", "JPG"];
export const onlyJpeg = ["jpeg", "JPEG"];
export const onlyPng = ["png", "PNG"];
export const onlyPdf = ["pdf"];
export const excelAcceptList = ["xlsx", "xls"];
export const docAcceptList = ["docx", "docs"];
export const allFileAcceptList = [
  "jpg",
  "JPG",
  "jpeg",
  "JPEG",
  "png",
  "PNG",
  "pdf",
  "docs",
  "docx",
  "xlsx",
  "xls",
];
export const allImageTypesWithSlash = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
];

export const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "text/plain", // .txt
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export const allFileAcceptListWithZip = [
  "jpg",
  "JPG",
  "jpeg",
  "JPEG",
  "png",
  "PNG",
  "pdf",
  "docs",
  "docx",
  "xlsx",
  "xls",
  "zip",
];
export const imageAndPdfOnly = [
  "jpg",
  "JPG",
  "jpeg",
  "JPEG",
  "png",
  "PNG",
  "pdf",
];
export const videoAcceptList = ["mp4", "webm", "ogg"];

export const imageAndVideoAcceptList = [...imageAcceptList, ...videoAcceptList];

/**
 *
 * @param name
 * @param acceptFormat
 * @returns
 */

export const checkFileFormat = (name, acceptFormat) => {
  if (!name || typeof name !== "string") return false;
  if (!acceptFormat || !Array.isArray(acceptFormat)) return false;

  const parts = name.split(".");
  const format = parts.length > 1 ? parts.pop().toLowerCase() : "";

  return acceptFormat.map((f) => f.toLowerCase()).includes(format);
};

/**
 *
 * @param fileFormat
 * @param isDot
 * @returns
 */
export const convertFileFormatToString = (fileFormat, isDot = false) => {
  if (!fileFormat) return "";

  const formats = fileFormat
    .toString()
    .split(",")
    .map((f) => f.trim());

  let fileArrayString = formats.join(", ");
  if (isDot) {
    fileArrayString = formats
      .map((f) => (f.startsWith(".") ? f : `.${f}`))
      .join(", ");
  }

  return fileArrayString;
};

export const formatBytes = (bytes) => {
  var marker = 1024; // Change to 1000 if required
  var decimal = 2; // Change as required
  var kiloBytes = marker; // One Kilobyte is 1024 bytes
  var megaBytes = marker * marker; // One MB is 1024 KB
  var gigaBytes = marker * marker * marker; // One GB is 1024 MB

  // return bytes if less than a KB
  if (bytes < kiloBytes) return bytes + " Bytes";
  // return KB if less than a MB
  else if (bytes < megaBytes)
    return (bytes / kiloBytes).toFixed(decimal) + " KB";
  // return MB if less than a GB
  else if (bytes < gigaBytes)
    return (bytes / megaBytes).toFixed(decimal) + " MB";
  // return GB if less than a TB
  else return (bytes / gigaBytes).toFixed(decimal) + " GB";
};

export const mbToBytes = (mb) => {
  //CalculatedMaxSize (_maxsize is in MB, first 1024 multiplication for convert MB to KB, second 1024 multiplication for convert KB to BYTES)
  let bytes = mb * 1024 * 1024;
  return bytes;
};

export const getTodayDate = () => {
  const currentDateInMilliseconds = Date.parse(new Date());
  return currentDateInMilliseconds;
};

export const dateStringToEpoch = (dateString) => {
  const currentDateInMilliseconds = new Date(dateString);
  return currentDateInMilliseconds;
};

export const getDateFormatInString = (milliseconds) => {
  const dateObject = new Date(milliseconds);
  return dateObject.toLocaleDateString();
};

export const getPreviousFourYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = currentYear; i >= currentYear - 3; i--) {
    years.push(i);
  }

  return years;
};

export const get16YearsBackDate = () => {
  let today = new Date();
  today.setFullYear(today.getFullYear() - 16);
  return today;
};

export const getOneMonthBackDate = () => {
  let today = new Date();
  today.setMonth(today.getMonth() - 1);
  return today;
};

export const base64ToFile = (base64, filename, mimeType) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: mimeType });
};

export const downloadFile = async (file) => {
  const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}${file.file_url}`;

  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.file_name; // forces download
    document.body.appendChild(link);

    link.click();

    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};
