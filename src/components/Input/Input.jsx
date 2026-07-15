import React from "react";
import styles from "./Input.module.css";

const Input = ({type, placeholder, autocomplete, value, onChange, required = true, name, label}) => {
    return(
        <div>
            <p className={`${styles.label} font-medium`}>{label}</p>

            <input
                className={`w-full py-2 pl-5 mb-3 rounded-2xl ${styles.inputField}`}
                type={type}
                name={name}
                placeholder={placeholder}
                autoComplete={autocomplete}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
}

export default Input;