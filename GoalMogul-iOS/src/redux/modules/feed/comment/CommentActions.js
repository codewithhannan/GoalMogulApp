/**
 * This file contains actions for fetching comments for a specific goal and also
 * actions related to a specific comment
 */
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
  COMMENT_NEW_SUGGESTION_UPDAET_TYPE,

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

/* Actions for suggestion modal */
// When user clicks on the suggestion icon on teh comment box
export const createSuggestion = (suggestionForRef, suggestionFor) => (dispatch) => {
  dispatch({
    type: COMMENT_NEW_SUGGESTION_CREATE,
    payload: {
      suggestionFor,
      suggestionForRef
    }
  });
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

export const updateSuggestionType = suggestionType => (dispatch) =>
  dispatch({
    type: COMMENT_NEW_SUGGESTION_UPDAET_TYPE,
    payload: suggestionType
  });

export const openCurrentSuggestion = () => (dispatch) => {
  dispatch({
    type: COMMENT_NEW_SUGGESTION_OPEN_CURRENT
  });
};

export const attachSuggestion = () => (dispatch) => {
  dispatch({
    type: COMMENT_NEW_SUGGESTION_ATTACH
  });
};

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */
export const refreshComments = (parentId, parentType) => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit, hasNextPage } = getState().comment;
  if (hasNextPage === false) {
    return;
  }
  dispatch({
    type: COMMENT_LOAD
  });
  loadComments(0, limit, token, { parentId, parentType }, (data) => {
    dispatch({
      type: COMMENT_REFRESH_DONE,
      payload: {
        type: parentType,
        data,
        skip: data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
  }, () => {
    // TODO: implement for onError
  });
};

export const loadMoreComments = (parentId, parentType) => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, hasNextPage } = getState().comment;
  if (hasNextPage === false) {
    return;
  }
  dispatch({
    type: COMMENT_LOAD
  });
  loadComments(skip, limit, token, { parentId, parentType }, (data) => {
    dispatch({
      type: COMMENT_LOAD_DONE,
      payload: {
        type: parentType,
        data,
        skip: data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0)
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
