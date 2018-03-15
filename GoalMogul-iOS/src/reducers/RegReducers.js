import { Actions } from 'react-native-router-flux';

import {
  REGISTRATION_LOGIN,
  REGISTRATION_ADDPROFILE,
  REGISTRATION_INTRO,
  REGISTRATION_CONTACT,
  REGISTRATION_CONTACT_SYNC
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
  headline: '',
  contacts: [],
  profilePic: {},
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case REGISTRATION_LOGIN:
      return { ...state, ...INITIAL_STATE };

    case REGISTRATION_ADDPROFILE:
      return { ...state };

    case REGISTRATION_INTRO:
      return { ...state };

    case REGISTRATION_CONTACT:
      return { ...state };

    case REGISTRATION_CONTACT_SYNC:
      return { ...state };

    default:
      return state;
  }
};
