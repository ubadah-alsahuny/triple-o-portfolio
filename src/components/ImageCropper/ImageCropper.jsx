import React, {useState} from "react";
import Cropper from "react-easy-crop";
import styles from "./ImageCropper.module.css";
import Button from "../Button/Button.jsx"; // Please, install using: npm install react-easy-crop --save

const ImageCropper = ({ image, onCropDone, onCropCancel }) => {
    const [crop, setCrop] = useState({x: 0,y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(4 / 4);

    // A function called every time the cropped area changes
    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    return <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="w-[50%] h-[90%] bg-white p-4 rounded-lg place-items-center">
            <Cropper
                image={image}
                aspect={aspectRatio}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                    containerStyle: {
                        width: "100%",
                        height: "80%",
                        position: "relative",
                        borderRadius: 5,
                    },
                }}
            />

            <div className={`w-1/2 h-fit`}> {/* Action Buttons */}
                <div className={`mt-4`}>
                    <Button
                        label="Cancel crop"
                        onClick={onCropCancel}/>

                    <br/>

                    <Button
                        label="Crop & Change"
                        onClick={() => {onCropDone(croppedArea)}}/>
                </div>
            </div>
        </div>
    </div>
}

export default ImageCropper;