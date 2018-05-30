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
  },
  tribes: {
    data: [],
    queryId: undefined,
    loading: false,
    skip: 0,
    limit: 20,
  },
  events: {
    data: [],
    queryId: undefined,
    loading: false,
    skip: 0,
    limit: 20,
  },
  searchContent: ''
};

// Constants for search reducers
export const SEARCH_CHANGE_FILTER = 'search_change_filter';
export const SEARCH_REQUEST = 'search_request';
export const SEARCH_REQUEST_DONE = 'search_request_done';
export const SEARCH_REFRESH_DONE = 'search_refresh_done';
export const SEARCH_SWITCH_TAB = 'search_switch_tab';

const TabNames = ['PEOPLE', 'TRIBES', 'EVENTS'];

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
      let newState = { ...state };
      newState[type].loading = true;
      newState.queryId = queryId;
      newState.searchContent = searchContent;
      return { ...newState };
    }

    // Search refresh and request done
    case SEARCH_REFRESH_DONE:
    case SEARCH_REQUEST_DONE: {
      const { queryId, skip, data, type } = action.payload;
      let newState = { ...state };
      if (queryId === state.queryId) {
        newState[type].data = newState[type].data.concat(data);
        newState[type].loading = false;
        newState[type].skip = skip;
      }
      return { ...newState };
    }

    // Search refresh done
    // case SEARCH_REFRESH_DONE: {
    //   const { queryId, skip, data, type } = action.payload;
    //
    //   if (queryId === state.queryId) {
    //     return {
    //       ...state,
    //       loading: false,
    //       data,
    //       skip
    //     };
    //   }
    //   return { ...state };
    // }

    // Search switch tab
    case SEARCH_SWITCH_TAB: {
      const newNavigationState = { ...state.navigationState };
      newNavigationState.index = action.payload;

      console.log('index isL ', action.payload);
      return {
        ...state,
        selectedTab: newNavigationState.routes[action.payload].key,
        navigationState: newNavigationState
      };
    }

    default:
      return { ...state };
  }
};
