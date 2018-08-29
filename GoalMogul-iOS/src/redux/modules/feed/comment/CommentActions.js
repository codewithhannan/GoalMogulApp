import {
  COMMENT_LOAD,
  COMMENT_REFRESH_DONE,
  COMMENT_LOAD_DONE,
  COMMENT_NEW_TEXT_ON_CHANGE
} from './CommentReducers';
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
export const updateComment = (commentId, udpates) => {

};

/**
 * action to create a comment for a goal / post
 * @params comment: a json object of a comment object
 */
export const createComment = (rawComment) => {
  // rawComment needs an adapter to transform to backend jsonObject
  console.log('Creating comment with obj: ', rawComment);
};

/**
 * action to delete a comment for a goal / post
 * @params commentId: id of the comment
 */
export const deleteComment = (commentId) => {

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
  if (!hasNextPage) {
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
  if (!hasNextPage) {
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
