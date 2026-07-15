import React, { useRef, useEffect } from "react";
import {
  Rect,
  Circle,
  Arrow,
  Line,
  Transformer,
  Group,
  Image as KonvaImage,
} from "react-konva";
import useImage from "use-image";

const ShapeWithFill = ({
  element,
  isSelected,
  onSelect,
  onChange,
  isPreview,
  onDragMove,
  onDragEnd,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(element.fillImage || "", "anonymous");

  useEffect(() => {
    if (isSelected && shapeRef.current && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e) => {
    const node = shapeRef.current;
    onChange(element.id, {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    });
    if (onDragEnd) onDragEnd();
  };

  const handleDragMove = (e) => {
    if (onDragMove) {
      onDragMove(element.id, e.target.x(), e.target.y());
    }
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    const baseProps = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    };

    switch (element.shape) {
      case "rect":
        onChange(element.id, {
          ...baseProps,
          width: node.width() * scaleX,
          height: node.height() * scaleY,
        });
        break;
      case "circle":
        onChange(element.id, {
          ...baseProps,
          radius: node.radius() * scaleX,
        });
        break;
      case "triangle":
      case "rhombus":
        const scaledPoints = (element.points || []).map((point, index) =>
          index % 2 === 0 ? point * scaleX : point * scaleY
        );
        onChange(element.id, {
          ...baseProps,
          points: scaledPoints,
        });
        break;
      case "arrow":
        const scale = node.getAbsoluteScale();
        const [x1, y1, x2, y2] = element.points;
        const dx = (x2 - x1) * scale.x;
        const dy = (y2 - y1) * scale.y;
        onChange(element.id, {
          ...baseProps,
          points: [0, 0, dx, dy],
        });
        break;
      default:
        break;
    }
  };

  const commonProps = {
    ref: shapeRef,
    x: element.x,
    y: element.y,
    draggable: !isPreview,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    rotation: element.rotation || 0,
    stroke: element.stroke || "#000000",
    strokeWidth: element.strokeWidth || 2,
    onDragMove: handleDragMove,
    opacity: element.opacity ?? 1,
  };

  let shapeNode = null;

  switch (element.shape) {
    case "rect":
      shapeNode = (
        <>
          {image && (
            <Group
              clipFunc={(ctx) => {
                ctx.beginPath();
                ctx.rect(0, 0, element.width, element.height);
                ctx.closePath();
              }}
              x={element.x}
              y={element.y}
              rotation={element.rotation || 0}
            >
              <KonvaImage
                image={image}
                x={0}
                y={0}
                width={element.width}
                height={element.height}
                opacity={element.opacity ?? 1}
                listening={false}
              />
            </Group>
          )}
          <Rect
            {...commonProps}
            width={element.width}
            height={element.height}
            fill={element.fillImage ? undefined : element.fill || "transparent"}
          />
        </>
      );
      break;

    case "circle":
      shapeNode = (
        <>
          {image && (
            <Group
              clipFunc={(ctx) => {
                ctx.beginPath();
                ctx.arc(0, 0, element.radius, 0, Math.PI * 2);
                ctx.closePath();
              }}
              x={element.x}
              y={element.y}
              rotation={element.rotation || 0}
            >
              <KonvaImage
                image={image}
                x={-element.radius}
                y={-element.radius}
                width={element.radius * 2}
                height={element.radius * 2}
                opacity={element.opacity ?? 1}
                listening={false}
              />
            </Group>
          )}
          <Circle
            {...commonProps}
            radius={element.radius}
            fill={element.fillImage ? undefined : element.fill || "transparent"}
          />
        </>
      );
      break;

    case "arrow":
      shapeNode = (
        <Arrow
          {...commonProps}
          points={element.points}
          pointerLength={element.pointerLength}
          pointerWidth={element.pointerWidth}
          fill={element.fill || "transparent"}
        />
      );
      break;

    case "triangle":
    case "rhombus":
      const points = element.points || [];

      // حساب إحداثيات الإزاحة للحصول على أقصى عرض وارتفاع
      const xPoints = points.filter((_, i) => i % 2 === 0);
      const yPoints = points.filter((_, i) => i % 2 !== 0);
      const minX = Math.min(...xPoints);
      const minY = Math.min(...yPoints);
      const maxX = Math.max(...xPoints);
      const maxY = Math.max(...yPoints);
      const width = maxX - minX;
      const height = maxY - minY;

      // تحويل النقاط
      const shiftedPoints = points.map((val, i) =>
        i % 2 === 0 ? val - minX : val - minY
      );

      shapeNode = (
        <>
          {image && (
            <Group
              x={element.x + minX}
              y={element.y + minY}
              rotation={element.rotation || 0}
              clipFunc={(ctx) => {
                if (shiftedPoints.length >= 6) {
                  ctx.beginPath();
                  ctx.moveTo(shiftedPoints[0], shiftedPoints[1]);
                  for (let i = 2; i < shiftedPoints.length; i += 2) {
                    ctx.lineTo(shiftedPoints[i], shiftedPoints[i + 1]);
                  }
                  ctx.closePath();
                }
              }}
            >
              <KonvaImage
                image={image}
                x={0}
                y={0}
                width={width}
                height={height}
                opacity={element.opacity ?? 1}
                listening={false}
              />
            </Group>
          )}
          <Line
            {...commonProps}
            points={points}
            closed
            fill={element.fillImage ? undefined : element.fill || "transparent"}
          />
        </>
      );
      break;

    default:
      return null;
  }

  return (
    <>
      {shapeNode}
      {!isPreview && isSelected && <Transformer ref={trRef} />}
    </>
  );
};

export default ShapeWithFill;
