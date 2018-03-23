import { combineReducers } from 'redux';

/* reducers */
import AuthReducers from './AuthReducers';
import RegReducers from './RegReducers';
import CameraRollReducers from './CameraRollReducers';

export default combineReducers({
  auth: AuthReducers,
  registration: RegReducers,
  cameraRoll: CameraRollReducers
});
