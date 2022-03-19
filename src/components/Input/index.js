import { forwardRef, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import className from '../../helpers/className';
import './styles.css';

const Input = forwardRef(({
    debounce = 0,
    id,
    initialValue = '',
    loading = false,
    onChange,
    placeholder,
    dataList,
    ...props
}, ref) => {
    const [value, setValue] = useState(initialValue);
    const [searchValue, setSearchValue] = useState('');
    const [showListBox, setShowListBox] = useState(false);
    const [selectedListBoxOption, setSelectedListBoxOption] = useState(null);
    const inputLabelClassName = className({
        'input__label': true,
        'input__label--shrunk': value
    });
    const listBoxClassName = className({
        'input__listbox': true,
        'input__listbox--hidden': !showListBox
    });

    const onInputChange = ({ target }) => {
        setValue(target.value);
        setSearchValue('');
    };

    const onInputKeyDown = (evt) => {
        if (!dataList || !showListBox) return;

        let currentIndex = dataList.findIndex(({ id }) => id === selectedListBoxOption) || 0;
        let nextIndex;

        switch (evt.key) {
            case 'ArrowDown':
                evt.preventDefault();

                nextIndex = currentIndex + 1;

                if (!dataList[nextIndex]) nextIndex = 0;
                
                setSelectedListBoxOption(dataList[nextIndex].id);
    
                break;

            case 'ArrowUp':
                evt.preventDefault();

                nextIndex = currentIndex - 1;

                if (nextIndex < 0) nextIndex = dataList.length - 1;
                
                setSelectedListBoxOption(dataList[nextIndex].id);

                break;

            case 'Enter':
                if (!selectedListBoxOption) return;

                evt.preventDefault();

                const { searchValue, notFound } = dataList[currentIndex];

                if (!notFound) setSearchValue(searchValue);

                break;

            case 'Escape':
                evt.preventDefault();

                setShowListBox(false);

                break;
        }
    }

    useEffect(() => {
        let debouncedOnChange = setTimeout(() => {
           onChange(value);
        }, debounce);

        return () => clearTimeout(debouncedOnChange);
    }, [value, debounce, onChange]);

    useEffect(() => {
        setSelectedListBoxOption(null);
        setShowListBox(value.length > 1 && !!dataList?.length);
    }, [dataList, value]);

    useEffect(() => {
        if (searchValue) setShowListBox(false);
    }, [searchValue]);

    return (
        <div className="input">
            <div
                role={dataList && 'combobox'}
                aria-expanded={dataList && showListBox}
                aria-owns={dataList && `${id}-listbox`}
                aria-haspopup={dataList && `listbox`}
            >
                <input
                    aria-activedescendant={dataList && selectedListBoxOption}
                    aria-autocomplete={dataList && 'list'}
                    aria-controls={dataList && `${id}-listbox`}
                    className="input__input"
                    id={id}
                    onChange={onInputChange}
                    onKeyDown={onInputKeyDown}
                    ref={ref}
                    value={searchValue || value}
                    {...props}
                />
            </div>
            <ul
                aria-labelledby={`${id}-label`}
                className={listBoxClassName}
                id={`${id}-listbox`}
                role="listbox"
            >
                {dataList?.map(({ id, type, title, description, searchValue, notFound }) => {
                    const isSelected = id === selectedListBoxOption;
                    const listBoxOptionClassName = className({
                        'input__listbox-item': true,
                        'input__listbox-item--selected': isSelected
                    });
                    const listBoxTypeClassName = className({
                        'input__listbox-type': true,
                        [`input__listbox-type--${type?.short}`]: !notFound,
                        'input__listbox-type--hidden': notFound,
                    })

                    return (
                        <li
                            aria-selected={isSelected}
                            className={listBoxOptionClassName}
                            data-testid={id}
                            id={id}
                            key={id}
                            onClick={() => !notFound && setSearchValue(searchValue)}
                            onMouseOver={() => setSelectedListBoxOption(id)}
                            role="option"
                        >
                            <div className={listBoxTypeClassName}>
                                {type?.long}
                            </div>
                            <div className="input__listbox-details">
                                <div className="input__listbox-title">{title}</div>
                                <div className="input__listbox-desc">{description}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className="input__container" aria-hidden>
                <svg className="input__icon" aria-hidden viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <label className={inputLabelClassName} htmlFor={id} id={`${id}-label`}>{placeholder}</label>
                {loading && <div className="input__loader" data-testid="loader"></div>}
            </div>
        </div>);
});

Input.propTypes = {
    dataList: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.shape({
            long: PropTypes.string.isRequired,
            short: PropTypes.string.isRequired,
        }),
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        searchValue: PropTypes.string,
        notFound: PropTypes.bool
    })),
    debounce: PropTypes.number,
    id: PropTypes.string.isRequired,
    initialValue: PropTypes.string,
    loading: PropTypes.bool,
    placeholder: PropTypes.string.isRequired,
};

export default Input;