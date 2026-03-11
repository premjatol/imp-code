import React from "react";
import { Group, Text } from "react-konva";

export const SymbolShape = ({ shape, shapeProps }) => {
  const symbolSize = 40;

  return (
    <Group
      {...shapeProps}
      x={shape.x}
      y={shape.y}
      onMouseEnter={(e) => {
        const stage = e.target.getStage();
        stage.container().style.cursor = "pointer";
      }}
      onMouseLeave={(e) => {
        const stage = e.target.getStage();
        stage.container().style.cursor = "default";
      }}
    >
      {/* Symbol Icon (emoji) */}
      {shape.symbolData?.icon && (
        <Text
          x={-symbolSize / 2}
          y={-symbolSize / 2}
          width={symbolSize}
          height={symbolSize}
          text={shape.symbolData.icon}
          fontSize={28}
          align="center"
          verticalAlign="middle"
        />
      )}

      {/* Optional label below the icon */}
      {/* {shape.symbolData?.name && (
        <Text
          x={-50}
          y={symbolSize / 2 + 4}
          width={100}
          text={shape.symbolData.name}
          fontSize={10}
          fill="#ffffff"
          align="center"
        />
      )} */}
    </Group>
  );
};
