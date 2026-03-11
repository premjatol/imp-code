import Modal from "@/components/Modal";
import CreateTaskModal from "@/components/common/create-task-modal/CreateTaskModal";
import { useAnnotationStore } from "@/stores/plans/useAnnotationStore";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs";
import { useEffect, useRef, useState } from "react";
import {
  Image as KonvaImage,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
} from "react-konva";
import CalibrationPopup from "./components/CalibrationPopup";
import LinkPopup from "./components/LinkPopup";
import TextPopup from "./components/TextPopup";
import { calculateDistance } from "./shapes/MeasurementTools";
import { ShapeRenderer } from "./shapes/ShapeComponents";
import { useParams } from "next/navigation";
import useTasksStore from "@/stores/tasks/useTasksStore";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function CanvasArea({
  image,
  tool,
  shapes,
  setShapes,
  commitShapes,
  color,
  zoom,
  setZoom,
  stagePos,
  setStagePos,
  selectedSymbol,
  imageDimensions,
}) {
  const { deleteShape } = useAnnotationStore();
  const { clearTaskInfo, setTaskInfo, setTaskId } = useTasksStore();
  const { id: projectId, pid: planid } = useParams();

  const isDrawing = useRef(false);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [multiLinePoints, setMultiLinePoints] = useState([]);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // --- Measurement State ---
  const [measurementUnit, setMeasurementUnit] = useState("px");
  const [showCalibrationPopup, setShowCalibrationPopup] = useState(false);
  const [pendingCalibration, setPendingCalibration] = useState(null);

  // --- Text State ---
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [pendingTextPosition, setPendingTextPosition] = useState(null);

  // --- Marker State ---
  const [showMarkerPopup, setShowMarkerPopup] = useState(false);
  const [pendingMarkerPosition, setPendingMarkerPosition] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // --- multi select State ---
  const [selectionRect, setSelectionRect] = useState(null);

  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const containerRef = useRef(null);

  // Update canvas dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  // Deselect shapes when tool changes (except for select tool)
  useEffect(() => {
    if (!tool) {
      setSelectedIds([]);
    }
  }, [tool]);

  // --- Link State ---
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [pendingLinkPosition, setPendingLinkPosition] = useState(null);
  const [activeLinkType, setActiveLinkType] = useState(null);

  // --- Marker state ---
  const [editingMarker, setEditingMarker] = useState(null);

  // cursor-pointer
  useEffect(() => {
    const container = stageRef.current?.container();
    if (!container) return;

    if (!tool) {
      container.style.cursor = "grab";
      return;
    }

    const cursorMap = {
      pen: "crosshair",
      highlighter: "crosshair",
      large_highlighter: "crosshair",
      eraser: "pointer",
      marker: "pointer",
      polygon: "crosshair",
      select: "default",
    };

    container.style.cursor = cursorMap[tool] || "default";
  }, [tool]);

  // Mock data
  const [plans] = useState([
    { id: "PLN-001", name: "Floor Plan A", description: "First floor layout" },
    { id: "PLN-002", name: "Floor Plan B", description: "Second floor layout" },
    {
      id: "PLN-003",
      name: "Electrical Plan",
      description: "Electrical wiring layout",
    },
  ]);

  const [photos] = useState([
    {
      id: "PHT-001",
      name: "Photo 1.jpg",
      url: "https://via.placeholder.com/150",
    },
    {
      id: "PHT-002",
      name: "Photo 2.jpg",
      url: "https://via.placeholder.com/150",
    },
  ]);

  const [files] = useState([
    { id: "FILE-001", name: "Specification.pdf", type: "PDF Document" },
    { id: "FILE-002", name: "Materials.xlsx", type: "Excel Spreadsheet" },
  ]);

  useEffect(() => {
    if (!transformerRef.current) return;

    const stage = stageRef.current;

    const nodes = selectedIds
      .map((id) => stage.findOne(`#${id}`))
      .filter(Boolean);

    transformerRef.current.nodes(nodes);
    transformerRef.current.getLayer().batchDraw();
  }, [selectedIds]);

  // delete shape function
  const removeShape = (shapeId) => {
    const shape = shapes.find((s) => s.id === shapeId);
    if (!shape) return false;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shape?",
    );

    if (!confirmDelete) return false;

    if (shape.id) {
      deleteShape(shape.id);
    }

    setShapes((prev) => prev.filter((s) => s.id !== shapeId));

    return true;
  };

  // delete by key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Delete") return;

      if (selectedIds.length !== 1) {
        console.warn("Multiple shape delete is not allowed");
        return;
      }

      const shapeId = selectedIds[0];

      const deleted = removeShape(shapeId);

      if (deleted) {
        setSelectedIds([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, shapes]);

  // FIXED: Adjusted position for perfect pointer tracking at any zoom
  const getAdjustedPosition = (e) => {
    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();
    return {
      x: (pointerPosition.x - stage.x()) / stage.scaleX(),
      y: (pointerPosition.y - stage.y()) / stage.scaleY(),
    };
  };

  const clampToImageBounds = (pos) => {
    return {
      x: Math.max(0, Math.min(imageDimensions.width, pos.x)),
      y: Math.max(0, Math.min(imageDimensions.height, pos.y)),
    };
  };

  // --- Dragging Constraint Logic ---
  const handleDragMove = (e, shapeId) => {
    const node = e.target;

    const clamped = clampToImageBounds({
      x: node.x(),
      y: node.y(),
    });

    node.position(clamped);

    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === shapeId ? { ...shape, x: clamped.x, y: clamped.y } : shape,
      ),
    );
  };

  const handleDragEnd = (e, shapeId) => {
    const node = e.target;
    if (tool === "select") {
      const container = e.target.getStage().container();
      container.style.cursor = "grab";
    }
    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        if (shape.id === shapeId) {
          return {
            ...shape,
            x: node.x(),
            y: node.y(),
          };
        }
        return shape;
      }),
    );
  };

  const handleMouseDown = (e) => {
    const stage = stageRef.current;
    const container = stage.container();

    if (tool === "select") {
      const clickedOnTransformer =
        e.target.getParent()?.className === "Transformer";

      const clickedOnShape = shapes.some((shape) => e.target.id() === shape.id);

      if (!clickedOnShape && !clickedOnTransformer) {
        const pos = getAdjustedPosition(e);

        setSelectionRect({
          x1: pos.x,
          y1: pos.y,
          x2: pos.x,
          y2: pos.y,
        });

        setSelectedIds([]);
      }

      return;
    }

    if (tool === "select") return;

    const adjustedPos = getAdjustedPosition(e);
    const clampedPos = clampToImageBounds(adjustedPos);

    if (tool === "link_plan" || tool === "link_photo" || tool === "link_file") {
      setPendingLinkPosition(clampedPos);
      setActiveLinkType(tool.replace("link_", ""));
      setShowLinkPopup(true);
      return;
    }

    if (tool === "symbols" && selectedSymbol) {
      setShapes([
        ...shapes,
        {
          tool: "symbols",
          id: `symbols-${Date.now()}`,
          x: clampedPos.x,
          y: clampedPos.y,
          symbolData: selectedSymbol,
        },
      ]);
      return;
    }

    if (tool === "marker") {
      setEditingMarker(null); // ensure it's a new marker
      setIsEditMode(false); // important
      setTaskInfo({ x_coordinate: clampedPos.x, y_coordinate: clampedPos.y });
      setPendingMarkerPosition(clampedPos);
      setShowMarkerPopup(true);
      return;
    }

    if (tool === "text") {
      setPendingTextPosition(clampedPos);
      setShowTextPopup(true);
      return;
    }

    if (tool === "polygon" || tool === "polygon-filled") {
      container.style.cursor = "crosshair";
      setPolygonPoints([...polygonPoints, clampedPos.x, clampedPos.y]);
      return;
    }

    if (tool === "multi_line") {
      container.style.cursor = "crosshair";
      setMultiLinePoints([...multiLinePoints, clampedPos.x, clampedPos.y]);
      return;
    }

    if (tool === "measure_calibrate" || tool === "measure_distance") {
      isDrawing.current = true;
      setShapes([
        ...shapes,
        {
          tool,
          color: color,
          points: [clampedPos.x, clampedPos.y, clampedPos.x, clampedPos.y],
          id: `shape-${Date.now()}`,
        },
      ]);
      return;
    }

    if (tool === "measure_multiline" || tool === "measure_area") {
      container.style.cursor = "crosshair";
      setMeasurePoints([...measurePoints, clampedPos.x, clampedPos.y]);
      return;
    }

    if (
      tool === "pen" ||
      tool === "highlighter" ||
      tool === "large_highlighter"
    ) {
      isDrawing.current = true;
      setShapes([
        ...shapes,
        {
          tool,
          color,
          points: [clampedPos.x, clampedPos.y],
          id: `shape-${Date.now()}`,
        },
      ]);
      return;
    }

    if (tool === "straight_line" || tool === "arrow") {
      isDrawing.current = true;
      setShapes([
        ...shapes,
        {
          tool,
          color,
          points: [clampedPos.x, clampedPos.y, clampedPos.x, clampedPos.y],
          id: `shape-${Date.now()}`,
        },
      ]);
      return;
    }

    // Default shapes (rect, circle etc)
    isDrawing.current = true;
    setShapes([
      ...shapes,
      {
        tool,
        color,
        x: clampedPos.x,
        y: clampedPos.y,
        width: 0,
        height: 0,
        id: `shape-${Date.now()}`,
        filled: tool?.includes("-filled"),
      },
    ]);
  };

  const handleMouseMove = (e) => {
    if (tool === "select" && selectionRect) {
      const pos = getAdjustedPosition(e);

      setSelectionRect((prev) => ({
        ...prev,
        x2: pos.x,
        y2: pos.y,
      }));
      return;
    }

    if (!isDrawing.current || tool === "select") return;

    const clampedPoint = clampToImageBounds(getAdjustedPosition(e));
    const lastIndex = shapes.length - 1;
    const lastShape = { ...shapes[lastIndex] };

    if (["pen", "highlighter", "large_highlighter"].includes(tool)) {
      lastShape.points = [...lastShape.points, clampedPoint.x, clampedPoint.y];
    } else if (
      [
        "straight_line",
        "arrow",
        "measure_calibrate",
        "measure_distance",
      ].includes(tool)
    ) {
      lastShape.points = [
        lastShape.points[0],
        lastShape.points[1],
        clampedPoint.x,
        clampedPoint.y,
      ];
    } else {
      lastShape.width = clampedPoint.x - lastShape.x;
      lastShape.height = clampedPoint.y - lastShape.y;
    }

    const newShapes = [...shapes];
    newShapes[lastIndex] = lastShape;
    setShapes(newShapes);
  };

  const handleMouseUp = () => {
    if (tool === "measure_calibrate" && isDrawing.current) {
      const lastShape = shapes[shapes.length - 1];
      if (lastShape?.points?.length >= 4) {
        const dist = calculateDistance(
          lastShape.points[0],
          lastShape.points[1],
          lastShape.points[2],
          lastShape.points[3],
        );
        if (dist > 5) {
          setPendingCalibration({ shapeId: lastShape.id, pixelDistance: dist });
          setShowCalibrationPopup(true);
        }
      }
    }

    if (tool === "select" && selectionRect) {
      const { x1, y1, x2, y2 } = selectionRect;

      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const maxX = Math.max(x1, x2);
      const maxY = Math.max(y1, y2);

      const stage = stageRef.current;

      const selected = shapes
        .filter((shape) => {
          const node = stage.findOne(`#${shape.id}`);
          if (!node) return false;

          const box = node.getClientRect({
            skipTransform: false,
            relativeTo: stage,
          });

          return !(
            box.x > maxX ||
            box.x + box.width < minX ||
            box.y > maxY ||
            box.y + box.height < minY
          );
        })
        .map((shape) => shape.id);

      setSelectedIds(selected);
      setSelectionRect(null);
    }

    if (isDrawing.current) {
      commitShapes([...shapes]);
    }

    isDrawing.current = false;
  };

  const handleDoubleClick = () => {
    const container = stageRef.current?.container();
    if (
      (tool === "polygon" || tool === "polygon-filled") &&
      polygonPoints.length > 4
    ) {
      completePolygon();
      container.style.cursor = "default";
    }
    if (tool === "multi_line" && multiLinePoints.length > 2) {
      completeMultiLine();
      container.style.cursor = "default";
    }
    if (tool === "measure_multiline" && measurePoints.length > 2) {
      completeMeasureMultiline();
      container.style.cursor = "default";
    }
    if (tool === "measure_area" && measurePoints.length > 4) {
      completeMeasureArea();
      container.style.cursor = "default";
    }
  };

  // Logic completion functions (kept same as yours but ensuring they clean arrays)
  const completePolygon = () => {
    setShapes([
      ...shapes,
      {
        tool,
        color,
        points: polygonPoints,
        id: `poly-${Date.now()}`,
        filled: tool.includes("-filled"),
      },
    ]);
    setPolygonPoints([]);
  };

  const completeMultiLine = () => {
    setShapes([
      ...shapes,
      {
        tool: "multi_line",
        color,
        points: multiLinePoints,
        id: `ml-${Date.now()}`,
      },
    ]);
    setMultiLinePoints([]);
  };

  const completeMeasureMultiline = () => {
    setShapes([
      ...shapes,
      {
        tool: "measure_multiline",
        color: color,
        points: measurePoints,
        id: `mm-${Date.now()}`,
      },
    ]);
    setMeasurePoints([]);
  };

  const completeMeasureArea = () => {
    setShapes([
      ...shapes,
      {
        tool: "measure_area",
        color: color,
        points: measurePoints,
        id: `ma-${Date.now()}`,
      },
    ]);
    setMeasurePoints([]);
  };

  const applyCalibration = (data) => {
    if (!pendingCalibration) return;

    setMeasurementUnit(data.unit);

    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === pendingCalibration.shapeId
          ? {
              ...shape,
              calibratedValue: data.value,
              unit: data.unit,
            }
          : shape,
      ),
    );
  };

  const handleLinkSubmit = (data) => {
    if (pendingLinkPosition) {
      setShapes([
        ...shapes,
        {
          tool: "link",
          id: `link-${Date.now()}`,
          x: pendingLinkPosition.x,
          y: pendingLinkPosition.y,
          linkType: activeLinkType,
          color: color,
          ...data,
        },
      ]);
    }
    setShowLinkPopup(false);
  };

  const handleTextSubmit = (data) => {
    if (pendingTextPosition) {
      setShapes([
        ...shapes,
        {
          tool: "text",
          id: `txt-${Date.now()}`,
          x: pendingTextPosition.x,
          y: pendingTextPosition.y,
          text: data.text,
          fontSize: data.fontSize,
          color,
        },
      ]);
    }

    setShowTextPopup(false);
  };

  const handleMarkerSubmit = (data) => {
    if (!pendingMarkerPosition) return;

    if (isEditMode && editingMarker) {
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === editingMarker.id
            ? { ...shape, extraConfig: data }
            : shape,
        ),
      );
    } else {
      setShapes((prev) => [
        ...prev,
        {
          tool: "marker",
          id: `shape-${Date.now()}`,
          x: pendingMarkerPosition.x,
          y: pendingMarkerPosition.y,
          color: color,
          extraConfig: data,
        },
      ]);
    }

    setShowMarkerPopup(false);
  };

  const handleShapeClick = (id, e) => {
    const clickedShape = shapes.find((s) => s.id === id);
    if (!clickedShape) return;

    if (tool === "eraser") {
      removeShape(id);
      return;
    }

    if (tool === "select") {
      e.cancelBubble = true;

      if (clickedShape.tool === "marker") {
        setEditingMarker(clickedShape);
        setPendingMarkerPosition({
          x: clickedShape.x,
          y: clickedShape.y,
        });
        setShowMarkerPopup(true);
        setIsEditMode(true);
        console.log(clickedShape);
        
        setTaskId(clickedShape?.task_id);
      }

      if (e.evt.shiftKey) {
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
        );
      } else {
        setSelectedIds([id]);
      }
    }
  };

  const handleTransformEnd = (e, shapeId) => {
    const node = e.target;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    setShapes((prev) =>
      prev.map((shape) => {
        if (shape.id !== shapeId) return shape;

        const newWidth = Math.max(20, shape.width * scaleX);
        const newHeight = Math.max(20, shape.height * scaleY);

        return {
          ...shape,
          x: node.x(),
          y: node.y(),
          width: newWidth,
          height: newHeight,
          rotation: node.rotation(),
        };
      }),
    );
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.1, Math.min(10, newScale));
    setZoom(clampedScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-zinc-100 relative overflow-hidden"
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={zoom}
        scaleY={zoom}
        x={stagePos.x}
        y={stagePos.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDblClick={handleDoubleClick}
        onWheel={handleWheel}
        draggable={!tool}
        onDragStart={() => {
          if (!tool) {
            const container = stageRef.current.container();
            container.style.cursor = "grabbing";
          }
        }}
        onDragEnd={() => {
          if (!tool) {
            const container = stageRef.current.container();
            container.style.cursor = "grab";
          }
        }}
      >
        <Layer>
          {/* Outside Area (Gray Background) */}
          <Rect
            x={-5000}
            y={-5000}
            width={10000}
            height={10000}
            fill="#e5e7eb" // light gray
            listening={false}
          />

          {/* File Background (White Area) */}
          <Rect
            x={0}
            y={0}
            width={imageDimensions.width}
            height={imageDimensions.height}
            fill="#ffffff"
            stroke="#9ca3af" // gray border
            strokeWidth={2}
            listening={false}
          />

          {/* Image */}
          {image && (
            <KonvaImage
              image={image}
              width={imageDimensions.width}
              height={imageDimensions.height}
            />
          )}

          {/* Shapes */}
          {shapes.map((shape) => (
            <ShapeRenderer
              key={shape.id}
              shape={shape}
              onShapeClick={tool ? handleShapeClick : undefined}
              onTransformEnd={
                tool === "select" ? handleTransformEnd : undefined
              }
              onDragMove={
                tool === "select"
                  ? (e) => handleDragMove(e, shape.id)
                  : undefined
              }
              onDragEnd={
                tool === "select"
                  ? (e) => handleDragEnd(e, shape.id)
                  : undefined
              }
              draggable={tool === "select"}
              tool={tool}
              measurementUnit={measurementUnit}
              onMouseEnter={(e) => {
                if (tool === "select") {
                  const container = e.target.getStage().container();
                  container.style.cursor = "grab";
                }
              }}
              onMouseLeave={(e) => {
                if (tool === "select") {
                  const container = e.target.getStage().container();
                  container.style.cursor = "default";
                }
              }}
              onDragStart={(e) => {
                if (tool === "select") {
                  const container = e.target.getStage().container();
                  container.style.cursor = "grabbing";
                }
              }}
            />
          ))}

          {/* Select multiple shapes */}
          {selectionRect && (
            <Rect
              x={Math.min(selectionRect.x1, selectionRect.x2)}
              y={Math.min(selectionRect.y1, selectionRect.y2)}
              width={Math.abs(selectionRect.x2 - selectionRect.x1)}
              height={Math.abs(selectionRect.y2 - selectionRect.y1)}
              fill="rgba(0,161,255,0.2)"
              stroke="#00a1ff"
              strokeWidth={1}
              dash={[4, 4]}
            />
          )}

          {tool === "select" && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Prevent transformer from resizing outside bounds
                if (
                  newBox.x < 0 ||
                  newBox.y < 0 ||
                  newBox.x + newBox.width > imageDimensions.width ||
                  newBox.y + newBox.height > imageDimensions.height
                ) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}

          {/* Previews */}
          {polygonPoints.length > 0 && (
            <Line points={polygonPoints} stroke={color} strokeWidth={2} />
          )}
          {multiLinePoints.length > 0 && (
            <Line points={multiLinePoints} stroke={color} strokeWidth={2} />
          )}
          {measurePoints.length > 0 && (
            <Line
              points={measurePoints}
              stroke="#4ecdc4"
              dash={[5, 5]}
              strokeWidth={2}
            />
          )}
        </Layer>
      </Stage>

      {/* Floating UI Indicators */}
      <div className="absolute top-4 right-4 bg-zinc-900 text-white px-3 py-1 rounded text-sm border border-zinc-700 z-10">
        {Math.round(zoom * 100)}%
      </div>

      <Modal
        open={showMarkerPopup}
        heading={isEditMode ? "Update Task" : "Add Task"}
        onClose={() => {
          setShowMarkerPopup(false);
          setEditingMarker(null);
          clearTaskInfo();
          setIsEditMode(false);
        }}
        width="800px"
      >
        <CreateTaskModal
          position={pendingMarkerPosition}
          initialData={editingMarker}
          onSubmit={handleMarkerSubmit}
          onClose={() => {
            setShowMarkerPopup(false);
            setEditingMarker(null);
            setIsEditMode(false);
          }}
          imageDimensions={imageDimensions}
          isEditMode={isEditMode}
        />
      </Modal>

      {showTextPopup && (
        <TextPopup
          position={pendingTextPosition}
          onSubmit={handleTextSubmit}
          onCancel={() => setShowTextPopup(false)}
        />
      )}

      {showCalibrationPopup && (
        <CalibrationPopup
          pixelDistance={pendingCalibration?.pixelDistance}
          onSubmit={(data) => {
            applyCalibration(data);
            setShowCalibrationPopup(false);
          }}
          onCancel={() => setShowCalibrationPopup(false)}
        />
      )}

      {showLinkPopup && (
        <LinkPopup
          linkType={activeLinkType}
          position={pendingLinkPosition}
          onSubmit={handleLinkSubmit}
          onCancel={() => setShowLinkPopup(false)}
          plans={plans}
          photos={photos}
          files={files}
        />
      )}
    </div>
  );
}
