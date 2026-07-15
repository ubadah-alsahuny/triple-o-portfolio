import React from 'react';
import {FiAlignLeft} from "react-icons/fi";
import styles from "./Header.module.css";

const Header = ({changeState}) => {
    return (
        <div className={`w-full flex-grow shadow-md`}>
            <div className={`h-13 items-center flex px-5 ${styles.header}`}>
                <FiAlignLeft className={`text-black mr-5 cursor-pointer`} size={25} onClick={changeState}/>

                <p className={`${styles.title}`}>PORTFOLIO</p>
            </div>
        </div>
    )
}

export default Header;