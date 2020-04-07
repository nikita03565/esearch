import React from 'react';
import {
    Router as ReactRouter, Route, Switch, Redirect,
} from 'react-router-dom';

import Login from './Login';
import NotFound from './NotFound';
import AuthService from './AuthService';
import history from './history';

function Router() {   
    return (
        <ReactRouter history={history}>
            <div style={{ margin: 20 }}>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </div>
        </ReactRouter>
    );
}

export default Router;
