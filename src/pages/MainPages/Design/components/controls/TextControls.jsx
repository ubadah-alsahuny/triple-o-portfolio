import React from "react";
import ElementRotationControl from "./ElementRotationControl.jsx";
import ElementOpacityControl from "./ElementOpacityControl.jsx";

const TextControls = ({ element, onChange, bringForward, sendBackward }) => (
    <>
        <div className={`flex mb-2`}>
            <label className="text-sm font-medium mr-3">
                Content
            </label>
            <textarea
                rows={3}
                value={element.text || ""}
                onChange={(e) => onChange(element.id, {text: e.target.value})}
                className="w-full flex-1 px-2 border rounded"
            />
        </div>

        <ElementRotationControl element={element} onChange={onChange}/>

        <div className={`flex mb-2`}>
            <label className="text-sm font-medium mr-3">
                Font Size:
            </label>
            <input
                type="number"
                value={element.fontSize || 24}
                onChange={(e) =>
                    onChange(element.id, {fontSize: parseFloat(e.target.value) || 24})
                }
                className="w-full flex-1 px-2 border rounded"
            />
        </div>

        <div className={`flex mb-2 items-center`}>
            <label className="text-sm font-medium mr-3">
                Font Family:
            </label>
            <select
                value={element.fontFamily || "Arial"}
                onChange={(e) => onChange(element.id, {fontFamily: e.target.value})}
                className="w-full flex-1 px-2 border rounded"
            >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="Verdana">Verdana</option>
            </select>
        </div>

        <div className={`flex mb-2 items-center`}>
            <label className="text-sm font-medium mr-3">
                Color:
            </label>
            <input
                type="color"
                value={element.fill || "#000000"}
                onChange={(e) => onChange(element.id, {fill: e.target.value})}
                className="w-full flex-1 h-7 rounded"
            />
        </div>

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

export default TextControls;
