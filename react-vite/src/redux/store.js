import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";

import boardsReducer from '../actions/boards';
import boardReducer from '../actions/board';
import pinsReducer from '../actions/pins';
import pinReducer from '../actions/pin';
import sessionReducer from './session';

const rootReducer = combineReducers({
    session: sessionReducer,
    boards: boardsReducer,
    board: boardReducer,
    pins: pinsReducer,
    pin: pinReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
