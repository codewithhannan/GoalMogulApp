import { combineReducers } from 'redux';

/* reducers */
import AuthReducers from './AuthReducers';
import RegReducers from './RegReducers';

export default combineReducers({
  auth: AuthReducers,
  registration: RegReducers
});
