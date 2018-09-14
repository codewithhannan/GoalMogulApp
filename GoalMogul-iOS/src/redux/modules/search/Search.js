import R from 'ramda';
import _ from 'lodash';

import {
  SHARE_NEW_CANCEL,
  SHARE_NEW_POST_SUCCESS
} from '../feed/post/NewShareReducers';

const INITIAL_STATE_EVENT = {
  data: [],
  queryId: undefined,
  loading: false,
  skip: 0,
  limit: 20,
  hasNextPage: undefined
};

const INITIAL_STATE_TRIBE = {
  data: [],
  queryId: undefined,
  loading: false,
  skip: 0,
  limit: 20,
  hasNextPage: undefined
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
  people: {
    data: [],
    queryId: undefined,
    loading: false,
    skip: 0,
    limit: 20,
    hasNextPage: undefined
  },
  tribes: { ...INITIAL_STATE_TRIBE },
  events: {
    ...INITIAL_STATE_EVENT
  },
  searchContent: ''
};

// Helper Functions
const dotPath = R.useWith(R.path, [R.split('.')]);
const propsDotPath = R.useWith(R.ap, [R.map(dotPath), R.of]);

// Constants for search reducers
export const SEARCH_CHANGE_FILTER = 'search_change_filter';
export const SEARCH_REQUEST = 'search_request';
export const SEARCH_REQUEST_DONE = 'search_request_done';
export const SEARCH_REFRESH_DONE = 'search_refresh_done';
export const SEARCH_SWITCH_TAB = 'search_switch_tab';
export const SEARCH_ON_LOADMORE_DONE = 'search_on_loadmore_done';
export const SEARCH_CLEAR_STATE = 'search_clear_state';

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
        newState[type].data = newState[type].data.concat(data);
        newState[type].loading = false;
        newState[type].skip = skip;
        newState[type].hasNextPage = hasNextPage;
      }
      return { ...newState };
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
      const newState = _.cloneDeep(state);
      return _.set(newState, tab, tabInitialState);
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
