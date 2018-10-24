import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import _ from 'lodash';
import {
  MYTRIBE_SWITCH_TAB,
  MYTRIBE_DETAIL_OPEN,
  MYTRIBE_DETAIL_LOAD_SUCCESS,
  MYTRIBE_DETAIL_LOAD_FAIL,
  MYTRIBE_DETAIL_CLOSE,
  MYTRIBE_FEED_FETCH,
  MYTRIBE_FEED_FETCH_DONE,
  MYTRIBE_FEED_REFRESH_DONE,
  MYTRIBE_REMOVE_MEMBER_SUCCESS,
  MYTRIBE_PROMOTE_MEMBER_SUCCESS,
  MYTRIBE_MEMBER_SELECT_FILTER
} from './MyTribeReducers';

// Selectors
import {
  getMyTribeUserStatus
} from './TribeSelector';

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

export const myTribeSelectMembersFilter = (option, index) => (dispatch) => {
  dispatch({
    type: MYTRIBE_MEMBER_SELECT_FILTER,
    payload: {
      option,
      index
    }
  });
};

export const tribeDetailClose = () => (dispatch) => {
  Actions.pop();
  dispatch({
    type: MYTRIBE_DETAIL_CLOSE,
  });
};

/**
 * Populate with the basic fields for the tribe detail.
 * Fetch tribe detail
 */
export const tribeDetailOpen = (tribe) => (dispatch, getState) => {
  const isMember = getMyTribeUserStatus(getState());

  // If user is not a member nor an invitee and tribe is not public visible,
  // Show not found for this tribe
  if ((!isMember || isMember === 'JoinRequester') && !tribe.isPubliclyVisible) {
    return Alert.alert(
      'Tribe not found'
    );
  }

  const newTribe = _.cloneDeep(tribe);
  dispatch({
    type: MYTRIBE_DETAIL_OPEN,
    payload: {
      tribe: _.set(newTribe, 'members', [])
    }
  });
  Actions.push('myTribeDetail');
  const { _id } = tribe;
  fetchTribeDetail(_id)(dispatch, getState);
  refreshTribeFeed(_id, dispatch, getState);
};

/**
 * Fetch tribe detail for a tribe
 */
export const fetchTribeDetail = (tribeId) => (dispatch, getState) => {
  const { token } = getState().user;
  const onSuccess = (data) => {
    dispatch({
      type: MYTRIBE_DETAIL_LOAD_SUCCESS,
      payload: {
        tribe: data
      }
    });
    console.log(`${DEBUG_KEY}: load tribe detail success with data: `, data);
  };

  const onError = (err) => {
    dispatch({
      type: MYTRIBE_DETAIL_LOAD_FAIL
    });
    console.log(`${DEBUG_KEY}: failed to load tribe detail with err: `, err);
  };

  API
    .get(`${BASE_ROUTE}/documents/${tribeId}`, token)
    .then((res) => {
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
 * This function removes a user from tribe
 * @param userId: removeeId
 * @param tribeId: tribeId
 */
export const myTribeAdminRemoveUser = (userId, tribeId) => (dispatch, getState) => {
  Alert.alert(
    'Confirmation',
    'Are you sure to remove this user?',
    [
      { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => doMyTribeAdminRemoveUser(userId, tribeId)(dispatch, getState)
      }
    ],
    { cancelable: false }
  );
};

const doMyTribeAdminRemoveUser = (userId, tribeId) => (dispatch, getState) => {
  const { token } = getState().user;
  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: remove member ${userId} successfully with res: `, res);
    dispatch({
      type: MYTRIBE_REMOVE_MEMBER_SUCCESS,
      payload: {
        removeeId: userId
      }
    });
  };
  const onError = (err) => {
    console.log(`${DEBUG_KEY}: failed to remove member ${userId} with err: `, err);
    Alert.alert(
      'Remove member failed',
      'Please try again later'
    );
  };

  API
    .delete(`${BASE_ROUTE}/member?removeeId=${userId}&tribeId=${tribeId}`, token)
    .then((res) => {
      if (res.data && res.message) {
        return onSuccess(res);
      }
      onError(res);
    })
    .catch((err) => {
      onError(err);
    });
};

/**
 * This function promotes a user in tribe to Admin
 * @param userId: promoteeId
 * @param tribeId: tribeId
 */
export const myTribeAdminPromoteUser = (userId, tribeId) => (dispatch, getState) => {
  Alert.alert(
    'Confirmation',
    'Are you sure to promote this user?',
    [
      { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => doMyTribeAdminPromoteUser(userId, tribeId)(dispatch, getState)
      }
    ],
    { cancelable: false }
  );
};

const doMyTribeAdminPromoteUser = (userId, tribeId) => (dispatch, getState) => {
  const { token } = getState().user;
  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: promote member ${userId} successfully with res: `, res);
    dispatch({
      type: MYTRIBE_PROMOTE_MEMBER_SUCCESS,
      payload: {
        promoteeId: userId
      }
    });
  };
  const onError = (err) => {
    console.log(`${DEBUG_KEY}: failed to promote member ${userId} with err: `, err);
    Alert.alert(
      'Promote member failed',
      'Please try again later'
    );
  };

  API
    .post(`${BASE_ROUTE}/admin?promoteeId=${userId}&tribeId=${tribeId}`, token)
    .then((res) => {
      if (res.data && res.message) {
        return onSuccess(res);
      }
      onError(res);
    })
    .catch((err) => {
      onError(err);
    });
};

/**
 * This function demotes a user in tribe to member from Admin
 * @param userId: demoteeId
 * @param tribeId: tribeId
 */
export const myTribeAdminDemoteUser = (userId, tribeId) => (dispatch, getState) => {
  Alert.alert(
    'Confirmation',
    'Are you sure to demote this user?',
    [
      { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => doMyTribeAdminDemoteUser(userId, tribeId)(dispatch, getState)
      }
    ],
    { cancelable: false }
  );
};

const doMyTribeAdminDemoteUser = (userId, tribeId) => (dispatch, getState) => {
  const { token } = getState().user;
  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: demote member ${userId} successfully with res: `, res);
    dispatch({
      type: MYTRIBE_PROMOTE_MEMBER_SUCCESS,
      payload: {
        demoteeId: userId
      }
    });
  };
  const onError = (err) => {
    console.log(`${DEBUG_KEY}: failed to demote member ${userId} with err: `, err);
    Alert.alert(
      'Demote member failed',
      'Please try again later'
    );
  };

  API
    .post(`${BASE_ROUTE}/admin?demoteeId=${userId}&tribeId=${tribeId}`, token)
    .then((res) => {
      if (res.data && res.message) {
        return onSuccess(res);
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