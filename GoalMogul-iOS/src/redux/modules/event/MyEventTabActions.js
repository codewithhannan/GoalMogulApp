// This stores informations for events under my events
import { Actions } from 'react-native-router-flux';
import {
  MYEVENTTAB_REFRESH_DONE,
  MYEVENTTAB_LOAD_DONE,
  MYEVENTTAB_LOAD,
  MYEVENTTAB_SORTBY,
  MYEVENTTAB_UPDATE_FILTEROPTIONS,
  MYEVENTTAB_OPEN,
  MYEVENTTAB_CLOSE
} from './MyEventTabReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

const DEBUG_KEY = '[ Action MyEventTab ]';
const BASE_ROUTE = 'secure/event';

// Open my event tab
export const openMyEventTab = () => (dispatch, getState) => {
  dispatch({
    type: MYEVENTTAB_OPEN
  });
  Actions.push('myEventTab');
  refreshEvent()(dispatch, getState);
};

// Close my event tab
export const closeMyEventTab = () => (dispatch) => {
  Actions.popTo('home');
  dispatch({
    type: MYEVENTTAB_CLOSE
  });
};

// update sortBy
export const updateSortBy = (value) => (dispatch, getState) => {
  dispatch({
    type: MYEVENTTAB_SORTBY,
    value
  });

  refreshEvent()(dispatch, getState);
};


// update filterOptions
export const updateFilterOptions = ({ type, value }) => (dispatch, getState) => {
  dispatch({
    type: MYEVENTTAB_UPDATE_FILTEROPTIONS,
    payload: {
      type,
      value
    }
  });

  refreshEvent()(dispatch, getState);
};

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions, TribeTabActions,
 * TribeActions, EventActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */

//Refresh feed for activity tab
export const refreshEvent = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit, filterOptions, sortBy } = getState().myEventTab;

  dispatch({
    type: MYEVENTTAB_LOAD
  });
  loadEvent(0, limit, token, sortBy, filterOptions, (data) => {
    dispatch({
      type: MYEVENTTAB_REFRESH_DONE,
      payload: {
        type: 'myeventtab',
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
export const loadMoreEvent = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, sortBy, filterOptions, hasNextPage } = getState().myEventTab;
  if (hasNextPage === false) {
    return;
  }
  loadEvent(skip, limit, token, sortBy, filterOptions, (data) => {
    dispatch({
      type: MYEVENTTAB_LOAD_DONE,
      payload: {
        type: 'myeventtab',
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
const loadEvent = (skip, limit, token, sortBy, filterOptions, callback, onError) => {
  API
    .get(
      `${BASE_ROUTE}?${queryBuilder(skip, limit, { sortBy, filterOptions })}`,
      token
    )
    .then((res) => {
      console.log('loading events with res: ', res);
      if (res && res.data) {
        // Right now return test data
        return callback(res.data);
      }
      console.warn(`${DEBUG_KEY}: Loading goal with no res`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY} load events error: ${err}`);
      onError(err);
    });
};
