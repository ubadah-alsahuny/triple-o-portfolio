import React, { useRef, useEffect, useState, useLayoutEffect } from "react";

import {
  Stage,
  Layer,
  Text,
  Image as KonvaImage,
  Transformer,
  Rect,
  Circle,
  Arrow,
  Line,
} from "react-konva";
import useImage from "use-image";
import ShapeWithFill from "../ShapeWithFill.jsx";

//  صورة الخلفية من URL
const URLBackground = ({ imageUrl, width, height }) => {
  const [img] = useImage(imageUrl, "anonymous");
  return (
    <KonvaImage
      image={img}
      x={0}
      y={0}
      width={width}
      height={height}
      listening={false}
    />
  );
};
//  عنصر الصورة
const CanvasImage = ({
  element,
  isSelected,
  onSelect,
  onChange,
  isPreview,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img] = useImage(element.src, "anonymous");

  useEffect(() => {
    if (!isPreview && isSelected && img && shapeRef.current && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, img, isPreview]);

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={img}
        x={Number(element.x)}
        y={Number(element.y)}
        width={Number(element.width)}
        height={Number(element.height)}
        draggable={!isPreview}
        opacity={element.opacity ?? 1}
        onClick={!isPreview ? onSelect : undefined}
        onTap={!isPreview ? onSelect : undefined}
        onDragEnd={
          !isPreview
            ? (e) =>
                onChange(element.id, {
                  x: e.target.x(),
                  y: e.target.y(),
                })
            : undefined
        }
        rotation={element.rotation || 0}
        onTransformEnd={
          !isPreview
            ? (e) => {
                const node = shapeRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                node.scaleX(1);
                node.scaleY(1);

                onChange(element.id, {
                  x: node.x(),
                  y: node.y(),
                  width: node.width() * scaleX,
                  height: node.height() * scaleY,
                  rotation: node.rotation(),
                });
              }
            : undefined
        }
      />
      {!isPreview && isSelected && <Transformer ref={trRef} />}
    </>
  );
};

//  النص
const EditableText = ({
  element,
  isSelected,
  onSelect,
  onChange,
  onStartEditing,
  isPreview,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (!isPreview && isSelected && shapeRef.current && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, isPreview]);

  return (
    <>
      <Text
        ref={shapeRef}
        x={Number(element.x)}
        y={Number(element.y)}
        fontSize={Number(element.fontSize) || 24}
        text={element.text}
        fill={element.fill || "#000"}
        draggable={!isPreview}
        opacity={element.opacity ?? 1}
        fontFamily={element.fontFamily || "Arial"}
        onClick={
          !isPreview
            ? () => {
                onSelect();
                onStartEditing(element);
              }
            : undefined
        }
        onDragEnd={
          !isPreview
            ? (e) =>
                onChange(element.id, {
                  x: e.target.x(),
                  y: e.target.y(),
                })
            : undefined
        }
        rotation={element.rotation || 0}
        onTransformEnd={
          !isPreview
            ? () => {
                const node = shapeRef.current;
                const scaleY = node.scaleY();

                // إعادة التحجيم لوضعه الطبيعي
                node.scaleX(1);
                node.scaleY(1);

                const newFontSize = (element.fontSize || 24) * scaleY;

                onChange(element.id, {
                  x: node.x(),
                  y: node.y(),
                  fontSize: newFontSize,
                  rotation: node.rotation(),
                });
              }
            : undefined
        }
      />

      {!isPreview && isSelected && <Transformer ref={trRef} />}
    </>
  );
};
const SNAP_DISTANCE = 5;
//  مكون الكانفا الرئيسي
const CanvasArea = ({
  elements,
  selectedId,
  onSelectElement,
  onUpdateElement,
  onCanvasRef,
  onStartEditing,
  canvasSettings,
  isPreview = false,
  onAddElement,
  zoomLevel = 1,
  stagePosition,
  onPan,
}) => {
  const stageRef = useRef();
  const wrapperRef = useRef();
  const [guidelines, setGuidelines] = React.useState([]);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 700;
  const width = CANVAS_WIDTH;
  const height = CANVAS_HEIGHT;

  useEffect(() => {
    if (onCanvasRef && stageRef.current) {
      onCanvasRef(stageRef);
    }
  }, [onCanvasRef]);
  const handleDrop = (e) => {
    e.preventDefault();
    const stage = stageRef.current.getStage();
    const stageBox = stage.container().getBoundingClientRect();

    // حساب الموقع الدقيق داخل الكانفا
    const position = {
      x: e.clientX - stageBox.left,
      y: e.clientY - stageBox.top,
    };

    const shapeType = e.dataTransfer.getData("shapeType");

    const defaultProps = {
      x: position.x,
      y: position.y,
      id: Date.now().toString(),
    };

    let newShape = null;

    switch (shapeType) {
      case "rect":
        newShape = {
          ...defaultProps,
          type: "shape",
          shape: "rect",
          width: 100,
          height: 80,
          fill: "#000",
        };
        break;
      case "circle":
        newShape = {
          ...defaultProps,
          type: "shape",
          shape: "circle",
          radius: 40,
          fill: "#000",
        };
        break;
      case "arrow":
        newShape = {
          ...defaultProps,
          type: "shape",
          shape: "arrow",
          points: [0, 0, 100, 0],
          stroke: "#000",
          strokeWidth: 4,
          pointerLength: 10,
          pointerWidth: 10,
        };
        break;
      case "triangle":
        newShape = {
          ...defaultProps,
          type: "shape",
          shape: "triangle",
          points: [0, 100, 50, 0, 100, 100],
          fill: "#000",
          closed: true,
        };
        break;
      case "rhombus":
        newShape = {
          ...defaultProps,
          type: "shape",
          shape: "rhombus",
          points: [50, 0, 100, 50, 50, 100, 0, 50],
          fill: "#000",
          //     fill: null,
          stroke: "#000",
          strokeWidth: 2,
          closed: true,
        };
        break;
      default:
        return;
    }

    if (onAddElement && newShape) {
      onAddElement(newShape);
    }
  };
  const handleDragMove = (id, x, y) => {
    const movingEl = elements.find((el) => el.id === id);
    if (!movingEl) return;

    const lines = [];
    const stageWidth = 1000; // يجب تعريف هذه القيمة أو تمريرها كمعامل
    const stageHeight = 700; // يجب تعريف هذه القيمة أو تمريرها كمعامل
    const movingWidth = movingEl.width || 0;
    const movingHeight = movingEl.height || 0;
    // أ) فرز العناصر حسب المحور X
    elements.forEach((el) => {
      if (el.id === id) return;

      const elWidth = el.width || 0;
      const elHeight = el.height || 0;

      // محاذاة الحواف الأفقية
      if (Math.abs(el.x - x) < 5) {
        lines.push({
          points: [el.x, 0, el.x, stageHeight],
          color: "red",
        });
      }
      if (Math.abs(el.x + elWidth - (x + movingWidth)) < 5) {
        lines.push({
          points: [el.x + elWidth, 0, el.x + elWidth, stageHeight],
          color: "red",
        });
      }

      // محاذاة الحواف العمودية
      if (Math.abs(el.y - y) < 5) {
        lines.push({
          points: [0, el.y, stageWidth, el.y],
          color: "red",
        });
      }
      if (Math.abs(el.y + elHeight - (y + movingHeight)) < 5) {
        lines.push({
          points: [0, el.y + elHeight, stageWidth, el.y + elHeight],
          color: "red",
        });
      }

      // محاذاة المراكز
      const movingCenterX = x + movingWidth / 2;
      const movingCenterY = y + movingHeight / 2;
      const elCenterX = el.x + elWidth / 2;
      const elCenterY = el.y + elHeight / 2;

      if (Math.abs(elCenterX - movingCenterX) < 10) {
        lines.push({
          type: "vertical",
          points: [elCenterX, 0, elCenterX, stageHeight],
          color: "blue",
        });
      }

      if (Math.abs(elCenterY - movingCenterY) < 10) {
        lines.push({
          type: "horizontal",
          points: [0, elCenterY, stageWidth, elCenterY],
          color: "blue",
        });
      }
    });

    // محاذاة مع منتصف الصفحة
    const pageCenterX = stageWidth / 2;
    const movingCenterX = x + movingWidth / 2;

    if (Math.abs(movingCenterX - pageCenterX) < 10) {
      lines.push({
        type: "vertical",
        points: [pageCenterX, 0, pageCenterX, stageHeight],
        color: "gray",
      });
    }

    setGuidelines(lines);
  };
  const handleDragEnd = () => {
    setGuidelines([]);
  };

  return (
    <div
      ref={wrapperRef}
      className="overflow-hidden bg-neutral-100 flex justify-center items-center p-4"
      style={{ width: "100%", height: "100%" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Stage
        ref={stageRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        scale={isPreview ? { x: 1, y: 1 } : { x: zoomLevel, y: zoomLevel }}
        position={isPreview ? { x: 0, y: 0 } : stagePosition}
        className="bg-white scale-70 shadow border border-gray-300"
        onMouseDown={(e) => {
          // السحب بالزر الأوسط أو Ctrl
          if (e.evt.button === 1 || e.evt.ctrlKey) {
            setIsPanning(true);
            setLastPos({ x: e.evt.clientX, y: e.evt.clientY });
            return;
          }

          // تفريغ التحديد إذا ضغطت على مساحة فارغة
          if (!isPreview && e.target === e.target.getStage()) {
            onSelectElement(null);
          }
        }}
        onMouseMove={(e) => {
          if (!isPanning) return;

          const dx = e.evt.clientX - lastPos.x;
          const dy = e.evt.clientY - lastPos.y;

          setLastPos({ x: e.evt.clientX, y: e.evt.clientY });
          onPan(dx, dy);
        }}
        onMouseUp={() => setIsPanning(false)}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <Layer>
          {canvasSettings?.backgroundImage ? (
            <URLBackground
              imageUrl={canvasSettings.backgroundImage}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
            />
          ) : (
            <Rect
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              fill={canvasSettings?.backgroundColor || "#ffffff"}
              listening={false}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          )}

          {elements.map((el) => {
            const commonProps = {
              x: el.x,
              y: el.y,
              draggable: !isPreview,
              onClick: () => onSelectElement(el.id),
              onTap: () => onSelectElement(el.id),
            };

            if (el.type === "image") {
              return (
                <CanvasImage
                  key={el.id}
                  {...commonProps}
                  element={el}
                  isSelected={el.id === selectedId}
                  onChange={onUpdateElement}
                  onSelect={() => onSelectElement(el.id)}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                />
              );
            }

            if (el.type === "text") {
              return (
                <EditableText
                  key={el.id}
                  {...commonProps}
                  element={el}
                  isSelected={el.id === selectedId}
                  onChange={onUpdateElement}
                  onSelect={() => onSelectElement(el.id)}
                  onStartEditing={onStartEditing}
                  isPreview={isPreview}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                />
              );
            }

            if (el.type === "shape") {
              return (
                <ShapeWithFill
                  key={el.id}
                  element={el}
                  isSelected={el.id === selectedId}
                  onSelect={() => onSelectElement(el.id)}
                  onChange={onUpdateElement}
                  isPreview={isPreview}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                />
              );
            }

            return null;
          })}
          {guidelines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke={line.color}
              strokeWidth={1}
              dash={[4, 4]}
              listening={false}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasArea;
