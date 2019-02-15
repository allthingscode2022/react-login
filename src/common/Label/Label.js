import React from 'react'
import PropTypes from 'prop-types'

// stateless component for handling labels for inputs
export const Label = (props) => {
    return (
        <React.Fragment>
            <label>{props.name}</label>
        </React.Fragment>
    )
}

Label.propTypes = {
    name: PropTypes.string
}
