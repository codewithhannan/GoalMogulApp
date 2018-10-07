/**
 * @param title
 * @param start
 * @param durationHours
 * @param options: {
 *  participantsCanInvite,
 *  isInviteOnly,
 *  participantLimit,
 *  location,
 *  description,
 *  picture
 *  }
 */
 // Actions to create a new event
import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import moment from 'moment';
import { api as API } from '../../middleware/api';
import ImageUtils from '../../../Utils/ImageUtils';

import {
  EVENT_NEW_SUBMIT,
  EVENT_NEW_SUBMIT_SUCCESS,
  EVENT_NEW_SUBMIT_FAIL,
  EVENT_NEW_CANCEL,
  EVENT_NEW_UPLOAD_PICTURE_SUCCESS,
} from './NewEventReducers';

const BASE_ROUTE = 'secure/event';
const DEBUG_KEY = '[ Action New Event ]';

// Open creating event modal
export const openNewEventModal = () => (dispatch) => {
  Actions.push('createEventStack');
};

export const cancelCreatingNewEvent = () => (dispatch) => {
  Actions.pop();
  dispatch({
    type: EVENT_NEW_CANCEL
  });
};

/**
 * @param title
 * @param start
 * @param durationHours
 * @param options:
  {participantsCanInvite, isInviteOnly, participantLimit, location, description, picture}
 */
export const createNewEvent = (values) => (dispatch, getState) => {
  const { token } = getState().user;
  const newEvent = formToEventAdapter(values);
  console.log('hours is: ', newEvent);

  dispatch({
    type: EVENT_NEW_SUBMIT
  });

  const onSuccess = (data) => {
    dispatch({
      type: EVENT_NEW_SUBMIT_SUCCESS,
      payload: data
    });
    Actions.pop();
    Alert.alert(
      'Success',
      'Congrats! Your event is successfully created.'
    );
  };

  const onError = (err) => {
    dispatch({
      type: EVENT_NEW_SUBMIT_FAIL
    });
    Alert.alert(
      'Failed to create new Event',
      'Please try again later'
    );
    console.log('Error submitting new Event with err: ', err);
  };

  const imageUri = newEvent.options.picture;
  if (!imageUri) {
    // If no mediaRef then directly submit the post
    sendCreateEventRequest(newEvent, token, dispatch, onSuccess, onError);
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
            type: EVENT_NEW_UPLOAD_PICTURE_SUCCESS,
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
        return sendCreateEventRequest(
          { ...newEvent, options: { ...newEvent.options, picture: image } },
          token,
          dispatch,
          onSuccess,
          onError
        );
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
        onError(err);
      });
  }
};

const sendCreateEventRequest = (newEvent, token, dispatch, onSuccess, onError) => {
  API
    .post(`${BASE_ROUTE}`, { ...newEvent }, token)
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

// Tranform form values to a event object
/**
 * @param title
 * @param start
 * @param durationHours
 * @param options:
  {participantsCanInvite, isInviteOnly, participantLimit, location, description, picture}
 */
const formToEventAdapter = (values) => {
  const {
    title,
    startTime,
    endTime,
    participantsCanInvite,
    isInviteOnly,
    participantLimit,
    location,
    description,
    picture
  } = values;

  const startMoment = moment(startTime.date);
  const endMoment = moment(endTime.date);
  const duration = moment.duration(endMoment.diff(startMoment));

  return {
    title,
    start: startTime.date,
    durationHours: duration.asHours(),
    options: {
      participantsCanInvite,
      isInviteOnly,
      participantLimit,
      location,
      description,
      picture
    }
  };
};

// Transform event object to form values
const eventToFormAdapter = (event) => {

};

/**
 * User edits a event that belongs to self
 */
export const editEvent = (event) => (dispatch, getState) => {

};
