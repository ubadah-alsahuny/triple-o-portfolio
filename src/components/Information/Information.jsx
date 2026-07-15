import styles from './Information.module.css';

const Information = ({icon, label = "Information", content = "Information content", isEmail = false}) => {
    return (
        <div className={`flex-col columns-2 w-1/3 h-fit mb-4`}>
            <p className={`flex place-items-center ${styles.shared}`}>
                {icon}
                {label}:
            </p>

            <p className={`${styles.content}`}>
                {isEmail ? (
                    <a href={`mailto:${content}`} className="text-blue-600 hover:underline">
                        {content}
                    </a>
                ) : (
                    content
                )}
            </p>
        </div>
    )
}

export default Information;