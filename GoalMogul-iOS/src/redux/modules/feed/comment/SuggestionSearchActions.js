import curry from 'ramda/src/curry';
import _ from 'lodash';
import { api as API } from '../../../middleware/api';
import {
  SUGGESTION_SEARCH_REQUEST,
  SUGGESTION_SEARCH_REQUEST_DONE,
  SUGGESTION_SEARCH_REFRESH_DONE,
  SUGGESTION_SEARCH_ON_LOADMORE_DONE,
  SUGGESTION_SEARCH_CLEAR_STATE,
  SearchRouteMap
} from './SuggestionSearchReducers';
import { switchCaseF } from '../../../middleware/utils';

const DEBUG_KEY = '[ Action Suggestion Search ]';

// export const searchChangeFilter = (type, value) => {
//   return {
//     type: SUGGESTION_SEARCH_CHANGE_FILTER,
//     payload: {
//       type,
//       value
//     }
//   };
// };

/**
	 * Sends a search requests and update reducers
	 * @param searchContent: searchContent of the current search
   * @param queryId: hashCode of searchContent
   * @param type: one of ['people', 'events', 'tribes']
	 */
const searchWithId = (searchContent, queryId, type) => (dispatch, getState) => {
  const { token } = getState().user;
  const { searchType, searchRes } = getState().suggestionSearch;
  const { limit } = searchRes;
  console.log(`${DEBUG_KEY} with text: ${searchContent} and queryId: ${queryId}`);
  dispatch({
    type: SUGGESTION_SEARCH_REQUEST,
    payload: {
      queryId,
      searchContent,
      type
    }
  });
  // Send request to end point using API
  fetchData(searchContent, type, 0, limit, token, searchType, (res) => {
    const data = res.data ? res.data : [];
    dispatch({
      type: SUGGESTION_SEARCH_REQUEST_DONE,
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
 * @param type: no need to supply this field for now
 */
export const handleSearch = (searchContent, type) => {
  const queryId = generateQueryId(searchContent);
  return searchCurry(searchContent, queryId, type);
};

export const debouncedSearch = () => (dispatch) =>
  _.debounce((value, type) => dispatch(handleSearch(value, type)), 400);

/**
  * Refresh search result
  * @param type: tab that needs to refresh
  */
export const refreshSearchResult = (type) => (dispatch, getState) => {
  const { token } = getState().user;
  const { searchContent, searchType, searchRes } = getState().suggestionSearch;
  const { skip, limit, queryId } = searchRes;
  dispatch({
    type: SUGGESTION_SEARCH_REQUEST,
    payload: {
      queryId,
      searchContent,
      type
    }
  });

  fetchData(searchContent, type, skip, limit, token, searchType, (res) => {
    const data = res.data ? res.data : [];
    dispatch({
      type: SUGGESTION_SEARCH_REFRESH_DONE,
      payload: {
        queryId,
        data,
        skip: data.length,
        type,
        hasNextPage: data.length !== 0
      }
    });
  }, true);
};

/**
  * Load more for search result
  * @param type: tab that needs to load more
  */
export const onLoadMore = (type) => (dispatch, getState) => {
  const { token } = getState().user;
  const { searchType, searchRes } = getState().suggestionSearch;
  const { skip, limit, queryId, searchContent, hasNextPage } = searchRes;
  if (hasNextPage !== undefined && !hasNextPage) {
    return;
  }

  if (searchContent === undefined || searchContent === '') {
    return;
  }
  dispatch({
    type: SUGGESTION_SEARCH_REQUEST,
    payload: {
      queryId,
      searchContent,
      type
    }
  });

  fetchData(searchContent, type, skip, limit, token, searchType, (res) => {
    const data = res.data ? res.data : [];
    dispatch({
      type: SUGGESTION_SEARCH_ON_LOADMORE_DONE,
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
// export const searchSwitchTab = curry((dispatch, index) => {
//   console.log('index in action is: ', index);
//   dispatch({
//     type: SUGGESTION_SEARCH_SWITCH_TAB,
//     payload: index
//   });
// });

// Clear search state on cancel
export const clearSearchState = curry((dispatch) => (tab) => {
  console.log('clear state in action');
  dispatch({
    type: SUGGESTION_SEARCH_CLEAR_STATE,
    payload: {
      tab
    }
  });
});

const fetchData =
curry((searchContent, type, skip, limit, token, searchType, callback, forceRefresh) => {
  const baseRoute = switchCaseF(SearchRouteMap)('Default')(searchType);
  const forRefreshString = forceRefresh ? '&forceRefresh=true' : '';
  API
    .get(
      `${baseRoute.route}?skip=${skip}&limit=${limit}&query=${searchContent}${forRefreshString}`,
      token
    )
    .then((res) => {
      console.log(`${DEBUG_KEY} fetching with res: `, res);
      if (callback) {
        callback(res);
      }
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY} fetching fails with err: `, err);
      if (callback) {
        callback({ data: [] });
      }
    });
});
