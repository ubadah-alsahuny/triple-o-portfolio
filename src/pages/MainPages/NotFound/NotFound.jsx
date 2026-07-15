import NotFoundImage from '../../../assets/404 Not Found.png';
import styles from './NotFound.module.css'
import Button from "../../../components/Button(Link To)/Button.jsx";

const NotFound = () => {
    return (
        <div className={`flex flex-col items-center`}>
            <p className={`${styles.text} w-80 text-center font-light`}>
                Oh, Oh!
            </p>

            <p className={`${styles.subtext} w-74 text-center italic mb-7`}>
                Looks like you may have followed a non-existent link!
            </p>
        </div>
    )
}

export default NotFound;