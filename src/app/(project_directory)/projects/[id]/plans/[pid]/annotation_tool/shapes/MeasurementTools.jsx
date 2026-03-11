import React from "react";
import { Line, Group, Text, Circle, Rect } from "react-konva";

// ---------------- Distance Helpers ----------------

// Distance between two points
export const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// Total polyline distance
export const calculatePolylineDistance = (points) => {
  let totalDistance = 0;

  for (let i = 0; i < points.length - 2; i += 2) {
    totalDistance += calculateDistance(
      points[i],
      points[i + 1],
      points[i + 2],
      points[i + 3],
    );
  }

  return totalDistance;
};

// Polygon area using Shoelace formula
export const calculatePolygonArea = (points) => {
  let area = 0;
  const n = points.length / 2;

  for (let i = 0; i < n; i++) {
    const x1 = points[i * 2];
    const y1 = points[i * 2 + 1];
    const x2 = points[((i + 1) % n) * 2];
    const y2 = points[((i + 1) % n) * 2 + 1];

    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area / 2);
};

// Convert pixels to feet
export const pixelsToFeet = (pixels, pixelsPerFoot) => {
  if (!pixelsPerFoot) return 0;
  return pixels / pixelsPerFoot;
};

// Convert decimal feet to feet + inches
export const formatFeetInches = (feetDecimal) => {
  const feet = Math.floor(feetDecimal);
  const inchesDecimal = (feetDecimal - feet) * 12;

  const inches = Math.floor(inchesDecimal);
  const fraction = inchesDecimal - inches;

  const denominator = 16;
  const numerator = Math.round(fraction * denominator);

  if (numerator === 0) {
    return `${feet}' ${inches}"`;
  }

  return `${feet}' ${inches}-${numerator}/${denominator}"`;
};

// ---------------- Calibration Shape ----------------

export const CalibrationShape = ({ shape, shapeProps }) => {
  if (!shape.points || shape.points.length < 4) return null;

  const [x1, y1, x2, y2] = shape.points;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const pixelDistance = calculateDistance(x1, y1, x2, y2);

  const pixelsPerFoot = shape.pixelsPerFoot || 1;

  let label = "";

  // 1️⃣ If user entered a fixed value
  if (shape.calibratedValue) {
    label = shape.calibratedValue;
  }

  // 2️⃣ Otherwise calculate automatically
  else {
    const feetValue = pixelDistance / pixelsPerFoot;
    label = formatFeetInches(feetValue);
  }

  const color = shape.color || "#00ff00";

  return (
    <Group {...shapeProps}>
      <Line
        points={shape.points}
        stroke={color}
        strokeWidth={2}
        lineCap="round"
      />

      <Circle x={x1} y={y1} radius={4} fill={color} />
      <Circle x={x2} y={y2} radius={4} fill={color} />

      <Rect
        x={midX - 40}
        y={midY - 22}
        width={80}
        height={20}
        fill="black"
        opacity={0.6}
        cornerRadius={4}
      />

      <Text
        x={midX - 40}
        y={midY - 22}
        width={80}
        height={20}
        text={label}
        fontSize={10}
        fill={color}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
};

// ---------------- Distance Shape ----------------

export const DistanceShape = ({ shape, shapeProps }) => {
  if (!shape.points || shape.points.length < 4) return null;

  const [x1, y1, x2, y2] = shape.points;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const pixelDistance = calculateDistance(x1, y1, x2, y2);

  const pixelsPerFoot = shape.pixelsPerFoot || 1;

  const feetValue = pixelsToFeet(pixelDistance, pixelsPerFoot);

  const displayDistance = formatFeetInches(feetValue);

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const perpAngle = angle + Math.PI / 2;

  const capLength = 8;

  const color = shape.color || "#ff6b6b";

  return (
    <Group {...shapeProps}>
      <Line
        points={shape.points}
        stroke={color}
        strokeWidth={2}
        lineCap="round"
        dash={[5, 5]}
      />

      <Circle x={x1} y={y1} radius={4} fill={color} />
      <Circle x={x2} y={y2} radius={4} fill={color} />

      <Line
        points={[
          x1 + Math.cos(perpAngle) * capLength,
          y1 + Math.sin(perpAngle) * capLength,
          x1 - Math.cos(perpAngle) * capLength,
          y1 - Math.sin(perpAngle) * capLength,
        ]}
        stroke={color}
        strokeWidth={2}
      />

      <Line
        points={[
          x2 + Math.cos(perpAngle) * capLength,
          y2 + Math.sin(perpAngle) * capLength,
          x2 - Math.cos(perpAngle) * capLength,
          y2 - Math.sin(perpAngle) * capLength,
        ]}
        stroke={color}
        strokeWidth={2}
      />

      {/* Distance label with background */}
      <Group x={midX} y={midY - 18}>
        <Rect
          x={0}
          y={-4}
          width={60}
          height={18}
          fill="black"
          opacity={0.6}
          cornerRadius={4}
        />

        <Text
          text={displayDistance}
          fontSize={10}
          fill={color}
          width={60}
          align="center"
          verticalAlign="middle"
        />
      </Group>
    </Group>
  );
};

// ---------------- Multi Line Distance ----------------

export const MultiLineDistanceShape = ({ shape, shapeProps }) => {
  if (!shape.points || shape.points.length < 4) return null;

  const points = shape.points;

  const pixelsPerFoot = shape.pixelsPerFoot || 1;

  const totalPixelDistance = calculatePolylineDistance(points);

  const totalFeet = pixelsToFeet(totalPixelDistance, pixelsPerFoot);

  const displayDistance = formatFeetInches(totalFeet);

  const centerIndex = Math.floor(points.length / 4) * 2;

  const labelX = points[centerIndex] || points[0];
  const labelY = points[centerIndex + 1] || points[1];

  return (
    <Group {...shapeProps}>
      <Line
        points={points}
        stroke={shape.color || "#4ecdc4"}
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
        dash={[5, 5]}
      />

      {Array.from({ length: points.length / 2 }).map((_, i) => (
        <Circle
          key={i}
          x={points[i * 2]}
          y={points[i * 2 + 1]}
          radius={4}
          fill={shape.color || "#4ecdc4"}
        />
      ))}

      {Array.from({ length: points.length / 2 - 1 }).map((_, i) => {
        const x1 = points[i * 2];
        const y1 = points[i * 2 + 1];

        const x2 = points[(i + 1) * 2];
        const y2 = points[(i + 1) * 2 + 1];

        const segmentDistance = calculateDistance(x1, y1, x2, y2);

        const feetSegment = pixelsToFeet(segmentDistance, pixelsPerFoot);

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        return (
          <Text
            key={i}
            x={midX - 20}
            y={midY - 16}
            text={formatFeetInches(feetSegment)}
            fontSize={10}
            fill={shape.color}
            opacity={0.8}
          />
        );
      })}

      <Group x={labelX} y={labelY - 30}>
        <Text
          text={`Total: ${displayDistance}`}
          fontSize={12}
          fill={shape.color}
          fontStyle="bold"
          padding={4}
        />
      </Group>
    </Group>
  );
};

// ---------------- Area Shape ----------------

export const AreaShape = ({ shape, shapeProps }) => {
  if (!shape.points || shape.points.length < 6) return null;

  const points = shape.points;

  const pixelsPerFoot = shape.pixelsPerFoot || 1;

  const pixelArea = calculatePolygonArea(points);

  const areaFeet = pixelArea / (pixelsPerFoot * pixelsPerFoot);

  const displayArea = `${areaFeet.toFixed(2)} ft²`;

  const perimeterPixels = calculatePolylineDistance([
    ...points,
    points[0],
    points[1],
  ]);

  const perimeterFeet = pixelsToFeet(perimeterPixels, pixelsPerFoot);

  const displayPerimeter = formatFeetInches(perimeterFeet);

  let centroidX = 0;
  let centroidY = 0;

  const n = points.length / 2;

  for (let i = 0; i < n; i++) {
    centroidX += points[i * 2];
    centroidY += points[i * 2 + 1];
  }

  centroidX /= n;
  centroidY /= n;

  return (
    <Group {...shapeProps}>
      <Line
        points={points}
        stroke={shape.color || "#ffd93d"}
        strokeWidth={2}
        fill={`${shape.color || "#ffd93d"}33`}
        closed
        lineCap="round"
        lineJoin="round"
      />

      {Array.from({ length: n }).map((_, i) => (
        <Circle
          key={i}
          x={points[i * 2]}
          y={points[i * 2 + 1]}
          radius={4}
          fill={shape.color || "#ffd93d"}
        />
      ))}

      <Group x={centroidX - 40} y={centroidY - 20}>
        <Text
          text={`Area: ${displayArea}`}
          fontSize={12}
          fill={shape.color}
          fontStyle="bold"
        />

        <Text
          y={16}
          text={`Perimeter: ${displayPerimeter}`}
          fontSize={10}
          fill={shape.color}
        />
      </Group>
    </Group>
  );
};
