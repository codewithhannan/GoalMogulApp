/**
 * This file contains actions for fetching comments for a specific goal and also
 * actions related to a specific comment
 */
import {
  Alert
} from 'react-native';
import {
  COMMENT_LOAD,
  COMMENT_REFRESH_DONE,
  COMMENT_LOAD_DONE
} from './CommentReducers';

import {
  COMMENT_NEW,
  COMMENT_NEW_TEXT_ON_CHANGE,
  COMMENT_NEW_SUGGESTION_REMOVE,
  COMMENT_NEW_SUGGESTION_CREATE,
  COMMENT_NEW_SUGGESTION_ATTACH,
  COMMENT_NEW_SUGGESTION_CANCEL,
  COMMENT_NEW_SUGGESTION_OPEN_CURRENT,
  COMMENT_NEW_SUGGESTION_OPEN_MODAL,
  COMMENT_NEW_SUGGESTION_UPDAET_TYPE,

  // update suggestion link and text
  COMMENT_NEW_SUGGESTION_UPDATE_TEXT,
  COMMENT_NEW_SUGGESTION_UPDATE_LINK,

  // Select searched suggestion item
  COMMENT_NEW_SUGGESTION_SELECT_ITEM,

  COMMENT_NEW_POST_START,
  COMMENT_NEW_POST_SUCCESS,
  COMMENT_NEW_POST_FAIL,
} from './NewCommentReducers';

import { api as API } from '../../../middleware/api';
import { queryBuilder } from '../../../middleware/utils';

const DEBUG_KEY = 'Comment ]';
const BASE_ROUTE = 'secure/feed/comment';

// New comment related actions
export const newCommentOnTextChange = (text) => (dispatch) => {
  dispatch({
    type: COMMENT_NEW_TEXT_ON_CHANGE,
    payload: text
  });
};

// Comment module related actions

/**
 * action to update a comment for a goal / post
 * @params commentId: id of the comment
 * @params updates: JsonObject of the updated comment
 */
export const updateComment = (commentId, updates) => {

};

/**
 * action to delete a comment for a goal / post
 * @params commentId: id of the comment
 */
export const deleteComment = (commentId) => {

};

/**
 * Following section is for actions related to creating a new comment
 * which involes suggestion
 */

// User clicks on the comment button
export const createComment = (commentDetail) =>
(dispatch, getState) => {
  // const { parentType, parentRef, commentType, replyToRef } = commentDetail;
  const { userId } = getState().user;

  console.log('Creating comment with commentDetail: ', commentDetail);

  dispatch({
    type: COMMENT_NEW,
    payload: {
      ...commentDetail,
      owner: userId
    }
  });
};

// When user clicks on suggestion icon outside comment box
// const { parentType, parentRef, commentType, replyToRef } = commentDetail;
export const createCommentFromSuggestion = ({ commentDetail, suggestionForRef, suggestionFor }) =>
(dispatch, getState) => {
  const { userId } = getState().user;

  dispatch({
    type: COMMENT_NEW,
    payload: {
      ...commentDetail,
      owner: userId
    }
  });

  dispatch({
    type: COMMENT_NEW_SUGGESTION_CREATE,
    payload: {
      suggestionFor,
      suggestionForRef
    }
  });
};

export const postComment = () => (dispatch, getstate) => {
  dispatch({
    type: COMMENT_NEW_POST_START
  });
  // TODO: Check if no suggestion and no replyToRef is filled
  // and commentType is Suggestion, then we set commentType to Comment.

  // If succeed, COMMENT_NEW_POST_SUCCESS, otherwise, COMMENT_NEW_POST_FAIL
  // If succeed and comment type is suggestionFor a need or a step, switch to
  // comment tab
};

/* Actions for suggestion modal */
export const openSuggestionModal = () => (dispatch) => dispatch({
  type: COMMENT_NEW_SUGGESTION_OPEN_MODAL
});

// When user clicks on the suggestion icon on the comment box
export const createSuggestion = () => (dispatch, getState) => {
  //check if suggestionFor and suggestionRef have assignment,
  //If not then we assign the current goal ref and 'Goal'
  const { suggestion, tmpSuggestion } = getState().newComment;
  const { _id } = getState().goalDetail;

  // Already have a suggestion. Open the current one
  if (suggestion.suggestionFor && suggestion.suggestionForRef) {
    return openCurrentSuggestion()(dispatch);
  }

  // This is the first time user clicks on the suggestion icon. No other entry points.
  if (!tmpSuggestion.suggestionFor && !tmpSuggestion.suggestionForRef) {
    dispatch({
      type: COMMENT_NEW_SUGGESTION_CREATE,
      payload: {
        suggestionFor: 'Goal',
        suggestionForRef: _id
      }
    });
  }

  openSuggestionModal()(dispatch);
};

// Cancel creating a suggestion
export const cancelSuggestion = () => (dispatch) => {
  dispatch({
    type: COMMENT_NEW_SUGGESTION_CANCEL
  });
};

// Remove the suggestion
export const removeSuggestion = () => (dispatch) =>
  dispatch({
    type: COMMENT_NEW_SUGGESTION_REMOVE
  });

export const updateSuggestionType = (suggestionType) => (dispatch) =>
  dispatch({
    type: COMMENT_NEW_SUGGESTION_UPDAET_TYPE,
    payload: suggestionType
  });

export const openCurrentSuggestion = () => (dispatch) => {
  dispatch({
    type: COMMENT_NEW_SUGGESTION_OPEN_CURRENT
  });
};

export const attachSuggestion = () => (dispatch, getState) => {
  const { tmpSuggestion } = getState().newComment;
  const { suggestionText, suggestionLink, selectedItem } = tmpSuggestion;

  // If nothing is selected, then we show an error
  if (!suggestionText && !suggestionLink && !selectedItem) {
    return Alert.alert('Error', 'You need to suggestion something.');
  }

  dispatch({
    type: COMMENT_NEW_SUGGESTION_ATTACH
  });
};

export const onSuggestionTextChange = (text) => (dispatch) => {
  dispatch({
    type: COMMENT_NEW_SUGGESTION_UPDATE_TEXT,
    payload: text
  });
};

export const onSuggestionLinkChange = (link) => (dispatch) => {
  dispatch({
    type: COMMENT_NEW_SUGGESTION_UPDATE_LINK,
    payload: link
  });
};

export const onSuggestionItemSelect = (item) => (dispatch) => {
  console.log('suggestion item selected with item: ', item);
  dispatch({
    type: COMMENT_NEW_SUGGESTION_SELECT_ITEM,
    payload: item
  });
};

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */
export const refreshComments = (parentId, parentType, tab) => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit, hasNextPage } = getState().comment;
  if (hasNextPage === false) {
    return;
  }
  dispatch({
    type: COMMENT_LOAD,
    tab
  });
  loadComments(0, limit, token, { parentId, parentType }, (data) => {
    dispatch({
      type: COMMENT_REFRESH_DONE,
      payload: {
        type: parentType,
        data,
        skip: data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0),
        tab
      }
    });
  }, () => {
    // TODO: implement for onError
  });
};

export const loadMoreComments = (parentId, parentType, tab) => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, hasNextPage } = getState().comment;
  if (hasNextPage === false) {
    return;
  }
  dispatch({
    type: COMMENT_LOAD,
    tab
  });
  loadComments(skip, limit, token, { parentId, parentType }, (data) => {
    dispatch({
      type: COMMENT_LOAD_DONE,
      payload: {
        type: parentType,
        data,
        skip: data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0),
        tab
      }
    });
  }, () => {
    // TODO: implement for onError
  });
};

export const loadComments = (skip, limit, token, params, callback, onError) => {
  API
    .get(
      `${BASE_ROUTE}?${queryBuilder(skip, limit, { ...params })}`,
      token
    )
    .then((res) => {
      console.log(`[ Loading ${DEBUG_KEY} with res: `, res);
      if (res) {
        // Right now return test data
        if (skip === 0) {
          callback(res);
        } else {
          callback([]);
        }
      }
      console.warn(`[ Loading ${DEBUG_KEY}: Loading comment with no res`);
    })
    .catch((err) => {
      console.log(`[ Loading ${DEBUG_KEY}: load comment error: ${err}`);
    });
};
