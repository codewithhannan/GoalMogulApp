import R from 'ramda';

import {
  USER_LOG_OUT
} from './User';

const INITIAL_STATE = {
  goal: {

  }
};

export const GOAL_DETAIL_FETCH = 'goal_detail_fetch';
export const GOAL_DETAIL_FETCH_DONE = 'goal_detail_fetch_done';
export const GOAL_DETAIL_CLOSE = 'goal_detail_close';
export const GOAL_DETAIL_COMMENT = 'goal_detail_comment';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GOAL_DETAIL_FETCH: {
      return { ...state };
    }

    case GOAL_DETAIL_FETCH_DONE: {
      return { ...state };
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
