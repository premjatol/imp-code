import React from "react";
import { Text, Group } from "react-konva";

export default function TextBox({
  shape,
  shapeProps,
  isSelected,
  onTransformEnd,
}) {
  return (
    <Group
      {...shapeProps}
      x={shape.x}
      y={shape.y}
      draggable={shapeProps?.draggable}
      onDragEnd={(e) => {
        if (shapeProps?.draggable && onTransformEnd) {
          onTransformEnd(e, shape.id);
        }
      }}
    >
      <Text
        text={shape.text}
        fontSize={shape.fontSize || 16}
        fill={shape.color}
        fontFamily={shape.fontFamily || "sans-serif"}
        padding={10}
        align="left"
        verticalAlign="middle"
      />
    </Group>
  );
}
