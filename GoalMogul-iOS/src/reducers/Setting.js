import _ from 'lodash';
import {
  LOGIN_USER_SUCCESS,
  SETTING_OPEN_SETTING,
  SETTING_TAB_SELECTION,
  PROFILE_FETCHING_SUCCESS,
  SETTING_FRIEND_SETTING_SELECTION,
  SETTING_EMAIL_UPDATE_SUCCESS,
  SETTING_PHONE_UPDATE_SUCCESS,
  SETTING_PHONE_VERIFICATION_SUCCESS,
  SETTING_BLOCK_FETCH_ALL,
  SETTING_BLOCK_FETCH_ALL_DONE,
  SETTING_BLOCK_REFRESH_DONE,
  SETTING_BLOCK_BLOCK_REQUEST,
  SETTING_BLOCK_BLOCK_REQUEST_DONE,
  SETTING_BLOCK_UNBLOCK_REQUEST,
  SETTING_BLOCK_UNBLOCK_REQUEST_DONE,
  PROFILE_UPDATE_SUCCESS
} from '../actions/types';

import {
  USER_LOG_OUT
} from './User';

export const SETTING_NOTIFICATION_TOKEN_PUSH_SUCCESS = 'setting_notification_token_push_success';

const INITIAL_STATE = {
  userId: undefined,
  email: {},
  phone: {},
  privacy: {
    friends: ''
  },
  selectedTab: 'account',
  block: {
    data: [],
    skip: 0,
    limit: 10,
    refreshing: false,
    loading: false,
    hasNextPage: undefined
  },
  notificationToken: undefined
};

const DEBUG_KEY = '[ Reducer Setting ]';
/*
  TODO:
  1. populate initial set on profile fetch successfully
*/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER_SUCCESS: {
      const { userId } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, 'userId', userId);
    }

    case PROFILE_UPDATE_SUCCESS:
    case PROFILE_FETCHING_SUCCESS: {
      const { user, userId } = action.payload;
      let newState = _.cloneDeep(state);

      if (_.get(newState, 'userId') !== userId) {
        // Do not update if not current user
        return newState;
      }
      const { privacy, email, phone } = user;

      newState = _.set(newState, 'privacy', privacy);
      newState = _.set(newState, 'email', email);
      newState = _.set(newState, 'phone', phone);

      return newState;
    }

    case SETTING_FRIEND_SETTING_SELECTION: {
      const privacy = { ...state.privacy };
      privacy.friends = action.payload;
      return { ...state, privacy };
    }

    case SETTING_TAB_SELECTION:
      return { ...state, selectedTab: action.payload };

    case SETTING_OPEN_SETTING:
      return { ...state };

    case SETTING_EMAIL_UPDATE_SUCCESS: {
      let newState = _.cloneDeep(state);
      const { email, userId } = action.payload;
      if (userId !== _.get(newState, 'userId')) {
        console.warn(`${DEBUG_KEY}: email updated is not for app user.` + 
        `Expected userId: ${_.get(newState, 'userId')}, actual userId: ${userId}`);
        return newState;
      }

      newState = _.set(newState, 'email.address', email);
      newState = _.set(newState, 'email.isVerified', false);
      return newState;
    }

    case SETTING_PHONE_UPDATE_SUCCESS: {
      let newState = _.cloneDeep(state);
      const { phone, userId } = action.payload;
      if (userId !== _.get(newState, 'userId')) {
        console.warn(`${DEBUG_KEY}: email updated is not for app user.` + 
        `Expected userId: ${_.get(newState, 'userId')}, actual userId: ${userId}`);
        return newState;
      }

      newState = _.set(newState, 'phone.number', phone);
      newState = _.set(newState, 'phone.isVerified', false);
      return newState;
    }

    case SETTING_PHONE_VERIFICATION_SUCCESS: {
      const phone = { ...state.phone };
      phone.isVerified = true;
      return { ...state, phone };
    }

    /*
    Blocked user management
    1. fetch/refresh/load more blocked users
    2. unblock user
    3. block user
    TODO: implement block, unblock, refresh and load more logic
    */
    case SETTING_BLOCK_FETCH_ALL: {
      let newState = _.cloneDeep(state);
      const { refresh } = action.payload;
      if (refresh) {
        newState = _.set(newState, 'block.refreshing', true);
      } else {
        newState = _.set(newState, 'block.loading', true);
      }

      return newState;
      // return { ...state, block: { ...state.block, fetching: true } };
    }

    case SETTING_BLOCK_FETCH_ALL_DONE: {
      const { data, refresh, skip, hasNextPage, message } = action.payload;
      let newState = _.cloneDeep(state);
      if (!message) {
        if (refresh || skip === 0) {
          newState.block.data = data;
        } else {
          console.log(`${DEBUG_KEY}: [ ${action.type}]: payload is`, action.payload);
          newState.block.data = newState.block.data.concat(data);
        }
        newState.block.skip = skip;
        newState.block.hasNextPage = hasNextPage;

        if (refresh) {
          newState.block.refreshing = false;
        } else {
          newState.block.loading = false;
        }
      }

      return { ...newState };
    }

    case SETTING_BLOCK_BLOCK_REQUEST: {
      return { ...state };
    }

    case SETTING_BLOCK_BLOCK_REQUEST_DONE: {
      return { ...state };
    }

    case SETTING_BLOCK_REFRESH_DONE: {
      return { ...state };
    }

    case SETTING_BLOCK_UNBLOCK_REQUEST: {
      return { ...state };
    }

    case SETTING_BLOCK_UNBLOCK_REQUEST_DONE: {
      return { ...state };
    }

    case USER_LOG_OUT: {
      return { ...INITIAL_STATE };
    }

    case SETTING_NOTIFICATION_TOKEN_PUSH_SUCCESS: {
      const { notificationToken } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, 'notificationToken', notificationToken);
    }

    default:
      return { ...state };
  }
};
