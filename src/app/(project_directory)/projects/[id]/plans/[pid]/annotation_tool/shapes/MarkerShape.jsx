import { Circle, Group, Line, Text } from "react-konva";

export const MarkerShape = ({ shape, shapeProps }) => {
  const markerRadius = 12;
  const pinHeight = 20;

  return (
    <Group {...shapeProps} x={shape.x} y={shape.y}>
      <Line
        points={[0, 0, 0, -pinHeight]}
        stroke={shape.color}
        strokeWidth={3}
        lineCap="round"
      />

      <Circle
        x={0}
        y={-pinHeight - markerRadius}
        radius={markerRadius}
        fill={shape.color}
        stroke="#ffffff"
        strokeWidth={2}
      />

      <Text
        x={-markerRadius}
        y={-pinHeight - markerRadius - 6}
        width={markerRadius * 2}
        align="center"
        text={shape.markerNumber || ""}
        fontSize={12}
        fontStyle="bold"
        fill="#ffffff"
      />

      <Circle x={0} y={0} radius={3} fill={shape.color} />
    </Group>
  );
};
