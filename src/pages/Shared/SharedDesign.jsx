import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import CanvasArea from "../MainPages/Design/components/canvasArea/CanvasArea.jsx";
import axios from "axios";
import SkeletonCard from "../../components/SkeletonCard2/SkeletonCard2.jsx";

const SharedDesign = () => {
  const { id } = useParams();
  const [elements, setElements] = useState([]);
  const [canvasSettings, setCanvasSettings] = useState({
    backgroundColor: "#ffffff",
    backgroundImage: null,
  });
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:8000/api/shared-design/${id}`)
      .then((res) => {
        const design = res.data.data;

        if (
          !["published", "under review", "approved", "rejected"].includes(
            design.status
          )
        ) {
          setIsPublished(false);
          return;
        }

        const extracted = design.designData || [];
        const last = extracted[extracted.length - 1];
        setElements(Array.isArray(extracted) ? extracted.slice(0, -1) : []);
        setCanvasSettings(last?.canvasSettings || {});
        setIsPublished(true);
      })
      .catch((err) => {
        console.error("Failed to load design:", err);
        setIsPublished(false);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="border shadow-lg bg-white w-full max-w-5xl p-6 rounded-md text-center">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : !isPublished ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white px-4">
            <div className="max-w-md text-center">
              <div className="text-6xl mb-4 text-red-500">🚫</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                This design is not published yet
              </h2>
              <p className="text-gray-500 text-lg">
                Please check back later or contact the owner for access.
              </p>
            </div>
          </div>
        ) : (
          <CanvasArea
            elements={elements}
            selectedId={null}
            onSelectElement={() => {}}
            onUpdateElement={() => {}}
            onCanvasRef={(ref) => (canvasRef.current = ref.current)}
            onStartEditing={() => {}}
            canvasSettings={canvasSettings}
            isPreview={true}
          />
        )}
      </div>
    </div>
  );
};

export default SharedDesign;
