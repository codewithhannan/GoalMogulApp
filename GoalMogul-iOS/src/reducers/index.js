import { combineReducers } from 'redux';

/* reducers */
import AuthReducers from './AuthReducers';

export default combineReducers({
  auth: AuthReducers
});
