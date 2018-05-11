import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

/* reducers */
import AuthReducers from './AuthReducers';
import RegReducers from './RegReducers';
import CameraRollReducers from './CameraRollReducers';
import User from './User';
import Profile from './Profile';
import Setting from './Setting';
import { reducer as formReducer } from 'redux-form';
import NavigationReducers from './NavigationReducers';
import MeetReducers from './MeetReducers';

const rootPersistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  blacklist: ['registration', 'form']
};

const reducers = combineReducers({
  auth: AuthReducers,
  registration: RegReducers,
  cameraRoll: CameraRollReducers,
  user: User,
  profile: Profile,
  form: formReducer,
  setting: Setting,
  navigation: NavigationReducers,
  meet: MeetReducers
});

export default persistReducer(rootPersistConfig, reducers);
