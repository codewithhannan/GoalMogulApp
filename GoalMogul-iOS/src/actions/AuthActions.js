import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';
import { AppState, Image } from 'react-native';
import { api as API } from '../redux/middleware/api';
import * as Sentry from '@sentry/react-native';

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
import { openProfile } from '../actions';
import {
  saveUnreadNotification,
  loadUnreadNotification
} from '../redux/modules/notification/NotificationActions';

import {
  saveTutorialState,
  loadTutorialState
} from '../redux/modules/User/TutorialActions';

import {
  refreshFeed,
} from '../redux/modules/home/feed/actions';

import {
  refreshGoals
} from '../redux/modules/home/mastermind/actions';

import {
  IMAGE_BASE_URL
} from '../Utils/Constants';

// Components
import { DropDownHolder } from '../Main/Common/Modal/DropDownModal';

import LiveChatService from '../socketio/services/LiveChatService';
import MessageStorageService from '../services/chat/MessageStorageService';
import { MemberDocumentFetcher } from '../Utils/UserUtils';
import { Logger } from '../redux/middleware/utils/Logger';
import { saveRemoteMatches, loadRemoteMatches } from './MeetActions';
import { setUser, captureException, SentryRequestBuilder } from '../monitoring/sentry';
import { identify, resetUser } from '../monitoring/segment';
import { SENTRY_TAGS, SENTRY_MESSAGE_LEVEL } from '../monitoring/sentry/Constants';

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

export const loginUser = ({ username, password, navigate, onError, onSuccess }) => {
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

          // Invoke onSuccess callback to clear login page state
          if (onSuccess) {
            onSuccess();
          }

          // Sentry track user
          setUser(res.userId, username);

          // Segment track user
          identify(res.userId, username);

          // set up chat listeners
          LiveChatService.mountUser({
            userId: res.userId,
            authToken: res.token,
          });
          MessageStorageService.mountUser({
            userId: res.userId,
            authToken: res.token,
          });

          // Fetch user profile using returned token and userId
          fetchAppUserProfile(res.token, res.userId)(dispatch, getState);
          refreshFeed()(dispatch, getState);
          refreshGoals()(dispatch, getState);
          const hasTutorialShown = await Tutorial.getTutorialShown(res.userId); 
          
          // Load unread notification
          await loadUnreadNotification()(dispatch, getState);
          // loadUnreadNotification()(dispatch, getState);

          // Load tutorial state
          await loadTutorialState(res.userId)(dispatch, getState);
          // loadTutorialState(res.userId)(dispatch, getState);

          // Load remote matches
          await loadRemoteMatches(res.userId)(dispatch, getState);
          // loadRemoteMatches(res.userId)(dispatch, getState);

          // If navigate is set to false, it means user has already opened up the home page
          // We only need to reload the profile and feed data
          if (navigate === false) {
            return;
          }

          Actions.replace('drawer');
          // Starting version 0.4.2, we replace this with step by step tutorial
          // User has watched the tutorial
          // if (hasTutorialShown) {
          //   Actions.replace('drawer'); // Go to the main route and replace the auth stack
          //   return;
          // }
          // Show tutorial
          // Actions.replace('tutorial');
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

      if (onError) {
        onError(message);
      }
      
      // Record failure message in Sentry
      new SentryRequestBuilder(message).withLevel(SENTRY_MESSAGE_LEVEL.INFO).withTag(SENTRY_TAGS.ACTION.LOGIN_IN, 'failed').send();
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
  // Reset user on logout
  resetUser();
  // Store the unread notification first as USER_LOG_OUT will clear its state
  await saveUnreadNotification()(dispatch, getState);
  await saveTutorialState()(dispatch, getState);
  await saveRemoteMatches()(dispatch, getState);

  const callback = (res) => {
    if (res instanceof Error) {
      console.log(`${DEBUG_KEY}: log out user error: `, res);
    } else {
      console.log(`${DEBUG_KEY}: log out user with res: `, res);
    }
  };
  Auth.reset(callback); 
  Actions.reset('root');
  // clear chat service details
  LiveChatService.unMountUser();
  MessageStorageService.unMountUser();
  // clear caches
  MemberDocumentFetcher.clearMemberCache();

  dispatch({
    type: USER_LOG_OUT
  });
};

const TOAST_IMAGE_STYLE = {
  height: 36, 
  width: 36, 
  borderRadius: 4
};
const TOAST_IMAGE_CONTAINER_STYLE = {
  borderWidth: 0.5,
  padding: 0.5,
  borderColor: 'lightgray',
  alignItems: 'center',
  borderRadius: 5,
  alignSelf: 'center',
  backgroundColor: 'transparent'
};
const NEWLY_CREATED_KEY = 'newly_created_key';
const makeTitleWithName = (name) => `You\'ve accepted ${name}\'s invite!`;
const makeMessage = () => 'Tap here to visit their profile and help them with their goals.';
export const checkIfNewlyCreated = () => async (dispatch, getState) => {
  const { token, userId } = getState().user;
  // Check if we already show toast
  const hasShownToast = await Auth.getByKey(`${userId}_${NEWLY_CREATED_KEY}`);
  if (hasShownToast) {
    Logger.log(`${DEBUG_KEY}: user shown toast state:`, hasShownToast, 2);
    return; // comment out to test
  }

  // Check if user is newly invited
  const onSuccess = async (res) => {
    Logger.log(`${DEBUG_KEY}: [ checkIfNewlyCreated ] res is:`, res, 2);
    const { isNewlyInvited, inviter } = res;
    // Show toast
    if (!isNewlyInvited) {
      Logger.log(`${DEBUG_KEY}: [ checkIfNewlyCreated ] user is no longer newly invited`, null, 2);
      return; // comment out to test
    }
    
    if (!inviter) {
      console.warn(`${DEBUG_KEY}: [ checkIfNewlyCreated ] invalid inviter:`, inviter);
      return; // comment out to test
    } 
    
    const { profile, name, _id } = inviter;
    if (profile && profile.image) {
      const urlToSet = `${IMAGE_BASE_URL}${profile.image}`;
      const onCloseFunc = () => {
        console.log(`${DEBUG_KEY}: I am here`);
        openProfile(_id)(dispatch, getState)
      };
      Image.prefetch(urlToSet);
      // Set image, image style and image container style
      DropDownHolder.setDropDownImage(urlToSet);
      DropDownHolder.setDropDownImageStyle(TOAST_IMAGE_STYLE);
      DropDownHolder.setDropDownImageContainerStyle(TOAST_IMAGE_CONTAINER_STYLE);
      DropDownHolder.setOnClose(onCloseFunc);
    }
    
    // Wait for image to preload
    console.log(`${DEBUG_KEY}: [ checkIfNewlyCreated ]: scheduled showing alert`);

    setTimeout(() => {
      console.log(`${DEBUG_KEY}: [ checkIfNewlyCreated ]: showing alert`);
      DropDownHolder.alert('custom', makeTitleWithName(name), makeMessage());
    }, 1000);
    
    // Save the response
    await Auth.saveByKey(`${userId}_${NEWLY_CREATED_KEY}`, 'true');
  };

  const onError = (res) => {
    console.warn(`${DEBUG_KEY}: endpoint fetch user/account/is-newly-invited failed with err:`, res);
    return;
  };

  API
    .get('secure/user/account/is-newly-invited', token)
    .then((res) => {
      if (res.status === 200) {
        onSuccess(res);
        return;
      }
      onError(res);
    })
    .catch((err) => {
      onError(err)
    });
};
