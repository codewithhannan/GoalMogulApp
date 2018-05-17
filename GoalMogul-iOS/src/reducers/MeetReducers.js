import {
  MEET_SELECT_TAB,
  MEET_LOADING,
  MEET_LOADING_DONE,
  MEET_UPDATE_FRIENDSHIP,
  MEET_UPDATE_FRIENDSHIP_DONE,
  MEET_TAB_REFRESH,
  MEET_TAB_REFRESH_DONE,
  MEET_CHANGE_FILTER,
  MEET_REQUESTS_CHANGE_TAB
} from '../actions/types';

const TabNames = ['SUGGESTED', 'REQUESTS', 'FRIENDS', 'CONTACTS'];
const limit = 20;
const filter = {
  friends: {
    sortBy: ['alphabetical', 'lastadd']
  }
}

const INITIAL_STATE = {
  selectedTab: 'suggested',
  navigationState: {
    index: 0,
    routes: [
      { key: 'suggested', title: 'Suggested' },
      { key: 'friends', title: 'Friends' },
      { key: 'requests', title: 'Requests' },
      { key: 'contacts', title: 'Contacts' },
    ],
  },

  suggested: {
    data: [],
    loading: false,
    refreshing: false,
    limit,
    skip: 0
  },
  requests: {
    selectedTab: 'outgoing',
    incoming: {
      data: [],
      loading: false,
      refreshing: false,
      limit,
      skip: 0
    },
    outgoing: {
      data: [],
      loading: false,
      refreshing: false,
      limit,
      skip: 0
    }
  },
  friends: {
    filter: {
      sortBy: 'alphabetical'
    },
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
      const newNavigationState = { ...state.navigationState };
      newNavigationState.index = action.payload;

      return {
        ...state,
        selectedTab: newNavigationState.routes[action.payload].key,
        navigationState: newNavigationState
      };
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

    // Handle tab change filter criteria
    case MEET_CHANGE_FILTER: {
      const { tab, type, value } = action.payload;
      const newTabState = { ...state[tab] };
      const newFilterState = newTabState.filter;
      newFilterState[type] = value;
      newTabState.filter = newFilterState
      console.log('new tab state is: ', newTabState);
      return { ...state, [tab]: newTabState };
    }

    // Requests Tab actions
    case MEET_REQUESTS_CHANGE_TAB: {
      const newRequests = { ...state['requests'] };
      newRequests.selectedTab = action.payload;
      return { ...state, requests: newRequests };
    }

    default:
      return { ...state };
  }
};
