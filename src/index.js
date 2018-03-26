import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import configureStore from './store/configureStore';
import App from './container/App';
import Login from './container/Auth/Login';
import Register from './container/Auth/Register';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/" component={App} />
                <Redirect to="/login" />
            </Switch>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root')
);
registerServiceWorker();
