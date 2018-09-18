// Actions for an event that belongs to my event tab
import { Actions } from 'react-native-router-flux';
import {
  MYEVENT_SWITCH_TAB,
  MYEVENT_DETAIL_CLOSE,
  MYEVENT_DETAIL_OPEN,
  MYEVENT_FEED_FETCH,
  MYEVENT_FEED_FETCH_DONE,
  MYEVENT_FEED_REFRESH_DONE
} from './MyEventReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

const DEBUG_KEY = '[ Event Actions ]';
const BASE_ROUTE = 'secure/event';

export const eventSelectTab = (index) => (dispatch) => {
  dispatch({
    type: MYEVENT_SWITCH_TAB,
    payload: index
  });
};

export const eventDetailClose = () => (dispatch) => {
  Actions.pop();
  dispatch({
    type: MYEVENT_DETAIL_CLOSE
  });
};

export const eventDetailOpen = (event) => (dispatch, getState) => {
  dispatch({
    type: MYEVENT_DETAIL_OPEN,
    payload: { ...event }
  });
  Actions.myEventDetail();
  refreshEventFeed(event._id, dispatch, getState);
};

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions,
 * EventActions, TribeActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */
export const refreshEventFeed = (eventId, dispatch, getState) => {
  const { token } = getState().user;
  const { limit } = getState().event;

  dispatch({
    type: MYEVENT_FEED_FETCH
  });
  loadEventFeed(0, limit, token, { eventId }, (data) => {
    dispatch({
      type: MYEVENT_FEED_REFRESH_DONE,
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
    type: MYEVENT_FEED_FETCH
  });
  loadEventFeed(skip, limit, token, { eventId }, (data) => {
    dispatch({
      type: MYEVENT_FEED_FETCH_DONE,
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
      callback([]);
      console.warn(`${DEBUG_KEY}: loading with no res`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: loading event error: ${err}`);
    });
};
