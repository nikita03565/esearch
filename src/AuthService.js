import axios from 'axios';
import Cookies from 'js-cookie';
import history from './history';

export default class AuthService {
    constructor() {
        this.signin = this.signin.bind(this);
        this.signup = this.signup.bind(this);
        this.getUsername = this.getUsername.bind(this);
        this.getId = this.getId.bind(this);
    }

    async signin(username, password) {
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
        this.setId(res.data.id);
        return Promise.resolve(res);
    }

    async signup(username, password, first_name, last_name) {
        const csrfToken = Cookies.get('csrftoken');
        axios.defaults.xsrfCookieName = 'csrftoken';
        axios.defaults.xsrfHeaderName = 'X-CSRFToken';
        const data = {
            username,
            password,
            first_name,
            last_name,
        };
        const res = await axios({
            method: 'post',
            url: '/api/signup/',
            data,
            headers: {
                'X-CSRFToken': csrfToken,
            },
        });
        this.setToken(res.data.token);
        this.setUsername(res.data.username);
        this.setId(res.data.id);
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

    setId(id) {
        localStorage.setItem('id', id);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getUsername() {
        return localStorage.getItem('username');
    }

    getId() {
        return localStorage.getItem('id');
    }

    logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('id');
    }
}
