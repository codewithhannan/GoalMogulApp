import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import {
  TRIBE_SWITCH_TAB,
  TRIBE_DETAIL_OPEN,
  TRIBE_DETAIL_CLOSE,
  TRIBE_FEED_FETCH,
  TRIBE_FEED_FETCH_DONE,
  TRIBE_FEED_REFRESH_DONE,
  TRIBE_REQUEST_JOIN_SUCCESS,
  TRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
  TRIBE_MEMBER_SELECT_FILTER,
  TRIBE_MEMBER_INVITE_SUCCESS,
  TRIBE_MEMBER_INVITE_FAIL,
  TRIBE_DELETE_SUCCESS
} from './TribeReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

const DEBUG_KEY = '[ Tribe Actions ]';
const BASE_ROUTE = 'secure/tribe';

export const reportTribe = (tribeId) => (dispatch, getState) => {
  
};

// User deletes an tribe belongs to self
export const deleteTribe = (tribeId) => (dispatch, getState) => {
  const { token } = getState().user;
  const onSuccess = (res) => {
    Actions.pop();
    dispatch({
      type: TRIBE_DELETE_SUCCESS
    });
    console.log(`${DEBUG_KEY}: tribe with id: ${tribeId}, is deleted with res: `, res);
    Alert.alert(
      'Success',
      'You have successfully deleted the tribe.'
    );
  };

  const onError = (err) => {
    Alert.alert(
      'Error',
      'Failed to delete this tribe. Please try again later.'
    );
    console.log(`${DEBUG_KEY}: delete tribe error: `, err);
  };

  API
    .delete(`${BASE_ROUTE}`, { tribeId }, token)
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

// User edits a tribe. Open the create tribe modal with pre-populated item.
export const editTribe = (tribe) => (dispatch, getState) => {
  Actions.push('createTribeModal', { initializeFromState: true, tribe });
};

export const openTribeInvitModal = (tribeId) => (dispatch) => {
  const searchFor = {
    type: 'tribe',
    id: tribeId
  };
  Actions.push('searchPeopleLightBox', { searchFor });
};

export const inviteUserToTribe = (tribeId, inviteeId) => (dispatch, getState) => {
  const { token } = getState().user;

  const onSuccess = (res) => {
    dispatch({
      type: TRIBE_MEMBER_INVITE_SUCCESS
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
      type: TRIBE_MEMBER_INVITE_FAIL
    });
    Alert.alert(
      'Error',
      'Failed to send invitation to user. Please try again later.'
    );
    console.log(`${DEBUG_KEY}: error sending invitation to user: `, err);
  };

  API
    .post(`${BASE_ROUTE}/member-invitation`, { tribeId, inviteeId }, token)
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

// User selects member filter
export const tribeSelectMembersFilter = (option) => (dispatch) => {
  dispatch({
    type: TRIBE_MEMBER_SELECT_FILTER,
    payload: option
  });
};

export const requestJoinTribe = (tribeId, join) => (dispatch, getState) => {
  const { token } = getState().user;

  const onSuccess = () => {
    if (join) {
      return dispatch({
        type: TRIBE_REQUEST_JOIN_SUCCESS
      });
    }
    return dispatch({
      type: TRIBE_REQUEST_CANCEL_JOIN_SUCCESS
    });
  };

  const onError = (err) => {
    Alert.alert(
      'Failed to request to join',
      'Please try again later'
    );
    console.log(`${DEBUG_KEY}: request to join tribe failed with err: `, err);
  };

  API
    .post(`${BASE_ROUTE}/joint-request`, { tribeId }, token)
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

export const tribeSelectTab = (index) => (dispatch) => {
  dispatch({
    type: TRIBE_SWITCH_TAB,
    payload: index
  });
};

export const tribeDetailClose = () => (dispatch) => {
  Actions.pop();
  dispatch({
    type: TRIBE_DETAIL_CLOSE,
  });
};

export const tribeDetailOpen = (tribe) => (dispatch, getState) => {
  dispatch({
    type: TRIBE_DETAIL_OPEN,
    payload: { ...tribe }
  });
  Actions.tribeDetail();
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
    type: TRIBE_FEED_FETCH
  });
  loadTribeFeed(0, limit, token, { tribeId }, (data) => {
    dispatch({
      type: TRIBE_FEED_REFRESH_DONE,
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
    type: TRIBE_FEED_FETCH
  });
  loadTribeFeed(skip, limit, token, { tribeId }, (data) => {
    dispatch({
      type: TRIBE_FEED_FETCH_DONE,
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
      console.warn(`${DEBUG_KEY}: loading with no res. Message is: ${res.message}`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: loading comment error: ${err}`);
      onError(err);
    });
};
