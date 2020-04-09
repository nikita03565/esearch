import React from 'react';
import {
    Router as ReactRouter, Route, Switch,
} from 'react-router-dom';

import Signin from './AuthManagment/Signin';
import Signup from './AuthManagment/Signup';
import NotFound from './NotFound';
import Home from './Home'
import Users from './Users'
import Dreams from './Dreams'
import Dream from './Dreams/Dream'
import UserDetail from './Users/UserDetail'
import history from './history';

function Router() {   
    return (
        <ReactRouter history={history}>
            <div style={{ margin: 20 }}>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/signin' component={Signin} />
                    <Route exact path='/signup' component={Signup} />
                    <Route exact path='/users' component={Users} />
                    <Route exact path='/dreams' component={Dreams} />
                    <Route exact path='/dreams/:id' component={Dreams} />
                    <Route exact path='/users/:id' component={UserDetail} />
                    <Route path='*' component={NotFound} />
                </Switch>
            </div>
        </ReactRouter>
    );
}

export default Router;
