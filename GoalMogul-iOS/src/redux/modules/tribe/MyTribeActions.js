import { Actions } from 'react-native-router-flux';
import {
  MYTRIBE_SWITCH_TAB,
  MYTRIBE_DETAIL_OPEN,
  MYTRIBE_DETAIL_CLOSE,
  MYTRIBE_FEED_FETCH,
  MYTRIBE_FEED_FETCH_DONE,
  MYTRIBE_FEED_REFRESH_DONE
} from './MyTribeReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

const DEBUG_KEY = '[ Tribe Actions ]';
const BASE_ROUTE = 'secure/tribe';

export const tribeSelectTab = (index) => (dispatch) => {
  dispatch({
    type: MYTRIBE_SWITCH_TAB,
    payload: index
  });
};

export const tribeDetailClose = () => (dispatch) => {
  Actions.pop();
  dispatch({
    type: MYTRIBE_DETAIL_CLOSE,
  });
};

export const tribeDetailOpen = (tribe) => (dispatch, getState) => {
  dispatch({
    type: MYTRIBE_DETAIL_OPEN,
    payload: { ...tribe }
  });
  Actions.push('myTribeDetail');
  refreshTribeFeed(tribe._id, dispatch, getState);
};

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions,
 * TribeActions, TribeActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */
export const refreshTribeFeed = (tribeId, dispatch, getState) => {
  const { token } = getState().user;
  const { limit } = getState().tribe;

  dispatch({
    type: MYTRIBE_FEED_FETCH
  });
  loadTribeFeed(0, limit, token, { tribeId }, (data) => {
    dispatch({
      type: MYTRIBE_FEED_REFRESH_DONE,
      payload: {
        type: 'tribefeed',
        data,
        skip: data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
  }, () => {
    // TODO: implement for onError
  });
};

export const loadMoreTribeFeed = (tribeId) => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, hasNextPage } = getState().tribe;
  if (hasNextPage === false) {
    return;
  }
  dispatch({
    type: MYTRIBE_FEED_FETCH
  });
  loadTribeFeed(skip, limit, token, { tribeId }, (data) => {
    dispatch({
      type: MYTRIBE_FEED_FETCH_DONE,
      payload: {
        type: 'tribefeed',
        data,
        skip: data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
  }, () => {
    // TODO: implement for onError
  });
};

export const loadTribeFeed = (skip, limit, token, params, callback, onError) => {
  API
    .get(
      `${BASE_ROUTE}/feed?${queryBuilder(skip, limit, { ...params })}`,
      token
    )
    .then((res) => {
      console.log(`${DEBUG_KEY}: loading with res: `, res);
      if (res && res.data) {
        // Right now return test data
        return callback(res.data);
      }
      console.warn(`${DEBUG_KEY}: loading with no res. Message is: `, res.message);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: loading comment error: ${err}`);
    });
};
