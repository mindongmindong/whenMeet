import PropTypes from "prop-types";

function Input({ type, value, onChange, placeholder }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
        />
    );
}

Input.propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
}

export default Input;