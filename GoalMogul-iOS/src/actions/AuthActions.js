import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';
import { Alert } from 'react-native';
import { api as API } from '../redux/middleware/api';

import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  REGISTRATION_ACCOUNT,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER_LOADING
} from './types';

import {
  USER_LOAD_PROFILE_DONE,
  USER_LOG_OUT
} from '../reducers/User';

import { auth as Auth } from '../redux/modules/auth/Auth';

import {
  refreshFeed,
} from '../redux/modules/home/feed/actions';

import {
  refreshGoals
} from '../redux/modules/home/mastermind/actions';

const DEBUG_KEY = '[ Action Auth ]';
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

const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(String(email).toLowerCase());
};

export const loginUser = ({ username, password }) => {
  // Call the endpoint to use username and password to signin
  // Obtain the credential

  const data = validateEmail(username) ?
  {
    email: username,
    password
  } :
  {
    phone: username,
    password
  };

  return async (dispatch, getState) => {
    dispatch({
      type: LOGIN_USER_LOADING
    });
    const message = await API
      .post('pub/user/authenticate/', { ...data }, undefined)
      .then((res) => {
        // console.log('login with message: ', res);
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
          Auth.saveKey(username, password);
          fetchUserProfile(res.token, res.userId, dispatch);
          refreshFeed()(dispatch, getState);
          refreshGoals()(dispatch, getState);
          Actions.mainTabs();
        } else {
          // User login fail
          return res.message;
        }
      })
      .catch((err) => err.message || 'Please try again later');

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

// We have the same action in Profile.js
const fetchUserProfile = (token, userId, dispatch) => {
  API
    .get(`secure/user/profile?userId=${userId}`, token)
    .then((res) => {
      if (res.data) {
        dispatch({
          type: USER_LOAD_PROFILE_DONE,
          payload: {
            user: res.data
          }
        });
      }
    })
    .catch((err) => {
      console.log('[ Auth Action ] fetch user profile fails: ', err);
    });
};

export const registerUser = () => (dispatch) => {
  dispatch({
    type: REGISTRATION_ACCOUNT
  });
  Actions.registration();
};

export const logout = () => (dispatch) => {
  dispatch({
    type: USER_LOG_OUT
  });
  const callback = (res) => {
    if (res instanceof Error) {
      console.log(`${DEBUG_KEY}: log out user error: `, res);
    } else {
      console.log(`${DEBUG_KEY}: log out user with res: `, res);
    }
  };
  Auth.reset(callback);
  Actions.popTo('splash');
};
