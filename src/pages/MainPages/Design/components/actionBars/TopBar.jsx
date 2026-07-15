import React, { useState, useRef } from "react";
import { ChromePicker } from "react-color";
/*import styles from "../../Design.module.css";*/
import styles from "./TopBar.module.css";
import Spinner from "../../../../../components/Spinner [Renewed]/Spinner.jsx";
import Button from "../../../../../components/Button/Button.jsx";
const TopBar = ({
  onAddText,
  onAddImage,
  onExportPDF,
  onSaveDesign,
  onChangeBackgroundColor,
    onChangeBackgroundImage,
  loading,
  onZoomIn,
  onZoomOut,
  zoomLevel,
  onResetView,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const pickerRef = useRef();
  return (
    <div className="w-full h-full bg-white content-center sticky z-40 shadow-sm">
      <div className="flex relative items-center px-3 py-0.5 gap-x-3">
        <div className={`flex-1`}>
          <p className={`font-bold text-gray-900 mr-auto my-0 tracking-tight ${styles.Title}`}>
            Design <span></span>
            <span className={`${styles.inTitle}`}>your</span>
            <br/>
            <span className={`tracking-[0.15rem]`}>Portfolio</span>
          </p>
        </div>

        {/*<button
            onClick={onAddText}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            + Add Text
          </button>*/}
        {/*<button
            onClick={onAddImage}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            📷 Add Image
          </button>*/}
        <div className={`sm:w-1/3 md:w-1/3 flex gap-2`}>
          <Button
              label={"🔄 Reset Canvas"}
              onClick={onResetView}/>

          <Button
              label={"📄 Export as PDF"}
              onClick={onExportPDF}/>

          <Button
              label={`💾 Save Design`}
              onClick={onSaveDesign}
              loading={loading}/>
        </div>

        {/*<button
            onClick={onExportPDF}
            className="px-3 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm font-medium"
          >
            🧾 Export PDF
          </button>*/}

        {/*<button
            onClick={onSaveDesign}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            💾 Save Design
            {loading && <Spinner/>}
          </button>*/}

        {/*<div className="flex items-center gap-2">
            <button onClick={onZoomOut} className="px-2 py-1 border rounded">
              ➖
            </button>
            <span>{Math.round(zoomLevel * 100)}%</span>
            <button onClick={onZoomIn} className="px-2 py-1 border rounded">
              ➕
            </button>
          </div>*/}

        {/*<button
            onClick={onChangeBackgroundImage}
            className="px-3 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm font-medium"
          >
            🖼️ Background Image
          </button>*/}

        {/* 🎨 Color Picker Button */}
        <div className="relative" ref={pickerRef}>
          {/*<button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="px-3 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm font-medium"
            >
              🎨 Background Color
            </button>*/}
          {/*<button onClick={onResetView} className="px-2 py-1 border rounded">
              🔄 ResetView
            </button>*/}

          {showColorPicker && (
              <div className="absolute top-full mt-2 z-50">
                <ChromePicker
                    color={currentColor}
                    width="200px"
                    disableAlpha
                    onChange={(color) => {
                      setCurrentColor(color.hex);
                      onChangeBackgroundColor(color.hex);
                    }}
                />
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
