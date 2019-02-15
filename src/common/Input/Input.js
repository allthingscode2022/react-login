import React from 'react'
import PropTypes from 'prop-types'

// stateless component for handling inputs
export const Input = (props) => {
    return (
        <React.Fragment>
            <input
                type={props.type}
                value={props.value}
                name={props.name}
                onChange={props.onChange}
                className={props.className}
                placeholder={props.placeholder}
                disabled={props.disabled}
            />
        </React.Fragment>
    )
}

Input.propTypes = {
    type: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool
}
