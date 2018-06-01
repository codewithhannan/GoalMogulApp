import R from 'ramda';
import _ from 'lodash';

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
  tribes: {
    data: [],
    queryId: undefined,
    loading: false,
    skip: 0,
    limit: 20,
    hasNextPage: undefined
  },
  events: {
    data: [],
    queryId: undefined,
    loading: false,
    skip: 0,
    limit: 20,
    hasNextPage: undefined
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

    default:
      return { ...state };
  }
};
