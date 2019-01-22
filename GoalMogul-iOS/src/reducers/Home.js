import _ from 'lodash';
import {
  HOME_SWITCH_TAB,
} from '../actions/types';

import {
  LIKE_GOAL,
  LIKE_POST,
  UNLIKE_POST,
  UNLIKE_GOAL
} from '../redux/modules/like/LikeReducers';

import {
  PROFILE_GOAL_DELETE_SUCCESS,
  PROFILE_POST_DELETE_SUCCESS
} from './Profile';

export const HOME_MASTERMIND_OPEN_CREATE_OVERLAY = 'home_mastermind_open_create_overlay';
export const HOME_CLOSE_CREATE_OVERLAY = 'home_mastermind_close_create_overlay';
// Goal related constants
export const HOME_REFRESH_GOAL = 'home_refresh_goal';
export const HOME_REFRESH_GOAL_DONE = 'home_refresh_goal_done';
export const HOME_LOAD_GOAL = 'home_load_goal';
export const HOME_LOAD_GOAL_DONE = 'home_load_goal_done';
export const HOME_SET_GOAL_INDEX = 'home_set_goal_index'; // set current goal viewing index
export const HOME_UPDATE_FILTER = 'home_update_filter';

// Feed related constants
export const HOME_REFRESH_FEED = 'home_refresh_feed';
export const HOME_REFRESH_FEED_DONE = 'home_refresh_feed_done';
export const HOME_LOAD_FEED_DONE = 'home_load_feed_done';
export const HOME_SET_FEED_INDEX = 'home_set_feed_index'; // set current goal viewing index
export const HOME_UPDATE_FEED_FILTER = 'home_update_feed_filter';

const DEBUG_KEY = '[ Action Home ]';
const INITIAL_STATE = {
  tabIndex: 0,
  mastermind: {
    showPlus: true,
    data: [],
    limit: 4,
    skip: 0,
    currentIndex: 0,
    filter: {
      sortBy: 'shared',
      orderBy: 'descending',
      categories: 'All',
      completedOnly: 'false',
      priorities: ''
    },
    hasNextPage: undefined,
    loading: false, // Set to true when refreshing
    loadingMore: false, // Set to true when loading more
    refreshing: false // Set to true when refreshing
  },
  activityfeed: {
    showPlus: true,
    data: [],
    limit: 4,
    skip: 0,
    currentIndex: 0,
    filter: {
      sortBy: 'created',
      orderBy: 'descending',
      categories: 'All',
      completedOnly: 'false',
      priorities: ''
    },
    hasNextPage: undefined,
    loading: false,
    loadingMore: false
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
      newState = _.set(newState, `${type}.refreshing`, true);
      return _.set(newState, `${type}.loading`, true);
    }

    case HOME_REFRESH_GOAL_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.loading`, false);
      newState = _.set(newState, `${type}.refreshing`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${type}.skip`, skip);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);

      let sortedData = [];
      if (type === 'mastermind') {
        sortedData = data.sort((a, b) =>
          new Date(b.feedInfo.publishDate) - new Date(b.feedInfo.publishDate));
      } else {
        sortedData = data.sort((a, b) =>
         new Date(b.created) - new Date(b.created));
      }

      return _.set(newState, `${type}.data`, sortedData);
    }

    case HOME_LOAD_GOAL: {
      const { type } = action.payload;
      let newState = _.cloneDeep(state);
      return _.set(newState, `${type}.loadingMore`, true);
    }

    case HOME_LOAD_GOAL_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.loading`, false);
      newState = _.set(newState, `${type}.loadingMore`, false);
      // console.log(`${DEBUG_KEY}: new skip for type: ${type} is: `, skip);
      if (skip !== undefined) {
        newState = _.set(newState, `${type}.skip`, skip);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
      const oldData = _.get(newState, `${type}.data`);
      const newData = arrayUnique(oldData.concat(data));

      let sortedData = [];
      if (type === 'mastermind') {
        sortedData = newData.sort((a, b) =>
          new Date(b.feedInfo.publishDate) - new Date(b.feedInfo.publishDate));
      } else {
        sortedData = newData.sort((a, b) =>
         new Date(b.created) - new Date(b.created));
      }

      return _.set(newState, `${type}.data`, sortedData);
    }

    case HOME_SET_GOAL_INDEX: {
      const { type, index } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.currentIndex`, index);
    }

    // Update one of the home tab filters
    case HOME_UPDATE_FILTER: {
      const { tab, type, value } = action.payload;
      const newState = _.cloneDeep(state);
      if (type === 'priorities') {
        const oldPriorities = _.get(newState, `${tab}.filter.priorities`);
        const newPriorities = updatePriorities(oldPriorities, value);
        return _.set(newState, `${tab}.filter.priorities`, newPriorities);
      }
      return _.set(newState, `${tab}.filter.${type}`, value);
    }

    // When user deletes his/her own goals from Goals Feed, remove the corresponding
    // Item from the goal feed list
    case PROFILE_GOAL_DELETE_SUCCESS: {
      const goalId = action.payload;
      let newState = _.cloneDeep(state);
      const oldGoalData = _.get(newState, 'mastermind.data');
      // Filter out the goal
      const newGoalData = oldGoalData.filter(({ _id }) => _id !== goalId);

      // Filter out the goal from activity feed
      const oldActivityData = _.get(newState, 'activityfeed.data');
      const newActivityData = oldActivityData
        .filter(({ actedUponEntityId }) => actedUponEntityId !== goalId);

      newState = _.set(newState, 'activityfeed.data', newActivityData);
      return _.set(newState, 'mastermind.data', newGoalData);
    }

    // When user deletes his/her own posts from activity Feed, remove the corresponding
    // Item from the activity feed list
    case PROFILE_POST_DELETE_SUCCESS: {
      const postId = action.payload;
      const newState = _.cloneDeep(state);
      const oldData = _.get(newState, 'activityfeed.data');
      // Filter out the activity feed that relates to this deleted post
      const newData = oldData.filter(({ actedUponEntityId }) => actedUponEntityId !== postId);
      return _.set(newState, 'activityfeed.data', newData);
    }

    // Update like
    case UNLIKE_GOAL:
    case UNLIKE_POST:
    case LIKE_GOAL:
    case LIKE_POST: {
      const { id, likeId, type, undo } = action.payload;
      let newState = _.cloneDeep(state);
      const oldGoalFeedData = _.get(newState, 'mastermind.data');
      const oldActivityData = _.get(newState, 'activityfeed.data');

      // Update activity feed
      newState =
        _.set(newState, 'activityfeed.data', updateLike(oldActivityData, id, likeId, type, undo, action.type));
      // Update goal feed
      return _.set(newState, 'mastermind.data', updateLike(oldGoalFeedData, id, likeId, type, undo, action.type));
    }

    default:
      return { ...state };
  }
};

function updateLike(array, id, likeId, type, undo, likeType) {
  return array.map((item) => {
    let newItem = _.cloneDeep(item);
    if (type === 'post') {
      let itemToUpdate;
      let path;
      if (newItem.postRef) {
        path = 'postRef';
      }
      if (newItem.goalRef) {
        path = 'goalRef';
      }
      if (path) {
        itemToUpdate = _.get(newItem, `${path}`);
        if (itemToUpdate._id === id) {
          // upate maybeLikeRef
          itemToUpdate = _.set(itemToUpdate, 'maybeLikeRef', likeId);

          // Update like Count
          const oldLikeCount = _.get(itemToUpdate, 'likeCount');
          let newLikeCount = oldLikeCount;

          if (likeType === LIKE_GOAL || likeType === LIKE_POST) {
            if (undo) {
              newLikeCount = oldLikeCount - 1;
            } else if (likeId === 'testId') {
              newLikeCount = oldLikeCount + 1;
            }
          } else if (likeType === UNLIKE_GOAL || likeType === UNLIKE_POST) {
            if (undo) {
              newLikeCount = oldLikeCount + 1;
            } else if (likeId === undefined) {
              newLikeCount = oldLikeCount - 1;
            }
          }
          itemToUpdate = _.set(
            itemToUpdate,
            'likeCount',
            newLikeCount
          );
          newItem = _.set(newItem, `${path}`, itemToUpdate);
        }
      }
      return newItem;
    }

    if (item._id.toString() === id.toString()) {
      newItem = _.set(newItem, 'maybeLikeRef', likeId);

      const oldLikeCount = _.get(newItem, 'likeCount');
      let newLikeCount = oldLikeCount;

      if (likeType === LIKE_GOAL || likeType === LIKE_POST) {
        if (undo) {
          newLikeCount = oldLikeCount - 1;
        } else if (likeId === 'testId') {
          newLikeCount = oldLikeCount + 1;
        }
      } else if (likeType === UNLIKE_GOAL || likeType === UNLIKE_POST) {
        if (undo) {
          newLikeCount = oldLikeCount + 1;
        } else if (likeId === undefined) {
          newLikeCount = oldLikeCount - 1;
        }
      }
      newItem = _.set(
        newItem,
        'likeCount',
        newLikeCount
      );
    }
    return newItem;
  });
}

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

function updatePriorities(priorities, newPriority) {
  let newPriorities = [];
  const oldPriorities = priorities === '' ? [] : priorities.split(',').sort();

  if (newPriority === 'All') {
    if (oldPriorities.join() === '1,2,3,4,5,6,7,8,9') {
      return '';
    }
    return '1,2,3,4,5,6,7,8,9';
  }

  if (oldPriorities.indexOf(`${newPriority}`) < 0) {
    // Add the new priority to the string
    newPriorities = [...oldPriorities, newPriority];
  } else {
    // Remove the new priority from the string
    newPriorities = oldPriorities.filter((p) => p !== newPriority);
  }

  return newPriorities.join();
}
