import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import _ from 'lodash';
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
  TRIBE_DELETE_SUCCESS,
  TRIBE_MEMBER_REMOVE_SUCCESS,
  TRIBE_MEMBER_ACCEPT_SUCCESS,
  TRIBE_DETAIL_LOAD_SUCCESS,
  TRIBE_DETAIL_LOAD_FAIL,
  TRIBE_RESET
} from './TribeReducers';

import {
  MYTRIBE_MEMBER_REMOVE_SUCCESS,
  MYTRIBE_MEMBER_ACCEPT_SUCCESS,
  MYTRIBE_REQUEST_JOIN_SUCCESS,
  MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS
} from './MyTribeReducers';

import {
  REPORT_CREATE
} from '../report/ReportReducers';

// Actions
import {
  refreshMyTribeDetail
} from './MyTribeActions';

// Selector
import {
  getUserStatus
} from './TribeSelector';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

const DEBUG_KEY = '[ Tribe Actions ]';
const BASE_ROUTE = 'secure/tribe';

// Reset tribe page
export const tribeReset = () => (dispatch) => {
  dispatch({
    type: TRIBE_RESET
  });
};

// Creating a new report
// category: ['General', 'User', 'Post', 'Goal', 'Comment', 'Tribe', 'Event']
// type: ['detail', something else]
export const reportTribe = (referenceId, type) => (dispatch, getState) => {
  const { userId } = getState().user;
  // Set the basic information for a report
  dispatch({
    type: REPORT_CREATE,
    payload: {
      type,
      creatorId: userId,
      category: 'Tribe',
      referenceId
    }
  });
  Actions.push('createReport');
};


// User deletes an tribe belongs to self
export const deleteTribe = (tribeId) => (dispatch, getState) => {
  const { token } = getState().user;
  const onSuccess = (res) => {
    Actions.pop();
    dispatch({
      type: TRIBE_DELETE_SUCCESS,
      payload: {
        tribeId      
      }
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
    .delete(`${BASE_ROUTE}?tribeId=${tribeId}`, { }, token)
    .then((res) => {
      if (res.status === 200 || (res.message && res.message.includes('Deleted'))) {
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
  Actions.push('createTribeStack', { initializeFromState: true, tribe });
};

export const openTribeInvitModal = ({ tribeId, cardIconSource, cardIconStyle }) =>
(dispatch) => {
  const searchFor = {
    type: 'tribe',
    id: tribeId
  };
  Actions.push('searchPeopleLightBox', { searchFor, cardIconSource, cardIconStyle });
};

export const inviteUserToTribe = (tribeId, inviteeId) => (dispatch, getState) => {
  const { token } = getState().user;

  const onSuccess = (res) => {
    dispatch({
      type: TRIBE_MEMBER_INVITE_SUCCESS
    });
    console.log(`${DEBUG_KEY}: invite user success: `, res);
    refreshMyTribeDetail(tribeId)(dispatch, getState);
    refreshTribeDetail(tribeId)(dispatch, getState);
    Actions.pop();
    Alert.alert(
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
      if (res && res.success) {
        return onSuccess(res.data);
      }
      return onError(res);
    })
    .catch((err) => {
      onError(err);
    });
};

// User selects member filter
export const tribeSelectMembersFilter = (option, index) => (dispatch) => {
  dispatch({
    type: TRIBE_MEMBER_SELECT_FILTER,
    payload: {
      option,
      index
    }
  });
};

/**
 * User chooses to leave a tribe
 * type: ['mytribe', 'tribe'];
 */
export const leaveTribe = (tribeId, type) => (dispatch, getState) => {
  const { token, userId } = getState().user;
  const actionType = type === 'mytribe'
    ? MYTRIBE_MEMBER_REMOVE_SUCCESS
    : TRIBE_MEMBER_REMOVE_SUCCESS;
  const onSuccess = () => {
    dispatch({
      type: actionType,
      payload: {
        userId,
        tribeId
      }
    });
    console.log(`${DEBUG_KEY}: leave tribe success.`);
  };

  const onError = (err) => {
    Alert.alert(
      'Error',
      'Failed to leave tribe. Please try again later.'
    );
    console.log(`${DEBUG_KEY}: error leaving tribe with err: `, err);
  };

  API
    .delete(`${BASE_ROUTE}/member?tribeId=${tribeId}&removeeId=${userId}`, { }, token)
    .then((res) => {
      if (res.status === 200 || (res && res.message && res.message.includes('Delete'))) {
        return onSuccess();
      }
      onError(res);
    })
    .catch(err => {
      onError(err);
    });
};

/**
 * User accept tribe invitation
 * type: ['mytribe', 'tribe'];
 */
export const acceptTribeInvit = (tribeId, type) => (dispatch, getState) => {
  const { token, userId, user } = getState().user;
  const actionType = type === 'mytribe'
    ? MYTRIBE_MEMBER_ACCEPT_SUCCESS
    : TRIBE_MEMBER_ACCEPT_SUCCESS;
  const onSuccess = (res) => {
    dispatch({
      type: actionType,
      payload: {
        tribeId,
        userId,
        joinerId: userId,
        member: {
          memberRef: {
            ...user
          },
          category: 'Member'
        }
      }
    });
    console.log(`${DEBUG_KEY}: success accept tribe invitation with res: `, res);
    // TODO: refresh page
  };

  const onError = (err) => {
    Alert.alert(
      'Error',
      'Failed to accept inivitation. Please try again later.'
    );
    console.log(`${DEBUG_KEY}: error accept tribe invitation with err: `, err);
  };

  API
    .put(`${BASE_ROUTE}/accept-invitation`, { tribeId }, token)
    .then((res) => {
      if (res && res.message) {
        return onSuccess(res);
      }
      onError(res);
    })
    .catch(err => {
      onError(err);
    });
};

// Decline tribe invitation is the same as leaving a tribe
export const declineTribeInvit = (tribeId, type) => (dispatch, getState) => {
  leaveTribe(tribeId, type)(dispatch, getState);
};

/**
 * User request to join a tribe
 * type: ['mytribe', 'tribe']
 * @param type: if type is undefined or tribe, then it's requested from tribe page
 * Otherwise, it's from mytribe
 */
export const requestJoinTribe = (tribeId, join, type) => (dispatch, getState) => {
  const { token, userId, user } = getState().user;

  const onSuccess = () => {
    if (join) {
      return dispatch({
        type: (type && type === 'mytribe')
          ? MYTRIBE_REQUEST_JOIN_SUCCESS
          : TRIBE_REQUEST_JOIN_SUCCESS,
        payload: {
          tribeId,
          userId,
          member: {
            memberRef: {
              ...user
            },
            category: 'JoinRequester'
          }
        }
      });
    }
    return dispatch({
      type: (type && type === 'mytribe')
        ? MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS
        : TRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
      payload: {
        tribeId,
        userId
      }
    });
  };

  const onError = (err) => {
    if (join) {
      Alert.alert(
        'Join request failed',
        'Please try again later'
      );
    } else {
      Alert.alert(
        'Cancel request failed',
        'Please try again later'
      );
    }

    console.log(`${DEBUG_KEY}: request to join tribe failed with err: `, err);
  };

  if (!join) {
    API
      .delete(`${BASE_ROUTE}/member?tribeId=${tribeId}&removeeId=${userId}`, { }, token)
      .then((res) => {
        if (res.status === 200 || (res.message && res.message.includes('Delete'))) {
          return onSuccess();
        }
        return onError();
      })
      .catch((err) => {
        onError(err);
      });
      return;
  }

  API
    .post(`${BASE_ROUTE}/join-request`, { tribeId }, token)
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

/**
 * Current behavior is to go to explore page and opens up tribe detail
 * and then open tribe detail with id
 */
export const tribeDetailOpenWithId = (tribeId) => (dispatch, getState) => {
  const callback = (res) => {
    console.log(`${DEBUG_KEY}: res for verifying user identify: `, res);
    if (!res.data) {
      return Alert.alert(
        'Tribe not found'
      );
    }
    dispatch({
      type: TRIBE_DETAIL_LOAD_SUCCESS,
      payload: {
        tribe: res.data
      }
    });
    Actions.tribeDetail();
  };

  fetchTribeDetail(tribeId, callback)(dispatch, getState);
};

// Refresh tribe detail
export const refreshTribeDetail = (tribeId) => (dispatch, getState) => {
  const { item } = getState().tribe;
  if (!item || item._id !== tribeId) return;
  fetchTribeDetail(tribeId)(dispatch, getState);
  refreshTribeFeed(tribeId, dispatch, getState);
};

export const tribeDetailOpen = (tribe) => (dispatch, getState) => {
  const isMember = getUserStatus(getState());
  const { _id } = tribe;

  if ((!isMember || isMember === 'JoinRequester') && !tribe.isPubliclyVisible) {
    const callback = (res) => {
      console.log(`${DEBUG_KEY}: res for verifying user identify: `, res);
      if (!res.data || res.status === 400 || res.status === 404) {
        return Alert.alert(
          'Tribe not found'
        );
      }
      dispatch({
        type: TRIBE_DETAIL_LOAD_SUCCESS,
        payload: {
          tribe: res.data
        }
      });
      Actions.tribeDetail();
    };

    fetchTribeDetail(_id, callback)(dispatch, getState);
    return;
  }

  const newTribe = _.cloneDeep(tribe);
  dispatch({
    type: TRIBE_DETAIL_OPEN,
    payload: {
      tribe: _.set(newTribe, 'members', [])
    }
  });
  Actions.tribeDetail();
  fetchTribeDetail(_id)(dispatch, getState);
  refreshTribeFeed(_id, dispatch, getState);
};

/**
 * Fetch tribe detail for a tribe
 */
export const fetchTribeDetail = (tribeId, callback) => (dispatch, getState) => {
  const { token } = getState().user;
  const onSuccess = (data) => {
    dispatch({
      type: TRIBE_DETAIL_LOAD_SUCCESS,
      payload: {
        tribe: data
      }
    });
    console.log(`${DEBUG_KEY}: load tribe detail success with data: `, data);
  };

  const onError = (err) => {
    dispatch({
      type: TRIBE_DETAIL_LOAD_FAIL
    });
    console.log(`${DEBUG_KEY}: failed to load tribe detail with err: `, err);
  };

  API
    .get(`${BASE_ROUTE}/documents/${tribeId}`, token)
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
        hasNextPage: !(data === undefined || data.length === 0),
        pageId: 'TRIBE'
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
        hasNextPage: !(data === undefined || data.length === 0),
        pageId: 'TRIBE'
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
