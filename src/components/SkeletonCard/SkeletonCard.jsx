import React from "react";

const SkeletonCard = ({ height = "h-48" }) => {
  return (
    <div
      className={`bg-gray-300 rounded-lg animate-pulse w-full h-36`}
    ></div>
  );
};

export default SkeletonCard;
