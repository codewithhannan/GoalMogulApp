import _ from 'lodash';
import {
  HOME_SWITCH_TAB,

} from '../actions/types';

export const HOME_MASTERMIND_OPEN_CREATE_OVERLAY = 'home_mastermind_open_create_overlay';
export const HOME_CLOSE_CREATE_OVERLAY = 'home_mastermind_close_create_overlay';
// Goal related constants
export const HOME_REFRESH_GOAL = 'home_refresh_goal';
export const HOME_REFRESH_GOAL_DONE = 'home_refresh_goal_done';
export const HOME_LOAD_GOAL_DONE = 'home_load_goal_done';
export const HOME_SET_GOAL_INDEX = 'home_set_goal_index'; // set current goal viewing index

const INITIAL_STATE = {
  tabIndex: 0,
  mastermind: {
    showPlus: true,
    goals: [],
    limit: 20,
    skip: 0,
    currentIndex: 0,
    hasNextPage: undefined
  },
  activityfeed: {
    feeds: [],
    limit: 20,
    skip: 0
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HOME_SWITCH_TAB:
      return { ...state, tabIndex: action.payload };

    case HOME_MASTERMIND_OPEN_CREATE_OVERLAY: {
      let newState = _.cloneDeep(state);
      newState.mastermind.showPlus = false;
      return { ...newState };
    }

    case HOME_CLOSE_CREATE_OVERLAY: {
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${action.payload}.showPlus`, true);
      return { ...newState };
    }

    default:
      return { ...state };
  }
};
