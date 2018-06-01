import { Actions } from 'react-native-router-flux';
import { Image } from 'react-native';

import ImageUtils from '../Utils/ImageUtils';
import { updateAccount, updateProfile, updatePassword } from '../Utils/ProfileUtils';
import { api as API } from '../redux/middleware/api';

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

import {
  PROFILE_FETCH_MUTUAL_FRIEND_DONE
} from '../reducers/Profile';

const DEBUG_KEY = '[ Action Profile ]';

const prefetchImage = (imageUrl) => {
  if (imageUrl) {
    const fullImageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
    Image.prefetch(fullImageUrl);
  }
};

const fetchMutualFriendSucceed = (res, dispatch) => {
  console.log(`${DEBUG_KEY} fetchMutualFriendSucceed with res: `, res);
  dispatch({
    type: PROFILE_FETCH_MUTUAL_FRIEND_DONE,
    payload: res.data
  });
};

const fetchProfileSucceed = (res, dispatch) => {
  console.log(`${DEBUG_KEY} fetch profile succeed`);
  dispatch({
    type: PROFILE_FETCHING_SUCCESS,
    payload: res.data
  });
};

const fetchProfileFail = (res, dispatch) => {
  console.log(`${DEBUG_KEY} fetch profile succeed`);
  dispatch({
    type: PROFILE_FETCHING_FAIL,
    payload: res.message
  });
};

export const openProfile = (userId) => (dispatch, getState) => {
  dispatch({
    type: PROFILE_OPEN_PROFILE,
    payload: userId
  });
  Actions.profile();

  const { token } = getState().user;

  const profilePromise =
    API.get(`secure/user/profile?userId=${userId}`, token);
  const mutualFriendsPromise =
    API.get(`secure/user/friendship/mutual-friends?userId=${userId}`, token);

  Promise
    .all([profilePromise, mutualFriendsPromise])
    .then((res) => {
      const [profileRes, friendsRes] = res;

      if (profileRes.message) {
        /* TODO: error handling */
        return fetchProfileFail(profileRes, dispatch);
      }

      // Dispatch actions
      fetchMutualFriendSucceed(friendsRes, dispatch);
      fetchProfileSucceed(profileRes, dispatch);
      // Prefetch profile image
      prefetchImage(profileRes.profile.image);
    })
    .catch((err) => {
      console.log('err in loading user profile', err);
      dispatch({
        type: PROFILE_FETCHING_FAIL,
        payload: `Error loading user profile: ${err}`
      });
      // TODO: show toaster saying loading fail
    });
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
