import React, { useState } from "react";
import { createPortal } from "react-dom";
import CanvasArea from "./components/canvasArea/CanvasArea.jsx";
import Sidebar from "./components/actionBars/Sidebar.jsx";
import TopBar from "./components/actionBars/TopBar.jsx";
import BottomBar from "./components/actionBars/BottomBar.jsx";
import ImageModal from "./components/modals/ImageModal.jsx";
import axios from "axios";
import html2canvas from "html2canvas";
import { saveDesign } from "./utils/saveDesign";
import { useEffect } from "react";
import { getDesignById } from "./api/getDesignById";
import { updateDesign } from "./api/updateDesign";
import { useParams, useSearchParams } from "react-router-dom";
import ShapeSidebar from "./components/actionBars/ShapeSidebar.jsx";
import toast from "react-hot-toast";
import {
  MdOutlineZoomIn,
  MdOutlineZoomOut,
  MdOutlineZoomOutMap,
} from "react-icons/md";
import { GrZoomIn, GrZoomOut } from "react-icons/gr";
const Design = () => {
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [canvasRef, setCanvasRef] = useState(null);
  const [editingElement, setEditingElement] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // القيمة الافتراضية 100%
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const stageCenter = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  const [canvasSettings, setCanvasSettings] = useState({
    backgroundColor: "#ffffff",
    backgroundImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const addElement = (element) => {
    const newElement = {
      ...element,
      id: Date.now().toString(),
    };
    setElements((prev) => [...prev, newElement]);
  };
  const { id } = useParams(); // ← لقراءة ID من /design/:id

  const updateElement = (id, updates) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };
  const bringForward = (id) => {
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id);
      if (index === -1 || index === prev.length - 1) return prev;
      const newArr = [...prev];
      [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
      return newArr;
    });
  };

  const sendBackward = (id) => {
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id);
      if (index <= 0) return prev;
      const newArr = [...prev];
      [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
      return newArr;
    });
  };

  const deleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
    if (editingElement?.id === id) {
      setEditingElement(null);
    }
  };

  const addText = () => {
    addElement({
      type: "text",
      x: 100,
      y: 100,
      text: "New text",
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#000000",
    });
  };

  const handleSaveDesign = async () => {
    const defaultName = "تصميم جديد";
    const name = prompt("📝 أدخل اسم التصميم:", defaultName);
    if (!name) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      const payload = {
        name,
        elements,
        canvasRef,
        token,
        canvasSettings,
      };

      if (id) {
        //  تعديل تصميم موجود: تحديث البيانات + الصورة المصغّرة
        await updateDesign({ ...payload, id });
        toast.success("✅ Design updated successfully");
      } else {
        // 🆕 إنشاء تصميم جديد
        const result = await saveDesign(payload);
        toast.success("✅ Design Saved successfully");
      }
    } catch (error) {
      console.error("❌ خطأ أثناء الحفظ:", error);
      toast.error("❌ Failed to saved design");
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundColorChange = (color) => {
    setCanvasSettings((prev) => ({
      ...prev,
      backgroundColor: color,
      backgroundImage: null, // لو المستخدم غيّر من صورة إلى لون
    }));
  };
  const handleSelectBackgroundImage = (url) => {
    setCanvasSettings({
      backgroundColor: null,
      backgroundImage: url,
    });
    setIsBackgroundModalOpen(false);
  };
  useEffect(() => {
    if (id) {
      getDesignById(id).then((data) => {
        setElements(data.elements || []);
        setCanvasSettings(
          data.canvasSettings || {
            backgroundColor: "#ffffff",
            backgroundImage: null,
          }
        );
      });
    }
  }, [id]);
  const handleZoom = (delta) => {
    setZoomLevel((prevZoom) => {
      const newZoom = Math.min(Math.max(prevZoom + delta, 0.3), 3);

      if (!canvasRef?.current) return newZoom;

      const stage = canvasRef.current.getStage();
      const oldScale = prevZoom;
      const newScale = newZoom;

      const mousePointTo = {
        x: stageCenter.x / oldScale - stagePosition.x / oldScale,
        y: stageCenter.y / oldScale - stagePosition.y / oldScale,
      };

      const newPos = {
        x: -(mousePointTo.x - stageCenter.x / newScale) * newScale,
        y: -(mousePointTo.y - stageCenter.y / newScale) * newScale,
      };

      setStagePosition(newPos);
      return newZoom;
    });
  };
  const handlePan = (dx, dy) => {
    setStagePosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };
  const resetView = () => {
    setZoomLevel(1);
    setStagePosition({ x: 0, y: 0 });
    setSelectedId(null);
  };
  const fitElementsToScreen = () => {
    if (!canvasRef?.current || elements.length === 0) return;

    const stage = canvasRef.current.getStage();

    // احسب أقصى حدود للكائنات
    const padding = 40;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    elements.forEach((el) => {
      const elX = el.x || 0;
      const elY = el.y || 0;
      const elWidth = el.width || (el.radius || 0) * 2 || 50;
      const elHeight = el.height || (el.radius || 0) * 2 || 50;

      minX = Math.min(minX, elX);
      minY = Math.min(minY, elY);
      maxX = Math.max(maxX, elX + elWidth);
      maxY = Math.max(maxY, elY + elHeight);
    });

    const boundingWidth = maxX - minX + padding * 2;
    const boundingHeight = maxY - minY + padding * 2;

    const containerWidth = stage.width();
    const containerHeight = stage.height();

    const scaleX = containerWidth / boundingWidth;
    const scaleY = containerHeight / boundingHeight;

    const newScale = Math.min(scaleX, scaleY, 1); // لا نكبر أكثر من 1x

    // تمركز العناصر في الشاشة
    const newPos = {
      x: (containerWidth - (maxX + minX) * newScale) / 2,
      y: (containerHeight - (maxY + minY) * newScale) / 2,
    };

    setZoomLevel(newScale);
    setStagePosition(newPos);
  };
  useEffect(() => {
    if (isPreview) {
      fitElementsToScreen();
    }
  }, [isPreview, elements, canvasRef]);

  // Generate a random seed
  // const seed = Math.random() * 1000;
  return (
    <div className="h-full w-full flex  flex-col bg-gray-50">
      {!isPreview && (
          <div className={`h-1/8 bg-black`}>
        {!isPreview && (
          <TopBar
            onAddImage={() => setIsImageModalOpen(true)}
            onExportPDF={() => {
              if (canvasRef) {
                import("./utils/exportToPDF").then((module) => {
                  module.default(canvasRef);
                });
              } else {
                console.log(" لم ينجح التصدير");
              }
            }}
            onSaveDesign={handleSaveDesign}
            onChangeBackgroundColor={handleBackgroundColorChange}
            onChangeBackgroundImage={() => setIsBackgroundModalOpen(true)}
            loading={loading}
            zoomLevel={zoomLevel}
            onZoomIn={() => setZoomLevel((z) => Math.min(z + 0.1, 3))}
            onZoomOut={() =>
              setZoomLevel((z) => {
                const next = z - 0.1;
                return next < 1 ? 1 : next;
              })
            }
            onResetView={resetView}
          />
        )}
      </div>)}

      <div className={`${isPreview ? 'h-full' : 'h-4/5'} bg-black flex`}>
        <div className={`${isPreview ? "hidden" : "w-1/25"} h-full bg-gray-600 z-50`}>
          {!isPreview && (
            <ShapeSidebar
              onAddText={addText}
              onAddImage={() => setIsImageModalOpen(true)}
              onChangeBackgroundColor={handleBackgroundColorChange}
              onChangeBackgroundImage={() => setIsBackgroundModalOpen(true)}
            />
          )}
        </div>

        <div className={`flex-1 h-full`}>
          <CanvasArea
            elements={elements}
            selectedId={selectedId}
            onSelectElement={setSelectedId}
            onUpdateElement={updateElement}
            onCanvasRef={setCanvasRef}
            onStartEditing={(el) => setEditingElement(el)}
            canvasSettings={canvasSettings}
            isPreview={isPreview}
            zoomLevel={zoomLevel}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
            stagePosition={stagePosition}
            onPan={handlePan}
            onAddElement={(newShape) =>
              setElements((prev) => [...prev, newShape])
            }
          />
        </div>

        {elements.length > 0 && !isPreview && (
          <div className={`w-5/25 h-full bg-gray-600`}>
            <Sidebar
              elements={elements}
              selectedId={selectedId}
              onSelectElement={setSelectedId}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
              bringForward={bringForward}
              sendBackward={sendBackward}
            />
          </div>
        )}
      </div>
      {!isPreview && (
      <div
        className={`h-3/40 bg-blue-400 shadow-md justify-items-center content-center`}
      >
        <div className="flex items-center gap-2">
          <GrZoomOut
            size={25}
            onClick={() =>
              setZoomLevel((z) => {
                const next = z - 0.1;
                return next < 1 ? 1 : next;
              })
            }
            className={`cursor-pointer text-white`}
          />

          <span className={`text-white`}>{Math.round(zoomLevel * 100)}%</span>

          <GrZoomIn
            size={25}
            onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 3))}
            className={`cursor-pointer text-white`}
          />
        </div>
      </div>
      )}

      {!isPreview && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          onImageSelect={(imageSrc, imageElement) => {
            addElement({
              type: "image",
              x: 50,
              y: 50,
              width: 200,
              height: 150,
              src: imageSrc,
              image: imageElement,
            });
          }}
        />
      )}
      {!isPreview && (
        <ImageModal
          isOpen={isBackgroundModalOpen}
          onClose={() => setIsBackgroundModalOpen(false)}
          onImageSelect={(url) => handleSelectBackgroundImage(url)}
        />
      )}
      {editingElement &&
        createPortal(
          <input
            value={editingElement.text}
            onChange={(e) => {
              const newText = e.target.value;
              setEditingElement({ ...editingElement, text: newText });
              updateElement(editingElement.id, { text: newText });
            }}
            onBlur={() => setEditingElement(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditingElement(null);
            }}
            autoFocus
            className="border px-2 py-1 rounded text-sm"
            style={{
              position: "absolute",
              top: editingElement.y + 60,
              left: editingElement.x + 250,
              zIndex: 9999,
            }}
          />,
          document.body
        )}

      {/*{!isPreview && (
        <TopBar
          onAddText={addText}
          onAddImage={() => setIsImageModalOpen(true)}
          onExportPDF={() => {
            if (canvasRef) {
              import("./utils/exportToPDF").then((module) => {
                module.default(canvasRef);
              });
            } else {
              console.log(" لم ينجح التصدير");
            }
          }}
          onSaveDesign={handleSaveDesign}
          onChangeBackgroundColor={handleBackgroundColorChange}
          onChangeBackgroundImage={() => setIsBackgroundModalOpen(true)}
          loading={loading}
          zoomLevel={zoomLevel}
          onZoomIn={() => setZoomLevel((z) => Math.min(z + 0.1, 3))}
          onZoomOut={() =>
            setZoomLevel((z) => {
              const next = z - 0.1;
              return next < 1 ? 1 : next;
            })
          }
          onResetView={resetView}
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        {!isPreview && <ShapeSidebar />}
        <div className="flex-1 flex flex-col">
          <CanvasArea
            elements={elements}
            selectedId={selectedId}
            onSelectElement={setSelectedId}
            onUpdateElement={updateElement}
            onCanvasRef={setCanvasRef}
            onStartEditing={(el) => setEditingElement(el)}
            canvasSettings={canvasSettings}
            isPreview={isPreview}
            zoomLevel={zoomLevel}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
            stagePosition={stagePosition}
            onPan={handlePan}
            onAddElement={(newShape) =>
              setElements((prev) => [...prev, newShape])
            }
          />

          {!isPreview && <BottomBar />}
        </div>
        {!isPreview && (
          <Sidebar
            elements={elements}
            selectedId={selectedId}
            onSelectElement={setSelectedId}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
            bringForward={bringForward}
            sendBackward={sendBackward}
          />
        )}
      </div>
      */}
    </div>
  );
};

export default Design;
