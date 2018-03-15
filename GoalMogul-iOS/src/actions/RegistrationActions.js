import { Actions } from 'react-native-router-flux';

import {
  REGISTRATION_LOGIN,
  REGISTRATION_ADDPROFILE,
  REGISTRATION_INTRO,
  REGISTRATION_CONTACT,
  REGISTRATION_CONTACT_SYNC
} from './types';

export const registrationLogin = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_LOGIN
    });
    Actions.pop();
  };
};

/* Account actions */

export const registrationNextAddProfile = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_ADDPROFILE
    });
    Actions.registrationProfile();
  };
};

/* Profile Picture actions */

export const registrationNextIntro = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_INTRO,
    });
    Actions.registrationIntro();
  };
};

/* IntroForm actions */

export const registrationNextContact = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_CONTACT,
    });
    Actions.registrationContact();
  };
};

/* Contact actions */

export const registrationNextContactSync = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_CONTACT_SYNC,
    });
    Actions.registrationContactSync();
  };
};

/* Contact Sync actions */
