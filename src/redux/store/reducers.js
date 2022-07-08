import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Session from '../session/reducer'
import Partner from '../partner/reducer'
import Analytic from '../analytic/'

const createRootReducer = (history) =>
  {
    const routerObject= {router: connectRouter(history)};
    return {routerObject, Session, Partner, Analytic }
  };

export default createRootReducer;