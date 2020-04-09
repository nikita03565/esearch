import Cookies from 'js-cookie';

export function authHeader() {
    return {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
    };
}

export function withAuthHeader(headers) {
    const newHeaders = { ...headers };
    const token = localStorage.getItem('token');
    if (token) {
        newHeaders.Authorization = `Token ${localStorage.getItem('token')}`;
    }
    return newHeaders;
}

export function withCsrf(headers) {
    const newHeaders = { ...headers };
    newHeaders['X-CSRFToken'] = Cookies.get('csrftoken');
    return headers;
}
