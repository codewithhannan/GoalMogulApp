// This reducer is for Post Detail Page
import _ from 'lodash';

import {
  USER_LOG_OUT
} from '../../../../reducers/User';

import {
  LIKE_POST,
  UNLIKE_POST,
} from '../../like/LikeReducers';

const NEW_POST_INITIAL_STATE = {
  mediaRef: undefined,
  uploading: false
};

const INITIAL_STATE = {
  post: {

  },
  newPost: {
    ...NEW_POST_INITIAL_STATE
  }
};

export const POST_DETAIL_FETCH = 'post_detail_fetch';
export const POST_DETAIL_FETCH_DONE = 'post_detail_fetch_done';
export const POST_DETAIL_OPEN = 'post_detail_open';
export const POST_DETAIL_CLOSE = 'post_detail_close';
// Comment related constants
export const POST_DETAIL_GET_COMMENT = 'post_detail_get_comment';
export const POST_DETAIL_CREATE_COMMENT = 'post_detail_create_comment';
export const POST_DETAIL_UPDATE_COMMENT = 'post_detail_create_comment';
export const POST_DETAIL_DELETE_COMMENT = 'post_detail_create_comment';

// New post related constants
export const POST_NEW_POST_UPDATE_MEDIA = 'post_new_post_update_media';
export const POST_NEW_POST_SUBMIT = 'post_new_post_submit';
export const POST_NEW_POST_SUBMIT_SUCCESS = 'post_new_post_submit_success';
export const POST_NEW_POST_SUBMIT_FAIL = 'post_new_post_submit_fail';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POST_DETAIL_FETCH: {
      return { ...state };
    }

    case POST_DETAIL_FETCH_DONE: {
      return { ...state };
    }

    case POST_DETAIL_OPEN: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'post', { ...action.payload });
    }

    /**
     * Clear post detail on user close or log out
     */
    case POST_DETAIL_CLOSE:
    case USER_LOG_OUT: {
      return { ...INITIAL_STATE };
    }

    case LIKE_POST:
    case UNLIKE_POST: {
      const { id, likeId } = action.payload;
      let newState = _.cloneDeep(state);

      const { post } = newState;
      if (post._id && post._id.toString() === id.toString()) {
        newState = _.set(newState, 'post.maybeLikeRef', likeId);
      }
      return newState;
    }

    case POST_NEW_POST_UPDATE_MEDIA: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'newPost.mediaRef', action.payload);
    }

    case POST_NEW_POST_SUBMIT: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'newPost.uploading', true);
    }

    case POST_NEW_POST_SUBMIT_FAIL: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'newPost.uploading', false);
    }

    case POST_NEW_POST_SUBMIT_SUCCESS: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'newPost', { ...NEW_POST_INITIAL_STATE });
    }

    default:
      return { ...state };
  }
};
