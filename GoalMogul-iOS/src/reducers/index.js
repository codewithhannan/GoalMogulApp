import { combineReducers } from 'redux';

/* reducers */
import AuthReducers from './AuthReducers';
import RegReducers from './RegReducers';
import CameraRollReducers from './CameraRollReducers';
import User from './User';

export default combineReducers({
  auth: AuthReducers,
  registration: RegReducers,
  cameraRoll: CameraRollReducers,
  user: User
});
