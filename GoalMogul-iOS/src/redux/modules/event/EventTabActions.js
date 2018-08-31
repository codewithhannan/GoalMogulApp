import {
  EVENTTAB_REFRESH_DONE,
  EVENTTAB_LOAD_DONE,
  EVENTTAB_LOAD,
  EVENTTAB_SORTBY,
  EVENTTAB_UPDATE_FILTEROPTIONS
} from './EventTabReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

const DEBUG_KEY = '[ Action Event Tab ]';
const BASE_ROUTE = 'secure/event/';


// update sortBy
export const updateSortBy = (value) => (dispatch) =>
  dispatch({
    type: EVENTTAB_SORTBY,
    value
  });

// update filterOptions
export const updateFilterOptions = (value) => (dispatch) =>
  dispatch({
    type: EVENTTAB_UPDATE_FILTEROPTIONS,
    value
  });
/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions, TribeTabActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */

//Refresh feed for activity tab
export const refreshEvent = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit, filterOptions, sortBy } = getState().eventTab;

  dispatch({
    type: EVENTTAB_LOAD
  });
  loadEvent(0, limit, token, sortBy, filterOptions, (data) => {
    dispatch({
      type: EVENTTAB_REFRESH_DONE,
      payload: {
        type: 'eventtab',
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
  const { skip, limit, sortBy, filterOptions, hasNextPage } = getState().eventTab;
  if (!hasNextPage) {
    return;
  }
  loadEvent(skip, limit, token, sortBy, filterOptions, (data) => {
    dispatch({
      type: EVENTTAB_LOAD_DONE,
      payload: {
        type: 'eventtab',
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
      console.log('loading goal with res: ', res);
      if (res) {
        // Right now return test data
        if (skip === 0) {
          callback([]);
        } else {
          callback([]);
        }
      }
      console.warn(`${DEBUG_KEY}: Loading goal with no res`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY} load goal error: ${err}`);
      if (skip === 0) {
        callback([]);
      } else {
        callback([]);
      }
    });
};