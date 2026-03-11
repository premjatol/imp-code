// utils/convertJSONToShape.js

// ---------- Denormalize ----------
const denormalizePoint = (x, y, imageWidth, imageHeight) => ({
  x: x * imageWidth,
  y: y * imageHeight,
});

// ---------- Reverse Tool Action Map ----------
const toolActionToTool = {
  freeThin: "pen",
  freeMedium: "highlighter",
  freeThick: "large_highlighter",
  straight: "straight_line",
  arrow: "arrow",
  polygonLasso: "multi_line",
};

// ---------- Reverse Shape Action Map ----------
const shapeActionToTool = {
  rectangle: "rect",
  circle: "circle",
  revisionCloud: "cloud",
  triangle: "triangle",
  polygon: "polygon",
};

// utils/convertJSONToShape.js
export const convertJSONToShape = (apiShape, imageWidth, imageHeight) => {
  if (!apiShape || !apiShape.data_json) return null;

  const { data_json, id, page_number } = apiShape;
  const toolAction = data_json?.toolAction || data_json?.toolType;

  const base = { id, page_number };

  // ================= FREE DRAW =================
  if (toolActionToTool[toolAction] && data_json.points) {
    const tool = toolActionToTool[toolAction];

    const points = (data_json.points || []).flatMap((p) => {
      const dp = denormalizePoint(p.x, p.y, imageWidth, imageHeight);
      return [dp.x, dp.y];
    });

    return {
      ...base,
      tool,
      color: data_json.color || "#000000",
      strokeWidth: data_json.strokeWidth || 2,
      points,
    };
  }

  // ================= STRAIGHT LINE / ARROW =================
  if (toolAction === "straight" || toolAction === "arrow") {
    const tool = toolActionToTool[toolAction];

    const start = denormalizePoint(
      data_json.start.x,
      data_json.start.y,
      imageWidth,
      imageHeight,
    );

    const end = denormalizePoint(
      data_json.end.x,
      data_json.end.y,
      imageWidth,
      imageHeight,
    );

    return {
      ...base,
      tool,
      color: data_json.color || "#000000",
      strokeWidth: data_json.strokeWidth || 2,
      points: [start.x, start.y, end.x, end.y],
    };
  }

  // ================= SHAPES =================
  if (shapeActionToTool[toolAction]) {
    const baseTool = shapeActionToTool[toolAction];
    const isFilled = !!data_json.fillColor;

    const tool = isFilled ? `${baseTool}-filled` : baseTool;

    const start = denormalizePoint(
      data_json.start.x,
      data_json.start.y,
      imageWidth,
      imageHeight,
    );

    const end = denormalizePoint(
      data_json.end.x,
      data_json.end.y,
      imageWidth,
      imageHeight,
    );

    return {
      ...base,
      tool,
      color: data_json.color || "#000000",
      strokeWidth: data_json.strokeWidth || 2,
      x: start.x,
      y: start.y,
      width: end.x - start.x,
      height: end.y - start.y,
      filled: isFilled,
    };
  }

  // ================= POLYGON =================
  if (toolAction === "polygon") {
    const isFilled = !!data_json.fillColor;
    const tool = isFilled ? "polygon-filled" : "polygon";

    const points = (data_json.points || []).flatMap((p) => {
      const dp = denormalizePoint(p.x, p.y, imageWidth, imageHeight);
      return [dp.x, dp.y];
    });

    return {
      ...base,
      tool,
      color: data_json.color || "#000000",
      strokeWidth: data_json.strokeWidth || 2,
      points,
      filled: isFilled,
    };
  }

  // ================= TEXT =================
  if (toolAction === "text") {
    const start = denormalizePoint(
      data_json.start.x,
      data_json.start.y,
      imageWidth,
      imageHeight,
    );

    return {
      ...base,
      tool: "text",
      color: data_json.textColor || "#000000",
      backgroundColor: data_json.color || "#FFFF00",
      x: start.x,
      y: start.y,
      text: data_json.text || "",
      fontSize: data_json.fontSize || 14,
    };
  }

  // ================= MARKER / PIN =================
  if (toolAction === "location" || data_json.toolType === "location") {
    const start = denormalizePoint(
      data_json.start.x,
      data_json.start.y,
      imageWidth,
      imageHeight,
    );

    return {
      ...base,
      tool: "marker",
      color: data_json.symbolColor || "#FF0000",
      x: start.x,
      y: start.y,
      symbolId: data_json.symbolId || "pin_icon_red",
      category: data_json.category || "inspection_point",
      task_id: apiShape.task_id,
    };
  }

  // ================= LINK / ATTACHMENT =================
  if (toolAction === "attachFile") {
    const start = denormalizePoint(
      data_json.start.x,
      data_json.start.y,
      imageWidth,
      imageHeight,
    );

    const linkType = data_json.attachment?.type || "file";
    const attachmentName = data_json.attachment?.name || "";

    if (data_json.symbolId && linkType === "file") {
      return {
        ...base,
        tool: "symbols",
        color: data_json.symbolColor || "#000000",
        x: start.x,
        y: start.y,
        symbolData: {
          id: data_json.symbolId,
          name: attachmentName,
        },
      };
    }

    return {
      ...base,
      tool: "link",
      color: data_json.symbolColor || "#0000FF",
      x: start.x,
      y: start.y,
      linkType,
      symbolId: data_json.symbolId || "doc_icon_01",
      ...(linkType === "plan" && { planName: attachmentName }),
      ...(linkType === "photo" && { photoName: attachmentName }),
      ...(linkType === "file" && { fileName: attachmentName }),
    };
  }

  // ================= MULTILINE DISTANCE =================
  if (toolAction === "lassoDistanceAuto") {
    const points = (data_json.points || []).flatMap((p) => {
      const dp = denormalizePoint(p.x, p.y, imageWidth, imageHeight);
      return [dp.x, dp.y];
    });

    return {
      ...base,
      tool: "measure_multiline",
      color: data_json.color || "#FF6600",
      strokeWidth: data_json.strokeWidth || 2,
      points,

      calibrated: data_json.calibrated || false,
      pixelsPerFoot: data_json.pixelsPerFoot || null,

      measurement: data_json.measurement || null,
    };
  }

  // ================= LINEAR DISTANCE / CALIBRATION =================
  if (toolAction === "linearDistance" || toolAction === "linearDistanceAuto") {
    const start = denormalizePoint(
      data_json.start.x,
      data_json.start.y,
      imageWidth,
      imageHeight,
    );

    const end = denormalizePoint(
      data_json.end.x,
      data_json.end.y,
      imageWidth,
      imageHeight,
    );

    let tool = "measure_distance";
    let calibratedValue = null;

    // If calibration line (manual value)
    if (toolAction === "linearDistance") {
      tool = "measure_calibrate";
      calibratedValue = data_json.measurement || null;
    }

    return {
      ...base,
      tool,

      color: data_json.color || "#FF6600",
      strokeWidth: data_json.strokeWidth || 2,

      points: [start.x, start.y, end.x, end.y],

      calibrated: data_json.calibrated || false,
      pixelsPerFoot: data_json.pixelsPerFoot || null,

      calibratedValue,
    };
  }

  // ================= AREA =================
  if (toolAction === "polygonAreaCount") {
    const points = (data_json.points || []).flatMap((p) => {
      const dp = denormalizePoint(p.x, p.y, imageWidth, imageHeight);
      return [dp.x, dp.y];
    });

    return {
      ...base,
      tool: "measure_area",

      color: data_json.color || "#FF6600",
      strokeWidth: data_json.strokeWidth || 2,

      points,

      calibrated: data_json.calibrated || false,
      pixelsPerFoot: data_json.pixelsPerFoot || null,

      areaSqFt: data_json.areaSqFt || null,
    };
  }

  return null;
};

// ---------- Batch Converter ----------
export const convertAllJSONToShapes = (apiShapes, imageWidth, imageHeight) => {
  if (!Array.isArray(apiShapes)) return [];

  return [...apiShapes]
    .sort((a, b) => a.created_at - b.created_at) // ✅ oldest first → newest renders on top
    .map((apiShape) => convertJSONToShape(apiShape, imageWidth, imageHeight))
    .filter(Boolean);
};
