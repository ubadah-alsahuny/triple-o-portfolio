import React from "react";
import TextControls from "../controls/TextControls.jsx";
import ImageControls from "../controls/ImageControls.jsx";
import ShapeControls from "../controls/ShapeControls.jsx";
import styles from "./Sidebar.module.css";

const Sidebar = ({
  elements,
  selectedId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  bringForward,
  sendBackward,
}) => {
  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div className="w-full h-full bg-white flex flex-col">
        {elements.length === 0 ? "" :
            <div className="flex-1 overflow-y-auto p-2 border-(--secondary-color) border-b-4 rounded-lg">
                <p className={`font-semibold m-0 ${styles.Title}`}>Elements</p>
                    <div>
                        {elements.map((element) => (
                            <div
                                key={element.id}
                                className={`p-2 my-2 border-2 rounded cursor-pointer duration-500 bg-white transition-all ease-in-out ${
                                    selectedId === element.id
                                        ? "border-blue-500 drop-shadow-md"
                                        : "border-blue-100"
                                }`}
                                onClick={() => onSelectElement(element.id)}
                            >
                                <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                {element.type === "text"
                                    ? "Text"
                                    : element.type === "image"
                                        ? "Image"
                                        : `Shape (${element.shape})`}
                              </span>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteElement(element.id);
                                }}
                                className="text-xs italic border-1 border-gray-200 rounded px-1 text-gray-500 hover:bg-red-500 hover:text-white hover:border-red-500 duration-300">
                                Delete
                            </button>
                                </div>

                                {element.type === "text" && (
                                    <p className="text-xs italic text-gray-600 m-0 truncate">
                                        {element.text}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
            </div>}

        {selectedElement ? (
            <div className="h-2/3 overflow-y-auto p-2 bg-white">
                    <>
                        <p className={`font-semibold m-0 mb-3 ${styles.Title}`}>
                            Element Properties
                        </p>

                        {selectedElement.type === "text" && (
                            <TextControls
                                element={selectedElement}
                                onChange={onUpdateElement}
                                bringForward={bringForward}
                                sendBackward={sendBackward}
                            />
                        )}

                        {selectedElement.type === "image" && (
                            <ImageControls
                                element={selectedElement}
                                onChange={onUpdateElement}
                                bringForward={bringForward}
                                sendBackward={sendBackward}
                            />
                        )}

                        {selectedElement.type === "shape" && (
                            <ShapeControls
                                element={selectedElement}
                                onChange={onUpdateElement}
                                bringForward={bringForward}
                                sendBackward={sendBackward}
                            />
                        )}
                    </>
            </div>
        ) : ""}
    </div>
  );
};

export default Sidebar;
