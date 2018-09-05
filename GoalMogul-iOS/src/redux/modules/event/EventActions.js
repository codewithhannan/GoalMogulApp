import { Actions } from 'react-native-router-flux';
import {
  EVENT_SWITCH_TAB,
  EVENT_DETAIL_CLOSE,
  EVENT_DETAIL_OPEN,
  EVENT_FEED_FETCH,
  EVENT_FEED_FETCH_DONE,
  EVENT_FEED_REFRESH_DONE
} from './EventReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

const DEBUG_KEY = '[ Event Actions ]';
const BASE_ROUTE = 'secure/event/';

export const eventSelectTab = (index) => (dispatch) => {
  dispatch({
    type: EVENT_SWITCH_TAB,
    payload: index
  });
};

export const eventDetailClose = () => (dispatch) => {
  Actions.pop();
  dispatch({
    type: EVENT_DETAIL_CLOSE
  });
};

export const eventDetailOpen = (event) => (dispatch) => {
  dispatch({
    type: EVENT_DETAIL_OPEN,
    payload: { ...event }
  });
  Actions.eventDetail();
  refreshEventFeed(event._id);
};

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions,
 * EventActions, TribeActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */
export const refreshEventFeed = (eventId) => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit } = getState().event;

  dispatch({
    type: EVENT_FEED_FETCH
  });
  loadEventFeed(0, limit, token, { eventId }, (data) => {
    dispatch({
      type: EVENT_FEED_REFRESH_DONE,
      payload: {
        type: 'eventfeed',
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

export const loadMoreEventFeed = (eventId) => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, hasNextPage } = getState().event;
  if (hasNextPage === false) {
    return;
  }
  dispatch({
    type: EVENT_FEED_FETCH
  });
  loadEventFeed(skip, limit, token, { eventId }, (data) => {
    dispatch({
      type: EVENT_FEED_FETCH_DONE,
      payload: {
        type: 'eventfeed',
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

export const loadEventFeed = (skip, limit, token, params, callback, onError) => {
  API
    .get(
      `${BASE_ROUTE}/feed?${queryBuilder(skip, limit, { ...params })}`,
      token
    )
    .then((res) => {
      console.log(`${DEBUG_KEY}: loading with res: `, res);
      if (res) {
        // Right now return test data
        if (skip === 0) {
          callback(res);
        } else {
          callback([]);
        }
      }
      console.warn(`${DEBUG_KEY}: loading with no res`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: loading comment error: ${err}`);
    });
};
