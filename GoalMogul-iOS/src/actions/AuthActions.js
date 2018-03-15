import { Actions } from 'react-native-router-flux';

import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_REGISTRATION
} from './types';

export const userNameChanged = (username) => {
  return {
    type: USERNAME_CHANGED,
    payload: username
  };
};

export const passwordChanged = (password) => {
  return {
    type: PASSWORD_CHANGED,
    payload: password
  };
};

export const loginUser = ({ username, password }) => {
  // Call the endpoint to use username and password to signin
  // Obtain the credential

  // fetch(url, header).then((res) => {
  //  res.json().then((data) => {
  //     // Handle data
  //     dispatch({ type: , payload: });
  //  })
  // })
  // return (dispatch) => {
  //
  // };
};

export const registerUser = () => {
  return (dispatch) => {
    dispatch({
      type: LOGIN_REGISTRATION
    });
    Actions.registration();
  };
};
