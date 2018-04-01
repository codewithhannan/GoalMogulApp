import {
  LOGIN_USER_SUCCESS,
  REGISTRATION_ACCOUNT_SUCCESS
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

    default:
      return state;
  }
};
