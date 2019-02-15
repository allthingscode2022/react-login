import React from "react";
import PropTypes from "prop-types";
// connect helps react communicate with redux and viceversa
import { connect } from "react-redux";
// using fetchUser for dispatching it as an action
import { fetchUser } from "../../actions/userActions";

// stateful component for representing our dashboard
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      redirect: false
    };
  }

  // on mount dispatch action to get the users info
  componentDidMount() {
    this.props.fetchUser(localStorage.getItem("id"));
  }

  // on props update set the state
  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      const {
        user: { success, user }
      } = this.props.user;
      if (success) {
        this.setState({
          name: user.name,
          email: user.email
        });
      } else {
        this.setState({
          redirect: !this.state.redirect
        });
      }
    }
  }

  render() {
    // users name from state
    const name = this.state.name;
    // user email from state
    const email = this.state.email;
    return (
      <div className='container my-5'>
        <header>
          <h2>Dashboard Page</h2>
        </header>
        <p className='lead'>
          welcome to your dashboard <strong>{name}</strong>
        </p>
        <ul className='list-group my-5'>
          <li className='list-group-item'>
            <strong>name: </strong>
            {name}
          </li>
          <li className='list-group-item'>
            <strong>email: </strong>
            {email}
          </li>
        </ul>
      </div>
    );
  }
}

Dashboard.propTypes = {
  fetchUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};
// method for seleccting the part of data from the store that this component needs
const mapStateToProps = state => {
  return {
    user: state.authentication
  };
};

// exporting and connecting our props, action, component
export default connect(
  mapStateToProps,
  { fetchUser }
)(Dashboard);
