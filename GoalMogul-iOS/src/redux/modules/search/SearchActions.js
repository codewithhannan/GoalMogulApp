import curry from 'ramda/src/curry';
import { api as API } from '../../middleware/api';
import {
  SEARCH_CHANGE_FILTER,
  SEARCH_REQUEST,
  SEARCH_REQUEST_DONE,
  SEARCH_REFRESH_DONE,
  SEARCH_SWITCH_TAB
} from './Search';

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
  const { skip, limit } = getState().search;
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
  fetchData(searchContent, skip, limit, token, (res) => {
    const data = res.data ? res.data : [];
    dispatch({
      type: SEARCH_REQUEST_DONE,
      payload: {
        queryId,
        data,
        skip: skip + limit,
        type
      }
    });
  });
};

// search function generator
const searchCurry = curry(searchWithId);

// Hashcode generator
const generateQueryId = (text) => hashCode(text);

// Functions to handle search
export const handleSearch = (searchContent, type) => {
  const queryId = generateQueryId(searchContent);
  return searchCurry(searchContent, queryId, type);
};


export const refreshSearchResult = curry((type) => (dispatch, getState) => {
  console.log(`${DEBUG_KEY} refresh tab: ${type}`);
  const { token } = getState().user;
  const { skip, limit, queryId, searchContent } = getState().search;
  dispatch({
    type: SEARCH_REQUEST,
    payload: {
      queryId,
      searchContent,
      type
    }
  });

  fetchData(searchContent, skip, limit, token, (res) => {
    const data = res.data ? res.data : [];
    dispatch({
      type: SEARCH_REFRESH_DONE,
      payload: {
        queryId,
        data,
        skip: limit,
        type
      }
    });
  });
});

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

export const searchSwitchTab = curry((dispatch, index) => {
  console.log('index in action is: ', index);
  dispatch({
    type: SEARCH_SWITCH_TAB,
    payload: index
  });
});

const fetchData = curry((searchContent, skip, limit, token, callback) =>
  API
    .get(
      `secure/user/friendship/es?skip=${skip}&limit=${limit}&query=${searchContent}`,
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
    })
);
