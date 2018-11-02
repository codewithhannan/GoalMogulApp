import R from 'ramda';
import _ from 'lodash';

import {
  COMMENT_NEW_SUGGESTION_UPDAET_TYPE
} from './NewCommentReducers';

import {
  arrayUnique
} from '../../../middleware/utils';

const INITIAL_STATE_SEARCH = {
  data: [],
  queryId: undefined,
  loading: false,
  skip: 0,
  limit: 40,
  hasNextPage: undefined
};

const INITIAL_STATE = {
  searchType: undefined,
  filterBar: {
    sortBy: 'relevance',
    category: 'people'
  },
  searchRes: {
    ...INITIAL_STATE_SEARCH
  },
  searchContent: ''
};

const BASE_ROUTE = 'secure';
export const SearchRouteMap = {
  Friend: {
    route: `${BASE_ROUTE}/user/friendship/es`
  },
  User: {
    route: `${BASE_ROUTE}/user/profile/es`
  },
  Event: {
    route: `${BASE_ROUTE}/event/es`
  },
  Tribe: {
    route: `${BASE_ROUTE}/tribe/es`
  },
  ChatConvoRoom: {
    route: ''
  },
  Default: {
    route: ''
  }
};

// Helper Functions
const dotPath = R.useWith(R.path, [R.split('.')]);

// Constants for search reducers
export const SUGGESTION_SEARCH_CHANGE_FILTER = 'suggestion_search_change_filter';
export const SUGGESTION_SEARCH_REQUEST = 'suggestion_search_request';
export const SUGGESTION_SEARCH_REQUEST_DONE = 'suggestion_search_request_done';
export const SUGGESTION_SEARCH_REFRESH_DONE = 'suggestion_search_refresh_done';
export const SUGGESTION_SEARCH_SWITCH_TAB = 'suggestion_search_switch_tab';
export const SUGGESTION_SEARCH_ON_LOADMORE_DONE = 'suggestion_search_on_loadmore_done';
export const SUGGESTION_SEARCH_CLEAR_STATE = 'suggestion_search_clear_state';

/*
  TODO:
  1. populate initial set on profile fetch successfully
*/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUGGESTION_SEARCH_CHANGE_FILTER: {
      const { type, value } = action.payload;
      const newFilterState = { ...state.filterBar };
      newFilterState[type] = value;
      return { ...state, filterBar: newFilterState };
    }

    // Initiate suggestion_search request
    case SUGGESTION_SEARCH_REQUEST: {
      const { searchContent, queryId, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState.searchRes.loading = true;
      newState.queryId = queryId;
      newState.searchContent = searchContent;
      return { ...newState };
    }

    // Search refresh and request done
    case SUGGESTION_SEARCH_REFRESH_DONE:
    case SUGGESTION_SEARCH_REQUEST_DONE: {
      const { queryId, skip, data, type, hasNextPage } = action.payload;
      let newState = _.cloneDeep(state);
      if (queryId === state.queryId) {
        newState.searchRes.data = data;
        newState.searchRes.loading = false;
        newState.searchRes.skip = skip;
        newState.searchRes.hasNextPage = hasNextPage;
      }
      return { ...newState };
    }

    // Search refresh done
    case SUGGESTION_SEARCH_ON_LOADMORE_DONE: {
      const { queryId, skip, data, type, hasNextPage } = action.payload;
      let newState = _.cloneDeep(state);
      if (queryId === state.queryId) {
        const oldData = _.get(newState, 'searchRes.data');
        newState = _.set(newState, 'searchRes.data', arrayUnique(oldData.concat(data)));
        newState.searchRes.loading = false;
        newState.searchRes.skip = skip;
        newState.searchRes.hasNextPage = hasNextPage;
      }
      return { ...newState };
    }

    case SUGGESTION_SEARCH_CLEAR_STATE: {
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

    // Update search type
    case COMMENT_NEW_SUGGESTION_UPDAET_TYPE: {
      let newState = _.cloneDeep(state);
      const {
        suggestionType,
        tab,
        pageId
      } = action.payload;
      return _.set(newState, 'searchType', suggestionType);
    }

    default:
      return { ...state };
  }
};
