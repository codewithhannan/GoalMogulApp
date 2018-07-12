import {
  HOME_CLOSE_CREATE_OVERLAY,
  HOME_MASTERMIND_OPEN_CREATE_OVERLAY,
  HOME_REFRESH_GOAL,
  HOME_REFRESH_GOAL_DONE,
  HOME_LOAD_GOAL_DONE,
  HOME_SET_GOAL_INDEX
} from '../../../../reducers/Home';

import { api as API } from '../../../middleware/api';

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

// Refresh goal for mastermind tab
export const refreshGoals = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit, filter } = getState().home.mastermind;
  const { categories, priority } = filter;
  dispatch({
    type: HOME_REFRESH_GOAL
  });
  loadGoals(0, limit, token, priority, categories, (data) => {
    dispatch({
      type: HOME_REFRESH_GOAL_DONE,
      payload: {
        data,
        skip: data.length,
        limit: 20,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
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
        data,
        skip: data.length,
        limit: 20,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
  });
};

/**
 * Basic API to load goals based on skip and limit
 * @param isRefresh:
 * @param skip:
 * @param limit:
 * @param token:
 */
const loadGoals = (skip, limit, token, priority, categories, callback) => {
  const route = '/feed';
  API
    .get(
      `${BASE_ROUTE}${route}?limit=${limit}&skip=${skip}&priority=${priority}&categories=${categories}`,
      token
    )
    .then((res) => {
      console.log('loading goal with res: ', res);
      if (res) {
        // Right now return empty data
        callback([]);
      }
      console.warn(`${DEBUG_KEY}: Loading goal with no res`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY} load goal error: ${err}`);
    });
};
