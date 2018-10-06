// Actions to create a new tribe
import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import { api as API } from '../../middleware/api';

import {
  TRIBE_NEW_SUBMIT,
  TRIBE_NEW_SUBMIT_SUCCESS,
  TRIBE_NEW_SUBMIT_FAIL,
  TRIBE_NEW_CANCEL,
  TRIBE_NEW_UPLOAD_PICTURE_SUCCESS
} from './NewTribeReducers';

 const BASE_ROUTE = 'secure/tribe';

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
 * @param name
 * @param options:
    {membersCanInvite, isPubliclyVisible, membershipLimit, description, picture}
 */
export const createNewTribe = (values) => (dispatch, getState) => {
  const { token } = getState().user;
  const newTribe = formToTribeAdapter(values);

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
      'Congrats! Your tribe is successfully created.'
    );
  };

  const onError = () => {
    dispatch({
      type: TRIBE_NEW_SUBMIT_FAIL
    });
    Alert.alert(
      'Failed to create new tribe',
      'Please try again later'
    );
  };

  // TODO: upload picture first

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
const formToTribeAdapter = (values) => {
  const {
    name,
    membersCanInvite,
    isPubliclyVisible,
    membershipLimit,
    description,
    picture
  } = values;

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
const tribeToFormAdapter = (tribe) => {

};

/**
 * User edits a tribe that belongs to self
 */
export const editTribe = (tribe) => (dispatch, getState) => {

};
