import { render, fireEvent } from '@testing-library/react';
import Input from './';

const initialProps = {
    id: 'my-input-id',
    placeholder: 'My Input Name',
};

describe('Given the `Input` element', () => {
    it('render successfully', () => {
        const { container } = render(<Input {...initialProps} />);

        expect(container).toMatchSnapshot();
    });

    describe('When user types on the Input', () => {
        it('should shrink the label', () => {
            const { getByLabelText, getByText } = render(<Input {...initialProps} />);
            const input = getByLabelText('My Input Name');
            const label = getByText('My Input Name');

            expect(label).not.toHaveClass('input__label--shrunk');

            fireEvent.change(input, {
                target: { value: 'Hello' }
            });

            expect(label).toHaveClass('input__label--shrunk');
        });
    });
});