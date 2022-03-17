import { forwardRef, useState } from "react";
import PropTypes from 'prop-types';
import className from '../../helpers/className';
import './styles.css';

const Input = forwardRef(({ id, placeholder, initialValue = '', ...props }, ref) => {
    const [value, setValue] = useState(initialValue);
    const inputLabelClassName = className({
        'input__label': true,
        'input__label--shrunk': value
    });

    const onInputChange = ({ target }) => {
        setValue(target.value);
    };

    return (
        <div className="input">
            <input
                className="input__input"
                id={id}
                onChange={onInputChange}
                ref={ref}
                value={value}
                {...props}
            />
            <div className="input__container" aria-hidden>
                <svg className="input__icon" aria-hidden viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <label className={inputLabelClassName} htmlFor={id}>{placeholder}</label>
            </div>
        </div>);
});

Input.propTypes = {
    id: PropTypes.string.isRequired,
    initialValue: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
};

export default Input;