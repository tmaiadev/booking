import { endpoint, mapEndpointResultsToDataList } from './locationLookup';

describe('Given `endpoint`', () => {
    describe('When called', () => {
        it('should return the correct URL with the `query` parameter parsed', () => {
            const result = endpoint('London Victoria');

            expect(result).toBe('https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=6&solrTerm=London%20Victoria');
        });
    });
});

describe('Given `mapEndpointResultsToDataList`', () => {
    describe('When called with an object from the autocomplete endpoint', () => {
        it('should return an object compatible with the Input dataList property', () => {
            const result = mapEndpointResultsToDataList({
                placeType: 'A',
                placeKey: '1472184',
                locationId: '38101',
                name: 'London City Airport',
                iata: 'LCY',
                city: 'London',
                region: 'Greater London',
                country: 'United Kingdom',
                countryIso: 'gb',
                ufi: 900038685,
                bookingId: 'airport-38101',
                lat: 51.503700256347656,
                lng: 0.05320800095796585,
                alternative: ['GB,UK,England,London City'],
                searchType: 'L',
                lang: 'en',
                index: 7,
                isPopular: false
            });

            expect(result).toStrictEqual({
                description: 'United Kingdom, Greater London, London',
                id: 'airport-38101',
                searchValue: 'London City Airport, London, Greater London, United Kingdom',
                title: 'London City Airport',
                type: {
                    long: 'Airport',
                    short: 'A',
                },
            });
        });

        describe('And result from endpoint is not found', () => {
            it('should return a not found result compatible with the Input dataList property', () => {
                const result = mapEndpointResultsToDataList({
                    name: 'No results found',
                    index: 1
                });

                expect(result).toStrictEqual({
                    id: '0',
                    notFound: true,
                    title: 'No results found',
                });
            });
        });
    });
});