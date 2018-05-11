import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';

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
  return async (dispatch) => {
    const url = 'https://goalmogul-api-dev.herokuapp.com/api/pub/user/authenticate/';
    // const url = 'http://192.168.0.3:8081/api/pub/user/authenticate/';
    const headers = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: username,
        password
      })
    };
    dispatch({
      type: LOGIN_USER_LOADING
    });

    const message = await fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        console.log('login with message: ', res);
        // User Login Successfully
        if (res.token) {
          const payload = {
            token: res.token,
            userId: res.userId
          };
          dispatch({
            type: LOGIN_USER_SUCCESS,
            payload
          });
          Actions.mainTabs();
        } else {
          // User login fail
          return res.message;
        }
      })
      .catch((err) => {
        console.log('error in login, ', err);
      });

    if (message) {
      throw new SubmissionError({
        _error: message
      });
    }
  };
};

export const registerUser = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_ACCOUNT
    });
    Actions.registration();
  };
};
