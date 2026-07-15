import React from "react";

const SkeletonCard = ({ height = "h-48", lines = 2 }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 animate-pulse w-full">
      <div className={`w-full ${height} bg-gray-200 rounded-lg mb-4`} />
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded mb-2 w-full"
          style={{ width: `${80 - i * 20}%` }}
        />
      ))}
      <div className="flex gap-2 mt-3">
        <div className="h-8 w-20 bg-gray-200 rounded" />
        <div className="h-8 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default SkeletonCard;
