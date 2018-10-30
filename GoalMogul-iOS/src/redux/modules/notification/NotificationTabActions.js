import {
  NOTIFICATION_REFRESH_SUCCESS,
  NOTIFICATION_LOAD,
  NOTIFICATION_LOAD_SUCCESS,
  NOTIFICATION_LOAD_FAIL,
  NOTIFICATION_SEE_MORE,
  NOTIFICATION_SEE_LESS
} from './NotificationTabReducers';

import { queryBuilder } from '../../middleware/utils';
import { api as API } from '../../middleware/api';

// Constants
const DEBUG_KEY = '[ Actions NotificationTab ]';

/**
 * clicks to see more notification for a type
 * @param type: ['needs', 'notifications']
 */
export const seeMoreNotification = (type) => (dispatch) => {
  dispatch({
    type: NOTIFICATION_SEE_MORE,
    payload: {
      type
    }
  });
};

/**
 * clicks to see less notification for a type
 * @param type: ['needs', 'notifications']
 */
export const seeLessNotification = (type) => (dispatch) => {
  dispatch({
    type: NOTIFICATION_SEE_LESS,
    payload: {
      type
    }
  });
};

/* Following are actions to load notifications */

/**
 * Refresh notifications and needs
 */
export const refreshNotifications = () => (dispatch, getState) => {
  const { skip, limit } = getState().notification.notifications;

  dispatch({
    type: NOTIFICATION_LOAD,
    payload: {
      type: 'notifications'
    }
  });

  const onSuccess = (data) => {
    console.log(`${DEBUG_KEY}: refresh notifications succeed with data: `, data);
    dispatch({
      type: NOTIFICATION_REFRESH_SUCCESS,
      payload: {
        type: 'notifications',
        data,
        skip: data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0 || data.length < limit)
      }
    });
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: refresh notifications failed with err: `, err);
    dispatch({
      type: NOTIFICATION_LOAD_FAIL,
      payload: {
        type: 'notifications'
      }
    });
  };

  loadNotifications(skip, limit, { refresh: true }, onSuccess, onError)(dispatch, getState);
  refreshNeeds()(dispatch, getState);
};

/**
 * Load more notifications based on skip and limit and hasNextPage
 */
export const loadMoreNotifications = () => (dispatch, getState) => {
  const { skip, limit, hasNextPage } = getState().notification.notifications;
  if (hasNextPage === false) return;

  dispatch({
    type: NOTIFICATION_LOAD,
    payload: {
      type: 'notifications'
    }
  });

  const onSuccess = (data) => {
    console.log(`${DEBUG_KEY}: load more notifications succeed with data: `, data);
    dispatch({
      type: NOTIFICATION_LOAD_SUCCESS,
      payload: {
        type: 'notifications',
        data,
        skip: skip + data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0 || data.length < limit)
      }
    });
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: load more notifications failed with err: `, err);
    dispatch({
      type: NOTIFICATION_LOAD_FAIL,
      payload: {
        type: 'notifications'
      }
    });
  };

  loadNotifications(skip, limit, {}, onSuccess, onError)(dispatch, getState);
};

export const loadNotifications = (skip, limit, params, onSuccess, onError) =>
(dispatch, getState) => {
  const { token } = getState().user;
  API
    .get(`secure/notification/activity?${queryBuilder(skip, limit, { ...params })}`, token)
    .then((res) => {
      if (res && res.data) {
        return onSuccess(res.data);
      }
      onError(res);
    })
    .catch((err) => onError(err));
};

/* Following are actions to load needs */
export const refreshNeeds = () => (dispatch, getState) => {
  const { skip, limit } = getState().notification.needs;

  dispatch({
    type: NOTIFICATION_LOAD,
    payload: {
      type: 'needs'
    }
  });

  const onSuccess = (data) => {
    console.log(`${DEBUG_KEY}: refresh needs succeed with data: `, data);
    dispatch({
      type: NOTIFICATION_REFRESH_SUCCESS,
      payload: {
        type: 'needs',
        data,
        skip: data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0 || data.length < limit)
      }
    });
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: refresh needs failed with err: `, err);
    dispatch({
      type: NOTIFICATION_LOAD_FAIL,
      payload: {
        type: 'needs'
      }
    });
  };

  loadNeeds(skip, limit, onSuccess, onError)(dispatch, getState);
};

/**
 * Load more notifications based on skip and limit
 */
export const loadMoreNeeds = () => (dispatch, getState) => {
  const { skip, limit, hasNextPage } = getState().notification.needs;
  if (hasNextPage === false) return;

  dispatch({
    type: NOTIFICATION_LOAD,
    payload: {
      type: 'needs'
    }
  });

  const onSuccess = (data) => {
    console.log(`${DEBUG_KEY}: load more needs succeed with data: `, data);
    dispatch({
      type: NOTIFICATION_LOAD_SUCCESS,
      payload: {
        type: 'needs',
        data,
        skip: skip + data.length,
        limit,
        hasNextPage: !(data === undefined || data.length === 0 || data.length < limit)
      }
    });
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: load more needs failed with err: `, err);
    dispatch({
      type: NOTIFICATION_LOAD_FAIL,
      payload: {
        type: 'needs'
      }
    });
  };

  loadNeeds(skip, limit, onSuccess, onError)(dispatch, getState);
};

export const loadNeeds = (skip, limit, onSuccess, onError) => (dispatch, getState) => {
  const { token } = getState().user;
  API
    .get(`secure/goal/needs/feed?${queryBuilder(skip, limit, {})}`, token)
    .then((res) => {
      if (res && res.data) {
        return onSuccess(res.data);
      }
      onError(res);
    })
    .catch((err) => onError(err));
};
