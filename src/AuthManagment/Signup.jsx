import React, { Component } from 'react';
import {
    Card, CardContent, Button, TextField,
} from '@material-ui/core';
// import styles from './styles';
import AuthService from '../AuthService';
import history from '../history';
import Navbar from '../Navbar'
class Signup extends Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();
        this.state = {
            errorText: '',
            username: '',
            password: '',
            password2: '',
            first_name: '',
            last_name: '',
        };
    }

    componentWillMount() {
        if (this.Auth.loggedIn()) {
            history.replace('/');
        }
    }

    async handleFormSubmit(e) {
        const { username, password, first_name, last_name } = this.state;
        e.preventDefault();
        try {
            await this.Auth.signup(username, password, first_name, last_name);
            history.push('/');
        } catch (err) {
            this.setState({ errorText: JSON.stringify(err.response) });
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    render() {
        const { errorText, username, password, first_name, last_name, password2 } = this.state;
        return (
            <div >
                <Navbar />
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'fixed',
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    overflow: 'auto',
                }}>
                    <Card style={{ width: 250, paddingLeft: 10 }}>
                        <CardContent>
                            <form onSubmit={this.handleFormSubmit}>
                                <TextField
                                    name="username"
                                    type="text"
                                    value={username}
                                    
                                    onChange={this.handleChange}
                                    placeholder="Введите юзернейм"
                                    required
                                />
                                <TextField
                                    name="first_name"
                                    type="text"
                                    value={first_name}
                                    
                                    onChange={this.handleChange}
                                    placeholder="Введите имя"
                                    required
                                />
                                <TextField
                                    name="last_name"
                                    type="text"
                                    value={last_name}
                                    
                                    onChange={this.handleChange}
                                    placeholder="Введите фамилию"
                                    required
                                />
                                <TextField
                                    name="password"
                                    value={password}
                                    type="password"
                                    
                                    onChange={this.handleChange}
                                    placeholder="Введите пароль"
                                    required
                                />
                                <TextField
                                    name="password2"
                                    value={password2}
                                    type="password"
                                    
                                    onChange={this.handleChange}
                                    placeholder="Повторите пароль"
                                    required
                                />
                                <Button
                                    style={{ marginTop: 20 }}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={password !== password2}
                                >
                                    Зарегистрироваться
                                </Button>
                            </form>
                            {errorText !== '' ? <p style={{ color: 'red', margin: 0, marginTop: 10 }}>{errorText}</p> : ''}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
}

export default Signup;
