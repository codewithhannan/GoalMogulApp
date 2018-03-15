import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER_LOADING,
  REGISTRATION_ACCOUNT
} from '../actions/types';

const INITIAL_STATE = {
  username: '',
  password: '',
  user: null,
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USERNAME_CHANGED:
      return { ...state, username: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        user: action.payload
      };
    case LOGIN_USER_FAIL:
    //TODO: alter error message
      return { ...state, error: 'auth fail', password: '', loading: false };

    case LOGIN_USER_LOADING:
      return { ...state, error: '', loading: true };

    case REGISTRATION_ACCOUNT:
      return { ...state, ...INITIAL_STATE, registration: true };
    default:
      return state;
  }
};
