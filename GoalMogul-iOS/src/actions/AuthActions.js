import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';
import { AppState } from 'react-native';
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
import { tutorial as Tutorial } from '../redux/modules/auth/Tutorial';
import {
  saveUnreadNotification
} from '../redux/modules/notification/NotificationActions';

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

export const loginUser = ({ username, password, navigate }) => {
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
    console.log(`${DEBUG_KEY}: current app state is: `, AppState.currentState);
    // Do not reload data when on background or inactive
    if (AppState.currentState === 'inactive' || AppState.currentState === 'background') {
      return;
    }

    const { loading } = getState().auth;

    if (loading) {
      // If user loading is already triggerred, do nothing
      // Potential place to trigger loading is at Router
      return;
    }
    dispatch({
      type: LOGIN_USER_LOADING
    });
    const message = await API
      .post('pub/user/authenticate/', { ...data }, undefined)
      .then(async (res) => {
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
          // Fetch user profile using returned token and userId
          fetchAppUserProfile(res.token, res.userId)(dispatch, getState);
          refreshFeed()(dispatch, getState);
          refreshGoals()(dispatch, getState);
          const hasTutorialShown = await Tutorial.getTutorialShown(res.userId); 

          // If navigate is set to false, it means user has already opened up the home page
          // We only need to reload the profile and feed data
          if (navigate === false) {
            return;
          }

          // User has watched the tutorial
          if (hasTutorialShown) {
            Actions.replace('drawer'); // Go to the main route and replace the auth stack
            return;
          }
          // Show tutorial
          Actions.tutorial();
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
export const fetchAppUserProfile = (token, userId) => (dispatch, getState) => {
  let tokenToUse = token;
  let userIdToUse = userId;
  if (!token) {
    tokenToUse = getState().user.token;
  }

  if (!userId) {
    userIdToUse = getState().user.userId;
  }

  API
    .get(`secure/user/profile?userId=${userIdToUse}`, tokenToUse)
    .then((res) => {
      if (res.data) {
        dispatch({
          type: USER_LOAD_PROFILE_DONE,
          payload: {
            user: res.data,
            pageId: 'LOGIN'
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
  Actions.registrationAccount();
};

export const logout = () => async (dispatch, getState) => {
  // Store the unread notification first as USER_LOG_OUT will clear its state
  await saveUnreadNotification()(dispatch, getState);

  const callback = (res) => {
    if (res instanceof Error) {
      console.log(`${DEBUG_KEY}: log out user error: `, res);
    } else {
      console.log(`${DEBUG_KEY}: log out user with res: `, res);
    }
  };
  Auth.reset(callback); 
  Actions.reset('root');
  dispatch({
    type: USER_LOG_OUT
  });
};
