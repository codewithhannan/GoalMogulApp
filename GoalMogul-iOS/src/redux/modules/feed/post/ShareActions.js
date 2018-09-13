import { Actions } from 'react-native-router-flux';
import { reset } from 'redux-form';

import {
  SHARE_NEW_SHARE_TO,
  SHARE_NEW_SELECT_DEST,
  SHARE_NEW_CANCEL,
  SHARE_NEW_POST_SUCCESS
} from './NewShareReducers';

import {
  switchCaseF
} from '../../../middleware/utils';

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
}, 'General', postType);

const switchShareToAction = (dest) => switchCaseF({
  // Open modal directly if share to feed
  feed: () => Actions.push('shareModal'),
  // Open search overlay if share to either tribe or event
  tribe: () => Actions.push('searchTribeLightBox'),
  event: () => Actions.push('searchEventLightBox')
}, 'feed', dest);

// User chooses a share destination
export const chooseShareDest = (postType, ref, dest, goalRef) => (dispatch, getState) => {
  const { userId } = getState().user;

  dispatch({
    type: SHARE_NEW_SHARE_TO,
    payload: {
      ...switchPostType(postType, ref, goalRef),
      shareTo: dest,
      owner: userId
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
export const submitShare = () => (dispatch, getState) => {


  // If succeed, close modal and reset form
  // Actions.pop(); dispatch(reset('shareModal'))
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
  Actions.push('shareModal');
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
  Actions.push('shareModal');
};
