import R from 'ramda';
import _ from 'lodash';

import {
  SHARE_NEW_CANCEL,
  SHARE_NEW_POST_SUCCESS
} from '../feed/post/NewShareReducers';

const INITIAL_SEARCH_STATE = {
  data: [],
  queryId: undefined,
  loading: false,
  skip: 0,
  limit: 20,
  hasNextPage: undefined,
  refreshing: false
};

const INITIAL_STATE = {
  selectedTab: 'people',
  navigationState: {
    index: 0,
    routes: [
      { key: 'people', title: 'People' },
      { key: 'tribes', title: 'Tribes' },
      { key: 'events', title: 'Events' },
    ],
  },
  filterBar: {
    sortBy: 'relevance',
    category: 'people'
  },
  people: { ...INITIAL_SEARCH_STATE },
  friends: { ...INITIAL_SEARCH_STATE },
  tribes: { ...INITIAL_SEARCH_STATE },
  events: { ...INITIAL_SEARCH_STATE },
  chatRooms: { ...INITIAL_SEARCH_STATE },
  searchContent: ''
};

// Helper Functions
const dotPath = R.useWith(R.path, [R.split('.')]);
const propsDotPath = R.useWith(R.ap, [R.map(dotPath), R.of]);
const BASE_ROUTE = 'secure';
const DEBUG_KEY = '[ Reducer Search ]';

// Constants for search reducers
export const SEARCH_CHANGE_FILTER = 'search_change_filter';
export const SEARCH_REQUEST = 'search_request';
export const SEARCH_REQUEST_DONE = 'search_request_done';
export const SEARCH_REFRESH_DONE = 'search_refresh_done';
export const SEARCH_SWITCH_TAB = 'search_switch_tab';
export const SEARCH_ON_LOADMORE_DONE = 'search_on_loadmore_done';
export const SEARCH_CLEAR_STATE = 'search_clear_state';

// Note: Search has different route map than SuggestionSearch
export const SearchRouteMap = {
  friends: {
    route: `${BASE_ROUTE}/user/friendship/es`
  },
  people: {
    route: `${BASE_ROUTE}/user/profile/es`
  },
  friends: {
    route: `${BASE_ROUTE}/user/friendship/es`
  },
  events: {
    route: `${BASE_ROUTE}/event/es`
  },
  tribes: {
    route: `${BASE_ROUTE}/tribe/es`
  },
  chatRooms: {
    route: `${BASE_ROUTE}/chat/room/es`
  }
};

/*
  TODO:
  1. populate initial set on profile fetch successfully
*/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_CHANGE_FILTER: {
      const { type, value } = action.payload;
      const newFilterState = { ...state.filterBar };
      newFilterState[type] = value;
      return { ...state, filterBar: newFilterState };
    }

    // Initiate search request
    case SEARCH_REQUEST: {
      const { searchContent, queryId, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState[type].loading = true;
      newState[type].refreshing = true;
      newState.queryId = queryId;
      newState.searchContent = searchContent;
      return { ...newState };
    }

    // Search refresh and request done
    case SEARCH_REFRESH_DONE:
    case SEARCH_REQUEST_DONE: {
      const { queryId, skip, data, type, hasNextPage } = action.payload;
      let newState = _.cloneDeep(state);
      if (queryId === state.queryId) {
        newState[type].data = data;
        newState[type].loading = false;
        newState[type].refreshing = false;
        newState[type].skip = skip;
        newState[type].hasNextPage = hasNextPage;
      }
      return { ...newState };
    }

    // Search refresh done
    case SEARCH_ON_LOADMORE_DONE: {
      const { queryId, skip, data, type, hasNextPage } = action.payload;
      let newState = _.cloneDeep(state);
      if (queryId === state.queryId) {
        const oldData = _.get(newState, `${type}.data`);
        const newData = oldData.concat(data);
        newState = _.set(newState, `${type}.data`, newData);
        newState = _.set(newState, `${type}.loading`, false);
        newState = _.set(newState, `${type}.skip`, skip);
        newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
        
        // console.log(`${DEBUG_KEY}: new data is: `, newData);
      }
      return newState;
    }

    // Search switch tab
    case SEARCH_SWITCH_TAB: {
      const newNavigationState = { ...state.navigationState };
      newNavigationState.index = action.payload;

      return {
        ...state,
        selectedTab: newNavigationState.routes[action.payload].key,
        navigationState: newNavigationState
      };
    }

    case SEARCH_CLEAR_STATE: {
      const { tab } = action.payload;
      if (!tab) {
        // No tab specified, clear all state
        return INITIAL_STATE;
      }
      // Clear state for specific tab
      const tabInitialState = dotPath(tab, INITIAL_STATE);
      let newState = _.cloneDeep(state);
      newState = _.set(newState, tab, tabInitialState);

      // User clears search content
      newState = _.set(newState, 'searchContent', '');

      // Clear the search result for all tabs
      newState = _.set(newState, 'people', { ...INITIAL_SEARCH_STATE });
      newState = _.set(newState, 'events', { ...INITIAL_SEARCH_STATE });
      newState = _.set(newState, 'tribes', { ...INITIAL_SEARCH_STATE });
      newState = _.set(newState, 'friends', { ...INITIAL_SEARCH_STATE });

      return newState;
    }

    /* Following cases is related to search for share */
    case SHARE_NEW_CANCEL:
    case SHARE_NEW_POST_SUCCESS: {
      let newState = _.cloneDeep(state);
      if (action.payload === 'event') {
        newState = _.set(newState, 'event', { ...INITIAL_STATE_EVENT });
      }
      if (action.payload === 'tribe') {
        newState = _.set(newState, 'tribe', { ...INITIAL_STATE_TRIBE });
      }
      return newState;
    }

    default:
      return { ...state };
  }
};
