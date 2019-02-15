import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as serviceWorker from './serviceWorker'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navigation from './components/Navigation/Navigation'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Dashboard from './components/Dashboard/Dashboard'
import { Blog } from './components/Blog/Blog'
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute'
import common from './common/Common'
import { store, persistor, history } from './store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ConnectedRouter } from 'connected-react-router'

if (localStorage.getItem('token')) {
    common.authenticateWithHeaders(localStorage.getItem('token'))
}

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
                <Router>
                    <div>
                        <Navigation />
                        <Switch>
                            <Route exact path='/' component={Login} />
                            <Route path='/register' component={Register} />
                            <PrivateRoute
                                path='/dashboard'
                                component={Dashboard}
                            />
                            <PrivateRoute path='/blog' component={Blog} />
                        </Switch>
                    </div>
                </Router>
            </ConnectedRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
