/**
 * This is reducer for notification tab
 */
import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

import {
  USER_LOG_OUT
} from '../../../reducers/User';

const INITIAL_STATE = {
  notifications: {
    data: [],
    loading: false,
    refreshing: false,
    skip: 0,
    limit: 10,
    hasNextPage: undefined,
    deleting: false,
    seeMoreSkip: 5, // Every time shows 5 more notifications
    seeMoreCount: 5 // how many items are shown currently
  },
  needs: {
    data: [],
    loading: false,
    refreshing: false,
    skip: 0,
    limit: 10,
    hasNextPage: undefined,
    seeMoreSkip: 5, // Every time shows 5 more notifications
    seeMoreCount: 5 // how many items are shown currently
  },
  unread: {
    data: [], // Unread notification FIFO queue, limit up to 50 items
    limit: 50,
    unreadCount: undefined, // This is fetched through periodic task getting unread count
    shouldUpdateUnreadCount: undefined
  }
};

const DEBUG_KEY = '[ Reducers NotificationTab ]';

export const NOTIFICATION_REFRESH = 'notification_refresh';
export const NOTIFICATION_REFRESH_SUCCESS = 'notification_refresh_success';
export const NOTIFICATION_REFRESH_FAIL = 'notification_refresh_fail';
export const NOTIFICATION_LOAD = 'notification_load';
export const NOTIFICATION_LOAD_SUCCESS = 'notification_load_done';
export const NOTIFICATION_LOAD_FAIL = 'notification_load_fail';
export const NOTIFICATION_SEE_MORE = 'notification_see_more';
export const NOTIFICATION_SEE_LESS = 'notification_see_less';

// User marks all notification as read
export const NOTIFICATION_MARK_ALL_READ = 'notification_mark_all_read';
// User subscribes to a notification
export const NOTIFICATION_SUBSCRIBE = 'notification_subscribe';
// User unsubscribe from a notification
export const NOTIFICATION_UNSUBSCRIBE = 'notification_unsubscribe'; 

export const NOTIFICATION_DELETE = 'notification_delete';
export const NOTIFICATION_DELETE_SUCCESS = 'notification_delete_success';
export const NOTIFICATION_DELETE_FAIL = 'notification_delete_fail';

/**
 * Constants related to UNREAD notification queue 
 */

// Load unread notification on user login from storage. Overwrite the current state
export const NOTIFICATION_UNREAD_LOAD = 'notification_unread_load';
// Mark one notification as read and remove from unread FIFO queue
export const NOTIFICATION_UNREAD_MARK_AS_READ = 'notification_unread_mark_as_read';
// Fetch unread count
export const NOTIFICATION_UNREAD_COUNT_UPDATE = 'notification_unread_count_update';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTIFICATION_LOAD: {
      const { type } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.loading`, true);
    }

    case NOTIFICATION_LOAD_FAIL: {
      const { type } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.loading`, false);
    }

    case NOTIFICATION_LOAD_SUCCESS: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.loading`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${type}.skip`, skip);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
      const oldData = _.get(newState, `${type}.data`);
      return _.set(newState, `${type}.data`, arrayUnique(oldData.concat(data)));
    }

    case NOTIFICATION_REFRESH: {
      const { type } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.refreshing`, true);
    }

    case NOTIFICATION_REFRESH_FAIL: {
      const { type } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.refreshing`, false);
    }

    case NOTIFICATION_REFRESH_SUCCESS: {
      const { skip, data, hasNextPage, type, refresh } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.refreshing`, false);
      const oldData = _.get(newState, `${type}.data`);

      if (skip !== undefined) {
        // When refresh is true, it only pulls in the new notifications
        // So we need to prepend to the list of notifications that we have
        // Add the skip number to the original data length
        let skipToSet = skip;
        if (refresh && type === 'notifications') {
          skipToSet += oldData.length;
        }
        newState = _.set(newState, `${type}.skip`, skipToSet);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);

      let dataToSet = data;
      if (refresh && type === 'notifications') {
        // When refresh is true, it only pulls in the new notifications
        // So we need to prepend to the list of notifications that we have
        dataToSet = dataToSet.concat(oldData);
      }
      newState = _.set(newState, `${type}.data`, dataToSet);

      // Following section is to update the unread notification
      let oldUnread = _.get(newState, 'unread.data');
      let newUnreadToAdd = [];
      const limit = _.get(newState, 'unread.limit');
      data
        // .sort((a, b) => new Date(a.created) - new Date(b.created)) // Put the latest to the top
        .forEach((d) => {
          // Check if this notification is unread and this notification is already in the queue
          if (d.read === false && !oldUnread.some(o => o._id === d._id)) {
            if (!_.isEmpty(oldUnread) && (oldUnread.length + newUnreadToAdd.length) >= limit) {
              oldUnread.pop(); // remove the last item aka the oldest item
            }
            // Push the new item to the new queue as we are iterating the notification from
            // The newest to the oldest
            newUnreadToAdd = newUnreadToAdd.concat(d); 
          }
        });
      newUnreadToAdd = newUnreadToAdd.concat(oldUnread); // [1, 2, 3] concat with [4, 5, 6]
      if (newUnreadToAdd.length > limit) {
        console.error(`${DEBUG_KEY}: calculating unread notification error: `, newUnreadToAdd);
      }
      newState = _.set(newState, 'unread.data', newUnreadToAdd);
      return newState;
    }

    case NOTIFICATION_SEE_MORE: {
      const { type } = action.payload;
      const newState = _.cloneDeep(state);
      const { seeMoreSkip, seeMoreCount, data } = _.get(newState, `${type}`);
      let newSeeMoreCount = seeMoreCount;
      if (seeMoreSkip + seeMoreCount >= data.length) {
        newSeeMoreCount = data.length;
      } else {
        newSeeMoreCount += seeMoreSkip;
      }

      return _.set(newState, `${type}.seeMoreCount`, newSeeMoreCount);
    }

    case NOTIFICATION_SEE_LESS: {
      const { type } = action.payload;
      const newState = _.cloneDeep(state);
      const { seeMoreSkip, seeMoreCount } = _.get(newState, `${type}`);
      let newSeeMoreCount = seeMoreCount;
      if (seeMoreCount - seeMoreSkip <= seeMoreSkip) {
        newSeeMoreCount = seeMoreSkip;
      } else {
        newSeeMoreCount -= seeMoreSkip;
      }

      return _.set(newState, `${type}.seeMoreCount`, newSeeMoreCount);
    }

    // Mark all notification as read. This is used for server side. No need to mark on our end.
    case NOTIFICATION_MARK_ALL_READ: {
      let newState = _.cloneDeep(state);
      const oldData = _.get(newState, 'notifications.data');
      const newData = oldData.map(d => ({
        ...d,
        read: true
      }));
      newState = _.set(newState, 'notifications.data', newData);
      return _.set(newState, 'unread.unreadCount', 0);
    }

    case NOTIFICATION_DELETE: {
      const { type, notificationId } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.deleting`, true);
    }

    case NOTIFICATION_DELETE_FAIL: {
      const { type, notificationId } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.deleting`, false);
    }

    case NOTIFICATION_DELETE_SUCCESS: {
      const { type, notificationId } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.deleting`, false);
      const oldData = _.get(newState, `${type}.data`);
      const newData = oldData.filter((i) => i._id !== notificationId);

      return _.set(newState, `${type}.data`, newData);
    }

    case NOTIFICATION_UNREAD_LOAD: {
      const { data } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, 'unread.data', data);
    }

    case NOTIFICATION_UNREAD_MARK_AS_READ: {
      const { notificationId } = action.payload;
      const newState = _.cloneDeep(state);
      const oldData = _.get(newState, 'unread.data');
      const newData = oldData.filter((d) => d._id !== notificationId);
      return _.set(newState, 'unread.data', newData);
    }

    // Update unread count
    case NOTIFICATION_UNREAD_COUNT_UPDATE: {
      const { data } = action.payload;
      const newState = _.cloneDeep(state);
      const shouldUpdateUnreadCount = _.get(newState, 'unread.shouldUpdateUnreadCount');
      // User is currently on notification tab
      if (!shouldUpdateUnreadCount && shouldUpdateUnreadCount !== undefined) {
        return newState;
      }
      console.log(`${DEBUG_KEY}: new count is: ${data}`);
      return _.set(newState, 'unread.unreadCount', data);
    }
    
    case 'Navigation/NAVIGATE': {
      const newState = _.cloneDeep(state);
      const { routeName } = action;
      if (!routeName || routeName !== 'notificationTab') {
        return _.set(newState, 'unread.shouldUpdateUnreadCount', true);
      }

      return _.set(newState, 'unread.shouldUpdateUnreadCount', false);
    }

    // Reset notification on user logout
    case USER_LOG_OUT: {
      return { ...INITIAL_STATE };
    }

    default: return { ...state };
  }
};
