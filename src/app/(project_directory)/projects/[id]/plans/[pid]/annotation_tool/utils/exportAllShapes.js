import { convertShapeToJSON } from "./drawingExport";

export function exportAllShapes(shapes, imageWidth, imageHeight) {
  return shapes
    .map((shape) => convertShapeToJSON(shape, imageWidth, imageHeight))
    .filter(Boolean);
}
