import curry from 'ramda/src/curry';
import { api as API } from '../../middleware/api';
import _ from 'lodash';
import {
  SEARCH_CHANGE_FILTER,
  SEARCH_REQUEST,
  SEARCH_REQUEST_DONE,
  SEARCH_REFRESH_DONE,
  SEARCH_SWITCH_TAB,
  SEARCH_ON_LOADMORE_DONE,
  SEARCH_CLEAR_STATE,
  SearchRouteMap
} from './Search';

import { switchCase } from '../../middleware/utils';

const DEBUG_KEY = '[ Action Search ]';

export const searchChangeFilter = (type, value) => {
  return {
    type: SEARCH_CHANGE_FILTER,
    payload: {
      type,
      value
    }
  };
};

/**
	 * Sends a search requests and update reducers
	 * @param searchContent: searchContent of the current search
   * @param queryId: hashCode of searchContent
   * @param type: one of ['people', 'events', 'tribes']
	 */
const searchWithId = (searchContent, queryId, type) => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit } = getState().search[type];
  console.log(`${DEBUG_KEY} with text: ${searchContent} and queryId: ${queryId}`);
  dispatch({
    type: SEARCH_REQUEST,
    payload: {
      queryId,
      searchContent,
      type
    }
  });
  // Send request to end point using API
  fetchData(searchContent, type, 0, limit, token, (res) => {
    const data = res.data ? res.data : [];
    dispatch({
      type: SEARCH_REQUEST_DONE,
      payload: {
        queryId,
        data,
        skip: data.length,
        type,
        hasNextPage: data.length !== 0
      }
    });
  }, false);
};

// search function generator
const searchCurry = curry(searchWithId);

// Hashcode generator
const generateQueryId = (text) => hashCode(text);

// Functions to handle search
/**
 * @param type: ['people', 'tribes', 'events', 'chatrooms']
 */
export const handleSearch = (searchContent, type) => {
  console.log('searchContent is: ', searchContent);
  const queryId = generateQueryId(searchContent);
  return searchCurry(searchContent, queryId, type);
};

/**
  * Refresh search result
  * @param type: tab that needs to refresh
  */
export const refreshSearchResult = curry((type) => (dispatch, getState) => {
  console.log(`${DEBUG_KEY} refresh tab: ${type}`);
  const { token } = getState().user;
  const { searchContent } = getState().search;
  const { skip, limit, queryId } = getState().search[type];
  dispatch({
    type: SEARCH_REQUEST,
    payload: {
      queryId,
      searchContent,
      type
    }
  });

  fetchData(searchContent, type, skip, limit, token, (res) => {
    const data = res.data ? res.data : [];
    dispatch({
      type: SEARCH_REFRESH_DONE,
      payload: {
        queryId,
        data,
        skip: data.length,
        type,
        hasNextPage: data.length !== 0
      }
    });
  }, true);
});

/**
  * Load more for search result
  * @param type: tab that needs to load more
  */
export const onLoadMore = (type) => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, queryId, searchContent, hasNextPage, refreshing } = getState().search[type];
  if ((hasNextPage !== undefined && !hasNextPage) || refreshing) {
    return;
  }

  if (searchContent === undefined || searchContent === '') {
    return;
  }
  dispatch({
    type: SEARCH_REQUEST,
    payload: {
      queryId,
      searchContent,
      type
    }
  });

  console.log(`${DEBUG_KEY}: loading more for search type: ${type}`);
  fetchData(searchContent, type, skip, limit, token, (res) => {
    const data = res.data ? res.data : [];
    dispatch({
      type: SEARCH_ON_LOADMORE_DONE,
      payload: {
        queryId,
        data,
        skip: skip + data.length,
        type,
        hasNextPage: data.length !== 0
      }
    });
  }, false);
};

// Function to generate queryId for text
export const hashCode = function (text) {
  let hash = 0;
  let i;
  let chr;
  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Actions to switch tab index for search overlay
export const searchSwitchTab = (index) => (dispatch, getState) => {
  const { navigationState } = getState().search;
  const key = navigationState.routes[index].key;
  dispatch({
    type: SEARCH_SWITCH_TAB,
    payload: index
  });

  refreshSearchResult(key)(dispatch, getState);
};

// Clear search state on cancel
export const clearSearchState = curry((dispatch) => (tab) => {
  console.log('clear state in action');
  dispatch({
    type: SEARCH_CLEAR_STATE,
    payload: {
      tab
    }
  });
});

const fetchData = curry((searchContent, type, skip, limit, token, callback, forceRefresh) => {
  const baseRoute = switchCase(SearchRouteMap)('User')(type);
  const forceRefreshString = forceRefresh ? '&forceRefresh=true' : '';
  API
    .get(
      `${baseRoute.route}?skip=${skip}&limit=${limit}&query=${searchContent}${forceRefreshString}`,
      token
    )
    .then((res) => {
      console.log(`${DEBUG_KEY} fetching with res: `, res);
      if (res.data && callback) {
        callback(res);
        return;
      }
      callback({ data: [] });
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY} fetching fails with err: `, err);
      if (callback) {
        callback({ data: [] });
      }
    });
});
// TODO: integrate with search type later
