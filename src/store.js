// implementing redux
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import localStorage from "redux-persist/lib/storage";
import rootReducer from "./reducers";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";

// storing browser history to be passed as an argument to the rootReducer
export const history = createBrowserHistory();

// Object with options to be passed as argument to persistReducer method
const persistConfig = {
  key: "root",
  storage: localStorage
};

// method for persisting state in store
const persistedReducer = persistReducer(persistConfig, rootReducer(history));

// storing middleware that we are going to use inside the store into an array
const middleware = [thunk, routerMiddleware(history)];

// creating the store and exporting it
export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

// persisting store and exporting it
export const persistor = persistStore(store);
