import React, { useRef, useState } from "react";


import styles from './CommingSoon.module.css'
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
export default function ComingSoon() {
    const canvasRef = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false);
    const text = "Coming Soon";

    // Generate a random seed
    const seed = Math.random() * 1000;
    return (
        <div className="flex h-screen bg-black items-center justify-center">
            <h1 className={`relative text-center  leading-[0.70em] outline-none box-reflect ${styles.font}`}>
                {text.split("").map((letter, index) => {
                    const delay = seededRandom(seed + index) * 0.5 + 0.1;
                    return (
                        <span
                            key={index}
                            className={styles.animateFlicker}
                            style={{ animationDelay: `${delay}s` }}
                        >
              {letter}
            </span>
                    );
                })}
            </h1>
            {/* Blurred glass effect layer */}
            <div className={`absolute w-[1000px] h-[150px] ${styles.glassEffect} flex items-center justify-center`}>
            </div>
        </div>
    );

}
