// using our types for action types on reducers
import {
  LOGIN_USER,
  LOGIN_USER_ERROR,
  REGISTER_USER,
  REGISTER_USER_ERROR,
  LOG_USER_OUT,
  FETCH_USER,
  FETCH_USER_ERROR
} from "../actions/Types";

// our initial state
const initialState = {
  isAuthenticated: false,
  login: {},
  register: {},
  user: {}
};

// reducer method that handles user login and user logout
export function authenticateReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isAuthenticated: true,
        login: {
          success: action.payload.success,
          message: action.payload.message
        }
      };
    case LOGIN_USER_ERROR:
      return { ...state, isAuthenticated: false, login: action.payload };
    case LOG_USER_OUT:
      return { ...state, isAuthenticated: false, login: {} };
    case REGISTER_USER:
      return {
        ...state,
        register: {
          success: action.payload.success,
          message: action.payload.message
        }
      };
    case REGISTER_USER_ERROR:
      return {
        ...state,
        register: action.payload
      };
    case FETCH_USER:
      return { ...state, user: action.payload };
    case FETCH_USER_ERROR:
      return {
        ...state,
        user: {
          success: false,
          message:
            "Your account info was not fetched. Log Out and Log back in please"
        }
      };
    default:
      return state;
  }
}
