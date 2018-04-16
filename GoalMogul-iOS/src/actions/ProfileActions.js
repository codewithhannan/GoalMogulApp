import { Actions } from 'react-native-router-flux';
import { ImagePickerIOS } from 'react-native';

import ImageUtils from '../Utils/ImageUtils';
import { updateAccount, updateProfile } from '../Utils/ProfileUtils';

import {
  PROFILE_SUBMIT_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  PROFILE_IMAGE_UPLOAD_SUCCESS
} from './types';

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
    const { headline, name, email, password } = values;
    const { about, occupation, elevatorPitch } = values.profile;
    const imageUri = values.profile.image;

    const { token } = getState().user;

    // Start updaing process
    dispatch({
      type: PROFILE_SUBMIT_UPDATE
    });

    const updateAccountPromise = updateAccount({ name, email, password, headline, token });
    const updateProfilePromis = ImageUtils
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

    Promise
      .all([updateAccountPromise, updateProfilePromis])
      .then((res) => {
        const [accountUpdateRes, profileUpdateRes] = res;
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
