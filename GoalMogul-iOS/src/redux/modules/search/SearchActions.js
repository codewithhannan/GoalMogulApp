import curry from 'ramda/src/curry';
import __ from 'ramda/src/__';
import { api as API } from '../../middleware/api';
import {
  SEARCH_CHANGE_FILTER,
  SEARCH_REQUEST,
  SEARCH_REQUEST_DONE,
  SEARCH_REFRESH_DONE
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

const debounceWithId = (fn, delay, id) => {
  const testFunc = curry(debounce);
  const testFunc2 = testFunc(fn, delay)

}

const generateQueryId = (text) => hashCode(text);

export const searchWithId = (searchContent, queryId) => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit } = getState().search;
  console.log(`sending request with text: ${searchContent} and queryId: ${queryId}`);
  dispatch({
    type: SEARCH_REQUEST,
    payload: {
      queryId,
      searchContent
    }
  });
  // Send request to end point using API
  API
    .get(
      `secure/user/friendship/es?skip=${skip}&limit=${limit}&query=${searchContent}`,
      token
    )
    .then((res) => {
      console.log(`${DEBUG_KEY} fetching with res: `, res);
      dispatch({
        type: SEARCH_REQUEST_DONE,
        payload: {
          queryId,
          data: [],
          skip: skip + limit,
        }
      });
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY} fetching fails with err: `, err);
    });
};

export const refreshSearchResult = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, queryId, searchContent } = getState().search;
  dispatch({
    type: SEARCH_REQUEST,
    payload: {
      queryId,
      searchContent
    }
  });

  //
  dispatch({
    type: SEARCH_REFRESH_DONE,
    payload: {
      queryId,
      skip: skip + limit,
      data: []
    }
  });
};

export function debounce(fn, delay, ...args) {
  let timer = null;
  return function () {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

const hashCode = function () {
  let hash = 0;
  let i;
  let chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
