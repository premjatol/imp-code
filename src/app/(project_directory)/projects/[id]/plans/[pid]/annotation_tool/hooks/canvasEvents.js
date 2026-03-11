// canvasEvents.js
import { calculateDistance } from "../shapes/MeasurementTools";

/* ---------------------------------- */
/* Helpers                            */
/* ---------------------------------- */

export const getAdjustedPosition = (stageRef) => {
  const stage = stageRef.current;
  const pointerPosition = stage.getPointerPosition();

  return {
    x: (pointerPosition.x - stage.x()) / stage.scaleX(),
    y: (pointerPosition.y - stage.y()) / stage.scaleY(),
  };
};

export const clampToImageBounds = (pos, imageDimensions) => ({
  x: Math.max(0, Math.min(imageDimensions.width, pos.x)),
  y: Math.max(0, Math.min(imageDimensions.height, pos.y)),
});

/* ---------------------------------- */
/* Drag Events                        */
/* ---------------------------------- */

export const handleDragMove = ({
  e,
  shapeId,
  selectedIds,
  shapes,
  setShapes,
}) => {
  if (!selectedIds.includes(shapeId)) return;

  const node = e.target;
  const original = shapes.find((s) => s.id === shapeId);
  if (!original) return;

  const dx = node.x() - original.x;
  const dy = node.y() - original.y;

  setShapes((prev) =>
    prev.map((shape) =>
      selectedIds.includes(shape.id)
        ? { ...shape, x: shape.x + dx, y: shape.y + dy }
        : shape,
    ),
  );
};

export const handleDragEnd = ({
  e,
  shapeId,
  tool,
  setShapes,
  stageRef,
}) => {
  const node = e.target;

  if (tool === "select") {
    const container = stageRef.current.container();
    container.style.cursor = "grab";
  }

  setShapes((prev) =>
    prev.map((shape) =>
      shape.id === shapeId
        ? { ...shape, x: node.x(), y: node.y() }
        : shape,
    ),
  );
};

/* ---------------------------------- */
/* Mouse Events                       */
/* ---------------------------------- */

export const handleMouseDown = (params) => {
  const {
    e,
    tool,
    stageRef,
    shapes,
    setShapes,
    color,
    imageDimensions,
    isDrawing,
    polygonPoints,
    setPolygonPoints,
    multiLinePoints,
    setMultiLinePoints,
    measurePoints,
    setMeasurePoints,
    setSelectionRect,
    setSelectedIds,
    setPendingTextPosition,
    setShowTextPopup,
    setPendingMarkerPosition,
    setShowMarkerPopup,
    setPendingLinkPosition,
    setShowLinkPopup,
    setActiveLinkType,
    selectedSymbol,
  } = params;

  const stage = stageRef.current;
  const clickedOnEmpty = e.target === stage;

  if (tool === "select") {
    if (clickedOnEmpty) {
      const pos = getAdjustedPosition(stageRef);
      setSelectionRect({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
      setSelectedIds([]);
    }
    return;
  }

  const adjustedPos = getAdjustedPosition(stageRef);
  const clampedPos = clampToImageBounds(adjustedPos, imageDimensions);

  if (tool === "text") {
    setPendingTextPosition(clampedPos);
    setShowTextPopup(true);
    return;
  }

  if (tool === "marker") {
    setPendingMarkerPosition(clampedPos);
    setShowMarkerPopup(true);
    return;
  }

  if (tool === "link_plan" || tool === "link_photo" || tool === "link_file") {
    setPendingLinkPosition(clampedPos);
    setActiveLinkType(tool.replace("link_", ""));
    setShowLinkPopup(true);
    return;
  }

  if (tool === "symbols" && selectedSymbol) {
    setShapes((prev) => [
      ...prev,
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

  isDrawing.current = true;

  setShapes((prev) => [
    ...prev,
    {
      tool,
      color,
      x: clampedPos.x,
      y: clampedPos.y,
      width: 0,
      height: 0,
      id: `shape-${Date.now()}`,
    },
  ]);
};

export const handleMouseMove = ({
  e,
  tool,
  isDrawing,
  stageRef,
  shapes,
  setShapes,
  imageDimensions,
}) => {
  if (!isDrawing.current || tool === "select") return;

  const clampedPoint = clampToImageBounds(
    getAdjustedPosition(stageRef),
    imageDimensions,
  );

  const lastIndex = shapes.length - 1;
  const lastShape = { ...shapes[lastIndex] };

  lastShape.width = clampedPoint.x - lastShape.x;
  lastShape.height = clampedPoint.y - lastShape.y;

  const newShapes = [...shapes];
  newShapes[lastIndex] = lastShape;
  setShapes(newShapes);
};

export const handleMouseUp = ({
  tool,
  isDrawing,
  shapes,
  setShowCalibrationPopup,
  setPendingCalibration,
}) => {
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
        setPendingCalibration({
          shapeId: lastShape.id,
          pixelDistance: dist,
        });
        setShowCalibrationPopup(true);
      }
    }
  }

  isDrawing.current = false;
};

/* ---------------------------------- */
/* Shape Click                        */
/* ---------------------------------- */

export const handleShapeClick = ({
  id,
  e,
  tool,
  shapes,
  setShapes,
  setSelectedIds,
}) => {
  if (tool === "eraser") {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    return;
  }

  if (tool === "select") {
    e.cancelBubble = true;

    if (e.evt.shiftKey) {
      setSelectedIds((prev) =>
        prev.includes(id)
          ? prev.filter((sid) => sid !== id)
          : [...prev, id],
      );
    } else {
      setSelectedIds([id]);
    }
  }
};

/* ---------------------------------- */
/* Transform                          */
/* ---------------------------------- */

export const handleTransformEnd = ({
  e,
  shapeId,
  setShapes,
}) => {
  const node = e.target;

  const scaleX = node.scaleX();
  const scaleY = node.scaleY();

  node.scaleX(1);
  node.scaleY(1);

  setShapes((prev) =>
    prev.map((shape) => {
      if (shape.id !== shapeId) return shape;

      return {
        ...shape,
        x: node.x(),
        y: node.y(),
        width: Math.max(20, shape.width * scaleX),
        height: Math.max(20, shape.height * scaleY),
        rotation: node.rotation(),
      };
    }),
  );
};
