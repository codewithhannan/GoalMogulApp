import { Actions } from 'react-native-router-flux';
import { CameraRoll, ImagePickerIOS } from 'react-native';
import Expo from 'expo';
import { SubmissionError } from 'redux-form';
import { api as API } from '../redux/middleware/api';

import {
  REGISTRATION_BACK,
  REGISTRATION_LOGIN,
  REGISTRATION_ADDPROFILE,
  REGISTRATION_ACCOUNT_LOADING,
  REGISTRATION_ACCOUNT_SUCCESS,

  REGISTRATION_CONTACT_SKIP,
  REGISTRATION_CONTACT,
  REGISTRATION_CONTACT_SYNC,
  REGISTRATION_CONTACT_SYNC_SKIP,
  REGISTRATION_CONTACT_SYNC_DONE,
  REGISTRATION_CONTACT_SYNC_UPLOAD_DONE,
  REGISTRATION_CONTACT_SYNC_FETCH,
  REGISTRATION_CONTACT_SYNC_FETCH_DONE,
  REGISTRATION_CONTACT_SYNC_REFRESH,
  REGISTRATION_CONTACT_SYNC_REFRESH_DONE,

  REGISTRATION_INTRO,
  REGISTRATION_INTRO_FORM_CHANGE,
  REGISTRATION_INTRO_SKIP,

  REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
  REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO,
  REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
  REGISTRATION_ERROR
} from './types';

import ImageUtils from '../Utils/ImageUtils';
import { handleUploadContacts, fetchMatchedContacts } from '../Utils/ContactUtils';

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

  const data = validateEmail(email) ?
  {
    name, email, password
  } :
  {
    name, phone: email, password
  };

  // TODO: refactor network request as factory function
  return async (dispatch) => {
    dispatch({
      type: REGISTRATION_ACCOUNT_LOADING
    });

    const message = await API
      .post('pub/user/', { ...data }, undefined)
      .then((res) => {
        if (res.message) {
          return res.message;
        }
        dispatch({
          type: REGISTRATION_ADDPROFILE
        });
        // AuthReducers record user token
        const payload = {
          token: res.token,
          userId: res.userId,
          name
        };
        dispatch({
          type: REGISTRATION_ACCOUNT_SUCCESS,
          payload
        });
        Actions.registrationProfile();
      })
      // TODO: error handling
      .catch((err) => console.log(err));


    // const url = 'https://goalmogul-api-dev.herokuapp.com/api/pub/user/';
    // const headers = {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     name,
    //     email,
    //     password
    //   })
    // };
    //
    // const message = await fetch(url, headers)
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res.message) {
    //       return res.message;
    //     }
    //     dispatch({
    //       type: REGISTRATION_ADDPROFILE
    //     });
    //     // AuthReducers record user token
    //     const payload = {
    //       token: res.token,
    //       userId: res.userId
    //     };
    //     dispatch({
    //       type: REGISTRATION_ACCOUNT_SUCCESS,
    //       payload
    //     });
    //     Actions.registrationProfile();
    //   })
    //   // TODO: error handling
    //   .catch((err) => console.log(err));

    if (message) {
      dispatch({
        type: REGISTRATION_ERROR,
        error: message
      });
      throw new SubmissionError({
        _error: message
      });
    }
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

    if (imageUri) {
      ImageUtils.getImageSize(imageUri)
        .then(({ width, height }) => {
          // Resize image
          console.log('width, height are: ', width, height);
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
          return API.put('secure/user/profile', {
            image
          }, token)
          .then((res) => {
            console.log('update profile picture Id with res: ', res);
          })
          .catch((err) => {
            console.log('error updating record: ', err);
          });

          // const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/profile';
          // const headers = {
          //   method: 'PUT',
          //   headers: {
          //     Accept: 'application/json',
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify({
          //     image,
          //     token
          //   })
          // };
          // return fetch(url, headers)
          //   .then((res) => res.json())
          //   .then((res) => {
          //     console.log('update profile picture Id with res: ', res);
          //   })
          //   .catch((err) => {
          //     console.log('error updating record: ', err);
          //   });
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
    }
    Actions.registrationIntro();
  };
};

// Actions to Open Camera to take photos
export const openCamera = (callback) => async (dispatch) => {
  const { Permissions } = Expo;
  const permissions = [Permissions.CAMERA, Permissions.CAMERA_ROLL];

  const permissionGranted = await ImageUtils.checkPermission(permissions);
  if (!permissionGranted) {
    return;
  }

  const result = await Expo.ImagePicker.launchCameraAsync({
      mediaTypes: 'Images',
    })
    .catch(error => console.log(permissions, { error }));

  if (!result.cancelled) {
    if (callback) {
      return callback(result);
    }
    return dispatch({
      type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
      payload: result.uri
    });
  }

  console.log('user took image fail with result: ', result);
};

// Action to open camera roll modal
export const openCameraRoll = (callback) => async (dispatch) => {
  const { Permissions } = Expo;
  const permissions = [Permissions.CAMERA, Permissions.CAMERA_ROLL];

  const permissionGranted = await ImageUtils.checkPermission(permissions);
  if (!permissionGranted) {
    return;
  }

  const result = await Expo.ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
  });

  if (!result.cancelled) {
    if (callback) {
      return callback(result);
    }
    return dispatch({
      type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
      payload: result.uri
    });
  }

  console.log('user choosing from camera roll fail with result: ', result);
  // Method 2:
  // ImagePickerIOS.canUseCamera(() => {
  //   ImagePickerIOS.openSelectDialog({}, imageUri => {
  //     dispatch({
  //       type: REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
  //       payload: imageUri
  //     });
  //   }, () => {
  //     console.log('user cancel choosing from camera roll');
  //   });
  // });

  // Method 3:
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
      // User skip intro input
      dispatch({
        type
      });
      return Actions.registrationContact();
    }
    const token = getState().user.token;

    API
      .put('secure/user/account', { headline }, token)
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

    // const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/account';
    // const headers = {
    //   method: 'PUT',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     headline,
    //     token
    //   })
    // };
    // fetch(url, headers)
    //   .then((res) => res.json())
    //   .then((res) => {
    //     dispatch({
    //       type,
    //       payload: headline
    //     });
    //     Actions.registrationContact();
    //   })
    //   .catch((err) => {
    //     console.log('error is: ', err);
    //     error.headline = err.message;
    //     return ({
    //       type: REGISTRATION_ERROR,
    //       payload: error
    //     });
    //   });
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
    // Skip and limit for fetching matched contacts
    const { matchedContacts } = getState().registration;

    // Show spinning bar
    dispatch({
      type
    });

    handleUploadContacts(token)
      .then((res) => {
        console.log(' response is: ', res);
        // Uploading contacts done. Hide spinner
        dispatch({
          type: REGISTRATION_CONTACT_SYNC_UPLOAD_DONE
        });

        Actions.registrationContactSync();

        // Fetching matched records. Show spinner
        dispatch({
          type: REGISTRATION_CONTACT_SYNC_FETCH
        });

        /* TODO: load matched contacts */
        return fetchMatchedContacts(token, 0, matchedContacts.limit);
      })
      .then((res) => {
        console.log('matched contacts are: ', res);
        if (res.data) {
          // User finish fetching
          return dispatch({
            type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
            payload: {
              data: res.data, // TODO: replaced with res
              skip: matchedContacts.skip + matchedContacts.limit,
              limit: matchedContacts.limit
            }
          });
        }
        // TODO: error handling for fail to fetch contact cards
        // TODO: show toast for user to refresh
        dispatch({
          type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
          payload: {
            data: [], // TODO: replaced with res
            skip: matchedContacts.skip,
            limit: matchedContacts.limit
          }
        });
      })
      .catch((err) => {
        console.warn('[ Action ContactSync Fail ]: ', err);
      });
  };
};

// Load more matched contacts for contact sync
export const contactSyncLoadMore = () => (dispatch, getState) => {
  dispatch({
    type: REGISTRATION_CONTACT_SYNC_FETCH
  });

  const { token } = getState().user;
  // Skip and limit for fetching matched contacts
  const { skip, limit, hasNextPage } = getState().registration.matchedContacts;

  if (hasNextPage === undefined || hasNextPage) {
    fetchMatchedContacts(token, skip, limit).then((res) => {
      if (res.data) {
        dispatch({
          type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
          payload: {
            data: res.data, // TODO: replaced with res
            skip: skip + limit,
            limit,
            hasNextPage: res.data.length !== 0
          }
        });
      }
    })
    .catch((err) => {
      console.warn('[ Action ContactSync Loadmore Fail ]: ', err);
    });
  }
};

// Refresh contact sync cards
export const contactSyncRefresh = () => (dispatch, getState) => {
  // REGISTRATION_CONTACT_SYNC_REFRESH
  // REGISTRATION_CONTACT_SYNC_REFRESH_DONE
  dispatch({
    type: REGISTRATION_CONTACT_SYNC_REFRESH
  });

  const { token } = getState().user;
  // Skip and limit for fetching matched contacts
  const { limit } = getState().registration.matchedContacts;

  fetchMatchedContacts(token, 0, limit).then((res) => {
    console.log('[ Action ContactSync ]: Refresh with res: ', res);
    if (res.data) {
      dispatch({
        type: REGISTRATION_CONTACT_SYNC_REFRESH_DONE,
        payload: {
          data: res.data, // TODO: replaced with res
          skip: limit,
        }
      });
    }
    // TODO: error handling for failing to fetch data
  })
  .catch((err) => {
    console.warn('[ Action ContactSync Refresh Fail ]: ', err);
  });
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
