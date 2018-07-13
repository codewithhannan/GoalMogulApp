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
export const HOME_UPDATE_FILTER = 'home_update_filter';

const INITIAL_STATE = {
  tabIndex: 0,
  mastermind: {
    showPlus: true,
    data: [],
    limit: 20,
    skip: 0,
    currentIndex: 0,
    filter: {
      category: 'general',
      priority: 10,
    },
    hasNextPage: undefined,
    loading: false
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

    /**
     * Please refer to the refactoring in Profile.js (reducer) for TODO
     */
    case HOME_REFRESH_GOAL: {
      const { type } = action.payload;
      let newState = _.cloneDeep(state);
      return _.set(newState, `${type}.loading`, true);
    }

    case HOME_REFRESH_GOAL_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.loading`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${type}.skip`, skip);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
      return _.set(newState, `${type}.data`, data);
    }

    case HOME_LOAD_GOAL_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.loading`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${type}.skip`, skip);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
      const oldData = _.get(newState, `${type}.data`);
      return _.set(newState, `${type}.data`, arrayUnique(oldData.concat(data)));
    }

    case HOME_SET_GOAL_INDEX: {
      const { type, index } = action.payload;
      let newState = _.cloneDeep(state);
      return _.set(newState, `${type}.currentIndex`, index);
    }

    // Update one of the home tab filters
    case HOME_UPDATE_FILTER: {
      const { tab, type, value } = action.payload;
      let newState = _.cloneDeep(state);
      return _.set(newState, `${tab}.filter.${type}`, value);
    }

    default:
      return { ...state };
  }
};

function arrayUnique(array) {
  let a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i]._id === a[j]._id) {
        a.splice(j--, 1);
      }
    }
  }

  return a;
}
