import axios from 'axios';
import { withAuthHeader } from '../Auth';


export const loadData = async (baseUrl) => {
    const res = await axios({
        url: `/api/${baseUrl}/`,
        headers: withAuthHeader(),
    });
    return res;
};


export const loadDataWithQp = async (url) => {
    const res = await axios({
        url: `/api/${url}`,
        headers: withAuthHeader(),
    });
    return res;
};

export const retreiveData = async (baseUrl, id) => {
    const res = await axios({
        url: `/api/${baseUrl}/${id}/`,
        headers: withAuthHeader(),
    });
    return res;
};


export const addEl = async (baseUrl, data) => {
    const res = await axios({
        method: 'post',
        url: `/api/${baseUrl}/`,
        data,
        headers: withAuthHeader(),
    });
    return res;
};

export const updateEl = async (baseUrl, id, data) => {
    const res = await axios({
        method: 'patch',
        url: `/api/${baseUrl}/${id}/`,
        data,
        headers: withAuthHeader(),
    });
    return res;
};

export const deleteEl = async (baseUrl, id) => {
    const res = await axios({
        method: 'delete',
        url: `/api/${baseUrl}/${id}/`,
        headers: withAuthHeader(),
    });
    return res;
};