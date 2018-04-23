import {
  SETTING_OPEN_SETTING,
  SETTING_TAB_SELECTION
} from '../actions/types';

const INITIAL_STATE = {
  email: {},
  phone: {},
  privacy: {
    friends: ''
  },
  selectedTab: 'account'
};

/*
  TODO:
  1. populate initial set on profile fetch successfully
*/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case SETTING_TAB_SELECTION:
      return { ...state, selectedTab: action.payload };

    case SETTING_OPEN_SETTING:
      return state;

    default:
      return state;
  }
};
