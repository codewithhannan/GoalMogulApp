import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';
import { api as API } from '../redux/middleware/api';

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
    dispatch({
      type: LOGIN_USER_LOADING
    });
    const message = await API
      .post('pub/user/authenticate/', {
        email: username,
        password
      }, undefined)
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
      dispatch({
        type: LOGIN_USER_FAIL,
      });
      throw new SubmissionError({
        _error: message
      });
    }
  };
};

export const registerUser = () => (dispatch) => {
  dispatch({
    type: REGISTRATION_ACCOUNT
  });
  Actions.registration();
};
