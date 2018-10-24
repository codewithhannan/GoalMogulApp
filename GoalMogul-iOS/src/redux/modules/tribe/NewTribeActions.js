// Actions to create a new tribe
import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import { api as API } from '../../middleware/api';
import ImageUtils from '../../../Utils/ImageUtils';

import {
  TRIBE_NEW_SUBMIT,
  TRIBE_NEW_SUBMIT_SUCCESS,
  TRIBE_NEW_SUBMIT_FAIL,
  TRIBE_NEW_CANCEL,
  TRIBE_NEW_UPLOAD_PICTURE_SUCCESS
} from './NewTribeReducers';

const BASE_ROUTE = 'secure/tribe';
const DEBUG_KEY = '[ Action Create Tribe ]';

// Open creating tribe modal
export const openNewTribeModal = () => (dispatch) => {
  Actions.push('createTribeStack');
};

export const cancelCreatingNewTribe = () => (dispatch) => {
  Actions.pop();
  dispatch({
    type: TRIBE_NEW_CANCEL
  });
};

/**
 * @param values: new tribe values
 * @param needUpload: if there is media to be uploaded
 * @param isEdit: if edit, then use put rather than post
 *
 * Following are the params for the values submitted to the server
 * @param name
 * @param options:
    {membersCanInvite, isPubliclyVisible, membershipLimit, description, picture}
 */
export const createNewTribe = (values, needUpload, isEdit, tribeId) => (dispatch, getState) => {
  const { token } = getState().user;
  const newTribe = formToTribeAdapter(values, tribeId, isEdit);

  dispatch({
    type: TRIBE_NEW_SUBMIT
  });

  const onSuccess = (data) => {
    dispatch({
      type: TRIBE_NEW_SUBMIT_SUCCESS,
      payload: data
    });
    Actions.pop();
    Alert.alert(
      'Success',
      `Congrats! Your tribe is successfully ${isEdit ? 'updated' : 'created'}.`
    );
  };

  const onError = () => {
    dispatch({
      type: TRIBE_NEW_SUBMIT_FAIL
    });
    Alert.alert(
      `Failed to ${isEdit ? 'update' : 'create'} new Tribe`,
      'Please try again later'
    );
  };

  const imageUri = newTribe.options.picture;
  if (!needUpload) {
    // If no mediaRef then directly submit the post
    sendCreateTribeRequest(newTribe, token, isEdit, dispatch, onSuccess, onError);
  } else {
    ImageUtils.getImageSize(imageUri)
      .then(({ width, height }) => {
        // Resize image
        console.log('width, height are: ', width, height);
        return ImageUtils.resizeImage(imageUri, width, height);
      })
      .then((image) => {
        // Upload image to S3 server
        console.log('image to upload is: ', image);
        return ImageUtils.getPresignedUrl(image.uri, token, (objectKey) => {
          // Obtain pre-signed url and store in getState().postDetail.newPost.mediaRef
          dispatch({
            type: TRIBE_NEW_UPLOAD_PICTURE_SUCCESS,
            payload: objectKey
          });
        }, 'PageImage');
      })
      .then(({ signedRequest, file }) => {
        return ImageUtils.uploadImage(file, signedRequest);
      })
      .then((res) => {
        if (res instanceof Error) {
          // uploading to s3 failed
          console.log(`${DEBUG_KEY}: error uploading image to s3 with res: `, res);
          throw res;
        }
        return getState().newEvent.picture;
      })
      .then((image) => {
        // Use the presignedUrl as media string
        console.log(`${BASE_ROUTE}: presigned url sent is: `, image);
        const newTribeObject = isEdit
          ?
          {
            ...newTribe,
            details: { ...newTribe.details, picture: image }
          }
          :
          {
            ...newTribe,
            options: { ...newTribe.options, picture: image }
          };
        return sendCreateTribeRequest(
          newTribeObject,
          token,
          isEdit,
          dispatch,
          onSuccess,
          onError
        );
      })
      .catch((err) => {
        /*
        Error Type:
          image getSize
          image Resize
          image upload to S3
          update profile image Id
        */
        onError(err);
      });
  }
};

const sendCreateTribeRequest = (newTribe, token, isEdit, dispatch, onSuccess, onError) => {
  if (isEdit) {
    API
      .put(`${BASE_ROUTE}`, { ...newTribe }, token)
      .then((res) => {
        if (res.data) {
          return onSuccess(res.data);
        }
        onError(res.message);
      })
      .catch((err) => {
        onError(err);
      });
    return;
  }
  API
    .post(`${BASE_ROUTE}`, { ...newTribe }, token)
    .then((res) => {
      if (res.data) {
        return onSuccess(res.data);
      }
      onError(res.message);
    })
    .catch((err) => {
      onError(err);
    });
};

// Tranform form values to a tribe object
const formToTribeAdapter = (values, tribeId, isEdit) => {
  const {
    name,
    membersCanInvite,
    isPubliclyVisible,
    membershipLimit,
    description,
    picture
  } = values;

  if (isEdit) {
    return {
      tribeId,
      details: {
        membersCanInvite,
        isPubliclyVisible,
        membershipLimit,
        description,
        picture
      }
    };
  }

  return {
    name,
    options: {
      membersCanInvite,
      isPubliclyVisible,
      membershipLimit,
      description,
      picture
    }
  };
};

// Transform tribe object to form values
export const tribeToFormAdapter = (tribe) => {
  const {
    name,
    membersCanInvite,
    isPubliclyVisible,
    membershipLimit,
    description,
    picture
  } = tribe;

  return {
    name,
    membersCanInvite,
    isPubliclyVisible,
    membershipLimit: `${membershipLimit}`,
    description,
    picture
  };
};

/**
 * User edits a tribe that belongs to self
 */
export const editTribe = (tribe) => (dispatch, getState) => {

};