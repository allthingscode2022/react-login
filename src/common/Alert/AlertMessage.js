import React from 'react'
import PropTypes from 'prop-types'

// stateless component for handling flash messages
export const AlertMessage = (props) => {
    return (
        <div className={props.className} role='alert'>
            {props.message}
        </div>
    )
}

AlertMessage.propTypes = {
    className: PropTypes.string,
    role: PropTypes.string,
    message: PropTypes.string
}
