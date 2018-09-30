import { Actions } from 'react-native-router-flux';
import { reset } from 'redux-form';
import { Alert } from 'react-native';

import {
  SHARE_NEW_SHARE_TO,
  SHARE_NEW_SELECT_DEST,
  SHARE_NEW_CANCEL,
  SHARE_NEW_POST_SUCCESS,
  SHARE_NEW_POST,
  SHARE_NEW_POST_FAIL
} from './NewShareReducers';

import {
  switchCaseF
} from '../../../middleware/utils';

import { api as API } from '../../../middleware/api';

const DEBUG_KEY = '[ Action Share ]';

const switchPostType = (postType, ref, goalRef) => switchCaseF({
  General: {
    postType,
    postRef: ref
  },
  ShareUser: {
    postType,
    userRef: ref
  },
  SharePost: {
    postType,
    postRef: ref
  },
  ShareGoal: {
    postType,
    goalRef: ref
  },
  ShareNeed: {
    postType,
    needRef: ref,
    goalRef
  }
})('General')(postType);

const switchShareToAction = (dest) => switchCaseF({
  // Open modal directly if share to feed
  feed: () => {
    console.log('feed also pushes');
    Actions.push('shareModal');
  },
  // Open search overlay if share to either tribe or event
  tribe: () => Actions.searchTribeLightBox(),
  event: () => Actions.push('searchEventLightBox')
})('feed')(dest);

// User chooses a share destination
export const chooseShareDest = (postType, ref, dest, itemToShare, goalRef) =>
(dispatch, getState) => {
  const { userId } = getState().user;

  dispatch({
    type: SHARE_NEW_SHARE_TO,
    payload: {
      ...switchPostType(postType, ref, goalRef),
      shareTo: dest,
      owner: userId,
      itemToShare
    }
  });

  switchShareToAction(dest);
};

// Cancel a share
export const cancelShare = () => (dispatch) => {
  Actions.pop();
  dispatch(reset('shareModal'));
  dispatch({
    type: SHARE_NEW_CANCEL
  });
};

// User submit the share modal form
export const submitShare = (values) => (dispatch, getState) => {
  dispatch({
    type: SHARE_NEW_POST
  });

  const { token } = getState().user;
  const newShare = newShareAdaptor(getState().newShare, values);

  console.log(`${DEBUG_KEY}: new share to create is: `, newShare);

  API
    .post(
      'secure/feed/post',
      {
        post: JSON.stringify({ ...newShare })
      },
      token
    )
    .then((res) => {
      if (!res.message && res.data) {
        dispatch({
          type: SHARE_NEW_POST_SUCCESS,
          payload: res.data
        });
        Actions.pop();
        return dispatch(reset('shareModal'));
      }
      console.warn(`${DEBUG_KEY}: creating share failed with message: `, res);
      dispatch({
        type: SHARE_NEW_POST_FAIL
      });
    })
    .catch((err) => {
      Alert.alert(
        'Creating share failed',
        'Please try again later'
      );
      dispatch({
        type: SHARE_NEW_POST_FAIL
      });
      console.warn(`${DEBUG_KEY}: creating share failed with exception: `, err);
    });
};

const newShareAdaptor = (newShare, formVales) => {
  const {
    owner,
    postType,
    userRef,
    postRef,
    goalRef,
    needRef,
    belongsToTribe,
    belongsToEvent
  } = newShare;

  const {
    privacy, // needs to uncapitalize the first character and map Private to self
    content
  } = formVales;

  const transformedPrivacy = privacy === 'Private' ? 'self' : privacy.toLowerCase();

  return {
    owner,
    postType,
    userRef,
    postRef,
    goalRef,
    needRef,
    belongsToTribe,
    belongsToEvent,
    content,
    privacy: transformedPrivacy
  };
};

export const selectEvent = (event) => (dispatch) => {
  dispatch({
    type: SHARE_NEW_SELECT_DEST,
    payload: {
      type: 'belongsToEvent',
      value: event
    }
  });

  // Open share modal
  Actions.pop();
  Actions.shareModal();
};

export const selectTribe = (tribe) => (dispatch) => {
  dispatch({
    type: SHARE_NEW_SELECT_DEST,
    payload: {
      type: 'belongsToTribe',
      value: tribe
    }
  });

  // Open share modal
  Actions.pop();
  Actions.shareModal();
};
