/**
 * This is reducer for notification tab
 */
import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

const INITIAL_STATE = {
  notifications: {
    data: [],
    loading: false,
    skip: 0,
    limit: 10,
    hasNextPage: undefined,
    seeMoreSkip: 5, // Every time shows 5 more notifications
    seeMoreCount: 5 // how many items are shown currently
  },
  needs: {
    data: [],
    loading: false,
    skip: 0,
    limit: 10,
    hasNextPage: undefined,
    seeMoreSkip: 5, // Every time shows 5 more notifications
    seeMoreCount: 5 // how many items are shown currently
  }
};

export const NOTIFICATION_REFRESH_SUCCESS = 'notification_refresh_success';
export const NOTIFICATION_LOAD = 'notification_load';
export const NOTIFICATION_LOAD_SUCCESS = 'notification_load_done';
export const NOTIFICATION_LOAD_FAIL = 'notification_load_fail';
export const NOTIFICATION_SEE_MORE = 'notification_see_more';
export const NOTIFICATION_SEE_LESS = 'notification_see_less';

export default (state = INITIAL_STATE, action) => {
  switch (state.type) {
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

    case NOTIFICATION_REFRESH_SUCCESS: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.loading`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${type}.skip`, skip);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
      return _.set(newState, `${type}.data`, data);
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

    default: return { ...state };
  }
};
