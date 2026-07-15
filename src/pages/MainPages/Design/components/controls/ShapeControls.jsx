import React, { useState } from "react";
import ElementRotationControl from "./ElementRotationControl.jsx";
import ElementOpacityControl from "./ElementOpacityControl.jsx";
import ImageModal from "../modals/ImageModal.jsx";
import Button from "../../../../../components/Button/Button.jsx";

const ShapeControls = ({ element, onChange, bringForward, sendBackward }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const getShapeWidth = (points) => {
    const xPoints = points.filter((_, i) => i % 2 === 0);
    return Math.max(...xPoints) - Math.min(...xPoints);
  };

  const getShapeHeight = (points) => {
    const yPoints = points.filter((_, i) => i % 2 !== 0);
    return Math.max(...yPoints) - Math.min(...yPoints);
  };

  return (
      <>
          {(element.shape === "triangle" || element.shape === "rhombus") && (
              <>
                  <div className="flex text-sm">
                      <p className={`mr-3`}>Width:</p>
                      <p className={`font-normal flex-1 border px-2 rounded-lg text-black text-opacity-50`}>{getShapeWidth(element.points)} px</p>
                  </div>

                  <div className="flex text-sm -mt-2">
                      <p className={`mr-3`}>Height:</p>
                      <p className={`font-normal flex-1 border px-2 rounded-lg text-black text-opacity-50`}>{getShapeHeight(element.points)} px</p>
                  </div>
              </>
          )}

          {element.shape === "rect" && (
              <div>
                  <div className={`w-full flex items-center mb-2`}>
                      <label className="text-sm font-medium mr-3">Width:</label>
                      <input
                          type="number"
                          value={element.width || 100}
                          onChange={(e) =>
                              onChange(element.id, {width: Number(e.target.value)})
                          }
                          className="w-full flex-1 h-7 rounded-lg border px-2"
                      />
                  </div>

                  <div className={`w-full flex items-center mb-3`}>
                      <label className="text-sm font-medium mr-3">Height:</label>
                      <input
                          type="number"
                          value={element.height || 100}
                          onChange={(e) =>
                              onChange(element.id, {height: Number(e.target.value)})
                          }
                          className="w-full flex-1 h-7 rounded-lg border px-2"
                      />
                  </div>
              </div>
          )}

          {element.shape === "arrow" && (
              <>
                  <div className="flex text-sm">
                      <p className={`mr-3`}>Width:</p>
                      <p className={`font-normal flex-1 border px-2 rounded-lg text-black text-opacity-50`}>{Math.abs(element.points[2] - element.points[0])} px</p>
                  </div>

                  <div className="flex text-sm -mt-2">
                      <p className={`mr-3`}>Height:</p>
                      <p className={`font-normal flex-1 border px-2 rounded-lg text-black text-opacity-50`}>{Math.abs(element.points[3] - element.points[1])} px</p>
                  </div>
              </>
          )}

          <div className={`justify-items-center w-full h-fit`}>
              <Button
                  label={"📷 Fill with Image"}
                  onClick={() => setIsImageModalOpen(true)}/>
          </div>

          <br/>

          <div className={`w-full flex items-center mb-2`}>
              <label className="text-sm font-medium mr-3">Fill Color:</label>
              <input
                  type="color"
                  value={element.fill || "#ffffff"}
                  onChange={(e) =>
                      onChange(element.id, {fill: e.target.value, fillImage: null})}
                  className="flex-1 h-7 rounded-lg"
              />
          </div>

          <div className={`w-full flex items-center`}>
              <label className="text-sm font-medium mr-3">Border Color:</label>
              <input
                  type="color"
                  value={element.stroke || "#000000"}
                  onChange={(e) => onChange(element.id, {stroke: e.target.value})}
                  className="flex-1 h-7 rounded-lg"
              />
          </div>

          <br/>

          <div className={`w-full flex items-center mb-2`}>
              <label className="text-sm font-medium mr-3">Border Width:</label>
              <input
                  type="number"
                  min={0}
                  value={element.strokeWidth || 2}
                  onChange={(e) =>
                      onChange(element.id, {strokeWidth: Number(e.target.value)})
                  }
                  className="w-full flex-1 h-7 rounded-lg border px-2"
              />
          </div>

          {element.shape === "circle" && (
              <>
                  <div className={`w-full flex items-center mb-2`}>
                      <label className="text-sm font-medium mr-3">Radius:</label>
                      <input
                          type="number"
                          value={element.radius || 50}
                          onChange={(e) =>
                              onChange(element.id, {radius: Number(e.target.value)})
                          }
                          className="w-full flex-1 h-7 rounded-lg border px-2"
                      />
                  </div>
              </>
          )}

          <ElementRotationControl element={element} onChange={onChange}/>
          <ElementOpacityControl element={element} onChange={onChange}/>

          <br/>

          <div className="flex flex-col justify-between gap-2 mb-3">
              <button
                  onClick={() => bringForward(element.id)}
                  className="border rounded bg-white hover:drop-shadow duration-200 font-medium"
              >
                  ↑ Bring Forward
              </button>

              <button
                  onClick={() => sendBackward(element.id)}
                  className="border rounded bg-white hover:drop-shadow duration-200 font-medium"
              >
                  ↓ Send Backward
              </button>
          </div>

          <ImageModal
              isOpen={isImageModalOpen}
              onClose={() => setIsImageModalOpen(false)}
              onImageSelect={(imageSrc) => {
                  onChange(element.id, {fillImage: imageSrc, fill: null});
                  setIsImageModalOpen(false);
              }}
          />
      </>
  );
};

export default ShapeControls;
