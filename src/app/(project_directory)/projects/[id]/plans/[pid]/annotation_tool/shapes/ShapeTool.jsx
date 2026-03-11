import React from "react";
import { Rect, Circle, Line, Path } from "react-konva";

// Generate cloud-like path
export const generateCloudPath = (x, y, width, height) => {
  const points = [];
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const radiusX = Math.abs(width / 2);
  const radiusY = Math.abs(height / 2);

  for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
    const bump = Math.sin(angle * 5) * 0.15;
    const r = 1 + bump;
    const px = centerX + Math.cos(angle) * radiusX * r;
    const py = centerY + Math.sin(angle) * radiusY * r;
    points.push(px, py);
  }

  return points;
};

// Rectangle Shape Component
export const RectangleShape = ({ shape, shapeProps, strokeWidth }) => {
  const isFilled = shape.filled || false;
  return (
    <Rect
      {...shapeProps}
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      stroke={shape.color}
      strokeWidth={strokeWidth}
      fill={isFilled ? shape.color : "transparent"}
    />
  );
};

// Circle Shape Component
export const CircleShape = ({ shape, shapeProps, strokeWidth }) => {
  const isFilled = shape.filled || false;
  const radius =
    Math.sqrt(Math.pow(shape.width, 2) + Math.pow(shape.height, 2)) / 2;

  return (
    <Circle
      {...shapeProps}
      x={shape.x + shape.width / 2}
      y={shape.y + shape.height / 2}
      radius={Math.abs(radius)}
      stroke={shape.color}
      strokeWidth={strokeWidth}
      fill={isFilled ? shape.color : "transparent"}
    />
  );
};

// Triangle Shape Component
export const TriangleShape = ({ shape, shapeProps, strokeWidth }) => {
  const isFilled = shape.filled || false;
  const points = [
    shape.width / 2,
    0,
    0,
    shape.height,
    shape.width,
    shape.height,
  ];

  return (
    <Line
      {...shapeProps}
      x={shape.x}
      y={shape.y}
      points={points}
      stroke={shape.color}
      strokeWidth={strokeWidth}
      closed={true}
      fill={isFilled ? shape.color : "transparent"}
    />
  );
};

export const CloudShape = ({ shape, shapeProps, strokeWidth }) => {
  const isFilled = shape.filled || false;

  const width = Math.abs(shape.width);
  const height = Math.abs(shape.height);

  const bumpSize = 10; // height of bump
  const bumpSpacing = 25; // distance between bumps

  let path = `M 0 0 `;

  // ---- TOP EDGE (left → right) ----
  for (let x = 0; x < width; x += bumpSpacing) {
    const nextX = Math.min(x + bumpSpacing, width);
    const midX = x + (nextX - x) / 2;
    path += `Q ${midX} ${-bumpSize} ${nextX} 0 `;
  }

  // ---- RIGHT EDGE (top → bottom) ----
  for (let y = 0; y < height; y += bumpSpacing) {
    const nextY = Math.min(y + bumpSpacing, height);
    const midY = y + (nextY - y) / 2;
    path += `Q ${width + bumpSize} ${midY} ${width} ${nextY} `;
  }

  // ---- BOTTOM EDGE (right → left) ----
  for (let x = width; x > 0; x -= bumpSpacing) {
    const nextX = Math.max(x - bumpSpacing, 0);
    const midX = x - (x - nextX) / 2;
    path += `Q ${midX} ${height + bumpSize} ${nextX} ${height} `;
  }

  // ---- LEFT EDGE (bottom → top) ----
  for (let y = height; y > 0; y -= bumpSpacing) {
    const nextY = Math.max(y - bumpSpacing, 0);
    const midY = y - (y - nextY) / 2;
    path += `Q ${-bumpSize} ${midY} 0 ${nextY} `;
  }

  path += "Z";

  return (
    <Path
      {...shapeProps}
      x={shape.x}
      y={shape.y}
      data={path}
      stroke={shape.color}
      strokeWidth={strokeWidth}
      fill={isFilled ? shape.color : "transparent"}
    />
  );
};

// Polygon Shape Component
export const PolygonShape = ({ shape, shapeProps, strokeWidth }) => {
  const isFilled = shape.filled || false;

  return (
    <Line
      {...shapeProps}
      points={shape.points}
      stroke={shape.color}
      strokeWidth={strokeWidth}
      closed={true}
      fill={isFilled ? shape.color : "transparent"}
      lineCap="round"
      lineJoin="round"
    />
  );
};
