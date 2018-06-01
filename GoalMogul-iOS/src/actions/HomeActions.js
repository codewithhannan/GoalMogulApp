import { Actions } from 'react-native-router-flux';
import { Image } from 'react-native';

import {
  PROFILE_FETCHING_SUCCESS,
  PROFILE_FETCHING_FAIL,
  HOME_SWITCH_TAB
} from './types';

// Fetching profile
export const fetchProfile = (userId, callback) => {
  return (dispatch, getState) => {
    const token = getState().user.token;
    const url = `https://goalmogul-api-dev.herokuapp.com/api/secure/user/profile?userId=${userId}`;
    const headers = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    };
    fetch(url, headers)
    .then((res) => res.json())
    .then((res) => {
      /* If message, it means error */
      if (res.message) {
        /* TODO: error handling */
        console.log('error fetching user profile: ', res);
        dispatch({
          type: PROFILE_FETCHING_FAIL,
          payload: res.message
        });
        return;
      }
      dispatch({
        type: PROFILE_FETCHING_SUCCESS,
        payload: res.data
      });
      if (callback) {
        callback();
        return;
      }
    })
    /* TODO: error handling */
    .catch((err) => console.log('err in loading user profile', err));
  };
};

// Tab switch between ActivityFeed and Mastermind
export const homeSwitchTab = (index) => {
  return (dispatch) => {
    dispatch({
      type: HOME_SWITCH_TAB,
      payload: index
    });
  };
};
