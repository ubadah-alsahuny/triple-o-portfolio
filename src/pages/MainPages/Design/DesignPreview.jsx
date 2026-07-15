import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CanvasArea from "./components/canvasArea/CanvasArea.jsx";
import { getDesignById } from "./api/getDesignById";

const DesignPreview = () => {
  const { id } = useParams();
  const [elements, setElements] = useState([]);
  const [canvasSettings, setCanvasSettings] = useState({
    backgroundColor: "#ffffff",
    backgroundImage: null,
  });

  useEffect(() => {
    if (id) {
      getDesignById(id).then((data) => {
        setElements(data.elements || []);
        setCanvasSettings(data.canvasSettings || {});
      });
    }
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <CanvasArea
        elements={elements}
        selectedId={null}
        onSelectElement={() => {}}
        onUpdateElement={() => {}}
        onCanvasRef={() => {}}
        onStartEditing={() => {}}
        canvasSettings={canvasSettings}
        isPreview //  سنستخدم هذا لاحقًا لتعطيل التفاعل
      />
    </div>
  );
};

export default DesignPreview;
