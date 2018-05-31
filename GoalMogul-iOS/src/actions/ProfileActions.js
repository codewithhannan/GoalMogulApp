import { Actions } from 'react-native-router-flux';
import { Image } from 'react-native';

import ImageUtils from '../Utils/ImageUtils';
import { updateAccount, updateProfile, updatePassword } from '../Utils/ProfileUtils';

import {
  PROFILE_OPEN_PROFILE,
  PROFILE_FETCHING_FAIL,
  PROFILE_FETCHING_SUCCESS,
  PROFILE_SUBMIT_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  PROFILE_IMAGE_UPLOAD_SUCCESS,
  PROFILE_SWITCH_TAB
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
        return dispatch({
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
    .then(() => {
      // prefetch profile image
      const imageUrl = getState().user.profile.image;
      if (imageUrl) {
        const fullImageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
        Image.prefetch(fullImageUrl);
      }
    })
    /* TODO: error handling */
    .catch((err) => console.log('err in loading user profile', err));
  };
};

export const openProfileDetail = () => {
  return (dispatch) => {
    dispatch({
      type: ''
    });
    Actions.profileDetail();
  };
};

export const openProfileDetailEditForm = () => {
  return (dispatch) => {
    dispatch({
      type: ''
    });
    Actions.profileDetailEditForm();
  };
};

export const submitUpdatingProfile = ({ values, hasImageModified }) => {
  return (dispatch, getState) => {
    const { headline, name, oldPassword, newPassword } = values;
    const { about, occupation, elevatorPitch } = values.profile;
    const imageUri = values.profile.image;

    const { token } = getState().user;

    // Start updaing process
    dispatch({
      type: PROFILE_SUBMIT_UPDATE
    });

    const updateAccountPromise = updateAccount({ name, headline, token });
    const updateProfilePromise = ImageUtils
      .upload(hasImageModified, imageUri, token, PROFILE_IMAGE_UPLOAD_SUCCESS, dispatch)
      .then(() => {
        const image = getState().profile.user.profile.image;
        return updateProfile({
          image,
          about,
          occupation,
          elevatorPitch,
          token
        });
      });

    let updatePasswordPromise = null;
    if (oldPassword && newPassword) {
      updatePasswordPromise = updatePassword({ oldPassword, newPassword, token });
    }

    Promise
      .all([updateAccountPromise, updateProfilePromise, updatePasswordPromise])
      .then((res) => {
        const [accountUpdateRes, profileUpdateRes, passwordUpdateRes] = res;
        const profile = { ...profileUpdateRes };
        const user = { ...accountUpdateRes, profile };

        dispatch({
          type: PROFILE_UPDATE_SUCCESS,
          payload: user
        });
        Actions.pop();
        console.log('Update profile succeed: ', res);
      })
      .catch((err) => {
        dispatch({
          type: PROFILE_UPDATE_FAIL,
          payload: err
        });
        console.log('error updating profile: ', err);
      });
  };
};

export const selectProfileTab = (index) => (dispatch) => {
  dispatch({
    type: PROFILE_SWITCH_TAB,
    payload: index
  });
};

/*
Handle user profile on refresh
NOTE: This is TODO for milestone 2
*/
export const handleProfileRefresh = () => {

};

// TODO: implement in milestone 2
const loadOneTab = () => {

};
