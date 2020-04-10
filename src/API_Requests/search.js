import axios from 'axios';
import { withAuthHeader } from '../Auth';


export const searchDreams = async (term) => {
    const res = await axios({
        url: `/api/desire_docs/?search=${term}`,
        headers: withAuthHeader(),
    });
    return res;
};


export const suggestDreams = async (field, term) => {
    const res = await axios({
        url: `/api/desire_docs/?${field}_suggest__completion=${term}`,
        headers: withAuthHeader(),
    });
    return res;
};
