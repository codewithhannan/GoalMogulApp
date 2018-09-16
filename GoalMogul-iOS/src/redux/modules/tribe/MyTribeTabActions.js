// This reducer stores information for my tribes
import { Actions } from 'react-native-router-flux';
import {
  MYTRIBETAB_REFRESH_DONE,
  MYTRIBETAB_LOAD_DONE,
  MYTRIBETAB_LOAD,
  MYTRIBETAB_SORTBY,
  MYTRIBETAB_UPDATE_FILTEROPTIONS,
  MYTRIBETAB_OPEN,
  MYTRIBETAB_CLOSE
} from './MyTribeTabReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

const DEBUG_KEY = '[ Action MyTribeTab ]';
const BASE_ROUTE = 'secure/tribe/';

// Open my tribe modal
export const openMyTribeTab = () => (dispatch, getState) => {
  dispatch({
    type: MYTRIBETAB_OPEN
  });

  Actions.push('myTribeTab');
  refreshTribe()(dispatch, getState);
};

// Close my tribe modal
export const closeMyTribeTab = () => (dispatch) => {
  Actions.popTo('home');
  dispatch({
    type: MYTRIBETAB_CLOSE
  });
};

// update sortBy
export const updateSortBy = (value) => (dispatch, getState) => {
  dispatch({
    type: MYTRIBETAB_SORTBY,
    value
  });

  refreshTribe()(dispatch, getState);
};


// update filterForMembershipCategory
export const updateFilterForMembershipCategory = (value) => (dispatch, getState) => {
  dispatch({
    type: MYTRIBETAB_UPDATE_FILTEROPTIONS,
    value
  });

  refreshTribe()(dispatch, getState);
};

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions, EventTabActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */

//Refresh feed for activity tab
export const refreshTribe = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit, filterForMembershipCategory, sortBy } = getState().eventTab;

  dispatch({
    type: MYTRIBETAB_LOAD
  });
  loadTribe(0, limit, token, sortBy, filterForMembershipCategory, (data) => {
    dispatch({
      type: MYTRIBETAB_REFRESH_DONE,
      payload: {
        type: 'mytribetab',
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
export const loadMoreTribe = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, sortBy, filterForMembershipCategory, hasNextPage } = getState().tribeTab;
  if (hasNextPage === false) {
    return;
  }
  loadTribe(skip, limit, token, sortBy, filterForMembershipCategory, (data) => {
    dispatch({
      type: MYTRIBETAB_LOAD_DONE,
      payload: {
        type: 'mytribetab',
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
 */
const loadTribe = (skip, limit, token, sortBy, filterForMembershipCategory, callback, onError) => {
  API
    .get(
      `${BASE_ROUTE}?${queryBuilder(skip, limit, { ...sortBy, ...filterForMembershipCategory })}`,
      token
    )
    .then((res) => {
      console.log('loading goal with res: ', res);
      if (res) {
        // Right now return test data
        if (skip === 0) {
          callback([]);
        } else {
          callback([]);
        }
      }
      console.warn(`${DEBUG_KEY}: Loading tribe with no res`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY} load tribe error: ${err}`);
      if (skip === 0) {
        callback([]);
      } else {
        callback([]);
      }
    });
};
