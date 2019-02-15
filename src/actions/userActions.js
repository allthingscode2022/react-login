import {
  LOGIN_USER,
  LOGIN_USER_ERROR,
  REGISTER_USER,
  REGISTER_USER_ERROR,
  LOG_USER_OUT,
  FETCH_USER,
  FETCH_USER_ERROR
} from "./Types";
import axios from "axios";
import common from "../common/Common";
import jwt from "jsonwebtoken";

/**
 * Method for dispatching an action when authenticating a user
 * @param {string} email
 * @param {string} password
 */
export function authenticateUser(email, password) {
  return function(dispatch) {
    return axios
      .post(`/user/login`, {
        email: email,
        password: password
      })
      .then(response => {
        const { token } = response.data;
        localStorage.setItem("token", token);
        common.authenticateWithHeaders(token);
        let decode = jwt.decode(token);
        localStorage.setItem("id", decode.id);
        dispatch({
          type: LOGIN_USER,
          payload: response.data
        });
      })
      .catch(error => {
        const errorResponse = error.response.data;
        dispatch({
          type: LOGIN_USER_ERROR,
          payload: errorResponse
        });
      });
  };
}

// method for loggin out a user
export function logUserOut() {
  return function(dispatch) {
    localStorage.removeItem("token");
    common.authenticateWithHeaders(false);
    return dispatch({
      type: LOG_USER_OUT
    });
  };
}

/**
 * Method for regitering a user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 */
export function registerUser(name, email, password) {
  return function(dispatch) {
    return axios
      .post(`/user/add`, {
        name,
        email,
        password
      })
      .then(response => {
        const serverResponse = response.data;
        dispatch({
          type: REGISTER_USER,
          payload: serverResponse
        });
      })
      .catch(error => {
        const errorResponse = error.response.data;
        dispatch({
          type: REGISTER_USER_ERROR,
          payload: errorResponse
        });
      });
  };
}

/**
 * Method for fecthing a specific user
 * @param {string} id
 */
export function fetchUser(id) {
  return function(dispatch) {
    return axios
      .get(`/user/get/${id}`)
      .then(response => {
        const serverResponse = response.data;
        dispatch({
          type: FETCH_USER,
          payload: serverResponse
        });
      })
      .catch(error => {
        dispatch({
          type: FETCH_USER_ERROR,
          payload: error.response
        });
      });
  };
}
