import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import SearchForm from './';
import serverResponseMock from './ServerResponse.mock';

jest.spyOn(global, 'fetch');
jest.useFakeTimers();

describe('Given the `SearchForm` component', () => {
    it('should render successfully', () => {
        const { container } = render(<SearchForm />);

        expect(container).toMatchSnapshot();
    });

    describe('When the user starts typing on the Pick-up Location input', () => {
        describe('and user types less than 2 characters', () => {
            it('should NOT make a network request', () => {
                fetch.mockResolvedValue(true);

                const { getAllByLabelText } = render(<SearchForm />);
                const [input] = getAllByLabelText('Pick-up Location');

                fireEvent.change(input, { target: { value: 'L' }});

                act(() => {
                    jest.advanceTimersByTime(600);
                });

                expect(fetch).not.toHaveBeenCalled();
            });
        });

        describe('and user types more than 2 characters', () => {
            let renderer, input;

            beforeEach(async () => {
                fetch.mockResolvedValue({
                    json: () => Promise.resolve(serverResponseMock)
                });

                renderer = render(<SearchForm />);
                const { getAllByLabelText, queryByTestId } = renderer;
                input = getAllByLabelText('Pick-up Location')[0];

                fireEvent.change(input, { target: { value: 'London Airport' }});

                act(() => {
                    jest.advanceTimersByTime(600);
                });

                await waitFor(() => expect(queryByTestId('loader')).toBeInTheDocument());
                await waitFor(() => expect(queryByTestId('loader')).not.toBeInTheDocument());
            });

            it('should request the correct url', () => {
                expect(fetch).toHaveBeenCalledWith('https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=6&solrTerm=London%20Airport');
            });

            it('should render a combobox', async () => {
                serverResponseMock.results.docs.forEach(({ name }) => 
                    expect(renderer.queryByText(name)).toBeInTheDocument());
            });

            describe('and user selects a combobox suggestion', () => {
                it('should update the input value', () => {
                    const option = renderer.queryByText('Heathrow Airport');

                    fireEvent.click(option);

                    expect(input.value).toBe('Heathrow Airport, London, Greater London, United Kingdom');
                });
            });
        });
    });
});