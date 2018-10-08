import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import {
  EVENT_SWITCH_TAB,
  EVENT_DETAIL_CLOSE,
  EVENT_DETAIL_OPEN,
  EVENT_FEED_FETCH,
  EVENT_FEED_FETCH_DONE,
  EVENT_FEED_REFRESH_DONE,
  EVENT_UPDATE_RSVP_STATUS,
  EVENT_UPDATE_RSVP_STATUS_SUCCESS,
  EVENT_UPDATE_RSVP_STATUS_FAIL,
  EVENT_PARTICIPANT_SELECT_FILTER,
  EVENT_PARTICIPANT_INVITE_SUCCESS,
  EVENT_PARTICIPANT_INVITE_FAIL
} from './EventReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder, switchCase } from '../../middleware/utils';

const DEBUG_KEY = '[ Event Actions ]';
const BASE_ROUTE = 'secure/event';

export const openEventInvitModal = (eventId) => (dispatch) => {
  const searchFor = {
    type: 'event',
    id: eventId
  };
  Actions.push('searchPeopleLightBox', { searchFor });
};

export const inviteParticipantToEvent = (eventId, inviteeId) => (dispatch, getState) => {
  const { token } = getState().user;

  const onSuccess = (res) => {
    dispatch({
      type: EVENT_PARTICIPANT_INVITE_SUCCESS
    });
    console.log(`${DEBUG_KEY}: invite user success: `, res);
    Actions.pop();
    Alert.aler(
      'Success',
      'You have successfully invited the user.'
    );
  };

  const onError = (err) => {
    dispatch({
      type: EVENT_PARTICIPANT_INVITE_FAIL
    });
    Alert.alert(
      'Error',
      'Failed to send invitation to user. Please try again later.'
    );
    console.log(`${DEBUG_KEY}: error sending invitation to user: `, err);
  };

  API
    .post(`${BASE_ROUTE}/participant`, { eventId, inviteeId }, token)
    .then((res) => {
      if (res && res.data) {
        return onSuccess(res.data);
      }
      return onError(res);
    })
    .catch((err) => {
      onError(err);
    });
};

// User updates his rsvp status for an event
export const rsvpEvent = (option, eventId) => (dispatch, getState) => {
  const { token, userId } = getState().user;

  const onSuccess = (res) => {
    dispatch({
      type: EVENT_UPDATE_RSVP_STATUS_SUCCESS,
      payload: {
        participantRef: {
          _id: userId
        },
        rsvp: option
      }
    });
    console.log(`${DEBUG_KEY}: rsvp success with res: `, res);
  };

  const onError = (err) => {
    dispatch({
      type: EVENT_UPDATE_RSVP_STATUS_FAIL
    });
    Alert.alert(
      'RSVP failed',
      'Please try again later'
    );
    console.log(`${DEBUG_KEY}: rsvp failed with err: `, err);
  };

  API
    .put(`${BASE_ROUTE}/rsvp`, { eventId, rsvpStatus: option }, token)
    .then((res) => {
      if (!res.message) {
        return onSuccess();
      }
      onError();
    })
    .catch((err) => {
      onError(err);
    });
};

export const eventSelectParticipantsFilter = (option) => (dispatch) => {
  dispatch({
    type: EVENT_PARTICIPANT_SELECT_FILTER,
    payload: option
  });
};

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

export const eventDetailOpen = (event) => (dispatch, getState) => {
  dispatch({
    type: EVENT_DETAIL_OPEN,
    payload: { ...event }
  });
  Actions.eventDetail();
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
      callback([]);
      console.warn(`${DEBUG_KEY}: loading with no res`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: loading event error: ${err}`);
    });
};
