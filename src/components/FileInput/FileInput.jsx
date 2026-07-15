import React, {useRef, useState} from 'react';
import {FiEdit} from "react-icons/fi";

const FileInput = ({ onImageSelected }) => {

    const inputRef = useRef(null);

    const handleOnChange = (event) => {
        if (event.target.files && event.target.files.length > 0){
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = function (e) {
                onImageSelected(reader.result)
            };
        }
    }

    const onChooseImage = () => {
        inputRef.current.click();
    }

    return (
        <div>
            <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleOnChange}
            hidden
            />

            <button onClick={onChooseImage}>
                <FiEdit size={25}/>
            </button>
        </div>
    )
}

export default FileInput