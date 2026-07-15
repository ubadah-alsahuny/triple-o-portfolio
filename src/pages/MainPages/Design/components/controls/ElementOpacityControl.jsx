import React from "react";

const ElementOpacityControl = ({ element, onChange }) => {
  const currentOpacity = element.opacity ?? 1;

  return (
    <div className="mt-3">
      <label className="text-sm font-medium mb-1">
        Opacity:
      </label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={currentOpacity}
        onChange={(e) =>
          onChange(element.id, {
            opacity: parseFloat(e.target.value),
          })
        }
        className="w-full"
      />
      <div className="text-xs text-gray-500 text-right">
        {Math.round(currentOpacity * 100)}%
      </div>
    </div>
  );
};

export default ElementOpacityControl;
