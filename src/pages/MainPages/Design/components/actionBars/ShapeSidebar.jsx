import React, {useRef, useState} from "react";
import { Square, Circle, Triangle, Diamond, ArrowRight } from "lucide-react";
import NavButton from "../../../../../components/NavButton [onClick]/NavButton.jsx";
import {MdAddBox} from "react-icons/md";
import {BiImageAdd, BiText} from "react-icons/bi";
import {FaArrowRight, FaCircle, FaSquareFull} from "react-icons/fa";
import {FaDiamond, FaTriangleExclamation} from "react-icons/fa6";
import {IoTriangle} from "react-icons/io5";
import {TbBackground} from "react-icons/tb";
import {IoMdColorFill, IoMdImage} from "react-icons/io";
import {ChromePicker} from "react-color";

const ShapeSidebar = ({ onAddText, onAddImage, onChangeBackgroundColor, onChangeBackgroundImage }) => {
  const handleDragStart = (e, shapeType) => {
    e.dataTransfer.setData("shapeType", shapeType);
  };

    const [shapeDropDown, setShapeDropDown] = useState(false)
    const [backgroundDropDown, setBackgroundDropDown] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState("#ffffff");
    const pickerRef = useRef();

  return (
      <div className="w-full h-full bg-(--secondary-color) p-3 flex flex-col items-center">
          <NavButton icon={<MdAddBox size={25}/>} functionName={() => setShapeDropDown(prev => !prev)}/>

          <div className={`bg-blue-400 p-2 rounded-md transition-all duration-300 ease-in-out transform origin-top
                         ${shapeDropDown ? `scale-y-100 max-h-100 my-2` : `max-h-0 scale-y-0 `}`}>
              <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, "arrow")}
                  title="Arrow"
                  className={`mb-3`}
              ><FaArrowRight size={21} className={`cursor-move text-blue-50`}/></div>

              <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, "circle")}
                  title="Circle"
                  className={`mb-3`}
              ><FaCircle size={21} className={`cursor-move text-blue-50`}/></div>

              <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, "rhombus")}
                  title="Diamond"
                  className={`mb-3`}
              ><FaDiamond size={21} className={`cursor-move text-blue-50`}/></div>

              <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, "rect")}
                  title="Rectangle"
                  className={`mb-3`}
              ><FaSquareFull size={21} className={`cursor-move text-blue-50`}/></div>

              <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, "triangle")}
                  title="Triangle"
              ><IoTriangle size={21} className={`cursor-move text-blue-50`}/></div>
          </div>

          <NavButton icon={<BiText size={25}/>} functionName={onAddText}/>

          <NavButton icon={<BiImageAdd size={25}/>} functionName={onAddImage}/>

          <NavButton icon={<TbBackground size={25}/>} functionName={() => setBackgroundDropDown(prev => !prev)}/>

          <div className={`bg-blue-400 p-2 rounded-md transition-all duration-300 ease-in-out transform origin-top
                         ${backgroundDropDown ? `scale-y-100 max-h-100 my-2` : `max-h-0 scale-y-0 overflow-hidden`}`}>
              <button className={`mb-3`} onClick={() => setShowColorPicker(!showColorPicker)} ref={pickerRef}>
                  <IoMdColorFill size={22} color="white"/>
              </button>

              {showColorPicker && (
                  <div className="absolute bottom-0 left-14 z-50">
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

              <button className={`mb-0`} onClick={onChangeBackgroundImage}>
                  <IoMdImage size={22} color="white"/>
              </button>
          </div>

          {/*<div
        draggable
        onDragStart={(e) => handleDragStart(e, "rect")}
        title="Rectangle"
        className="w-10 h-10 bg-gray-900 rounded-sm cursor-move hover:opacity-80"
      />

      <div
        draggable
        onDragStart={(e) => handleDragStart(e, "circle")}
        title="Circle"
        className="w-10 h-10 bg-gray-900 rounded-full cursor-move hover:opacity-80"
      />

      <ArrowRight
        draggable
        onDragStart={(e) => handleDragStart(e, "arrow")}
        title="Arrow"
        className="w-10 h-10 text-gray-900 cursor-move hover:opacity-80"
      />

      <div
        draggable
        onDragStart={(e) => handleDragStart(e, "rhombus")}
        title="Diamond"
        className="w-10 h-10 relative cursor-move"
      >
        <div className="w-6 h-6 bg-gray-900 rotate-45 absolute top-2 left-2" />
      </div>

      <div
        draggable
        onDragStart={(e) => handleDragStart(e, "triangle")}
        title="Triangle"
        className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-gray-900 cursor-move"
      />*/}
      </div>
  );
};

export default ShapeSidebar;
