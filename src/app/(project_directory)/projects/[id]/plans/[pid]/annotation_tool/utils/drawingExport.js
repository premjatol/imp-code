// ---------- Color ----------
export const hexToArgbInt = (hex) => {
  if (!hex) return null;

  if (typeof hex === "number") return hex;

  const cleaned = hex.replace("#", "");
  const bigint = parseInt(cleaned, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const a = 255;

  return ((a << 24) | (r << 16) | (g << 8) | b) >>> 0;
};

// ---------- Stroke Width ----------
export const strokeWidthMap = {
  pen: 0.0031399147915043197,
  highlighter: 0.006279829583008639,
  large_highlighter: 0.00941974437451296,
  straight_line: 0.0031399147915043197,
  arrow: 0.0031399147915043197,
  multi_line: 0.0031399147915043197,
};

// ---------- Tool Action ----------
export const toolActionMap = {
  pen: "freeThin",
  highlighter: "freeMedium",
  large_highlighter: "freeThick",
  straight_line: "straight",
  arrow: "arrow",
  multi_line: "polygonLasso",
};

// ---------- Shape Action ----------
export const shapeActionMap = {
  rect: "rectangle",
  "rect-filled": "rectangle",
  circle: "circle",
  "circle-filled": "circle",
  cloud: "revisionCloud",
  "cloud-filled": "revisionCloud",
  triangle: "triangle",
  "triangle-filled": "triangle",
  polygon: "polygon",
  "polygon-filled": "polygon",
};

// ---------- Normalize ----------
const normalizePoint = (x, y, w, h) => ({
  x: x / w,
  y: y / h,
});

// ---------- clean object ----------
export function cleanPayloadDeep(value) {
  // Remove null or undefined
  if (value === null || value === undefined) {
    return undefined;
  }

  // Remove empty string
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    const cleanedArray = value
      .map(cleanPayloadDeep)
      .filter((v) => v !== undefined);

    return cleanedArray.length > 0 ? cleanedArray : undefined;
  }

  // Handle objects
  if (typeof value === "object") {
    const cleanedObject = {};

    Object.entries(value).forEach(([key, val]) => {
      const cleanedVal = cleanPayloadDeep(val);

      if (cleanedVal !== undefined) {
        cleanedObject[key] = cleanedVal;
      }
    });

    return Object.keys(cleanedObject).length > 0 ? cleanedObject : undefined;
  }

  // Keep valid primitives (including 0 and false)
  return value;
}

// ---------- Universal Converter ----------
export const convertShapeToJSON = (shape, imageWidth, imageHeight) => {
  if (!shape) return null;

  // ================= PEN / FREE =================
  if (
    ["pen", "highlighter", "large_highlighter", "multi_line"]?.includes(
      shape.tool,
    )
  ) {
    const normalizedPoints = [];

    for (let i = 0; i < shape.points.length; i += 2) {
      normalizedPoints.push(
        normalizePoint(
          shape.points[i],
          shape.points[i + 1],
          imageWidth,
          imageHeight,
        ),
      );
    }

    return cleanPayloadDeep({
      id: shape?.id,
      page_number: shape.page_number || 1,
      type: "free_draw",

      data_json: {
        toolType: "pen",
        toolAction: toolActionMap[shape.tool] || "freeThin",
        start: normalizedPoints[0] || null,
        points: normalizedPoints,
        color: shape.color || "#000000",
        strokeWidth: shape.strokeWidth || 2,
      },
    });
  }

  // ================= STRAIGHT / ARROW =================
  if (["straight_line", "arrow"]?.includes(shape.tool)) {
    const [x1, y1, x2, y2] = shape.points;

    const start = normalizePoint(x1, y1, imageWidth, imageHeight);
    const end = normalizePoint(x2, y2, imageWidth, imageHeight);

    return cleanPayloadDeep({
      id: shape?.id,
      page_number: shape.page_number || 1,
      type: shape.tool === "arrow" ? "pen_arrow" : "pen_straight_line",

      data_json: {
        toolType: "pen",
        toolAction: toolActionMap[shape.tool] || "arrow",
        start,
        end,
        color: shape.color || "#000000",
        strokeWidth: shape.strokeWidth || 3,
      },
    });
  }

  // ================= RECT / CIRCLE / TRIANGLE / CLOUD =================
  if (
    [
      "rect",
      "circle",
      "cloud",
      "triangle",
      "rect-filled",
      "circle-filled",
      "cloud-filled",
      "triangle-filled",
    ]?.includes(shape.tool)
  ) {
    const start = normalizePoint(shape.x, shape.y, imageWidth, imageHeight);
    const end = normalizePoint(
      shape.x + shape.width,
      shape.y + shape.height,
      imageWidth,
      imageHeight,
    );

    const action = shapeActionMap[shape.tool];
    const isFilled = shape.tool.includes("filled");

    return cleanPayloadDeep({
      id: shape?.id,
      page_number: shape.page_number || 1,
      type: `shape_${action}`,

      data_json: {
        toolType: "shapes",
        toolAction: action,
        start,
        end,
        color: shape.color || "#000000",
        strokeWidth: shape.strokeWidth || 3,
        fillColor: isFilled ? `${shape.color}33` : undefined,
        hideHandles: false,
      },
    });
  }

  // ================= POLYGON =================
  if (["polygon", "polygon-filled"]?.includes(shape.tool)) {
    const normalizedPoints = [];

    for (let i = 0; i < shape.points.length; i += 2) {
      normalizedPoints.push(
        normalizePoint(
          shape.points[i],
          shape.points[i + 1],
          imageWidth,
          imageHeight,
        ),
      );
    }

    const isFilled = shape.tool === "polygon-filled";

    return cleanPayloadDeep({
      id: shape?.id,
      page_number: shape.page_number || 1,
      type: "shape_polygon",

      data_json: {
        toolType: "shapes",
        toolAction: "polygon",
        points: normalizedPoints,
        color: shape.color || "#000000",
        strokeWidth: shape.strokeWidth || 3,
        fillColor: isFilled ? `${shape.color}33` : undefined,
        hideHandles: false,
      },
    });
  }

  // ================= SYMBOLS (FILES TYPE) =================
  if (shape.tool === "symbols") {
    const start = normalizePoint(shape.x, shape.y, imageWidth, imageHeight);

    return cleanPayloadDeep({
      id: shape?.id,
      page_number: shape.page_number || 1,
      type: "link_attachment",

      data_json: {
        toolType: "link",
        toolAction: "attachFile",
        start,
        attachment: {
          type: "file",
          name: shape.fileName || shape.symbolData?.name || "random",
        },
        symbolId: shape.symbolData?.id || null,
        symbolColor: shape.color || "#000000",
      },
    });
  }

  // ================= MARKER / PIN =================
  if (shape.tool === "marker") {
    console.log("shape....", shape);

    const start = normalizePoint(shape.x, shape.y, imageWidth, imageHeight);

    return cleanPayloadDeep({
      id: shape?.id,
      page_number: shape.page_number || 1,
      type: "location_pin",
      task_id: shape.extraConfig?.task_id,

      data_json: {
        toolType: "location",
        start,
        symbolId: shape.symbolId || "pin_icon_red",
        symbolColor: shape.color || "#FF0000",
        ...shape.extraConfig,
      },
    });
  }

  // ================= LINK =================
  if (shape.tool === "link") {
    const start = normalizePoint(shape.x, shape.y, imageWidth, imageHeight);

    // resolve attachment name safely
    const attachmentName =
      shape.linkType === "plan"
        ? shape.planName
        : shape.linkType === "photo"
          ? shape.photoName
          : shape.fileName;

    return cleanPayloadDeep({
      id: shape?.id,
      page_number: shape.page_number || 1,
      type: "link_attachment",

      data_json: {
        toolType: "link",
        toolAction: "attachFile",
        start,
        attachment: {
          type: shape.linkType || "file", // plan | photo | file
          name: attachmentName || "random",
        },
        symbolId: shape.symbolId || "doc_icon_01",
        symbolColor: shape.color || "#0000FF",
      },
    });
  }

  // ================= TEXT =================
  if (shape.tool === "text") {
    const start = normalizePoint(shape.x, shape.y, imageWidth, imageHeight);

    return cleanPayloadDeep({
      id: shape?.id,
      page_number: shape.page_number || 1,
      type: "text_note",

      data_json: {
        toolType: "text",
        start,
        text: shape.text || "",
        fontSize: shape.fontSize || 14,
        textColor: shape.color || "#000000",
        color: shape.backgroundColor || "#FFFF00",
      },
    });
  }

  // ================= MEASUREMENT / RULER =================
  if (
    [
      "measure_distance",
      "measure_calibrate",
      "measure_multiline",
      "measure_area",
    ]?.includes(shape.tool)
  ) {
    const pixelsPerFoot = shape.pixelsPerFoot || 1;

    const isCalibrated = !!shape.calibrated;

    const measureState =
      shape.tool === "measure_calibrate"
        ? "locked"
        : isCalibrated
          ? "locked"
          : "calibrating";

    const commonData = {
      toolType: "ruler",
      color: shape.color || "#FF6600",
      strokeWidth: shape.strokeWidth || 2,
      calibrated: isCalibrated,
      pixelsPerFoot,
      measureState,
    };

    // ================= CALIBRATION =================
    if (shape.tool === "measure_calibrate") {
      const [x1, y1, x2, y2] = shape.points;

      const dx = x2 - x1;
      const dy = y2 - y1;

      const pixelDistance = Math.sqrt(dx * dx + dy * dy);
      const distanceInFeet = pixelDistance / pixelsPerFoot;

      return cleanPayloadDeep({
        id: shape?.id,
        page_number: shape.page_number || 1,
        type: "measurement_linear",

        data_json: {
          ...commonData,
          toolAction: "linearDistance",
          rulerAction: "linearDistance",
          start: normalizePoint(x1, y1, imageWidth, imageHeight),
          end: normalizePoint(x2, y2, imageWidth, imageHeight),
          measurement:
            shape.calibratedValue ?? Number(distanceInFeet.toFixed(2)),
        },
      });
    }

    // ================= DISTANCE =================
    if (shape.tool === "measure_distance") {
      const [x1, y1, x2, y2] = shape.points;

      const dx = x2 - x1;
      const dy = y2 - y1;

      const pixelDistance = Math.sqrt(dx * dx + dy * dy);
      const distanceFeet = pixelDistance / pixelsPerFoot;

      return cleanPayloadDeep({
        id: shape?.id,
        page_number: shape.page_number || 1,
        type: "measurement_linear",

        data_json: {
          ...commonData,
          toolAction: "linearDistanceAuto",
          rulerAction: "linearDistanceAuto",
          start: normalizePoint(x1, y1, imageWidth, imageHeight),
          end: normalizePoint(x2, y2, imageWidth, imageHeight),
          measurement: Number(distanceFeet.toFixed(2)),
        },
      });
    }

    // ================= MULTILINE =================
    if (shape.tool === "measure_multiline") {
      const normalizedPoints = [];

      for (let i = 0; i < shape.points.length; i += 2) {
        normalizedPoints.push(
          normalizePoint(
            shape.points[i],
            shape.points[i + 1],
            imageWidth,
            imageHeight,
          ),
        );
      }

      // calculate polyline length
      let totalPixels = 0;

      for (let i = 0; i < shape.points.length - 2; i += 2) {
        const dx = shape.points[i + 2] - shape.points[i];
        const dy = shape.points[i + 3] - shape.points[i + 1];
        totalPixels += Math.sqrt(dx * dx + dy * dy);
      }

      const totalFeet = totalPixels / pixelsPerFoot;

      return cleanPayloadDeep({
        id: shape?.id,
        page_number: shape.page_number || 1,
        type: "measurement_linear",

        data_json: {
          ...commonData,
          toolAction: "lassoDistanceAuto",
          rulerAction: "lassoDistanceAuto",
          points: normalizedPoints,
          measurement: Number(totalFeet.toFixed(2)),
        },
      });
    }

    // ================= AREA =================
    if (shape.tool === "measure_area") {
      const normalizedPoints = [];

      for (let i = 0; i < shape.points.length; i += 2) {
        normalizedPoints.push(
          normalizePoint(
            shape.points[i],
            shape.points[i + 1],
            imageWidth,
            imageHeight,
          ),
        );
      }

      // calculate polygon area
      let area = 0;
      const n = shape.points.length / 2;

      for (let i = 0; i < n; i++) {
        const x1 = shape.points[i * 2];
        const y1 = shape.points[i * 2 + 1];
        const x2 = shape.points[((i + 1) % n) * 2];
        const y2 = shape.points[((i + 1) % n) * 2 + 1];

        area += x1 * y2 - x2 * y1;
      }

      const pixelArea = Math.abs(area / 2);
      const areaSqFt = pixelArea / (pixelsPerFoot * pixelsPerFoot);

      return cleanPayloadDeep({
        id: shape?.id,
        page_number: shape.page_number || 1,
        type: "measurement_area",

        data_json: {
          ...commonData,
          toolAction: "polygonAreaCount",
          rulerAction: "polygonAreaCount",
          points: normalizedPoints,
          fillColor: `${shape.color}22`,
          areaSqFt: Number(areaSqFt.toFixed(2)),
        },
      });
    }
  }

  return null;
};
