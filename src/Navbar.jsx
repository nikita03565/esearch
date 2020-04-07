import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, IconButton } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import axios from 'axios';
import PropTypes from 'prop-types';
//import NavLink from './common/NavLink';
import { NavLink } from 'react-router-dom';

import AuthService from './AuthService';
import WithAuth from './WithAuth'

const Auth = new AuthService();

class Navbar extends Component {
    signal = axios.CancelToken.source();

    state = {
        editedCheckListsAmount: 0,
    }

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
        const { editedCheckListsAmount } = this.state;
        const { username } = this.props;
        return (
            <div>
                <h1> { username } </h1>
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
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                        style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}
                    >
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Основное
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                </div>
                            </li>
                            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                                <Badge
                                    color="primary"
                                    badgeContent={editedCheckListsAmount}
                                    max={9}
                                >
                                    <NavLink className="nav-link" to="/search">Поиск</NavLink>
                                </Badge>
                            </li>
                            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                                <NavLink className="nav-link" to="/user">Профиль</NavLink>
                            </li>
                            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                                <NavLink className="nav-link" to="/signup">Зарегистрироваться</NavLink>
                            </li>
                            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                                <NavLink className="nav-link" to="/signin">Войти</NavLink>
                            </li>
                        </ul>
                        
                        <div
                            style={{ alignItems: 'center', marginLeft: 'auto', marginRight: '0' }}
                            className="navbar-nav"
                        >
                            <div>
                                <span
                                    className="navbar-text"
                                    style={{ margin: '4px' }}
                                >
                                    {username}
                                </span>
                        
                                <IconButton
                                    style={{ marginLeft: '-5px' }}
                                    color="primary"
                                    component={Link}
                                    to="/settings"
                                >
                                    <Settings />
                                </IconButton>
                            </div>
                            <Button
                                variant="contained"
                                size="small"
                                component={Link}
                                to="/"
                                onClick={this.handleLogout}
                            >
                                Выйти
                            </Button>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default WithAuth(Navbar);
