import R from 'ramda';
import _ from 'lodash';

import {
  USER_LOG_OUT
} from './User';

import {
  LIKE_POST,
  LIKE_GOAL,
  UNLIKE_POST,
  UNLIKE_GOAL
} from '../redux/modules/like/LikeReducers';

import {
  COMMENT_NEW_POST_SUGGESTION_SUCCESS
} from '../redux/modules/feed/comment/NewCommentReducers';

const INITIAL_NAVIGATION_STATE = {
  index: 0,
  routes: [
    { key: 'comments', title: 'Comments' },
    { key: 'mastermind', title: 'Mastermind' },
  ],
};

const INITIAL_STATE = {
  goal: {
    navigationState: {
      ...INITIAL_NAVIGATION_STATE
    },
    goal: {

    }
  },
  goalExploreTab: {
    navigationState: {
      ...INITIAL_NAVIGATION_STATE
    },
    goal: {

    }
  },
  goalMeetTab: {
    navigationState: {
      ...INITIAL_NAVIGATION_STATE
    },
    goal: {

    }
  },
  goalNotificationTab: {
    navigationState: {
      ...INITIAL_NAVIGATION_STATE
    },
    goal: {

    }
  },
  goalChatTab: {
    navigationState: {
      ...INITIAL_NAVIGATION_STATE
    },
    goal: {

    }
  }
};

export const GOAL_DETAIL_FETCH = 'goal_detail_fetch';
export const GOAL_DETAIL_FETCH_DONE = 'goal_detail_fetch_done';
export const GOAL_DETAIL_OPEN = 'goal_detail_open';
export const GOAL_DETAIL_CLOSE = 'goal_detail_close';
export const GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS = 'goal_detail_mark_as_complete_success';
export const GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS = 'goal_detail_share_to_mastermind_success';
export const GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS =
  'goal_detail_mark_step_as_complete_success';
export const GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS =
  'goal_detail_mark_need_as_complete_success';

export const GOAL_DETAIL_SWITCH_TAB = 'goal_detail_switch_tab';
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
      const { tab, goal } = action.payload;
      const path = !tab ? 'goal.goal' : `goal${capitalizeWord(tab)}.goal`;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${path}`, { ...goal });
    }

    /**
     * Clear goal detail on user close or log out
     */
    case GOAL_DETAIL_CLOSE: {
      const { tab } = action.payload;
      const path = !tab ? 'goal.goal' : `goal${capitalizeWord(tab)}.goal`;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${path}`, {});
    }

    case GOAL_DETAIL_SWITCH_TAB: {
      const { tab, index } = action.payload;
      const path = !tab ? 'goal.navigation' : `goal${capitalizeWord(tab)}.navigation`;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${path}.index`, index);
    }

    case USER_LOG_OUT: {
      return { ...INITIAL_STATE };
    }

    case LIKE_POST:
    case LIKE_GOAL:
    case UNLIKE_POST:
    case UNLIKE_GOAL: {
      const { id, likeId, tab } = action.payload;
      let newState = _.cloneDeep(state);

      const path = !tab ? 'goal.goal' : `goal${capitalizeWord(tab)}.goal`;
      const goal = _.get(newState, `${path}`);
      if (goal._id && goal._id.toString() === id.toString()) {
        newState = _.set(newState, `${path}.maybeLikeRef`, likeId);
      }
      return newState;
    }

    case GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS: {
      const { tab } = action.payload;
      const path = !tab ? 'goal.goal' : `goal${capitalizeWord(tab)}.goal`;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${path}.isCompleted`, true);
    }

    case GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS: {
      const { tab } = action.payload;
      const path = !tab ? 'goal.goal' : `goal${capitalizeWord(tab)}.goal`;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${path}.shareToGoalFeed`, true);
    }

    case GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS: {
      const { isCompleted, id, tab } = action.payload;
      const newState = _.cloneDeep(state);
      const path = !tab ? 'goal.goal' : `goal${capitalizeWord(tab)}.goal`;
      const oldSteps = _.get(newState, `${path}.steps`);
      return _.set(newState, `${path}.steps`, findAndUpdate(id, oldSteps, { isCompleted }));
    }

    case GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS: {
      const { isCompleted, id, tab } = action.payload;
      const newState = _.cloneDeep(state);
      const path = !tab ? 'goal.goal' : `goal${capitalizeWord(tab)}.goal`;
      const oldNeeds = _.get(newState, `${path}.needs`);
      return _.set(newState, `${path}.needs`, findAndUpdate(id, oldNeeds, { isCompleted }));
    }

    // Comment with suggestion for need or step is posted successfully
    case COMMENT_NEW_POST_SUGGESTION_SUCCESS: {
      const { tab } = action.payload;
      const newState = _.cloneDeep(state);
      const path = !tab ? 'goal' : `goal${capitalizeWord(tab)}`;
      // set the navigationState to have comment as the tab
      return _.set(newState, `${path}.navigationState.index`, 0);
    }

    default:
      return { ...state };
  }
};

// Find the object with id and update the object with the newValsMap
function findAndUpdate(id, data, newValsMap) {
  return data.map((item) => {
    let newItem = _.cloneDeep(item);
    if (item._id === id) {
      Object.keys(newValsMap).forEach(key => {
        if (newValsMap[key] !== null) {
          newItem = _.set(newItem, `${key}`, newValsMap[key]);
        }
      });
    }
    return newItem;
  });
}

const capitalizeWord = (word) => {
  if (!word) return '';
  return word.replace(/^\w/, c => c.toUpperCase());
};
