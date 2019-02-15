import React from 'react'
import { Route, Redirect } from 'react-router-dom'

// stateless component for protecting authenticated routes
export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            localStorage.getItem('token') ? (
                <Component {...props} />
            ) : (
                <Redirect to='/' />
            )
        }
    />
)
