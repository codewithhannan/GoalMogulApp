import {
  EVENTTAB_REFRESH_DONE,
  EVENTTAB_LOAD_DONE,
  EVENTTAB_LOAD,
  EVENTTAB_SORTBY,
  EVENTTAB_UPDATE_FILTEROPTIONS
} from './EventTabReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

const DEBUG_KEY = '[ Action Explore Event Tab ]';
const BASE_ROUTE = 'secure/event/recommendation';


// update sortBy
export const updateSortBy = (value) => (dispatch, getState) => {
  dispatch({
    type: EVENTTAB_SORTBY,
    value
  });

  refreshEvent()(dispatch, getState);
};

/*
 * Deprecated
 */
// update filterOptions
// export const updateFilterOptions = (value) => (dispatch) =>
//   dispatch({
//     type: EVENTTAB_UPDATE_FILTEROPTIONS,
//     value
//   });
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
  const { limit, sortBy } = getState().eventTab;

  dispatch({
    type: EVENTTAB_LOAD
  });
  loadEvent(0, limit, token, sortBy, { refresh: true }, (data) => {
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
  const { skip, limit, sortBy, hasNextPage } = getState().eventTab;
  if (hasNextPage === false) {
    return;
  }
  loadEvent(skip, limit, token, sortBy, {}, (data) => {
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
      console.log('loading events feed with res: ', res);
      if (res && res.data) {
        // Right now return test data
        return callback(res.data);
      }
      console.warn(`${DEBUG_KEY}: Loading event feed with no res`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY} load event feed error: ${err}`);
      if (skip === 0) {
        callback([]);
      } else {
        callback([]);
      }
    });
};
