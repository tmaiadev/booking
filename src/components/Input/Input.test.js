import { render, fireEvent } from '@testing-library/react';
import Input from './';

const inputLabel = 'My Input Name';
const initialProps = {
    id: 'my-input-id',
    placeholder: inputLabel,
};

jest.useFakeTimers();

describe('Given the `Input` component', () => {
    it('should render successfully', () => {
        const { container } = render(<Input {...initialProps} />);

        expect(container).toMatchSnapshot();
    });

    describe('When user types on the Input', () => {
        it('should shrink the label', () => {
            const { getByRole, getByText } = render(<Input {...initialProps} />);
            const input = getByRole('textbox');
            const label = getByText(inputLabel);

            expect(label).not.toHaveClass('input__label--shrunk');

            fireEvent.change(input, {
                target: { value: 'Hello' }
            });

            expect(label).toHaveClass('input__label--shrunk');
        });

        describe('and the `debounce` prop is passed', () => {
            it('should call the `onChange` prop only after the time described in the `debouce` prop has passed', () => {
                const debounce = 1000;
                const value = 'Hello';
                const onChange = jest.fn();
                const { getByRole } = render(<Input {...initialProps} onChange={onChange} debounce={debounce} />);
                const input = getByRole('textbox');

                fireEvent.change(input, {
                    target: { value }
                });

                expect(onChange).not.toHaveBeenCalled();

                jest.advanceTimersByTime(100);

                expect(onChange).not.toHaveBeenCalled();

                jest.advanceTimersByTime(debounce);

                expect(onChange).toHaveBeenCalledWith(value);
            });
        });
    });

    describe('When the `loading` prop is set to true', () => {
        it('should display a loading spinner', () => {
            const { getByTestId } = render(<Input {...initialProps} loading />);
            const spinner = getByTestId('loader');

            expect(spinner).toBeInTheDocument();
        });
    });

    describe('When the `dataList` prop is passed', () => {
        const dataList = [{
            id: 'airport-37766',
            type: {
                short: 'A',
                long: 'Airport'
            },
            title: 'Heathrow Airport',
            description: 'United Kingdom, Greater London, London',
            searchValue: 'Heathrow Airport, London, Greater London, United Kingdom'
        }, {
            id: 'city-2623186',
            type: {
                short: 'C',
                long: 'City'
            },
            title: 'London',
            description: 'United Kingdom, Greater London',
            searchValue: 'London, Greater London, United Kingdom'
        }, {
            id: 'airport-38106',
            type: {
                short: 'A',
                long: 'Airport'
            },
            title: 'London Luton Airport',
            description: 'United Kingdom, Greater London, London',
            searchValue: 'London Luton Airport, London, Greater London, United Kingdom'
        }, {
            id: 'airport-38111',
            type: {
                short: 'A',
                long: 'Airport'
            },
            title: 'London Stansted Airport',
            description: 'United Kingdom, Greater London, London',
            searchValue: 'London Stansted Airport, London, Greater London, United Kingdom'
        }, {
            id: 'airport-37761',
            type: {
                short: 'A',
                long: 'Airport'
            },
            title: 'Gatwick Airport',
            description: 'United Kingdom, Greater London, London',
            searchValue: 'Gatwick Airport, London, Greater London, United Kingdom'
        }, {
            id: 'train-23862',
            type: {
                short: 'T',
                long: 'Station'
            },
            title: 'London - Victoria Station',
            description: 'United Kingdom, England, London',
            searchValue: 'London - Victoria Station, London, England, United Kingdom'
        }];

        it('should render combobox with the correct aria attributes', () => {
            const { getByRole } = render(<Input {...initialProps} dataList={dataList} />);
            const combobox = getByRole('combobox');
            const input = getByRole('textbox');

            expect(combobox).toHaveAttribute('aria-expanded', 'false');
            expect(combobox).toHaveAttribute('aria-owns', 'my-input-id-listbox');
            expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');

            expect(input).toHaveAttribute('aria-autocomplete', 'list');
            expect(input).toHaveAttribute('aria-controls', 'my-input-id-listbox');
        });

        describe('and the user types 1 character on the input', () => {
            it('should NOT display the listbox', () => {
                const { getByRole } = render(<Input {...initialProps} dataList={dataList} />);
                const input = getByRole('textbox');
                const combobox = getByRole('combobox');
                const listbox = getByRole('listbox');

                fireEvent.change(input, { target: { value: 'L' } });

                expect(combobox).toHaveAttribute('aria-expanded', 'false');
                expect(listbox).toHaveClass('input__listbox--hidden');
            });
        });

        describe('and the user types 2 or more characters on the input', () => {
            let input, combobox, listbox, renderer;

            beforeEach(() => {
                renderer = render(<Input {...initialProps} dataList={dataList} />);
                const { getByRole } = renderer;

                input = getByRole('textbox');
                combobox = getByRole('combobox');
                listbox = getByRole('listbox');

                fireEvent.change(input, { target: { value: 'London' } });
            });

            it('should display the listbox', () => {
                fireEvent.change(input, { target: { value: 'Lo' } });

                expect(combobox).toHaveAttribute('aria-expanded', 'true');
                expect(listbox).not.toHaveClass('input__listbox--hidden');
            });

            describe('and the user presses the Arrow Down key', () => {
                let firstOption, firstOptionId;

                beforeEach(() => {
                    firstOptionId = dataList[0].id;
                    firstOption = renderer.getByTestId(firstOptionId);
                });
    
                it('should focus on the first listbox option', () => {
                    expect(firstOption).toHaveAttribute('aria-selected', 'false');
                    expect(input).not.toHaveAttribute('aria-activedescendant');

                    fireEvent.keyDown(input, { key: 'ArrowDown' });

                    expect(firstOption).toHaveAttribute('aria-selected', 'true');
                    expect(input).toHaveAttribute('aria-activedescendant', firstOptionId);
                });

                describe('and user continues to press the Arrow Down key', () => {
                    it('should focus on the next listbox option until it loops again to the first option', () => {
                        dataList.forEach(({ id }) => {
                            fireEvent.keyDown(input, { key: 'ArrowDown' });

                            expect(renderer.getByTestId(id)).toHaveAttribute('aria-selected', 'true');
                            expect(input).toHaveAttribute('aria-activedescendant', id);
                        });

                        fireEvent.keyDown(input, { key: 'ArrowDown' });

                        expect(renderer.getByTestId(firstOptionId)).toHaveAttribute('aria-selected', 'true');
                        expect(input).toHaveAttribute('aria-activedescendant', firstOptionId);
                    });
                });
            });

            describe('and the user presses the Arrow Up key', () => {
                let lastOption, lastOptionId;

                beforeEach(() => {
                    lastOptionId = dataList[dataList.length - 1].id;
                    lastOption = renderer.getByTestId(lastOptionId);
                });
                
                it('should focus the last listbox option', () => {
                    expect(lastOption).toHaveAttribute('aria-selected', 'false');
                    expect(input).not.toHaveAttribute('aria-activedescendant');

                    fireEvent.keyDown(input, { key: 'ArrowUp' });

                    expect(lastOption).toHaveAttribute('aria-selected', 'true');
                    expect(input).toHaveAttribute('aria-activedescendant', lastOptionId);
                });

                describe('and user continues to press the Arrow Up key', () => {
                    it('should focus the previous listbox option until it loops back again to the end', () => {
                        [...dataList].reverse().forEach(({ id }) => {
                            fireEvent.keyDown(input, { key: 'ArrowUp' });

                            expect(renderer.getByTestId(id)).toHaveAttribute('aria-selected', 'true');
                            expect(input).toHaveAttribute('aria-activedescendant', id);
                        });

                        fireEvent.keyDown(input, { key: 'ArrowUp' });

                        expect(lastOption).toHaveAttribute('aria-selected', 'true');
                        expect(input).toHaveAttribute('aria-activedescendant', lastOptionId);
                    });
                });
            });

            describe('and the user presses the Enter key', () => {
                describe('and listbox option is NOT focused', () => {
                    it('nothing should happen', () => {
                        fireEvent.keyDown(input, { key: 'Enter' });

                        expect(input.value).toBe('London');
                        expect(combobox).toHaveAttribute('aria-expanded', 'true');
                        expect(input).not.toHaveAttribute('aria-activedescendant');
                    });
                });

                describe('and a listbox option is focused', () => {
                    it('should select the listbox option', () => {
                        fireEvent.keyDown(input, { key: 'ArrowDown' });
                        fireEvent.keyDown(input, { key: 'Enter' });

                        expect(input.value).toBe(dataList[0].searchValue);
                        expect(combobox).toHaveAttribute('aria-expanded', 'false');
                        expect(input).toHaveAttribute('aria-activedescendant', dataList[0].id);
                    });
                });
            });

            describe('and the user presses the Escape key', () => {
                it('should hide the listbox', () => {
                    fireEvent.keyDown(input, { key: 'Escape' });

                    expect(combobox).toHaveAttribute('aria-expanded', 'false');
                    expect(listbox).toHaveClass('input__listbox--hidden');
                });
            });

            describe('and the user hover over a listbox option', () => {
                let optionId = dataList[3].id, option;

                beforeEach(() => {
                    option = renderer.getByTestId(optionId);
                });

                it('should focus on the listbox option', () => {
                    expect(option).toHaveAttribute('aria-selected', 'false');
                    expect(input).not.toHaveAttribute('aria-activedescendant');

                    fireEvent.mouseOver(option);

                    expect(option).toHaveAttribute('aria-selected', 'true');
                    expect(input).toHaveAttribute('aria-activedescendant', optionId);
                });

                describe('and the user clicks the listbox option', () => {
                    it('should select the listbox option', () => {
                        fireEvent.click(option);

                        expect(input.value).toBe(dataList[3].searchValue);
                        expect(combobox).toHaveAttribute('aria-expanded', 'false');
                    });
                });
            });
        });
    });
});