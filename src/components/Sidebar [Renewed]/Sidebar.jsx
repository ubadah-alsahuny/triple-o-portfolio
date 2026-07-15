import {MdPerson2} from "react-icons/md";
import {FaPaintbrush} from "react-icons/fa6";
import {HiTemplate} from "react-icons/hi";
import {BsCollectionFill, BsLayoutSidebar} from "react-icons/bs";
import {TbHomeFilled, TbPhotoFilled} from "react-icons/tb";
import {IoLogOut} from "react-icons/io5";

import NavButton from "../NavButton/NavButton.jsx";
import {useAuth} from "../../contexts/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";

import Spinner from '../Spinner [Renewed]/Spinner.jsx'
import {BiSolidCollection} from "react-icons/bi";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    if (!user) return null;

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        setLoading(true);

        try{
            await logout();
            navigate("/login");
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return(
        <div className={`flex flex-col items-center h-full bg-black flex-shrink-0 shadow-md duration-300
                        ${open ? `w-56` : `w-12`}`}>
            <button onClick={() => setOpen(prev => !prev)}
                className={`w-fit mb-3 mt-2 p-1.5 text-white justify-items-center
                            hover:bg-gray-700 transition-all duration-300
                            ${open ? 'w-full bg-gray-700' : 'rounded'}`}>
                <BsLayoutSidebar size={22}/>
            </button>

            <NavButton open={open} setOpen={setOpen} to={"/home/home"} icon={<TbHomeFilled size={23}/>} label={"Home"}/>
            <NavButton open={open} setOpen={setOpen} to={"/home/profile"} icon={<MdPerson2 size={25}/>} label={"Profile"}/>
            <NavButton open={open} setOpen={setOpen} to={"/home/design"} icon={<FaPaintbrush size={22}/>} label={"Design"}/>
            <NavButton open={open} setOpen={setOpen} to={"/home/gallery"} icon={<TbPhotoFilled size={23}/>} label={"Gallery"}/>
            <NavButton open={open} setOpen={setOpen} to={"/home/templates"} icon={<HiTemplate size={22}/>} label={"Templates"}/>
            <NavButton open={open} setOpen={setOpen} to={"/home/design-library"} icon={<BiSolidCollection size={22}/>} label={"Your Portfolios"}/>

            <button onClick={handleLogout}
                    disabled={loading}
                    className={`flex mb-3 mt-auto p-1.5 text-white
                                justify-items-center rounded hover:bg-gray-700
                                transition-all duration-300
                                ${loading ? 'opacity-75' : ''}
                                ${open ? 'w-11/12' : 'w-9/11'}`}>
                {loading ? (
                    <Spinner height={23} width={20}/>
                ) : <IoLogOut size={23}/>}
                {open && (
                    <p className={`text-white pl-3 mb-0`}>Logout</p>
                )}
            </button>
        </div>
    )
}

export default Sidebar;