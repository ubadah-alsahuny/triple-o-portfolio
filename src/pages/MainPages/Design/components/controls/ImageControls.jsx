import React from "react";
import ElementRotationControl from "./ElementRotationControl.jsx";
import ElementOpacityControl from "./ElementOpacityControl.jsx";

const ImageControls = ({ element, onChange, bringForward, sendBackward }) => (
    <>
        <div className={`flex mb-2 items-center`}>
            <label className="text-sm font-medium flex-1">
                Dimensions:
            </label>
            <div className="flex">
                <input
                    type="number"
                    placeholder="Width"
                    value={element.width || 200}
                    onChange={(e) =>
                        onChange(element.id, {width: parseFloat(e.target.value) || 200})
                    }
                    className="px-2 w-17 border rounded"
                />

                <span className={`p-1`}>
                  x
              </span>

                <input
                    type="number"
                    placeholder="Height"
                    value={element.height || 150}
                    onChange={(e) =>
                        onChange(element.id, {height: parseFloat(e.target.value) || 150})
                    }
                    className="px-2 w-17 border rounded"
                />
            </div>
        </div>

        <ElementRotationControl element={element} onChange={onChange}/>
        <ElementOpacityControl element={element} onChange={onChange}/>

        <div className="flex flex-col justify-between gap-2 my-3">
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
    </>
);

export default ImageControls;
