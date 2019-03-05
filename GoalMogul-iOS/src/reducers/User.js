import _ from 'lodash';
import {
  REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
  REGISTRATION_ACCOUNT_SUCCESS,
  PROFILE_FETCHING_SUCCESS,
  PROFILE_UPDATE_SUCCESS,
  LOGIN_USER_SUCCESS,
  SETTING_EMAIL_UPDATE_SUCCESS,
  ACCOUNT_UPDATE_PASSWORD_DONE,
  ACCOUNT_UPDATE_PASSWORD
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
  profile: {},
  updatingPassword: false
};

export const USER_LOAD_PROFILE_DONE = 'user_load_profile_done';
export const USER_LOG_OUT = 'user_log_out';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROFILE_UPDATE_SUCCESS:
    case PROFILE_FETCHING_SUCCESS: {
      const newState = _.cloneDeep(state);
      const { user } = action.payload;
      if (user._id !== _.get(newState, 'userId')) {
        return newState;
      }

      return _.set(newState, 'user', user);
    } 

    // TODO: verify if this behavior is necessary
    case SETTING_EMAIL_UPDATE_SUCCESS:
      return { ...state, email: action.payload.email };

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

    case ACCOUNT_UPDATE_PASSWORD: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'updatingPassword', true);
    }

    case ACCOUNT_UPDATE_PASSWORD_DONE: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'updatingPassword', false);
    }

    default:
      return { ...state };
  }
};
