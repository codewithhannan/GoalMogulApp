import {
  EXPLORE_SWITCH_TAB,
  EXPLORE_PEOPLE_REFRESH,
  EXPLORE_PEOPLE_REFRESH_DONE,
  EXPLORE_PEOPLE_LOAD_MORE,
  EXPLORE_PEOPLE_LOAD_MORE_DONE,
} from './ExploreReducers';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

export const exploreSelectTab = (index) => (dispatch) => {
  dispatch({
    type: EXPLORE_SWITCH_TAB,
    payload: index
  });
};

/**
 * Refresh people in discovery tab
 */
export const exploreRefreshPeople = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { limit } = getState.explore.people;
  const oldData = getState.explore.people.data;

  const onSuccess = (res) => {
    const { data } = res;
    console.log(`${DEBUG_KEY}: [ exploreRefreshPeople ] success with data length:`, data.length);
    dispatch({
      type: EXPLORE_PEOPLE_REFRESH_DONE,
      payload: {
        data: res.data,
        hasNextPage: data && data.length === limit,
        skip: data ? data.length : 0,
        oldData
      }
    });
  };

  const onError = (err) => {
    console.warn(`${DEBUG_KEY}: [ exploreRefreshPeople ]: error with res:`, err);
    dispatch({
      type: EXPLORE_PEOPLE_REFRESH_DONE,
      payload: {
        data: [],
        hasNextPage: false,
        skip,
        oldData
      }
    });
  };

  const url = `secure/user/friendship/recommendations?${queryBuilder(0, limit, { refresh: true })}`;

  dispatch({
    type: EXPLORE_PEOPLE_REFRESH
  });
  exploreGetRequest(url, token, onSuccess, onError);
};

/**
 * Load more people in discovery tab
 */
export const exploreLoadMorePeople = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { skip, limit, hasNextPage, refreshing } = getState.explore.people;
  const oldData = getState.explore.people.data;

  if (hasNextPage === false || refreshing) return;

  const onSuccess = (res) => {
    const { data } = res;
    console.log(`${DEBUG_KEY}: [ exploreLoadMorePeople ] success with data length:`, data.length);
    dispatch({
      type: EXPLORE_PEOPLE_LOAD_MORE_DONE,
      payload: {
        data: res.data,
        hasNextPage: data && data.length === limit,
        skip: data ? data.length + skip : skip,
        oldData
      }
    });
  };

  const onError = (err) => {
    console.warn(`${DEBUG_KEY}: [ exploreLoadMorePeople ]: error with res:`, err);
    dispatch({
      type: EXPLORE_PEOPLE_LOAD_MORE_DONE,
      payload: {
        data: [],
        hasNextPage: false,
        skip,
        oldData
      }
    });
  };

  const url = `secure/user/friendship/recommendations?${queryBuilder(skip, limit, {})}`;

  dispatch({
    type: EXPLORE_PEOPLE_LOAD_MORE
  });
  exploreGetRequest(url, token, onSuccess, onError);
};

export const exploreGetRequest = (url, token, onSuccess, onError) => {
  API
    .get(url, token)
    .then((res) => {
      if (res.status === 200) {
        return onSuccess(res);
      }
      return onError(res);
    })
    .catch(err => onError(err));
};