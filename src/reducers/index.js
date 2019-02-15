// method that will help use combine reducers
import { combineReducers } from "redux";
// a redux binding for react router
import { connectRouter } from "connected-react-router";
//  importing our reducers to be exported
import { authenticateReducer } from "./userReducer";

// exporting our reducers
export default history =>
  combineReducers({
    router: connectRouter(history),
    authentication: authenticateReducer
  });
