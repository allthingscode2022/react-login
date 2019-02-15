import React from "react";
import PropTypes from "prop-types";
// using our stateless component for building inputs
import { Input } from "../../common/Input/Input";
// using our label stateless component for building our labels
import { Label } from "../../common/Label/Label";
// connect this component to the redux store
import { connect } from "react-redux";
// importing authenticateUser action for dispatching it on the component
import { authenticateUser } from "../../actions/userActions";
// using our alert message component for displaying messages
import { AlertMessage } from "../../common/Alert/AlertMessage";
// using our common js object for using properties methods
import common from "../../common/Common";

// stateful component representing login page
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      formErrors: {
        email: "",
        password: ""
      },
      isAuthenticated: "",
      message: "",
      fetching: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleGoogleClick = this.handleGoogleClick.bind(this);
  }

  // lifecylce method typically used to make requests and setState
  componentDidMount() {
    const isLoggedIn = common.isLoggedIn();
    if (isLoggedIn) {
      this.props.history.push("/dashboard");
    }
  }

  // everytime props change run this lifecycle method
  componentDidUpdate(prevProps) {
    if (prevProps.login !== this.props.login) {
      const { success, message } = this.props.login.login;
      if (success) {
        this.setState(
          {
            email: "",
            password: "",
            isAuthenticated: success,
            message: message,
            fetching: false
          },
          () => {
            setTimeout(() => {
              this.setState({
                isAuthenticated: "",
                message: ""
              });
              this.props.history.push("/dashboard");
            }, 2000);
          }
        );
      } else {
        this.setState(
          {
            isAuthenticated: success,
            message: message,
            fetching: false
          },
          () => {
            setTimeout(() => {
              this.setState({
                isAuthenticated: "",
                message: ""
              });
            }, 1500);
          }
        );
      }
    }
  }

  // on a specific input change please verify and update form errors and state input value
  handleInputChange(e) {
    const { name, value } = e.target;
    const formErrors = this.state.formErrors;
    let regex = "";
    switch (name) {
      case "email":
        regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/gi;
        formErrors.email =
          value.length && !regex.test(value)
            ? "email must have following format example: john@example.com"
            : "";
        break;
      case "password":
        regex = /.{6,}/gi;
        formErrors.password =
          value.length && !regex.test(value)
            ? "password must have at least 6 characters short"
            : "";
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value });
  }

  // this method verifies that the form has no errors
  validateForm(formErrors) {
    let valid = true;
    Object.values(formErrors).forEach(v => {
      valid = v.length ? true : false;
    });
    return valid;
  }

  // redirects to google auth authentication
  handleGoogleClick() {
    window.location = "http://localhost:2000/user/google";
  }

  // this method submits the form input values to the redux action method fetchUser
  handleFormSubmit(e) {
    e.preventDefault();
    this.props.authenticateUser(this.state.email, this.state.password);
    this.setState({
      fetching: true
    });
  }

  render() {
    // boolean that returns from our reducer
    const isAuthenticated = this.state.isAuthenticated;
    // message that returns from our reducer
    const message = this.state.message;
    // extract values from the current state
    const { formErrors, email, password } = this.state;
    // seek if email and password are not empty
    const noEmtpyInputsPlease = !email.length || !password.length;
    // get boolean from validateForm
    const formValidation = this.validateForm(formErrors);
    const successMessage = isAuthenticated && message && (
      <AlertMessage className='alert alert-success' message={message} />
    );

    const errorMessage = !isAuthenticated && message && (
      <AlertMessage className='alert alert-danger' message={message} />
    );
    return (
      <div className='container my-5'>
        {successMessage || errorMessage}
        <button className='btn btn-danger' onClick={this.handleGoogleClick}>
          Google+
        </button>
        <form onSubmit={this.handleFormSubmit}>
          <div className='form-group'>
            <Label message='email' />
            <Input
              type='email'
              className='form-control'
              name='email'
              value={this.state.email}
              onChange={this.handleInputChange}
              placeholder='email ..'
            />
            {formErrors.email && (
              <div className='invalid-feedback' style={{ display: "block" }}>
                {formErrors.email}
              </div>
            )}
          </div>
          <div className='form-group'>
            <Label message='password' />
            <Input
              type='password'
              className='form-control'
              name='password'
              value={this.state.password}
              onChange={this.handleInputChange}
              placeholder='password ..'
            />
            {formErrors.password && (
              <div className='invalid-feedback' style={{ display: "block" }}>
                {formErrors.password}
              </div>
            )}
          </div>
          <Input
            type='submit'
            className='btn btn-primary'
            value={this.state.fetching ? "Authenticating..." : "Login"}
            disabled={noEmtpyInputsPlease || formValidation ? true : false}
          />
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  authenticateUser: PropTypes.func.isRequired,
  login: PropTypes.object.isRequired
};
// method for seleccting the part of data from the store that this component needs
const mapStateToProps = state => ({
  login: state.authentication
});

// exporting and connecting our props, action, component
export default connect(
  mapStateToProps,
  { authenticateUser }
)(Login);
