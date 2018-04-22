import { combineReducers } from 'redux';

/* reducers */
import AuthReducers from './AuthReducers';
import RegReducers from './RegReducers';
import CameraRollReducers from './CameraRollReducers';
import User from './User';
import Profile from './Profile';
import Setting from './Setting';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
  auth: AuthReducers,
  registration: RegReducers,
  cameraRoll: CameraRollReducers,
  user: User,
  profile: Profile,
  form: formReducer,
  setting: Setting
});
