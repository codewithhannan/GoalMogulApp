/**
 * This file contains actions for fetching comments for a specific goal and also
 * actions related to a specific comment
 */
import {
  Alert
} from 'react-native';
import _ from 'lodash';
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
  COMMENT_NEW_POST_SUGGESTION_SUCCESS
} from './NewCommentReducers';

import { api as API } from '../../../middleware/api';
import { queryBuilder } from '../../../middleware/utils';

const DEBUG_KEY = '[ Action Comment ]';
const BASE_ROUTE = 'secure/feed/comment';

// New comment related actions
export const newCommentOnTextChange = (text, pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: COMMENT_NEW_TEXT_ON_CHANGE,
    payload: {
      text,
      tab,
      pageId
    }
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
export const createComment = (commentDetail, pageId) =>
(dispatch, getState) => {
  // const { parentType, parentRef, commentType, replyToRef } = commentDetail;
  const { userId } = getState().user;
  const { tab } = getState().navigation;
  console.log('Creating comment with commentDetail: ', commentDetail);

  dispatch({
    type: COMMENT_NEW,
    payload: {
      ...commentDetail,
      owner: userId,
      tab,
      pageId
    }
  });
};

// When user clicks on suggestion icon outside comment box
// const { parentType, parentRef, commentType, replyToRef } = commentDetail;
export const createCommentFromSuggestion = (
  { commentDetail, suggestionForRef, suggestionFor }, pageId
) =>
(dispatch, getState) => {
  const { userId } = getState().user;
  const { tab } = getState().navigation;

  dispatch({
    type: COMMENT_NEW,
    payload: {
      ...commentDetail,
      owner: userId,
      tab,
      pageId
    }
  });

  dispatch({
    type: COMMENT_NEW_SUGGESTION_CREATE,
    payload: {
      suggestionFor,
      suggestionForRef,
      tab,
      pageId
    }
  });
};
/**
 * comment(jsonStrObj):
 * parentRef, parentType("Goal" || "Post"), contentText, contentTags, commentType[, replyToRef, suggestion(Suggestion)]
 */
export const postComment = (pageId) => (dispatch, getState) => {
  const { token } = getState().user;
  const { tab } = getState().navigation;
  const newComment = commentAdapter(getState(), pageId, tab);
  const { suggestion, contentText } = newComment;
  console.log(`${DEBUG_KEY}: new comment to submit is: `, newComment);

  dispatch({
    type: COMMENT_NEW_POST_START,
    payload: {
      tab,
      pageId
    }
  });

  // TODO: Check if no suggestion and no replyToRef is filled
  // and commentType is Suggestion, then we set commentType to Comment.
  const onError = (err) => {
    dispatch({
      type: COMMENT_NEW_POST_FAIL
    });
    Alert.alert('Error', 'Failed to submit comment. Please try again later.');
    console.log(`${DEBUG_KEY}: error submitting comment: `, err);
  };

  // If succeed, COMMENT_NEW_POST_SUCCESS, otherwise, COMMENT_NEW_POST_FAIL
  const onSuccess = (data) => {
    const { commentType } = newComment;
    dispatch({
      type: COMMENT_NEW_POST_SUCCESS,
      payload: {
        comment: newComment,
        tab,
        pageId
      }
    });
    // If succeed and comment type is suggestionFor a need or a step, switch to
    // comment tab
    if (commentType === 'Suggestion'
        && (suggestion.suggestionFor === 'Need'
        || suggestion.suggestionFor === 'Step')) {
      dispatch({
        type: COMMENT_NEW_POST_SUGGESTION_SUCCESS,
        payload: {
          tab
        }
      });
    }
    console.log(`${DEBUG_KEY}: comment posted successfully with res: `, data);
    Alert.alert('Success', 'You have successfully created a comment.');
  };

  API
    .post(`${BASE_ROUTE}`, { comment: JSON.stringify(newComment) }, token)
    .then((res) => {
      if (!res.message && res.data) {
        return onSuccess(res.data);
      }
      onError(res);
    })
    .catch((err) => {
      onError(err);
    });
};

/**
 * Transform the new comment in state to proper comment format
 */
const commentAdapter = (state, pageId, tab) => {
  const page = pageId ? `${pageId}` : 'default';
  const path = !tab ? `homeTab.${page}` : `${tab}.${page}`;
  let newComment = _.get(state.newComment, `${path}`);

  const {
    contentText,
    // owner,
    parentType,
    parentRef,
    // content,
    commentType,
    replyToRef,
    suggestion
  } = newComment;

  const commentToReturn = {
    contentText,
    contentTags: [],
    parentType,
    parentRef,
    // content,
    commentType,
    replyToRef,
    suggestion
  };

  if (_.isEmpty(suggestion)) {
    delete commentToReturn.suggestion;
  }

  return commentToReturn;
};

/* Actions for suggestion modal */
export const openSuggestionModal = () => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: COMMENT_NEW_SUGGESTION_OPEN_MODAL,
    payload: {
      tab
    }
  });
};

// When user clicks on the suggestion icon on the comment box
export const createSuggestion = (pageId) => (dispatch, getState) => {
  //check if suggestionFor and suggestionRef have assignment,
  //If not then we assign the current goal ref and 'Goal'
  const { tab } = getState().navigation;
  const page = pageId ? `${pageId}` : 'default';
  const path = !tab ? `homeTab.${page}` : `${tab}.${page}`;

  const { suggestion, tmpSuggestion } = _.get(getState().newComment, `${path}`);
  const { _id } = getState().goalDetail;
  // Already have a suggestion. Open the current one
  if (suggestion.suggestionFor && suggestion.suggestionForRef) {
    return openCurrentSuggestion(pageId)(dispatch);
  }

  // This is the first time user clicks on the suggestion icon. No other entry points.
  if (!tmpSuggestion.suggestionFor && !tmpSuggestion.suggestionForRef) {
    dispatch({
      type: COMMENT_NEW_SUGGESTION_CREATE,
      payload: {
        suggestionFor: 'Goal',
        suggestionForRef: _id,
        tab
      }
    });
  }

  openSuggestionModal()(dispatch, getState);
};

// Cancel creating a suggestion
export const cancelSuggestion = (pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: COMMENT_NEW_SUGGESTION_CANCEL,
    payload: {
      tab,
      pageId
    }
  });
};

// Remove the suggestion
export const removeSuggestion = (pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: COMMENT_NEW_SUGGESTION_REMOVE,
    payload: {
      tab,
      pageId
    }
  });
};


export const updateSuggestionType = (suggestionType, pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: COMMENT_NEW_SUGGESTION_UPDAET_TYPE,
    payload: {
      suggestionType,
      tab,
      pageId
    }
  });
};


export const openCurrentSuggestion = (pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: COMMENT_NEW_SUGGESTION_OPEN_CURRENT,
    payload: {
      tab,
      pageId
    }
  });
};

export const attachSuggestion = (pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  const page = pageId ? `${pageId}` : 'default';
  const path = !tab ? `homeTab.${page}` : `${tab}.${page}`;
  const { tmpSuggestion } = _.get(getState().newComment, `${path}`);

  const { suggestionText, suggestionLink, selectedItem } = tmpSuggestion;

  // If nothing is selected, then we show an error
  if (!suggestionText && !suggestionLink && !selectedItem) {
    return Alert.alert('Error', 'You need to suggestion something.');
  }

  dispatch({
    type: COMMENT_NEW_SUGGESTION_ATTACH,
    payload: {
      tab,
      pageId
    }
  });
};

export const onSuggestionTextChange = (text, pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: COMMENT_NEW_SUGGESTION_UPDATE_TEXT,
    payload: {
      text,
      tab,
      pageId
    }
  });
};

export const onSuggestionLinkChange = (suggestionLink, pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: COMMENT_NEW_SUGGESTION_UPDATE_LINK,
    payload: {
      suggestionLink,
      tab,
      pageId
    }
  });
};

export const onSuggestionItemSelect = (selectedItem, pageId) => (dispatch, getState) => {
  console.log('suggestion item selected with item: ', selectedItem);
  const { tab } = getState().navigation;
  dispatch({
    type: COMMENT_NEW_SUGGESTION_SELECT_ITEM,
    payload: {
      selectedItem,
      tab,
      pageId
    }
  });
};

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */
export const refreshComments = (parentType, parentId, tab, pageId) => (dispatch, getState) => {
  const { token } = getState().user;
  const page = pageId ? `${pageId}` : 'default';
  const path = tab ? `${tab}.${page}` : `homeTab.${page}`;
  const { limit, hasNextPage } = _.get(getState().comment, path);
  if (hasNextPage === false) {
    return;
  }
  dispatch({
    type: COMMENT_LOAD,
    payload: {
      tab,
      pageId
    }
  });
  const onSuccess = (data) => {
    dispatch({
      type: COMMENT_REFRESH_DONE,
      payload: {
        type: parentType,
        data,
        skip: data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0),
        tab,
        pageId
      }
    });
    console.log(`${DEBUG_KEY}: refresh comment success with data: `, data);
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: refresh comment failed with err: `, err);
  };

  loadComments(0, limit, token, { parentId, parentType }, onSuccess, onError);
};

export const loadMoreComments = (parentType, parentId, tab, pageId) => (dispatch, getState) => {
  const { token } = getState().user;
  const page = pageId ? `${pageId}` : 'default';
  const path = tab ? `${tab}.${page}` : `homeTab.${page}`;
  const { skip, limit, hasNextPage } = _.get(getState().comment, path);

  if (hasNextPage === false) {
    return;
  }
  dispatch({
    type: COMMENT_LOAD,
    payload: {
      tab,
      pageId
    }
  });

  const onSuccess = (data) => {
    dispatch({
      type: COMMENT_LOAD_DONE,
      payload: {
        type: parentType,
        data,
        skip: data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0),
        tab,
        pageId
      }
    });
    console.log(`${DEBUG_KEY}: load more comments succeeds with data: `, data);
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: load more comments failed with err: `, err);
  };

  loadComments(skip, limit, token, { parentId, parentType }, onSuccess, onError);
};

export const loadComments = (skip, limit, token, params, callback, onError) => {
  API
    .get(
      `${BASE_ROUTE}?${queryBuilder(skip, limit, { ...params })}`,
      // `${BASE_ROUTE}?parentId=5bc81da9d4f72c0019bb0cdb&parentType=Goal`,
      token
    )
    .then((res) => {
      console.log(`${DEBUG_KEY}: loading with res: `, res);
      if (res.data) {
        // Right now return test data
        return callback(res.data);
      }
      console.warn(`${DEBUG_KEY}: Loading comment with no res`);
      onError(res);
    })
    .catch((err) => {
      onError(err);
    });
};
