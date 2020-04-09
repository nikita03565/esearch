const parseErrors = (error) => {
    if (!error) {
        return 'Неизвестная ошибка';
    }

    if (!error.response) {
        return JSON.stringify(error);
    }

    if (!error.response.data) {
        return JSON.stringify(error.response);
    }

    if (error.response.status === 500) {
        return 'Ошибка сервера';
    }

    const { data } = error.response;

    if (data.errors) {
        const text = data.errors.join('\r\n');
        return text;
    }

    if (data.detail) {
        const text = data.detail;
        return text;
    }

    if (!data.errors) {
        const values = Object.values(data).map(value => Object.values(value));
        const flatted = values.flat(2);
        const text = flatted.join('\r\n');
        return text;
    }


    return  JSON.stringify(error.response.data);
};

export default parseErrors;