import { useState, useEffect } from 'react';
import { endpoint, mapEndpointResultsToDataList } from '../../helpers/locationLookup';
import Input from '../Input';
import './styles.css';

const Form = () => {
    const [pickupLocationQuery, setPickupLocationQuery] = useState('');
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);

    const onSubmit = evt => evt.preventDefault();

    useEffect(() => {
        if (pickupLocationQuery.length <= 1) {
            setDataList([]);

            return;
        }

        setLoading(true);

        fetch(endpoint(pickupLocationQuery))
            .then(data => data.json())
            .then(data => setDataList(data?.results?.docs.map(mapEndpointResultsToDataList) || []))
            .catch(e => setDataList([]))
            .finally(() => setLoading(false))

    }, [pickupLocationQuery]);

    return <form className="search-form" onSubmit={onSubmit}>
        <Input
            id="pickup-location"
            placeholder="Pick-up Location"
            onChange={setPickupLocationQuery}
            debounce={500}
            loading={loading}
            dataList={dataList}
        />
        <button type="submit" className="search-form__submit-button">
            Search
        </button>
    </form>
};

export default Form;