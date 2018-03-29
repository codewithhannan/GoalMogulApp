import { Actions } from 'react-native-router-flux';

import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  REGISTRATION_ACCOUNT,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER_LOADING
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
  console.log('loging user');
  return (dispatch) => {
    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: null
    });
    Actions.mainTabs();
  }
  
};

export const registerUser = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_ACCOUNT
    });
    Actions.registration();
  };
};
