import { Actions } from 'react-native-router-flux';

import {
  REGISTRATION_ACCOUNT,
  REGISTRATION_LOGIN,
  REGISTRATION_ADDPROFILE,
  REGISTRATION_INTRO,
  REGISTRATION_CONTACT,
  REGISTRATION_CONTACT_SYNC,

  REGISTRATION_ACCOUNT_FORM_CHANGE,
  REGISTRATION_INTRO_FORM_CHANGE
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
  headline: '',
  contacts: [],
  profilePic: {},
  step: '',
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case REGISTRATION_LOGIN:
      return { ...state, ...INITIAL_STATE };

    case REGISTRATION_ACCOUNT:
      return { ...state, step: REGISTRATION_ACCOUNT };

    case REGISTRATION_ACCOUNT_FORM_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value };

    case REGISTRATION_INTRO_FORM_CHANGE:
      return { ...state, headline: action.payload };

    case REGISTRATION_ADDPROFILE:
      return { ...state, step: REGISTRATION_ADDPROFILE };

    case REGISTRATION_INTRO:
      return { ...state, step: REGISTRATION_INTRO };

    case REGISTRATION_CONTACT:
      return { ...state, step: REGISTRATION_CONTACT };

    case REGISTRATION_CONTACT_SYNC:
      return { ...state, step: REGISTRATION_CONTACT_SYNC };

    default:
      return state;
  }
};
