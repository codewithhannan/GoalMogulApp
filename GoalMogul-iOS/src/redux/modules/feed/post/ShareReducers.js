// This reducer is for Share Detail Page
import _ from 'lodash';

import {
  USER_LOG_OUT
} from '../../../../reducers/User';

import {
  LIKE_SHARE,
  UNLIKE_SHARE,
} from '../../like/LikeReducers';

const SHARE_INITIAL_STATE = {
  pageIdCount: 0,
  pageId: 'share_0'
};

const INITIAL_STATE = {
  share: {
    ...SHARE_INITIAL_STATE
  },
  // Share detail in meet tab
  shareMeetTab: {
    ...SHARE_INITIAL_STATE
  },
  // Share detail in notification tab
  shareNotificationTab: {
    ...SHARE_INITIAL_STATE
  },
  // Share detail in explore tab
  shareExploreTab: {
    ...SHARE_INITIAL_STATE
  },
  // Share detail in chatTab
  shareChatTab: {
    ...SHARE_INITIAL_STATE
  }
};

export const SHARE_DETAIL_FETCH = 'share_detail_fetch';
export const SHARE_DETAIL_FETCH_DONE = 'share_detail_fetch_done';
export const SHARE_DETAIL_OPEN = 'share_detail_open';
export const SHARE_DETAIL_CLOSE = 'share_detail_close';
// Comment related constants
export const SHARE_DETAIL_GET_COMMENT = 'share_detail_get_comment';
export const SHARE_DETAIL_CREATE_COMMENT = 'share_detail_create_comment';
export const SHARE_DETAIL_UPDATE_COMMENT = 'share_detail_create_comment';
export const SHARE_DETAIL_DELETE_COMMENT = 'share_detail_create_comment';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHARE_DETAIL_FETCH: {
      return { ...state };
    }

    case SHARE_DETAIL_FETCH_DONE: {
      return { ...state };
    }

    case SHARE_DETAIL_OPEN: {
      const newState = _.cloneDeep(state);
      const { share, tab } = action.payload;
      const path = (!tab || tab === 'homeTab') ? 'share' : `share${capitalizeWord(tab)}`;
      const { pageIdCount, pageId } = _.get(newState, `${path}`);

      return _.set(newState, `${path}`, { ...share, pageId, pageIdCount });
    }

    /**
     * Clear share detail on user close or log out
     */
    case SHARE_DETAIL_CLOSE:
    case USER_LOG_OUT: {
      const { tab } = action.payload;
      const path = (!tab || tab === 'homeTab') ? 'share' : `share${capitalizeWord(tab)}`;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${path}`, { ...SHARE_INITIAL_STATE });
    }

    case LIKE_SHARE:
    case UNLIKE_SHARE: {
      const { id, likeId, tab } = action.payload;
      let newState = _.cloneDeep(state);

      const path = (!tab || tab === 'homeTab') ? 'share' : `share${capitalizeWord(tab)}`;
      const share = _.get(newState, path);

      if (share._id && share._id.toString() === id.toString()) {
        newState = _.set(newState, `${path}.maybeLikeRef`, likeId);
      }
      return newState;
    }

    default:
      return { ...state };
  }
};

const capitalizeWord = (word) => {
  if (!word) return '';
  return word.replace(/^\w/, c => c.toUpperCase());
};
