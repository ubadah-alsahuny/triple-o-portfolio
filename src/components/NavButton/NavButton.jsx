import React from 'react'
import { useNavigate } from 'react-router-dom'

const NavButton = ({ open, setOpen, to, icon, label }) => {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => {navigate(to); setOpen(false)}}
            className={`flex w-9/12 h-fit p-1.5 mb-2 mt-2 text-white justify-items-center
                       rounded hover:bg-gray-700 transition-all duration-300
                       ${open ? 'w-11/12' : 'w-9/12'}`}
        >
            {icon}

            {open && (
                <p className={`text-white pl-3 mb-0`}>{label}</p>
            )}
        </button>
    )
}

export default NavButton;
