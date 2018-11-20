import {
  TRIBETAB_REFRESH_DONE,
  TRIBETAB_LOAD_DONE,
  TRIBETAB_LOAD,
  TRIBETAB_SORTBY,
  TRIBETAB_UPDATE_FILTEROPTIONS
} from './TribeTabReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

const DEBUG_KEY = '[ Action Explore Tribe Tab ]';
const BASE_ROUTE = 'secure/tribe/recommendations';


// update sortBy
export const updateSortBy = (value) => (dispatch, getState) => {
  dispatch({
    type: TRIBETAB_SORTBY,
    value
  });
  refreshTribe()(dispatch, getState);
};


/* Depreacted method */
// update filterForMembershipCategory
// export const updateFilterForMembershipCategory = (value) => (dispatch) =>
//   dispatch({
//     type: TRIBETAB_UPDATE_FILTEROPTIONS,
//     value
//   });
/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions, EventTabActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */

//Refresh feed for activity tab
export const refreshTribe = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit, sortBy } = getState().tribeTab;

  dispatch({
    type: TRIBETAB_LOAD
  });
  loadTribe(0, limit, token, sortBy, { refresh: true }, (data) => {
    dispatch({
      type: TRIBETAB_REFRESH_DONE,
      payload: {
        type: 'tribetab',
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
  const { skip, limit, sortBy, hasNextPage } = getState().tribeTab;
  if (hasNextPage === false) {
    return;
  }
  loadTribe(skip, limit, token, sortBy, {}, (data) => {
    dispatch({
      type: TRIBETAB_LOAD_DONE,
      payload: {
        type: 'tribetab',
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
      `${BASE_ROUTE}?${queryBuilder(skip, limit, { sortBy, ...filterForMembershipCategory })}`,
      token
    )
    .then((res) => {
      console.log(`${DEBUG_KEY}: loading tribe feed with res: `, res);
      if (res && res.data) {
        // Right now return test data
        return callback(res.data);
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
