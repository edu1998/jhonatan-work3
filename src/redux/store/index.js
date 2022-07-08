import { createBrowserHistory } from "history";
import { createStore, compose, applyMiddleware } from "redux";
import { routerMiddleware } from "connected-react-router";
import rootReducers from "./reducers";
import thunkMiddleware from 'redux-thunk';
// persist
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const history = createBrowserHistory();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['route','Session', 'Partner']
}

const middleware = [
  thunkMiddleware,
  routerMiddleware(history),
].filter(Boolean);

/* const enhancers = [applyMiddleware(...middleware)]; */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = persistCombineReducers(persistConfig, rootReducers(history));

export default () => {
  let store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middleware))
  )
  let persistor = persistStore(store, composeEnhancers(applyMiddleware(...middleware)), () => {
      console.log('Test', store.getState());
  })
  return { store, persistor }
}