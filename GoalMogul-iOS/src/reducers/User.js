import {
  LOGIN_USER_SUCCESS,
  REGISTRATION_ACCOUNT_SUCCESS,
  REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  userId: '',
  token: '',
  profile: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case LOGIN_USER_SUCCESS:
    case REGISTRATION_ACCOUNT_SUCCESS: {
      const { userId, token } = action.payload;
      return { ...state, token, userId };
    }

    case REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS: {
      const profile = { ...state.profile };
      profile.imageObjectId = action.payload;
      return { ...state, profile };
    }

    default:
      return state;
  }
};
