import React from 'react';
import Input from '../Input';
import './styles.css';

const Form = () => {
    const onSubmit = evt => evt.preventDefault();

    return <form className="search-form" onSubmit={onSubmit}>
        <Input
            id="pickup-location"
            name="pickup-location"
            placeholder="Pick-up Location"
        />
        <button type="submit" className="search-form__submit-button">
            Search
        </button>
    </form>
};

export default Form;