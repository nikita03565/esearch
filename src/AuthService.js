import axios from 'axios';
import Cookies from 'js-cookie';
import history from './history';

export default class AuthService {
    constructor() {
        this.login = this.login.bind(this);
        this.getUsername = this.getUsername.bind(this);
    }

    async login(username, password) {
        const csrfToken = Cookies.get('csrftoken');
        axios.defaults.xsrfCookieName = 'csrftoken';
        axios.defaults.xsrfHeaderName = 'X-CSRFToken';
        const data = {
            username,
            password,
        };
        const res = await axios({
            method: 'post',
            url: '/api/signin/',
            data,
            headers: {
                'X-CSRFToken': csrfToken,
            },
        });
        this.setToken(res.data.token);
        this.setUsername(res.data.username);
        return Promise.resolve(res);
    }

    loggedIn() {
        const token = this.getToken();
        return !!token;
    }

    setToken(token) {
        localStorage.setItem('token', token);
    }

    setUsername(username) {
        localStorage.setItem('username', username);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getUsername() {
        return localStorage.getItem('username');
    }

    logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    }
}
