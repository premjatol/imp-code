import React from "react";
import TextBox from "./TextBox";
import { MarkerShape } from "./MarkerShape";
import {
  ArrowShape,
  MultiLineShape,
  PenShape,
  StraightLineShape,
} from "./PenTool";
import {
  AreaShape,
  CalibrationShape,
  DistanceShape,
  MultiLineDistanceShape,
} from "./MeasurementTools";
import { SymbolShape } from "./SymbolShape";
import { LinkShape } from "./LinkShape";
import {
  CircleShape,
  CloudShape,
  PolygonShape,
  RectangleShape,
  TriangleShape,
} from "./ShapeTool";

// Main Shape Renderer Component
export const ShapeRenderer = ({
  shape,
  onShapeClick,
  onTransformEnd,
  tool,
  measurementScale = 1,
  measurementUnit = "px",
}) => {
  const strokeWidthMap = {
    pen: 2,
    highlighter: 15,
    large_highlighter: 25,
    straight_line: 2,
    arrow: 2,
    multi_line: 2,
  };

  const strokeWidth = strokeWidthMap[shape.tool] || 2;

  const isSelectable = tool === "select";
  const isEraser = tool === "eraser";

  const shapeProps = {
    id: shape.id,
    draggable: isSelectable,
    listening: isSelectable || isEraser,
    onClick:
      isSelectable || isEraser ? (e) => onShapeClick(shape.id, e) : undefined,
    onTap:
      isSelectable || isEraser ? (e) => onShapeClick(shape.id, e) : undefined,
  };

  const isSelected = tool === "select";

  // Render appropriate shape based on tool type
  switch (shape.tool) {
    case "rect":
    case "rect-filled":
      return (
        <RectangleShape shape={shape} shapeProps={shapeProps} strokeWidth={2} />
      );

    case "circle":
    case "circle-filled":
      return (
        <CircleShape shape={shape} shapeProps={shapeProps} strokeWidth={2} />
      );

    case "triangle":
    case "triangle-filled":
      return (
        <TriangleShape shape={shape} shapeProps={shapeProps} strokeWidth={2} />
      );

    case "cloud":
    case "cloud-filled":
      return (
        <CloudShape shape={shape} shapeProps={shapeProps} strokeWidth={2} />
      );

    case "polygon":
    case "polygon-filled":
      return (
        <PolygonShape shape={shape} shapeProps={shapeProps} strokeWidth={2} />
      );

    case "pen":
    case "highlighter":
    case "large_highlighter":
      return (
        <PenShape
          shape={shape}
          shapeProps={shapeProps}
          strokeWidth={strokeWidth}
        />
      );

    case "marker":
      return <MarkerShape shape={shape} shapeProps={shapeProps} />;

    case "text":
      return (
        <TextBox
          shape={shape}
          shapeProps={shapeProps}
          isSelected={isSelected}
          onTransformEnd={onTransformEnd}
        />
      );

    case "straight_line":
      return (
        <StraightLineShape
          shape={shape}
          shapeProps={shapeProps}
          strokeWidth={strokeWidth}
        />
      );

    case "arrow":
      return (
        <ArrowShape
          shape={shape}
          shapeProps={shapeProps}
          strokeWidth={strokeWidth}
        />
      );

    case "multi_line":
      return (
        <MultiLineShape
          shape={shape}
          shapeProps={shapeProps}
          strokeWidth={strokeWidth}
        />
      );

    // Measurement Tools
    case "measure_calibrate":
      return (
        <CalibrationShape
          shape={shape}
          shapeProps={shapeProps}
          scale={measurementScale}
          unit={measurementUnit}
        />
      );

    case "measure_distance":
      return (
        <DistanceShape
          shape={shape}
          shapeProps={shapeProps}
          scale={measurementScale}
          unit={measurementUnit}
        />
      );

    case "measure_multiline":
      return (
        <MultiLineDistanceShape
          shape={shape}
          shapeProps={shapeProps}
          scale={measurementScale}
          unit={measurementUnit}
        />
      );

    case "measure_area":
      return (
        <AreaShape
          shape={shape}
          shapeProps={shapeProps}
          scale={measurementScale}
          unit={measurementUnit}
        />
      );

    case "symbols": {
      return <SymbolShape shape={shape} shapeProps={shapeProps} />;
    }

    case "link":
      return <LinkShape shape={shape} shapeProps={shapeProps} />;

    default:
      return null;
  }
};
