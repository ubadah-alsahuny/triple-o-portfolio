import styles from './Button.module.css';
import Spinner from "../Spinner [Renewed]/Spinner.jsx";
import React from "react";

const Button = ({type, onClick, label, loading}) => {
    return (
        <div className={`w-full items-center`}>
            <button type={type}
                    onClick={onClick}
                    className={`w-full place-items-center text-white font-medium rounded-lg text-sm text-center py-1.5 ${styles.button}`}>

                {loading ? <Spinner width={26} height={25}/> : label}
            </button>
        </div>
    );
}

export default Button;