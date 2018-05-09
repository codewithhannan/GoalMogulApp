import {
  MEET_SELECT_TAB
} from '../actions/types';

const TabNames = ['SUGGESTED', 'REQUESTS', 'FRIENDS', 'CONTACTS'];

const INITIAL_STATE = {
  selectedTab: 'SUGGESTED',
  data: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MEET_SELECT_TAB: {
      return { ...state, selectedTab: action.payload };
    }

    default:
      return state;
  }
};
