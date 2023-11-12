function Input({type,value,onChange,placeholder}){
    return(
        <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        />
    );
}

export default Input;