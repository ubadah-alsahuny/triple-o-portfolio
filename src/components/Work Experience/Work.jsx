import Secondary from "./Secondary/Secondary.jsx";
import Primary from "./Primary/Primary.jsx";

import styles from './Settings.module.css'
import {FaCircleNodes} from "react-icons/fa6";

const Work = ({title = "Work Title", isPrimary = true, role = "Role in the job", jobDescription = "Description"}) => {
    return(
        <div className={`my-2 py-2 ${styles.container}`}>
            <div className={`w-full flex justify-between place-items-center`}>
                <p className={`${styles.title}`}>{title}</p>
                {isPrimary ? <Primary/> : <Secondary/>}
            </div>
            <p className={`italic flex place-items-center ${styles.other}`}> <FaCircleNodes className={`mr-1`}/> {role}</p>
            <p className={`${styles.other}`}>{jobDescription}</p>
        </div>
    )
}

export default Work;