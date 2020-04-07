import React from 'react';
import {
    Router as ReactRouter, Route, Switch, Redirect,
} from 'react-router-dom';

import Signin from './AuthManagment/Signin';
import Signup from './AuthManagment/Signup';
import NotFound from './NotFound';
import AuthService from './AuthService';
import Home from './Home'
import history from './history';

function Router() {   
    return (
        <ReactRouter history={history}>
            <div style={{ margin: 20 }}>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/signin' component={Signin} />
                    <Route exact path='/signup' component={Signup} />
                    <Route path='*' component={NotFound} />
                </Switch>
            </div>
        </ReactRouter>
    );
}

export default Router;