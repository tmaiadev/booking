export const endpoint = query => `https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=6&solrTerm=${encodeURI(query)}`;

const getTypeDescription = type => {
    switch (type) {
        case 'A':
            return 'Airport';

        case 'C':
            return 'City';

        case 'D':
            return 'District';

        case 'I':
            return 'Region';

        case 'T':
            return 'Station';

        default:
            return 'Unknown';
    }
}

export const mapEndpointResultsToDataList = ({ bookingId, name, country, region, city, placeType }) => {
    if (!bookingId) return { id: '0', title: name, notFound: true };

    return {
        id: bookingId,
        type: {
            short: placeType,
            long: getTypeDescription(placeType),
        },
        title: name,
        description: [country, region, city].filter(text => text).join(', '),
        searchValue: [name, city, region, country].filter(text => text).join(', '),
    };
};
