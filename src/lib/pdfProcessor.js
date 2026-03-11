// Use the legacy/minified build for better compatibility with Next.js
export const processFileToImages = async (file) => {
  // 1. Guard for SSR
  if (typeof window === "undefined") return [];

  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");

  // 2. Dynamic Worker Initialization
  // This ensures the worker matches the version of the library exactly
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  return new Promise(async (resolve, reject) => {
    try {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) =>
          resolve([
            {
              id: `p-${Date.now()}`,
              name: file.name,
              img: e.target.result,
              tasks: "0",
              date: new Date().toISOString().split("T")[0],
              tags: "",
              selected: false,
            },
          ]);
        reader.readAsDataURL(file);
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        // This helps avoid issues with custom transforms in some environments
        disableFontFace: false,
      });

      const pdf = await loadingTask.promise;
      const images = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        // Use a standard scale
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // jpeg at 0.7 quality to keep size manageable for LocalStorage
        const imageData = canvas.toDataURL("image/jpeg", 0.7);

        images.push({
          id: `p-${Date.now()}-${i}`,
          name: `${file.name.replace(".pdf", "")} (Page ${i})`,
          tasks: "0",
          date: new Date().toISOString().split("T")[0],
          tags: "",
          selected: false,
          img: imageData,
        });

        // Cleanup to prevent memory leaks
        canvas.width = 0;
        canvas.height = 0;
      }
      resolve(images);
    } catch (error) {
      console.error("PDF.js Error:", error);
      reject(error);
    }
  });
};
