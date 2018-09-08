import R from 'ramda';

import {
  USER_LOG_OUT
} from './User';

const INITIAL_STATE = {
  goal: {

  },
  like: {
    likeId: undefined,
    isLiked: undefined
  }
};

export const GOAL_DETAIL_FETCH = 'goal_detail_fetch';
export const GOAL_DETAIL_FETCH_DONE = 'goal_detail_fetch_done';
export const GOAL_DETAIL_OPEN = 'goal_detail_open';
export const GOAL_DETAIL_CLOSE = 'goal_detail_close';
// Comment related constants
export const GOAL_DETAIL_GET_COMMENT = 'goal_detail_get_comment';
export const GOAL_DETAIL_CREATE_COMMENT = 'goal_detail_create_comment';
export const GOAL_DETAIL_UPDATE_COMMENT = 'goal_detail_create_comment';
export const GOAL_DETAIL_DELETE_COMMENT = 'goal_detail_create_comment';
// Like related constants
export const GOAL_DETAIL_GET_LIKE = 'goal_detail_get_like';
export const GOAL_DETAIL_CREATE_LIKE = 'goal_detail_create_like';
export const GOAL_DETAIL_DELETE_LIKE = 'goal_detail_create_like';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GOAL_DETAIL_FETCH: {
      return { ...state };
    }

    case GOAL_DETAIL_FETCH_DONE: {
      return { ...state };
    }

    case GOAL_DETAIL_OPEN: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'goal', { ...action.payload });
    }

    /**
     * Clear goal detail on user close or log out
     */
    case GOAL_DETAIL_CLOSE:
    case USER_LOG_OUT: {
      return { ...INITIAL_STATE };
    }

    default:
      return { ...state };
  }
};
