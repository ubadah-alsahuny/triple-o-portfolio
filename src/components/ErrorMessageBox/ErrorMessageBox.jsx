import React, { useState, useEffect } from 'react';
import styles from './ErrorMessageBox.module.css';

const ErrorMessageBox = ({ message ,onDismiss }) => {

    const [isVisible , setIsVisible] = useState(true);
    useEffect(()=>{
        const timer = setTimeout(() => {
            setIsVisible(false);
        },3000);

        return () => clearTimeout(timer);
        },[]);

    useEffect(() => {
        if (!isVisible) {
            // Wait for exit animation to finish before calling onDismiss
            const timer = setTimeout(onDismiss, 500);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onDismiss]);

    return (
        <div
            className={`flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 ${styles.notification}`}
            role="alert">
            <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="currentColor" viewBox="0 0 20 20">
                <path
                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Info</span>
            <div>
                <span className="font-medium">Error!</span> {message}
            </div>
        </div>
    )
        ;
};

export default ErrorMessageBox;