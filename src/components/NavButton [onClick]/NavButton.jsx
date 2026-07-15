import React from 'react'
import { useNavigate } from 'react-router-dom'

const NavButton = ({ open, functionName, icon }) => {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => {functionName()}}
            className={`flex w-fit h-fit p-1.5 mb-2 text-white justify-items-center
                       rounded hover:bg-blue-400 transition-all duration-300`}
        >
            {icon}
        </button>
    )
}

export default NavButton
