import { Actions } from 'react-native-router-flux';

import {
  REGISTRATION_LOGIN,
  REGISTRATION_ADDPROFILE,
  REGISTRATION_INTRO,
  REGISTRATION_CONTACT,
  REGISTRATION_CONTACT_SYNC,
  REGISTRATION_INTRO_FORM_CHANGE
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

  // TODO: verify with server if email has already existed
  // If exist, prompt user to log in
  // If there are missing fields then show red error message
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_ADDPROFILE
    });
    Actions.registrationProfile();
  };
};

export * from './AccountActions';

/* Profile Picture actions */

export const registrationNextIntro = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_INTRO,
    });
    Actions.registrationIntro();
  };
};

export const handleOnHeadlineChanged = (headline) => {
  return {
    type: REGISTRATION_INTRO_FORM_CHANGE,
    payload: headline
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
