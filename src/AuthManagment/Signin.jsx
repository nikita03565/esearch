import React, { Component } from 'react';
import {
    Card, CardContent, Button, TextField,
} from '@material-ui/core';
// import styles from './styles';
import AuthService from '../AuthService';
import history from '../history';
import Navbar from '../Navbar'

class Signin extends Component {
    constructor() {
        console.log('HM???')
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();
        this.state = {
            errorText: '',
            username: '',
            password: '',
        };
    }

    componentWillMount() {
        if (this.Auth.loggedIn()) {
            history.replace('/');
        }
    }

    async handleFormSubmit(e) {
        const { username, password } = this.state;
        e.preventDefault();
        try {
            await this.Auth.signin(username, password);
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
        console.log('RENDER?')
        const { errorText, username, password } = this.state;
        return (
            <div >
                <Navbar />
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
                                name="password"
                                value={password}
                                type="password"
                                
                                onChange={this.handleChange}
                                placeholder="Введите пароль"
                                required
                            />
                            <Button
                                style={{ marginTop: 20 }}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Вход
                            </Button>
                        </form>
                        {errorText !== '' ? <p style={{ color: 'red', margin: 0, marginTop: 10 }}>{errorText}</p> : ''}
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default Signin;
