import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logUserOut } from "../../actions/userActions";

// stateful component for our main navigation
class Navigation extends React.Component {
  // method for dispatching logUserOut action
  logUserOut() {
    this.props.logUserOut();
  }

  render() {
    // if user authenticated true show or hide links
    const { isAuthenticated } = this.props.auth;
    // show or hide links if isAuthenticated true or false
    const authenticatedLinks = isAuthenticated && (
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item'>
          <Link className='nav-link' to='/dashboard'>
            Dashboard
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/blog'>
            Blog
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            className='nav-link'
            onClick={this.logUserOut.bind(this)}
            to='/'
          >
            Logout
          </Link>
        </li>
      </ul>
    );
    const guestLinks = !isAuthenticated && (
      <ul className='navbar-nav mr-auto'>
        <li className='nav-item active'>
          <Link className='nav-link' to='/'>
            Login <span className='sr-only'>(current)</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/register'>
            Register
          </Link>
        </li>
      </ul>
    );
    return (
      <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
        <Link className='navbar-brand' to='/'>
          Ecommerce
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarColor01'
          aria-controls='navbarColor01'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon' />
        </button>

        <div className='collapse navbar-collapse' id='navbarColor01'>
          {authenticatedLinks}
          {guestLinks}
        </div>
      </nav>
    );
  }
}

// defining component proptyes
Navigation.propTypes = {
  auth: PropTypes.object.isRequired,
  logUserOut: PropTypes.func.isRequired
};

// method for seleccting the part of data from the store that this component needs
const mapPropsToState = state => {
  return {
    auth: state.authentication
  };
};

// exporting and connecting our props, action, component
export default connect(
  mapPropsToState,
  { logUserOut }
)(Navigation);
