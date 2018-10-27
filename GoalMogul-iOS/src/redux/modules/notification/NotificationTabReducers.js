/**
 * This is reducer for notification tab
 */

const INITIAL_STATE = {
  notifcations: {
    data: [],
    loading: false,
    skip: 0,
    limit: 50,
    hasNextPage: undefined,
    seeMoreSkip: 5, // Every time shows 5 more notifications
    seeMoreCount: 5 // how many items are shown currently
  },
  needs: {
    data: [],
    loading: false,
    skip: 0,
    limit: 50,
    hasNextPage: undefined,
    seeMoreSkip: 5, // Every time shows 5 more notifications
    seeMoreCount: 5 // how many items are shown currently
  }
};

export const NOTIFICATION_REFRESH_SUCCESS = 'notification_refresh_success';
export const NOTIFICATION_LOAD = 'notification_load';
export const NOTIFICATION_LOAD_SUCCESS = 'notification_load_done';
export const NOTIFICATION_LOAD_FAIL = 'notification_load_fail';

export default (state = INITIAL_STATE, action) => {
  switch (state.type) {
    default: return { ...state };
  }
};
