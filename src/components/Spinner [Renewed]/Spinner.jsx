const Spinner = ({ width, height }) => {
    return (
        <div className={`border-2 border-white 
                         border-t-transparent
                         rounded-full
                         animate-spin`} style={{width: width, height: height}}/>
    )
}

export default Spinner;