// Actions for an event that belongs to my event tab
import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import _ from 'lodash';
import {
  MYEVENT_SWITCH_TAB,
  MYEVENT_DETAIL_CLOSE,
  MYEVENT_DETAIL_OPEN,
  MYEVENT_FEED_FETCH,
  MYEVENT_FEED_FETCH_DONE,
  MYEVENT_FEED_REFRESH_DONE,
  MYEVENT_DETAIL_LOAD,
  MYEVENT_DETAIL_LOAD_SUCCESS,
  MYEVENT_DETAIL_LOAD_FAIL,
  MYEVENT_MEMBER_SELECT_FILTER
} from './MyEventReducers';

import {
  getMyEventUserStatus
} from './EventSelector';

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

/**
 * Refresh an event detail
 * NOTE: callback can be provided to execute on refresh finish
 */
export const refreshMyEventDetail = (eventId, callback) => (dispatch, getState) => {
  const { item } = getState().myEvent;
  if (!item || item._id !== eventId) return;
  fetchEventDetail(eventId)(dispatch, getState);
  refreshEventFeed(eventId, dispatch, getState, callback);
};

/**
 * Current behavior is to go to explore page and opens up event detail
 * and then open event detail with id
 */
export const myEventDetailOpenWithId = (eventId) => (dispatch, getState) => {
  dispatch({
    type: MYEVENT_DETAIL_LOAD
  });
  const callback = (res) => {
    console.log(`${DEBUG_KEY}: res for verifying user identify: `, res);
    if (!res.data) {
      return Alert.alert(
        'Event not found'
      );
    }
    dispatch({
      type: MYEVENT_DETAIL_LOAD_SUCCESS,
      payload: {
        tribe: res.data
      }
    });
    Actions.myEventDetail();
  };

  fetchEventDetail(eventId, callback)(dispatch, getState);
};

export const eventDetailOpen = (event) => (dispatch, getState) => {
  // const isMember = getMyEventUserStatus(getState());
  const { userId } = getState().user;
  const { _id } = event;

  // If user is not a member nor an invitee and event is not public visible,
  // Show not found for this tribe
  if (event.isInviteOnly && userId !== event.creator) {
    const callback = (res) => {
      if (!res.data) {
        return Alert.alert(
          'Event not found'
        );
      }
      dispatch({
        type: MYEVENT_DETAIL_LOAD_SUCCESS,
        payload: {
          event: res.data
        }
      });
      Actions.myEventDetail();
    };
    fetchEventDetail(_id, callback)(dispatch, getState);
    return;
  }

  const newEvent = _.cloneDeep(event);
  dispatch({
    type: MYEVENT_DETAIL_OPEN,
    payload: {
      event: _.set(newEvent, 'participants', [])
    }
  });
  Actions.myEventDetail();
  fetchEventDetail(_id)(dispatch, getState);
  refreshEventFeed(_id, dispatch, getState);
};

export const myEventSelectMembersFilter = (option, index) => (dispatch) => {
  dispatch({
    type: MYEVENT_MEMBER_SELECT_FILTER,
    payload: {
      option,
      index
    }
  });
};


/**
 * Fetch event detail for an event
 */
export const fetchEventDetail = (eventId, callback) => (dispatch, getState) => {
  const { token } = getState().user;
  const onSuccess = (data) => {
    dispatch({
      type: MYEVENT_DETAIL_LOAD_SUCCESS,
      payload: {
        event: data
      }
    });
    console.log(`${DEBUG_KEY}: load event detail success with data: `, data);
  };

  const onError = (err) => {
    dispatch({
      type: MYEVENT_DETAIL_LOAD_FAIL
    });
    console.log(`${DEBUG_KEY}: failed to load event detail with err: `, err);
  };

  API
    .get(`${BASE_ROUTE}/documents/${eventId}`, token)
    .then((res) => {
      if (callback) {
        return callback(res);
      }
      if (res.data) {
        return onSuccess(res.data);
      }
      onError(res);
    })
    .catch((err) => {
      onError(err);
    });
};

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions,
 * EventActions, TribeActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */
export const refreshEventFeed = (eventId, dispatch, getState, callback) => {
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

    // This is callback is to perform actions like scrollToIndex in frontend
    if (callback) {
      callback();
    }
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
      if (res.status === 200 && res.data) {
        return callback(res.data);
      }
      callback([]);
      console.warn(`${DEBUG_KEY}: loading with no res`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: loading event error: ${err}`);
    });
};
