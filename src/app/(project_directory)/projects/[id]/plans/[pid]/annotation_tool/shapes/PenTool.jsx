// Add these exports to your existing ShapeComponents.jsx

import { Line } from "react-konva";

export const StraightLineShape = ({ shape, shapeProps, strokeWidth }) => {
  return (
    <Line
      {...shapeProps}
      points={shape.points}
      stroke={shape.color}
      strokeWidth={strokeWidth}
      lineCap="round"
      lineJoin="round"
    />
  );
};

export const ArrowShape = ({ shape, shapeProps, strokeWidth }) => {
  const [x1, y1, x2, y2] = shape.points;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowSize = 10;
  const arrowX1 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
  const arrowY1 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
  const arrowX2 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
  const arrowY2 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);

  return (
    <>
      <Line
        {...shapeProps}
        points={[x1, y1, x2, y2]}
        stroke={shape.color}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
      />
      <Line
        {...shapeProps}
        points={[x2, y2, arrowX1, arrowY1]}
        stroke={shape.color}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
      />
      <Line
        {...shapeProps}
        points={[x2, y2, arrowX2, arrowY2]}
        stroke={shape.color}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
      />
    </>
  );
};

export const MultiLineShape = ({ shape, shapeProps, strokeWidth }) => {
  return (
    <Line
      {...shapeProps}
      points={shape.points}
      stroke={shape.color}
      strokeWidth={strokeWidth}
      tension={0.3}
      lineCap="round"
      lineJoin="round"
      closed={false}
    />
  );
};

export const PenShape = ({ shape, shapeProps, strokeWidth }) => {
  const isHighlighter =
    shape.tool === "highlighter" || shape.tool === "large_highlighter";

  return (
    <Line
      {...shapeProps}
      points={shape.points}
      stroke={shape.color}
      strokeWidth={strokeWidth}
      tension={0.5}
      lineCap="round"
      lineJoin="round"
      opacity={isHighlighter ? 0.6 : 1}
      globalCompositeOperation={isHighlighter ? "multiply" : "source-over"}
      x={shape.x}
      y={shape.y}
    />
  );
};
