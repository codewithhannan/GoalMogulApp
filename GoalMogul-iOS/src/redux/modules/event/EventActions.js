import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import _ from 'lodash';
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
  EVENT_PARTICIPANT_INVITE_FAIL,
  EVENT_DELETE_SUCCESS,
  EVENT_EDIT,
  EVENT_DETAIL_LOAD_SUCCESS,
  EVENT_DETAIL_LOAD_FAIL
} from './EventReducers';

import {
  REPORT_CREATE
} from '../report/ReportReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder, switchCase } from '../../middleware/utils';

const DEBUG_KEY = '[ Event Actions ]';
const BASE_ROUTE = 'secure/event';

// Creating a new report
// category: ['General', 'User', 'Post', 'Goal', 'Comment', 'Tribe', 'Event']
// type: ['detail', something else]
export const reportEvent = (referenceId, type) => (dispatch, getState) => {
  const { userId } = getState().user;
  // Set the basic information for a report
  dispatch({
    type: REPORT_CREATE,
    payload: {
      type,
      creatorId: userId,
      category: 'Event',
      referenceId
    }
  });
  Actions.push('createReport');
};

// User deletes an event belongs to self
export const deleteEvent = (eventId) => (dispatch, getState) => {
  const { token } = getState().user;
  const onSuccess = (res) => {
    Actions.pop();
    dispatch({
      type: EVENT_DELETE_SUCCESS
    });
    console.log(`${DEBUG_KEY}: event with id: ${eventId}, is deleted with res: `, res);
    Alert.alert(
      'Success',
      'You have successfully deleted the event.'
    );
  };

  const onError = (err) => {
    Alert.alert(
      'Error',
      'Failed to delete this event. Please try again later.'
    );
    console.log(`${DEBUG_KEY}: delete event error: `, err);
  };

  API
    .delete(`${BASE_ROUTE}`, { eventId }, token)
    .then((res) => {
      if (res.message && res.message.includes('Deleted')) {
        return onSuccess(res);
      }
      onError(res);
    })
    .catch((err) => {
      onError(err);
    });
};

// User edits an event. Open the create event page with pre-populated item.
export const editEvent = (event) => (dispatch, getState) => {
  Actions.push('createEventModal', { initializeFromState: true, event });
};

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
    Alert.alert(
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
      if (res && res.success) {
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

/**
 * Current behavior is to go to explore page and opens up event detail
 * and then open event detail with id
 */
export const eventDetailOpenWithId = (eventId) => (dispatch, getState) => {
  const callback = (res) => {
    console.log(`${DEBUG_KEY}: res for verifying user identify: `, res);
    if (!res.data) {
      return Alert.alert(
        'Event not found'
      );
    }
    dispatch({
      type: EVENT_DETAIL_LOAD_SUCCESS,
      payload: {
        tribe: res.data
      }
    });
    Actions.eventDetail();
  };

  fetchEventDetail(eventId, callback)(dispatch, getState);
};

/**
 * Open an event detail
 */
export const eventDetailOpen = (event) => (dispatch, getState) => {
  const { userId } = getState().user;
  const { _id } = event;

  // If user is not a member nor an invitee and event is not public visible,
  // Show not found for this tribe
  if (event.isInviteOnly && userId !== event.creator) {
    const callback = (res) => {
      console.log(`${DEBUG_KEY}: res for verifying user identify: `, res);
      if (!res.data) {
        return Alert.alert(
          'Event not found'
        );
      }
      dispatch({
        type: EVENT_DETAIL_LOAD_SUCCESS,
        payload: {
          event: res.data
        }
      });
      Actions.eventDetail();
    };
    fetchEventDetail(_id, callback)(dispatch, getState);
    return;
  }

  const newEvent = _.cloneDeep(event);
  dispatch({
    type: EVENT_DETAIL_OPEN,
    payload: {
      event: _.set(newEvent, 'participants', [])
    }
  });
  Actions.eventDetail();
  fetchEventDetail(_id)(dispatch, getState);
  refreshEventFeed(_id, dispatch, getState);
};

/**
 * Fetch event detail for an event
 */
export const fetchEventDetail = (eventId, callback) => (dispatch, getState) => {
  const { token } = getState().user;
  const onSuccess = (data) => {
    dispatch({
      type: EVENT_DETAIL_LOAD_SUCCESS,
      payload: {
        event: data
      }
    });
    console.log(`${DEBUG_KEY}: load event detail success with data: `, data);
  };

  const onError = (err) => {
    dispatch({
      type: EVENT_DETAIL_LOAD_FAIL
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
