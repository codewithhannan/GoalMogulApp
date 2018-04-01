import { Actions } from 'react-native-router-flux';
import { CameraRoll, ImagePickerIOS } from 'react-native';

import {
  REGISTRATION_BACK,
  REGISTRATION_LOGIN,
  REGISTRATION_ADDPROFILE,
  REGISTRATION_ACCOUNT_SUCCESS,

  REGISTRATION_CONTACT_SKIP,
  REGISTRATION_CONTACT,
  REGISTRATION_CONTACT_SYNC,
  REGISTRATION_CONTACT_SYNC_SKIP,
  REGISTRATION_CONTACT_SYNC_DONE,

  REGISTRATION_INTRO,
  REGISTRATION_INTRO_FORM_CHANGE,
  REGISTRATION_INTRO_SKIP,

  REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO,
  REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
  REGISTRATION_ERROR
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
const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(String(email).toLowerCase());
};

export const registrationNextAddProfile = (value) => {
  // TODO: verify with server if email has already existed
  // If exist, prompt user to log in
  // If there are missing fields then show red error message
  const { name, email, password } = value;

  const error = {};
  // let errorMessage = validate({ email, name, password }, contraints);
  // console.log(errorMessage);
  error.name = name === '';
  error.email = email === '' || !validateEmail(email);
  error.password = password === '';

  if (error.name || error.email || error.password) {
    return ({
      type: REGISTRATION_ERROR,
      payload: error
    });
  }
  // TODO: refactor network request as factory function
  return (dispatch) => {
    const url = 'https://goalmogul-api-dev.herokuapp.com/api/pub/user/';
    const headers = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    };

    fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        if (res.message) {
          const err = { account: res.message };
          dispatch({
            type: REGISTRATION_ERROR,
            payload: err
          });
        } else {
          dispatch({
            type: REGISTRATION_ADDPROFILE
          });
          // AuthReducers record user token
          const payload = {
            token: res.token,
            userId: res.userId
          };
          dispatch({
            type: REGISTRATION_ACCOUNT_SUCCESS,
            payload
          });
          Actions.registrationProfile();
        }
      })
      // TODO: error handling
      .catch((err) => console.log(err));
  };
};

export * from './AccountActions';

/* Profile Picture actions */

export const registrationNextIntro = (skip) => {
  const type = skip ? REGISTRATION_INTRO_SKIP : REGISTRATION_INTRO;
  return (dispatch) => {
    dispatch({
      type,
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

const uploadPhoto = (token, imageUri) => {
  const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/s3/upload/signature';
  const headers = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      headline,
      token
    })
  };
  fetch(url, headers)
}

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

export const registrationNextContact = (headline, skip) => {
  const type = skip ? REGISTRATION_CONTACT_SKIP : REGISTRATION_CONTACT;

  const error = {};
  if (headline === '' && !skip) {
    error.headline = true;
    return ({
      type: REGISTRATION_ERROR,
      payload: error
    });
  }
  return (dispatch, getState) => {
    if (skip) {
      return dispatch({
        type
      });
    }
    const token = getState().user.token;
    const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/account';
    const headers = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        headline,
        token
      })
    };
    fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        dispatch({
          type,
          payload: headline
        });
        Actions.registrationContact();
      })
      .catch((err) => {
        console.log('error is: ', err);
        error.headline = err.message;
        return ({
          type: REGISTRATION_ERROR,
          payload: error
        });
      });
  };
};

export const handleOnHeadlineChanged = (headline) => {
  return {
    type: REGISTRATION_INTRO_FORM_CHANGE,
    payload: headline
  };
};

/* Contact actions */

export const registrationNextContactSync = ({ skip }) => {
  const type = skip ? REGISTRATION_CONTACT_SYNC_SKIP : REGISTRATION_CONTACT_SYNC;

  if (skip) {
    return (dispatch) => {
      dispatch({
        type,
      });
      Actions.mainTabs();
    };
  }

  // TODO: load contacts from iphone contacts and send to server

  return (dispatch) => {
    dispatch({
      type,
    });
    Actions.registrationContactSync();
  };
};

/* Contact Sync actions */
export const registrationContactSyncDone = () => {
  // Passed in a list of contacts that user wants to add as friends

  return (dispatch) => {
    dispatch({
      type: REGISTRATION_CONTACT_SYNC_DONE
    });
    Actions.mainTabs();
  };
};
