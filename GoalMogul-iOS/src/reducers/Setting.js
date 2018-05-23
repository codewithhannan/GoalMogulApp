import {
  SETTING_OPEN_SETTING,
  SETTING_TAB_SELECTION,
  PROFILE_FETCHING_SUCCESS,
  SETTING_FRIEND_SETTING_SELECTION,
  SETTING_EMAIL_UPDATE_SUCCESS,
  SETTING_PHONE_UPDATE_SUCCESS,
  SETTING_PHONE_VERIFICATION_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  email: {},
  phone: {},
  privacy: {
    friends: ''
  },
  selectedTab: 'account',
  block: {
    data: [],
    refreshing: false,
    hasNextPage: undefined
  }
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

    default:
      return { ...state };
  }
};
