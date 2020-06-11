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
  TRIBE_REQUEST_JOIN,
  TRIBE_REQUEST_JOIN_SUCCESS,
  TRIBE_REQUEST_JOIN_ERROR,
  TRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
  TRIBE_REQUEST_CANCEL_JOIN_ERROR,
  TRIBE_REQUEST_CANCEL_JOIN,
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
  MYTRIBE_REQUEST_JOIN_SUCCESS,
  MYTRIBE_REQUEST_JOIN_ERROR,
  MYTRIBE_REQUEST_JOIN,
  MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
  MYTRIBE_REQUEST_CANCEL_JOIN_ERROR,
  MYTRIBE_REQUEST_CANCEL_JOIN
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
import { trackWithProperties, EVENT as E } from '../../../monitoring/segment';
import { MYTRIBE_UPDATE_MEMBER_SUCCESS, MEMBER_UPDATE_TYPE } from './Tribes';

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
  trackWithProperties(E.TRIBE_REPORTED, {'UserId': userId, 'ReferenceId': referenceId});
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
  const { token, userId } = getState().user;
  const onSuccess = (res) => {
    trackWithProperties(E.TRIBE_DELETED, {'UserId': userId, 'TribeId': tribeId});
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

/**
 * Send invite requests to multiple users for a tribe
 * @param {*} tribeId 
 * @param {*} users 
 * @param {*} callback 
 */
export const inviteMultipleUsersToTribe = (tribeId, users, callback) => (dispatch, getState) => {
  const { token, userId } = getState().user;
  trackWithProperties(E.TRIBE_INVITE_SENT, {'UserId': userId, 'TribeId': tribeId});
  (async () => {
    let failedItems = []; 

    for (let user of users) {
        // send the message
        const body = {
            tribeId, inviteeId: user._id
        };
        try {
            const resp = await API.post(`${BASE_ROUTE}/member-invitation`, body, token);
            if (resp.status != 200) {
                failedItems.push(user);
            };
        } catch(e) {
            failedItems.push(user);
        };
    };

    if (failedItems.length == 0) {
        Alert.alert('Success', 'Your friends have been invited');
        // Use callback if there is one
        if (callback) {
          callback();
        } else {
          Actions.pop();
        }
    } else {
        const failedUserNames = failedItems.reduce((accum, u) => {
            return `${accum}, ${u.name}`;
        }, '');
        Alert.alert('Error', `Could not invite some users: ${failedUserNames}`);
    };
  })();
};

/**
 * Invite a single user to the tribe. This API is likely to be deprecated after 
 * inviteMultipleUsersToTribe with the multi-select invite modal is implemented
 * 
 * @param {String} tribeId 
 * @param {String} inviteeId 
 */
export const inviteUserToTribe = (tribeId, inviteeId) => (dispatch, getState) => {
  const { token, userId } = getState().user;
  const onSuccess = (res) => {
    trackWithProperties(E.TRIBE_INVITE_SENT, {'UserId': userId, 'TribeId': tribeId});
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
    ? MYTRIBE_UPDATE_MEMBER_SUCCESS
    : TRIBE_MEMBER_REMOVE_SUCCESS;
  const onSuccess = () => {
    trackWithProperties(type === 'mytribe' ? E.TRIBE_LEFT : E.TRIBE_MEMBER_REMOVED,
      {'UserId': userId, 'TribeId': tribeId, 'RemoveeId': userId});
    
    // TODO: tribe: remove below action and move the function to MyTribeActions.js
    dispatch({
      type: actionType,
      payload: {
        userId,
        tribeId
      }
    });
    dispatch({
      type: MYTRIBE_UPDATE_MEMBER_SUCCESS,
      payload: {
        userId,
        tribeId,
        updateType: MEMBER_UPDATE_TYPE.removeMember
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
    ? MYTRIBE_UPDATE_MEMBER_SUCCESS
    : TRIBE_MEMBER_ACCEPT_SUCCESS;
  const onSuccess = (res) => {
    trackWithProperties(E.TRIBE_INVITE_ACCEPTED, {'UserId': userId, 'TribeId': tribeId});

    // TODO: tribe: cleanup below action and move this function to MyTribeActions
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
    dispatch({
      type: MYTRIBE_UPDATE_MEMBER_SUCCESS,
      payload: {
        tribeId,
        userId,
        updateType: MEMBER_UPDATE_TYPE.acceptMember
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
export const requestJoinTribe = (tribeId, join, type, pageId) => (dispatch, getState) => {
  const { token, userId, user } = getState().user;
  let startActionType, endActionErrorType;
  if (join) {
    startActionType = type && type === 'mytribe' ? MYTRIBE_REQUEST_JOIN : TRIBE_REQUEST_JOIN;
    endActionErrorType = type && type === 'mytribe'? MYTRIBE_REQUEST_JOIN_ERROR : TRIBE_REQUEST_JOIN_ERROR;
    trackWithProperties(E.TRIBE_JOIN_REQUESTED, {'TribeId': tribeId, 'UserId': userId});
  } else {
    startActionType = type && type === 'mytribe' ? MYTRIBE_REQUEST_CANCEL_JOIN : TRIBE_REQUEST_CANCEL_JOIN;
    endActionErrorType = type && type === 'mytribe' ? MYTRIBE_REQUEST_CANCEL_JOIN_ERROR : TRIBE_REQUEST_CANCEL_JOIN_ERROR;
    trackWithProperties(E.TRIBE_JOIN_CANCELLED, {'TribeId': tribeId, 'UserId': userId});
  }

  console.log(`${DEBUG_KEY}: startActiontype: ${startActionType}, join: ${join}, type:${type}`);
  dispatch({
    type: startActionType
  });

  const onSuccess = () => {
    if (join) {
      return dispatch({
        type: (type && type === 'mytribe')
          ? MYTRIBE_REQUEST_JOIN_SUCCESS
          : TRIBE_REQUEST_JOIN_SUCCESS,
        payload: {
          tribeId,
          userId,
          pageId,
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
        userId,
        pageId
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
    dispatch({
      type: endActionErrorType,
      payload: {
        tribeId,
        pageId
      }
    });
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

// Refresh tribe detail
export const refreshTribeDetail = (tribeId, callback) => (dispatch, getState) => {
  const { item } = getState().tribe;
  if (!item || item._id !== tribeId) return;
  fetchTribeDetail(tribeId, callback)(dispatch, getState);
  refreshTribeFeed(tribeId, dispatch, getState);
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
      trackWithProperties(E.TRIBE_DETAIL_OPENED, {...res, 'TribeId': tribeId});
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
  const { skip, limit, hasNextPage, feed, feedLoading } = getState().tribe;

  // Do not load more in the following conditions
  // 1. No next page 2. already loading more 3. no feed item (when page is initial loading flatlist will invoke onEndReached)
  if (hasNextPage === false || feedLoading || feed.length == 0) {
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
        skip: data.length + feed.length,
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
