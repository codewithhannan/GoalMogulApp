import { Actions } from 'react-native-router-flux';
import { reset } from 'redux-form';
import { Alert } from 'react-native';
import _ from 'lodash';

import {
  SHARE_NEW_SHARE_TO,
  SHARE_NEW_SELECT_DEST,
  SHARE_NEW_CANCEL,
  SHARE_NEW_POST_SUCCESS,
  SHARE_NEW_POST,
  SHARE_NEW_POST_FAIL
} from './NewShareReducers';

import {
  SHARE_DETAIL_OPEN,
  SHARE_DETAIL_CLOSE
} from './ShareReducers';

import {
  switchCaseF,
  clearTags
} from '../../../middleware/utils';

// Actions
import {
  refreshComments
} from '../../feed/comment/CommentActions';

import { api as API } from '../../../middleware/api';

const DEBUG_KEY = '[ Action Share ]';

/* Functions related to a share detail */

/*
 * open share detail
 */
export const openShareDetail = (share) => (dispatch, getState) => {
  const { tab } = getState().navigation;

  const scene = (!tab || tab === 'homeTab') ? 'share' : `share${capitalizeWord(tab)}`;
  const { pageId } = _.get(getState().shareDetail, `${scene}`);

  dispatch({
    type: SHARE_DETAIL_OPEN,
    payload: {
      share,
      tab,
      pageId
    },
  });

  const { _id } = share;
  refreshComments('Post', _id, tab, pageId)(dispatch, getState);

  Actions.push(`${scene}`, { pageId });
};

// close share detail
export const closeShareDetail = () => (dispatch, getState) => {
  Actions.pop();

  const { tab } = getState().navigation;
  const path = (!tab || tab === 'homeTab') ? 'share' : `share${capitalizeWord(tab)}`;
  const { pageId } = _.get(getState().shareDetail, `${path}`);

  dispatch({
    type: SHARE_DETAIL_CLOSE,
    payload: {
      tab,
      pageId
    }
  });
};

/**
 * Functions related to creating a new share
 */
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
  },
  ShareStep: {
    postType,
    stepRef: ref,
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
  const postDetail = switchPostType(postType, ref, goalRef);

  dispatch({
    type: SHARE_NEW_SHARE_TO,
    payload: {
      ...postDetail,
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
      if ((!res.message && res.data) || res.status === 200) {
        dispatch({
          type: SHARE_NEW_POST_SUCCESS,
          payload: res.data
        });
        Actions.pop();
        console.log(`${DEBUG_KEY}: creating share successfully with data: `, res.data);
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
      console.log(`${DEBUG_KEY}: creating share failed with exception: `, err);
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
    stepRef,
    belongsToTribe,
    belongsToEvent
  } = newShare;

  const {
    privacy, // needs to uncapitalize the first character and map Private to self
    content,
    tags
  } = formVales;

  const transformedPrivacy = privacy === 'Private' ? 'self' : privacy.toLowerCase();
  const tagsToUse = clearTags(content, {}, tags);

  return {
    owner,
    postType,
    userRef,
    postRef,
    goalRef,
    needRef,
    stepRef,
    belongsToTribe,
    belongsToEvent,
    content: {
      text: content,
      tags: tagsToUse
    },
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

/**
 * Helper functions
 */
const capitalizeWord = (word) => {
  if (!word) return '';
  return word.replace(/^\w/, c => c.toUpperCase());
};
