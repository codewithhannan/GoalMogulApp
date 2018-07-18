import {
  HOME_CLOSE_CREATE_OVERLAY,
  HOME_MASTERMIND_OPEN_CREATE_OVERLAY,
  HOME_REFRESH_GOAL,
  HOME_REFRESH_GOAL_DONE,
  HOME_LOAD_GOAL_DONE,
  HOME_SET_GOAL_INDEX,
  HOME_UPDATE_FILTER
} from '../../../../reducers/Home';

import { api as API } from '../../../middleware/api';
import { queryBuilder } from '../../../middleware/utils';

const DEBUG_KEY = '[ Action Home Mastermind ]';
const BASE_ROUTE = 'secure/goal/';

export const openCreateOverlay = () => ({
  type: HOME_MASTERMIND_OPEN_CREATE_OVERLAY
});

export const closeCreateOverlay = (tab) => ({
  type: HOME_CLOSE_CREATE_OVERLAY,
  payload: tab
});

// set currentIndex to the prev one
export const getPrevGoal = () => (dispatch, getState) => {
  const { currentIndex } = getState().home.mastermind;
  if (currentIndex <= 0) {
    return false;
  }
  dispatch({
    type: HOME_SET_GOAL_INDEX,
    payload: currentIndex - 1
  });
  return true;
};

// set currentIndex to the next one
export const getNextGoal = () => (dispatch, getState) => {
  const { currentIndex, goals } = getState().home.mastermind;
  if (currentIndex >= goals.length) {
    return false;
  }
  dispatch({
    type: HOME_SET_GOAL_INDEX,
    payload: currentIndex + 1
  });
  return true;
};

// User update filter for specific tab in Mastermind
export const changeFilter = (tab, filterType, value) => (dispatch) => {
  dispatch({
    type: HOME_UPDATE_FILTER,
    payload: {
      tab,
      type: filterType,
      value
    }
  });
};

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions
 */

//Refresh goal for mastermind tab
export const refreshGoals = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit, filter } = getState().home.mastermind;
  const { categories, priority } = filter;
  dispatch({
    type: HOME_REFRESH_GOAL,
    payload: {
      type: 'mastermind'
    }
  });
  loadGoals(0, limit, token, priority, categories, (data) => {
    dispatch({
      type: HOME_REFRESH_GOAL_DONE,
      payload: {
        type: 'mastermind',
        data,
        skip: data.length,
        limit: 20,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
  }, () => {
    // TODO: implement for onError
  });
};

// Load more goal for mastermind tab
export const loadMoreGoals = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, filter, hasNextPage } = getState().home.mastermind;
  if (!hasNextPage) {
    return;
  }
  const { categories, priority } = filter;
  loadGoals(skip, limit, token, priority, categories, (data) => {
    dispatch({
      type: HOME_LOAD_GOAL_DONE,
      payload: {
        type: 'mastermind',
        data,
        skip: data.length,
        limit: 20,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
  }, () => {
    // TODO: implement for onError
  });
};

/**
 * Basic API to load goals based on skip and limit
 * @param isRefresh:
 * @param skip:
 * @param limit:
 * @param token:
 */
const loadGoals = (skip, limit, token, priority, categories, callback, onError) => {
  const route = '/feed';
  API
    .get(
      `${BASE_ROUTE}${route}?${queryBuilder(skip, limit, { priority, categories })}`,
      token
    )
    .then((res) => {
      console.log('loading goal with res: ', res);
      if (res) {
        // Right now return test data
        if (skip === 0) {
          callback(testData);
        } else {
          callback([]);
        }
      }
      console.warn(`${DEBUG_KEY}: Loading goal with no res`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY} load goal error: ${err}`);
      if (skip === 0) {
        callback(testData);
      } else {
        callback([]);
      }
    });
};

// TODO: delete this test data
const testData = [
  {
    _id: '1231293187907',
    owner: {
      name: 'Jia Zeng'
    },
    title: 'Establish a LMFBR near Westport, Connecticut by 2020',
    priority: 1,
    category: 'general',
    privacy: 'friends',
    shareToGoalFeed: true,
    start: new Date(),
    end: new Date(),
    detail: {
      text: 'This is detail'
    },
    type: 'goal'
  },
  {
    _id: '109283719082',
    owner: {
      name: 'Jia Zeng'
    },
    needRequest: {
      description: 'Introduction to someone from the Bill and Melinda Gates Foundation'
    },
    description: 'Hey guys! Do you know anyone that can connect me?? It\'d would mean a lot to me',
    type: 'need'
  }
];
