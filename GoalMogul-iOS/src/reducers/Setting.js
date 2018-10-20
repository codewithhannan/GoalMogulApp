import _ from 'lodash';
import {
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
  SETTING_BLOCK_UNBLOCK_REQUEST_DONE
} from '../actions/types';

import {
  USER_LOG_OUT
} from './User';

export const SETTING_NOTIFICATION_TOKEN_PUSH_SUCCESS = 'setting_notification_token_push_success';

const INITIAL_STATE = {
  email: {},
  phone: {},
  privacy: {
    friends: ''
  },
  selectedTab: 'account',
  block: {
    data: [],
    skip: 0,
    limit: 20,
    refreshing: false,
    hasNextPage: undefined
  },
  notificationToken: undefined
};

/*
  TODO:
  1. populate initial set on profile fetch successfully
*/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case PROFILE_FETCHING_SUCCESS: {
      console.log('profile fetched is: ', action.payload);
      const { privacy, email, phone } = action.payload;
      return { ...state, privacy, email, phone };
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
      const email = { ...state.email };
      email.address = action.payload;
      email.isVerified = false;
      return { ...state, email };
    }

    case SETTING_PHONE_UPDATE_SUCCESS: {
      const phone = { ...state.phone };
      phone.number = action.payload;
      phone.isVerified = false;
      return { ...state, phone };
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
    case SETTING_BLOCK_FETCH_ALL:
      return { ...state, block: { ...state.block, fetching: true } };

    case SETTING_BLOCK_FETCH_ALL_DONE: {
      const { data, refresh, skip, hasNextPage, message } = action.payload;
      let newState = _.cloneDeep(state);
      if (!message) {
        if (refresh || skip === 0) {
          newState.block.data = data;
        } else {
          console.log('payload is: ', action.payload);
          newState.block.data = newState.block.data.concat(data);
        }
        newState.block.skip = skip;
        newState.block.hasNextPage = hasNextPage;
        newState.block.refreshing = false;
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
