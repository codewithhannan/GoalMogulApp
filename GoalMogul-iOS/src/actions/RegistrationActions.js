import { Actions } from 'react-native-router-flux';
import { CameraRoll, ImagePickerIOS } from 'react-native';
import Expo from 'expo';

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

  REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
  REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO,
  REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
  REGISTRATION_ERROR
} from './types';

import ImageUtils from '../Utils/ImageUtils';
import { uploadContacts } from '../Utils/ContactUtils';

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
  return (dispatch, getState) => {
    if (skip) {
      dispatch({
        type,
      });
      return Actions.registrationIntro();
    }
    // Obtain pre-signed url
    const imageUri = getState().registration.profilePic;
    const token = getState().user.token;

    ImageUtils.getImageSize(imageUri)
      .then(({ width, height }) => {
        // Resize image
        return ImageUtils.resizeImage(imageUri, width, height);
      })
      .then((image) => {
        // Upload image to S3 server
        console.log('image to uplaod is: ', image);
        return ImageUtils.getPresignedUrl(image.uri, token, (objectKey) => {
          dispatch({
            type: REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
            payload: objectKey
          });
        });
      })
      .then(({ signedRequest, file }) => {
        return ImageUtils.uploadImage(file, signedRequest);
      })
      .then((res) => {
        if (res instanceof Error) {
          // uploading to s3 failed
          console.log('error uploading image to s3 with res: ', res);
          throw res;
        }
        return getState().user.profile.imageObjectId;
      })
      .then((image) => {
        // Update profile imageId to the latest uploaded one
        const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/profile';
        const headers = {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image,
            token
          })
        };
        return fetch(url, headers)
          .then((res) => res.json())
          .then((res) => {
            console.log('update profile picture Id with res: ', res);
          })
          .catch((err) => {
            console.log('error updating record: ', err);
          });
      })
      .catch((err) => {
        // TODO: error handling for different kinds of errors.
        /*
        Error Type:
          image getSize
          image Resize
          image upload to S3
          update profile image Id
        */
        console.log('profile picture error: ', err);
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

  return async (dispatch, getState) => {
    const permission = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS);
    if (permission.status !== 'granted') {
    // Permission was denied and dispatch an action
      return;
    }
    const { token } = getState().user;

    // Show spinning bar
    const contacts = await Expo.Contacts.getContactsAsync({
      fields: [
        Expo.Contacts.PHONE_NUMBERS,
        Expo.Contacts.EMAILS,
        Expo.Contacts.ADDRESSES,
        Expo.Contacts.NONGREGORIANBIRTHDAY,
        Expo.Contacts.SOCIAL_PROFILES,
        Expo.Contacts.IM_ADDRESSES,
        Expo.Contacts.URLS,
        Expo.Contacts.DATES,
      ],
      pageSize: 10,
      pageOffset: 0,
    });

    console.log('contacts are: ', contacts);
    uploadContacts(contacts.data, token)
      .then((res) => res.json())
      .then((res) => {
        console.log(' response is: ', res);
        // dispatch({
        //   type,
        // });
        // Actions.registrationContactSync();
      })
      .catch((err) => {
        // TODO: error handling
        console.log('error in uploading contacts: ', err);
      });
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
