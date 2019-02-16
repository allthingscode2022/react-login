import React from 'react'
import PropTypes from 'prop-types';
// using our stateless component for building inputs
import { Input } from '../../common/Input/Input'
// using our label stateless component for building our labels
import { Label } from '../../common/Label/Label'
// using our stateles component for building alert messages
import { AlertMessage } from '../../common/Alert/AlertMessage'
// connecting react with redux so they can communicate
import { connect } from 'react-redux'
// using our registerUser method for dispatching action
import { registerUser } from '../../actions/userActions'
// using our common js object for accessing properties and methods
import common from '../../common/Common'

// sateful component that represents our register page
class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
            formErrors: {
                name: '',
                email: '',
                password: ''
            },
            success: '',
            message: '',
            fetching: false
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    // lifecylce component, if user is logged in dont show this page
    componentDidMount() {
        const isLoggedIn = common.isLoggedIn()
        if (isLoggedIn) {
            this.props.history.push('/dashboard')
        }
    }

    // lifecycle method when our props change for this component
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            const { register: { success, message } } = this.props.register
            if (success) {
                this.setState(
                    {
                        success,
                        message,
                        fetching: false
                    },
                    () => {
                        setTimeout(() => {
                            this.setState({
                                success: '',
                                message: ''
                            })
                            this.props.history.push('/')
                        }, 1500)
                    }
                )
            } else {
                this.setState(
                    {
                        success,
                        message,
                        fetching: false
                    },
                    () => {
                        setTimeout(() => {
                            this.setState({
                                success: '',
                                message: ''
                            })
                        }, 1500)
                    }
                )
            }
        }
    }

    // on a specific input change please verify and update form errors and state input value
    handleInputChange(e) {
        const { name, value } = e.target
        const formErrors = this.state.formErrors
        let regex = ''
        switch (name) {
            case 'name':
                formErrors.name = value.length < 5 ? 'minimum 5 characters' : ''
                break
            case 'email':
                regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/gi
                formErrors.email =
                    value.length && !regex.test(value)
                        ? 'email must have following format example: john@example.com'
                        : ''
                break
            case 'password':
                regex = /.{6,}/gi
                formErrors.password =
                    value.length && !regex.test(value)
                        ? 'password must have at least 6 characters short'
                        : ''
                break
            default:
                break
        }
        this.setState({ formErrors, [name]: value })
    }

    // this method verifies that the form has no errors
    validateForm(formErrors) {
        let valid = true
        Object.values(formErrors).forEach((v) => {
            valid = v.length ? true : false
        })
        return valid
    }

    // this method submits the form input values to the redux action method fetchUser
    handleFormSubmit(e) {
        e.preventDefault()
        this.props.registerUser(
            this.state.name,
            this.state.email,
            this.state.password
        )
        this.setState({
            name: '',
            email: '',
            password: '',
            fetching: true
        })
    }

    render() {
        // boolean that returns from the reducer
        const success = this.state.success
        // message that returns from the reducer
        const message = this.state.message
        // extract values from the current state
        const { formErrors, name, email, password } = this.state
        // seek if email and password are not empty
        const noEmtpyInputsPlease =
            !name.length || !email.length || !password.length
        // boolean that returns from verifying form validation
        const formValidation = this.validateForm(formErrors)
        // on register success show alert success message
        const successMessage = success && message && (
            <AlertMessage className='alert alert-success' message={message} />
        )
        // on regiser failure show alert error message
        const errorMessage = !success && message && (
            <AlertMessage className='alert alert-danger' message={message} />
        )
        return (
            <div className='container my-5'>
                {successMessage || errorMessage}
                <form
                    onSubmit={this.handleFormSubmit}
                    className='needs-validation'
                    noValidate
                >
                    <div className='form-group'>
                        <Label name='name' />
                        <Input
                            type='text'
                            className='form-control'
                            name='name'
                            onChange={this.handleInputChange}
                            value={this.state.name}
                            placeholder='name ..'
                        />
                        {formErrors.name && (
                            <div
                                className='invalid-feedback'
                                style={{ display: 'block' }}
                            >
                                {formErrors.name}
                            </div>
                        )}
                    </div>
                    <div className='form-group'>
                        <Label name='email' />
                        <Input
                            type='email'
                            className='form-control'
                            name='email'
                            onChange={this.handleInputChange}
                            value={this.state.email}
                            placeholder='email ..'
                        />
                        {formErrors.email && (
                            <div
                                className='invalid-feedback'
                                style={{ display: 'block' }}
                            >
                                {formErrors.email}
                            </div>
                        )}
                    </div>
                    <div className='form-group'>
                        <Label name='password' />
                        <Input
                            type='password'
                            className='form-control'
                            name='password'
                            onChange={this.handleInputChange}
                            value={this.state.password}
                            placeholder='password ..'
                        />
                        {formErrors.password && (
                            <div
                                className='invalid-feedback'
                                style={{ display: 'block' }}
                            >
                                {formErrors.password}
                            </div>
                        )}
                    </div>
                    <Input
                        type='submit'
                        className='btn btn-primary'
                        value={
                            this.state.fetching ? 'Registering...' : 'Register'
                        }
                        disabled={
                            noEmtpyInputsPlease || formValidation ? true : false
                        }
                    />
                </form>
            </div>
        )
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    register: PropTypes.object.isRequired
}
// method for seleccting the part of data from the store that this component needs
const mapStateToProps = (state) => {
    return {
        register: state.authentication
    }
}

// exporting and connecting our props, action, component
export default connect(
    mapStateToProps,
    { registerUser }
)(Register)
