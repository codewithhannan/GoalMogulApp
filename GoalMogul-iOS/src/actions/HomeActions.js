import { Actions } from 'react-native-router-flux';

import {
  PROFILE_OPEN_PROFILE,
  PROFILE_FETCHING_SUCCESS,
  PROFILE_FETCHING_FAIL
} from './types';

export const openProfile = (userId) => {
  return (dispatch, getState) => {
    dispatch({
      type: PROFILE_OPEN_PROFILE,
      payload: userId
    });
    /*
    TODO:
      1. start loading profile and shows spinner
      2. On loading succeed, call Actions.profile();
    */
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
      }
      dispatch({
        type: PROFILE_FETCHING_SUCCESS,
        payload: res.data
      });
      Actions.profile();
    })
    /* TODO: error handling */
    .catch((err) => console.log('err in loading user profile', err));
  };
};
