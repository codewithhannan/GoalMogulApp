import _ from 'lodash';
import {
  LOGIN_USER_SUCCESS,
  REGISTRATION_ACCOUNT_SUCCESS,
  REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
  SETTING_EMAIL_UPDATE_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  userId: '',
  token: '',
  // Detail user info
  user: {
    profile: {
      image: undefined
    },
    email: {

    }
  },
  profile: {}
};

export const USER_LOAD_PROFILE_DONE = 'user_load_profile_done';
export const USER_LOG_OUT = 'user_log_out';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    // TODO: verify if this behavior is necessary
    case SETTING_EMAIL_UPDATE_SUCCESS:
      return { ...state, email: action.payload };

    case LOGIN_USER_SUCCESS:
    case REGISTRATION_ACCOUNT_SUCCESS: {
      const { userId, token } = action.payload;
      return { ...state, token, userId };
    }

    case REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS: {
      const profile = _.cloneDeep(state.profile);
      profile.imageObjectId = action.payload;
      return { ...state, profile };
    }

    case USER_LOAD_PROFILE_DONE: {
      const { user } = action.payload;
      let newState = _.cloneDeep(state);
      return _.set(newState, 'user', { ...user });
    }

    case USER_LOG_OUT: {
      return { ...INITIAL_STATE };
    }

    default:
      return { ...state };
  }
};
