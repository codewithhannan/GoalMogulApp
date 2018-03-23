import { Actions } from 'react-native-router-flux';
import { CameraRoll, ImagePickerIOS } from 'react-native';

import {
  REGISTRATION_BACK,
  REGISTRATION_LOGIN,
  REGISTRATION_ADDPROFILE,
  REGISTRATION_INTRO,
  REGISTRATION_CONTACT,
  REGISTRATION_CONTACT_SYNC,
  REGISTRATION_INTRO_FORM_CHANGE,
  REGISTRATION_ADDPROFILE_CAMERAROLL_OPEN,
  REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO,
  REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
} from './types';

export const registrationLogin = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_LOGIN
    });
    Actions.pop();
  };
};

export const registrationBack = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_BACK
    });
    Actions.pop();
  };
};

/* Account actions */

export const registrationNextAddProfile = () => {
  // TODO: verify with server if email has already existed
  // If exist, prompt user to log in
  // If there are missing fields then show red error message
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_ADDPROFILE
    });
    Actions.registrationProfile();
  };
};

export * from './AccountActions';

/* Profile Picture actions */

export const registrationNextIntro = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_INTRO,
    });
    Actions.registrationIntro();
  };
};

// Action to open camera roll modal
export const registrationCameraRollOnOpen = () => {
  return (dispatch) => {
    ImagePickerIOS.canUseCamera(() => {
      ImagePickerIOS.openSelectDialog({}, imageUri => {
        dispatch({
          type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
          payload: imageUri
        });
      }, () => {
        console.log('user cancel choosing from camera roll');
      });
    });

    /* Customized Image picker for IOS. Could use for Android */
    // dispatch({
    //   type: REGISTRATION_ADDPROFILE_CAMERAROLL_OPEN
    // });
    // console.log('Open photo library modal');
    // // Open photo library modal
    // Actions.photolib();
    // CameraRoll.getPhotos({
    //   first: 20,
    //   assetType: 'All'
    // })
    // .then((r) => {
    //   console.log('loading photos with r: ', r);
    //   dispatch({
    //     type: REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO,
    //     payload: r.edges
    //   });
    // });
  };
};

// TODO: deprecate this action
export const registrationCameraRollLoadPhoto = () => {
  return (dispatch) => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All'
    })
    .then((r) => {
      console.log('loading photos with r: ', r);
      dispatch({
        type: REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO,
        payload: r.edges
      });
    });
  };
};

// TODO: deprecate this action
export const registrationCameraRollOnImageChoosen = (uri) => {
  return (dispatch) => {
    Actions.pop();
    dispatch({
      type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
      payload: uri
    });
  };
};

// Open Camera / Video
export const registrationCameraOnOpen = () => {
  return (dispatch) => {
    ImagePickerIOS.canRecordVideos(() => {
      ImagePickerIOS.openCameraDialog({}, imageUri => {
        dispatch({
          type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
          payload: imageUri
        });
      }, () => {
        console.log('user cancel taking pictures');
      });
    });
  };
};

/* IntroForm actions */

export const registrationNextContact = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_CONTACT,
    });
    Actions.registrationContact();
  };
};

export const handleOnHeadlineChanged = (headline) => {
  return {
    type: REGISTRATION_INTRO_FORM_CHANGE,
    payload: headline
  };
};

/* Contact actions */

export const registrationNextContactSync = () => {
  return (dispatch) => {
    dispatch({
      type: REGISTRATION_CONTACT_SYNC,
    });
    Actions.registrationContactSync();
  };
};

/* Contact Sync actions */
