import { Link, useNavigate } from 'react-router-dom';
import styles from './Button.module.css';

const Button = ({to, label}) => {
    return (
        <div>
            <Link to={to}
                    className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-3 ${styles.button}`}>
                {label}
            </Link>
        </div>
    );
}

export default Button;