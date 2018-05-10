import {
  MEET_SELECT_TAB,
  MEET_LOADING,
  MEET_LOADING_DONE,
  MEET_UPDATE_FRIENDSHIP,
  MEET_UPDATE_FRIENDSHIP_DONE,
  MEET_TAB_REFRESH,
  MEET_TAB_REFRESH_DONE
} from '../actions/types';

const TabNames = ['SUGGESTED', 'REQUESTS', 'FRIENDS', 'CONTACTS'];
const limit = 20;

const INITIAL_STATE = {
  selectedTab: 'SUGGESTED',
  suggested: {
    data: [],
    loading: false,
    refreshing: false,
    limit,
    skip: 0
  },
  requests: {
    data: [],
    loading: false,
    refreshing: false,
    limit,
    skip: 0
  },
  friends: {
    data: [],
    loading: false,
    refreshing: false,
    limit,
    skip: 0
  },
  contacts: {
    data: [],
    loading: false,
    refreshing: false,
    limit,
    skip: 0
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

    //payload contains update type and id (userId)
    case MEET_UPDATE_FRIENDSHIP_DONE: {
      return { ...state };
    }

    // Handle tab refresh
    case MEET_TAB_REFRESH: {
      console.log('type is ', action.payload.type);
      const newState = { ...state[action.payload.type] };
      newState.refreshing = true;
      console.log('new state is: ', newState);
      return { ...state, [action.payload.type]: newState };
    }

    // Handle tab refresh
    case MEET_TAB_REFRESH_DONE: {
      // TODO: update the data
      const newState = { ...state[action.payload.type] };
      newState.refreshing = false;
      return { ...state, [action.payload.type]: newState };
    }

    default:
      return { ...state };
  }
};
