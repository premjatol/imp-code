import React, { useState, useRef, useEffect } from "react";
import Toolbar from "./Toolbar";
import CanvasArea from "./CanvasArea";
import { MdUndo, MdRedo, MdErrorOutline } from "react-icons/md";
import { FaFilePdf, FaFileImage } from "react-icons/fa";
import { addToRecentlyUsed } from "./data/SymbolsData";
import { useParams, usePathname } from "next/navigation";
import { useAnnotationStore } from "@/stores/plans/useAnnotationStore";
import useImage from "use-image";
import { exportAllShapes } from "./utils/exportAllShapes";
import Btn from "@/components/common/Btn";
import { convertAllJSONToShapes } from "./utils/Convertjsontoshape";
import useProjectStore from "@/stores/project/useProjectStore";
import useTasksStore from "@/stores/tasks/useTasksStore";

const MODULEKEY = "annotationTool";

export default function AnnotationToolComp() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [color, setColor] = useState("#ff0000");
  const [shapes, setShapes] = useState([]);
  const [history, setHistory] = useState([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [recentlyUsedSymbols, setRecentlyUsedSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const { id, pid } = useParams();

  const [imageSrc, setImageSrc] = useState(null);
  const [image] = useImage(imageSrc);

  const [imageDimensions, setImageDimensions] = useState({
    width: 800,
    height: 600,
  });

  const fullscreenContainerRef = useRef(null);
  const {
    planDetails,
    isLoading,
    createAnnotationMap,
    isApiLoading,
    getAnnotationShapes,
    shapes: apiShapes,
    clearAllStates,
  } = useAnnotationStore();

  const { setProjectId } = useTasksStore();

  const pathname = usePathname();

  useEffect(() => {
    getAnnotationShapes(id, pid);
    setProjectId(id);
  }, [id, pid]);

  useEffect(() => {
    return () => {
      clearAllStates();
    };
  }, [pathname]);

  // 2. Add this useEffect (after your existing useEffects)
  useEffect(() => {
    if (!apiShapes?.length || !imageDimensions.width || !imageDimensions.height)
      return;

    const converted = convertAllJSONToShapes(
      apiShapes,
      imageDimensions.width,
      imageDimensions.height,
    );

    setShapes(converted);
    setHistory([converted]); // reset history so undo doesn't go to empty
    setHistoryStep(0);
  }, [apiShapes, imageDimensions]);

  // 1. Get PID from URL and Load Data from LocalStorage
  useEffect(() => {
    if (planDetails) {
      const isPdf = planDetails?.file_path?.endsWith(".pdf");

      setFilePreview(
        `${process.env.NEXT_PUBLIC_IMAGE_URL}/${planDetails?.file_path}`,
      );
      setUploadedFile({
        type: isPdf ? "pdf" : "image",
        name: planDetails?.name || "Document",
      });
    }
  }, [planDetails]);

  const updateShapes = (newShapes) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newShapes);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    setShapes(newShapes);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      setShapes(history[newStep]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      setShapes(history[newStep]);
    }
  };

  const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 5));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.1));

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      fullscreenContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleSymbolSelect = (symbol) => {
    setRecentlyUsedSymbols((prevRecent) =>
      addToRecentlyUsed(symbol, prevRecent),
    );
    setSelectedSymbol(symbol);
    setSelectedTool("symbol");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        handleRedo();
      }
      if (e.key.toLowerCase() === "v" || e.key === "Escape") {
        setSelectedTool("select");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyStep, history, pid]);

  const toolbarProps = {
    selectedTool,
    setSelectedTool: (tool) => {
      if (tool === "fullView") handleFullScreen();
      else if (tool === "zoomin") handleZoomIn();
      else if (tool === "zoomout") handleZoomOut();
      else setSelectedTool(tool);
    },
    color,
    setColor,
    handleUndo,
    handleRedo,
    onSelectSymbol: handleSymbolSelect,
    recentlyUsedSymbols,
  };

  // Get actual image dimensions when loaded
  useEffect(() => {
    if (!filePreview) return;

    let isActive = true;
    let loadingTask = null;

    const loadFile = async () => {
      const isPdf = filePreview?.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        if (isActive) setImageSrc(filePreview);
        return;
      }

      try {
        loadingTask = pdfjsLib.getDocument(filePreview);
        const pdf = await loadingTask.promise;

        if (!isActive) return;

        const page = await pdf.getPage(1);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        if (!isActive) return;

        const dataUrl = canvas.toDataURL("image/png");
        setImageSrc(dataUrl);
      } catch (err) {
        if (isActive) {
          console.error("PDF render error:", err);
        }
      }
    };

    loadFile();

    return () => {
      isActive = false;

      if (loadingTask) {
        loadingTask.destroy();
      }
    };
  }, [filePreview]);

  useEffect(() => {
    if (!image) return;

    setImageDimensions({
      width: image.width,
      height: image.height,
    });
  }, [image]);

  const annotationSubmition = async () => {
    const json = exportAllShapes(
      shapes,
      imageDimensions.width,
      imageDimensions.height,
    );

    const data = json
      .filter((s) => s.id?.startsWith("shape-"))
      .map((s) => {
        const { id, ...rest } = s;
        return rest;
      });

    // console.log("annotationSubmition: ......", data);

    await createAnnotationMap({ items: data });
  };

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center text-white">
        Loading project...
      </div>
    );

  return (
    <div className="flex w-full h-full border border-gray-300 overflow-hidden rounded-l-md bg-zinc-900">
      {!filePreview ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
          <MdErrorOutline size={48} className="mb-2" />
          <p>File not found or invalid Project ID.</p>
        </div>
      ) : (
        <div
          ref={fullscreenContainerRef}
          className="flex flex-1 overflow-hidden bg-zinc-800 relative"
        >
          <Toolbar {...toolbarProps} />

          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="bg-zinc-100 border-b text-gray-700 border-zinc-300 px-4 py-1 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {uploadedFile?.type === "pdf" ? (
                  <FaFilePdf className="text-red-500 shrink-0" size={14} />
                ) : (
                  <FaFileImage className="text-blue-500 shrink-0" size={14} />
                )}
                <span className="text-gray-700 text-xs font-medium truncate">
                  {uploadedFile?.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-4">
                {/* Undo */}
                <button
                  onClick={handleUndo}
                  disabled={historyStep === 0}
                  className={`p-2 rounded-md transition-all duration-200 
                      ${
                        historyStep === 0
                          ? "opacity-40 cursor-not-allowed text-zinc-500"
                          : "text-zinc-500 hover:bg-zinc-200 hover:text-black active:scale-95 cursor-pointer"
                      }`}
                  title="Undo (Ctrl+Z)"
                >
                  <MdUndo size={18} />
                </button>

                {/* Redo */}
                <button
                  onClick={handleRedo}
                  disabled={historyStep === history.length - 1}
                  className={`p-2 rounded-md transition-all duration-200 
                    ${
                      historyStep === history.length - 1
                        ? "opacity-40 cursor-not-allowed text-zinc-500"
                        : "text-zinc-500 hover:bg-zinc-200 hover:text-black active:scale-95 cursor-pointer"
                    }`}
                  title="Redo (Ctrl+Y)"
                >
                  <MdRedo size={18} />
                </button>

                {/* submit */}
                <Btn
                  type="button"
                  btnName="Submit"
                  disabled={isApiLoading}
                  isLoading={isApiLoading}
                  onClickFunc={() => annotationSubmition()}
                />
              </div>
            </div>

            <div className="flex-1 overflow-hidden min-w-0">
              <CanvasArea
                image={image}
                tool={selectedTool}
                shapes={shapes}
                setShapes={setShapes}
                commitShapes={updateShapes}
                color={color}
                zoom={zoom}
                setZoom={setZoom}
                stagePos={stagePos}
                setStagePos={setStagePos}
                selectedSymbol={selectedSymbol}
                imageDimensions={imageDimensions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
