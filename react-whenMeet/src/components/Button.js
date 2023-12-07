
function Button({type,text,onClick,disabled}){
    return(
        <button
        className={disabled ? 'disabled' : 'active'}
        type = {type}
        onClick={onClick}
        disabled = {disabled}
        >
            {text}
        </button>
    );
}


export default Button;