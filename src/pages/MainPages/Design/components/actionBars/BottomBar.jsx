import React from "react";

const BottomBar = () => {
  return (
    <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 shadow-inner">
      <div className="flex items-center justify-center">
        <p className="text-sm text-gray-600 text-center">
          Drag to move, click to select, use the sidebar to edit
        </p>
      </div>
    </div>
  );
};

export default BottomBar;
