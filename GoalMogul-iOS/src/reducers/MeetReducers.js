import {
  MEET_SELECT_TAB,
  MEET_LOADING,
  MEET_LOADING_DONE,
  MEET_UPDATE_FRIENDSHIP,
  MEET_UPDATE_FRIENDSHIP_DONE,
} from '../actions/types';

const TabNames = ['SUGGESTED', 'REQUESTS', 'FRIENDS', 'CONTACTS'];

const INITIAL_STATE = {
  selectedTab: 'SUGGESTED',
  suggested: {
    data: [],
    loading: false
  },
  requests: {
    data: [],
    loading: false
  },
  friends: {
    data: [],
    loading: false
  },
  contacts: {
    data: [],
    loading: false
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    // Selection of tabs for meet
    case MEET_SELECT_TAB: {
      return { ...state, selectedTab: action.payload };
    }

    // Loading suggested cards
    case MEET_LOADING: {
      const newState = { ...state[action.payload.type] };
      newState.loading = true;
      return { ...state, [action.payload.type]: newState };
    }

    // Loading suggested cards done
    case MEET_LOADING_DONE: {
      const { data, type } = action.payload;
      const newState = { ...state[type] };
      newState.data = data;
      newState.loading = false;
      return { ...state, [type]: newState };
    }

    /**
      Update friendship
      1. send friend request
      2. accept friend request
      3. delete friend request
    */
    case MEET_UPDATE_FRIENDSHIP: {
      return { ...state };
    }

    case MEET_UPDATE_FRIENDSHIP_DONE: {
      return { ...state };
    }

    default:
      return state;
  }
};
