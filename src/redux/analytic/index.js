import dashboard from './dashboard/reducer';
import matrix from './matrix/reducer';
import { combineReducers } from 'redux';

export default combineReducers({
  dashboard,
  matrix,
});
