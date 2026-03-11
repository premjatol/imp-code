"use client";

import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfPreview({ fileUrl }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (!fileUrl) return;

    const lower = fileUrl.toLowerCase();
    const pdfCheck = lower.endsWith(".pdf");

    setIsPdf(pdfCheck);

    // ✅ If NOT pdf → just use original image
    if (!pdfCheck) {
      setThumbnail(null);
      return;
    }

    // ✅ If PDF → generate thumbnail
    const generateThumbnail = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const scale = 1;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        setThumbnail(canvas.toDataURL("image/png"));
      } catch (err) {
        console.error("PDF thumbnail error:", err);
      }
    };

    generateThumbnail();
  }, [fileUrl]);

  return (
    <div className="w-full overflow-hidden flex items-center justify-center">
      {isPdf ? (
        thumbnail ? (
          <img src={thumbnail} alt="PDF Preview" />
        ) : (
          "Loading..."
        )
      ) : (
        <img src={fileUrl} alt="Plan Image" />
      )}
    </div>
  );
}