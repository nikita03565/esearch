import React, {Component} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {Button} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import axios from 'axios';
import PropTypes from 'prop-types';

import AuthService from './AuthService';
import WithAuth from './WithAuth'

const Auth = new AuthService();

class Navbar extends Component {
    signal = axios.CancelToken.source();

    state = {}

    static propTypes = {
        username: PropTypes.string,
    };

    componentDidMount() {
        console.log("MOUNT!!!")
    }

    componentWillUnmount() {
        this.signal.cancel();
    }

    handleLogout = () => {
        Auth.logout();
    }

    render() {
        const {username, id} = this.props;
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-light bg-light">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"/>
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                        style={{maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto'}}
                    >
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                                <NavLink className="nav-link" to="/">Главная</NavLink>
                            </li>
                            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                                <NavLink className="nav-link" to="/search">Поиск</NavLink>
                            </li>
                            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                                <NavLink className="nav-link" to='/users'>Пользователи</NavLink>
                            </li>
                        </ul>
                        {
                            username
                                ?
                                <div
                                    style={{alignItems: 'center', marginLeft: 'auto', marginRight: '0'}}
                                    className="navbar-nav"
                                >
                                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                                        <NavLink className="nav-link" to={`/users/${id}`}><AccountCircleIcon/></NavLink>
                                    </li>
                                    <div>
                                        <span
                                            className="navbar-text"
                                            style={{margin: '5px'}}
                                        >
                                            {username}
                                        </span>
                                    </div>
                                    <Button
                                        style={{marginLeft: '10px'}}
                                        variant="contained"
                                        size="small"
                                        component={Link}
                                        to="/"
                                        onClick={this.handleLogout}
                                    >
                                        Выйти
                                    </Button>
                                </div>
                                :
                                <div
                                    style={{alignItems: 'center', marginLeft: 'auto', marginRight: '0'}}
                                    className="navbar-nav"
                                >
                                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                                        <NavLink className="nav-link" to="/signup">Зарегистрироваться</NavLink>
                                    </li>
                                    <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                                        <NavLink className="nav-link" to="/signin">Войти</NavLink>
                                    </li>
                                </div>
                        }
                    </div>
                </nav>
            </div>
        );
    }
}

export default WithAuth(Navbar);
