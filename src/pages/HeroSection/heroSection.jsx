import styles from "./heroSection.module.css";
import {FaFacebook, FaInstagram} from "react-icons/fa";
import {FaX, FaXTwitter} from "react-icons/fa6";
import Toggle from "../../components/Toggle/Toggle.jsx";
import penBelow from "../../assets/penBelow.jpg";
import penUp from "../../assets/penUp.jpg";
import {MdSunny} from "react-icons/md";

const HeroSection = () => {
    return(
        <>
            <div className={`w-screen h-screen content-center flex flex-col relative overflow-hidden`}>
                <div className={`w-1/4 h-1/4 fixed left-0 md:bottom-30 sm:bottom-0`}>
                    <img src={penBelow} alt={""}/>
                </div>

                <div className={`w-1/4 h-1/4 fixed right-0 top-0 rotate-y-180`}>
                    <img src={penUp} alt={""}/>
                </div>

                <div className={`w-full h-1/5 content-center place-items-center relative`}>
                    <ul className={`flex flex-row absolute`}>
                        <li className={`${styles.item}`}>
                            <a href={"/login"}> Login </a>
                        </li>

                        <li className={`${styles.item}`}>
                            <a href={"/signup"} className={`list-none`}>
                                Sign up
                            </a>
                        </li>

                        <li className={`${styles.item}`}>About us</li>
                    </ul>
                </div>

                <div className={`flex flex-row h-3/5 w-full`}>
                    <div className={`w-1/9 content-center justify-items-center`}>
                        
                    </div>

                    <div className={`w-7/9 text-center justify-items-center content-center`}>
                        <div className={`w-1/2`}>
                            <p className={`bold text-left ml-8 ${styles.O}`}>
                                Triple <span className={`${styles.O}`}>O:</span>
                            </p>

                            <p className={`font-light mt-0 ${styles.main} ${styles.main2}`}>
                                PORTFOLIO.
                            </p>
                        </div>
                    </div>

                    <div className={`w-1/9 text-center content-center`}>
                        <p className={`-rotate-90 flex w-43`}>
                            Follow Us:
                            <FaInstagram size={20} className={`ml-3 text-black cursor-pointer`}/>
                            <FaFacebook size={20} className={`ml-3 text-black cursor-pointer rotate-90`}/>
                            <FaXTwitter size={20} className={`ml-3 text-black cursor-pointer rotate-90`}/>
                        </p>
                    </div>
                </div>

                <div className={`w-full h-1/5 content-center justify-items-center`}>
                    <p className={`font-bold text-center`}>
                        Did you know:
                        <br/>
                        <span className={`font-light`}>
                            A well-crafted portfolio showcases your value more<br/>effectively than a traditional résumé ever could.
                        </span>
                    </p>
                </div>
            </div>
        </>
    )
}

export default HeroSection;