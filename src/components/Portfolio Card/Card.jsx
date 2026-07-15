import styles from './Card.module.css'
import {SlOptionsVertical} from "react-icons/sl";
import StatusActions from "../../pages/MainPages/DesignLibrary/components/StatusActions.jsx";
import {useState} from "react";

const Card = ({thumbnail, title = "Portfolio title", description = "Portfolio description", onClickforOpen, onClickforEdit, design, onChangeStatus, isLoading, onClickforDelete, isProfile = false, onClickforCopy}) => {
    const [Open, setOpen] = useState(false);

    const openDropdown = () => {setOpen(prev => !prev)}

    return (
        <div
            className={`break-inside-avoid mb-3 h-fit md:w-77 bg-blue-50 rounded-lg ${styles.container}`}>
            <div className={`h-[15rem] w-fit overflow-hidden rounded-t-lg`}>
                {!isProfile &&
                <div className={`z-50 absolute m-2 bg-white p-2 rounded-lg shadow-md cursor-pointer`} onClick={openDropdown}><SlOptionsVertical size={20} className={`text-blue-700`}/></div>}
                {Open && (
                    <div className={`h-fit w-fit absolute z-50 mt-5 bg-white py-3 px-2 rounded-lg shadow-md`}>
                        <StatusActions design={design} onChangeStatus={onChangeStatus} isLoading={isLoading}/>

                        <a onClick={onClickforCopy}
                           className="items-center px-3 py-2 text-sm font-medium text-center text-black bg-gray-200 hover:bg-gray-300 rounded-lg">
                            Copy link
                        </a>

                        <a onClick={onClickforDelete}
                           className="items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg">
                            Delete
                        </a>
                    </div>
                )}
                <img className={`h-full w-full object-cover object-center ${styles.thumbnail}`} src={thumbnail} alt=""/>
            </div>
            <div className="p-3">
                <h5 className="mb-1 text-2xl font-bold tracking-tight text-black">{title}</h5>
                <p className="mb-3 text-sm opacity-50 font-normal italic">{description}</p>
                {!isProfile &&
                <div className={`flex flex-col`}>
                    <a onClick={onClickforOpen}
                       className="items-center px-3 mb-2 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Open portfolio →
                    </a>

                    {!["under review", "approved"].includes(design.status) && (
                        <a onClick={onClickforEdit}
                           className="items-center px-3 py-2 text-sm font-medium text-center text-blue-700 bg-white rounded-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Edit portfolio →
                        </a>
                    )}
                </div>}
            </div>
        </div>
    )
}

export default Card;