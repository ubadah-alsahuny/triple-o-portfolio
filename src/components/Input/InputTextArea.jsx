import React from "react";
import styles from "./Input.module.css";

const InputTextArea = ({placeholder, value, onChange, required = true, label, rows}) => {
    return(
        <div>
            <p className={`${styles.label} font-medium`}>{label}</p>

            <textarea
                className={`w-full py-2 pl-5 mb-3 ${styles.TextArea} ${styles.inputField}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                rows={rows}
            />
        </div>
    );
}

export default InputTextArea;