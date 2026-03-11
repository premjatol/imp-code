import React, { useState } from "react";
import { Group, Circle, Text, Rect } from "react-konva";

export const LinkShape = ({ shape, shapeProps }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    if (shape.linkType === "plan") return "🔗";
    if (shape.linkType === "photo") return "📷";
    return "📎";
  };

  const canInteract = shapeProps?.listening;

  const radius = 14; // ✅ smaller size

  return (
    <Group
      {...shapeProps}
      x={shape.x}
      y={shape.y}
      onMouseEnter={canInteract ? () => setIsHovered(true) : undefined}
      onMouseLeave={canInteract ? () => setIsHovered(false) : undefined}
    >
      {/* Circle */}
      <Circle
        radius={radius}
        fill={shape.color || "#3b82f6"}
        stroke="#ffffff"
        strokeWidth={1}
        shadowColor="black"
        shadowBlur={isHovered ? 6 : 3}
        shadowOpacity={0.4}
      />

      {/* Icon */}
      <Text
        text={getIcon()}
        fontSize={14}
        fill="#ffffff"
        width={radius * 2}
        height={radius * 2}
        offsetX={radius}
        offsetY={radius}
        align="center"
        verticalAlign="middle"
      />

      {/* Smaller Tooltip */}
      {isHovered && canInteract && (
        <Group listening={false}>
          <Rect
            x={18}
            y={-12}
            width={110}
            height={24}
            fill="#000000"
            opacity={0.85}
            cornerRadius={4}
          />
          <Text
            text={
              shape.linkType === "plan"
                ? `Plan: ${shape.planId || "N/A"}`
                : shape.linkType === "photo"
                ? "View Photo"
                : "View File"
            }
            x={24}
            y={-6}
            fontSize={11}
            fill="#ffffff"
          />
        </Group>
      )}
    </Group>
  );
};
