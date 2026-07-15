import React from "react";

const ElementRotationControl = ({ element, onChange }) => {
  const rotation = element.rotation ?? 0;

  return (
    <div className="w-full flex mb-3 items-center">
      <label className="text-sm font-medium mr-3">
        Rotation Degree:
      </label>
      <input
        type="number"
        min={0}
        max={360}
        step={1}
        value={rotation}
        onChange={(e) =>
          onChange(element.id, {
            rotation: parseFloat(e.target.value) || 0,
          })
        }
        className="flex-1 border rounded-lg px-2 h-7"
      />
    </div>
  );
};

export default ElementRotationControl;
