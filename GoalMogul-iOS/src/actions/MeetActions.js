import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { api as API, singleFetch } from '../redux/middleware/api';
import {
  MEET_SELECT_TAB,
  MEET_LOADING,
  MEET_LOADING_DONE,
  MEET_UPDATE_FRIENDSHIP,
  MEET_UPDATE_FRIENDSHIP_DONE,
  MEET_TAB_REFRESH,
  MEET_TAB_REFRESH_DONE,
  MEET_CHANGE_FILTER,
  MEET_REQUESTS_CHANGE_TAB,
} from './types';

const BASE_ROUTE = 'secure/user/';
// const BASE_ROUTE = 'dummy/user/';

const requestMap = {
  suggested: 'friendship/recommendations',
  requests: {
    outgoing: 'friendship/invitations/outgoing',
    incoming: 'friendship/invitations/incoming'
  },
  friends: 'friendship',
  contacts: 'ContactSync/stored-matches'
};

const tabs = [
  'suggested', 'requests.outgoing', 'requests.incoming', 'friends', 'contacts'
];

const DEBUG_KEY = '[ MeetAction ]';

export const selectTab = index => (dispatch) => {
  dispatch({
    type: MEET_SELECT_TAB,
    payload: index
  });
};

// Preload meet tab
// TODO: abstract this method to accomodate four types of requests
export const preloadMeet = () => (dispatch, getState) => {
  dispatch({
    type: MEET_LOADING,
    payload: {
      type: 'suggested'
    }
  });
  const { token } = getState().user;
  // loadOneTab('suggested', 0, 20, token, dispatch);
  // tabs.map((key) => loadOneTab(key, 0, 20, token, dispatch, (data) => {
  //   dispatch({
  //     type: MEET_LOADING_DONE,
  //     payload: {
  //       type: key,
  //       data, // TODO: replace this with actual data
  //       skip: 0,
  //       limit: 20
  //     }
  //   });
  // }));
};

/*
@param type (string): current tab key
@param skip (number): number to skip for data
@param limit (number): number of cards to fetch
@param token:
@param dispatch:
@param callback:
*/
const loadOneTab = (type, skip, limit, token, dispatch, callback) => {
  const route = _.get(requestMap, type);
  API
    .get(`${BASE_ROUTE}${route}?limit=${limit}&skip=${skip}`, token)
    .then((res) => {
      console.log(`loading type: ${type} with res: `, res);

      // TODO: update failure condition
      if (res.data) {
        if (callback) {
          return callback(res.data);
        }
      }

      // fetch data failure
      dispatch({
        type: MEET_LOADING_DONE,
        payload: {
          type,
          data: []
        }
      });
    })
    .catch((err) => {
      console.log(`fetching friendship for type: ${type}, fails with error: ${err}`);
      dispatch({
        type: MEET_LOADING_DONE,
        payload: {
          type,
          data: []
        }
      });
    });

  // const url = `https://goalmogul-api-dev.herokuapp.com/api/secure/user/${route}?limit=${limit}&skip=${skip}`;
  // // const url = 'http://192.168.0.3:8081/api/secure/user/friendship?limit=100&skip=0';
  // const headers = {
  //   method: 'GET',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //     'x-access-token': token
  //   }
  // };
  // fetchData(url, headers, null)
  //   .then((res) => {
  //     console.log(`loading type: ${type} with res: `, res);
  //
  //     // TODO: update failure condition
  //     if (res.data) {
  //       if (callback) {
  //         return callback(res.data);
  //       }
  //     }
  //
  //     // fetch data failure
  //     dispatch({
  //       type: MEET_LOADING_DONE,
  //       payload: {
  //         type,
  //         data: []
  //       }
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(`fetching friendship for type: ${type}, fails with error: ${err}`);
  //     dispatch({
  //       type: MEET_LOADING_DONE,
  //       payload: {
  //         type,
  //         data: []
  //       }
  //     });
  //   });
};

// Refresh current tab based on selected id
export const handleRefresh = (key) => (dispatch, getState) => {
  dispatch({
    type: MEET_TAB_REFRESH,
    payload: {
      type: key
    }
  });

  const { token } = getState().user;
  const { limit } = _.get(getState().meet, key);
  loadOneTab(key, 0, limit, token, dispatch, (data) => {
    dispatch({
      type: MEET_TAB_REFRESH_DONE,
      payload: {
        type: key,
        data,
        skip: data.length,
        limit: 20
      }
    });
  });
};

// Load more data
export const meetOnLoadMore = (key) => (dispatch, getState) => {
  // TODO: dispatch onLoadMore start
  console.log(`${DEBUG_KEY} Loading more for ${key}`);
  const tabState = _.get(getState().meet, key);
  const { skip, limit, hasNextPage } = tabState;
  if (hasNextPage || hasNextPage === undefined) {
    const { token } = getState().user;
    loadOneTab(key, skip + limit, limit, token, dispatch, (data) => {
      const newSkip = data.length === 0 ? skip : skip + data.length;
      dispatch({
        type: MEET_LOADING_DONE,
        payload: {
          type: key,
          data,
          skip: newSkip,
          limit,
          hasNextPage: !(data === undefined || data.length === 0)
        }
      });
    });
  }

  // TODO: dispatch no new data
};

/**
  Update friendship between two users
  1. requestFriend
  2. acceptFriend
  3. deleteFriend
*/
export const updateFriendship = (id, type, tab, callback) => (dispatch, getState) => {
  // TODO: update type to MEET_UPDATE_FRIENDSHIP
  dispatch({
    type: MEET_UPDATE_FRIENDSHIP
  });

  const requestType = ((request) => {
    switch (request) {
      case 'requestFriend':
        return 'POST';
      case 'acceptFriend':
        return 'PUT';
      case 'deleteFriend':
        return 'DELETE';
      default:
        return 'POST';
    }
  })(type);
  const { token } = getState().user;
  singleFetch('secure/user/friendship', { userId: id }, requestType, token)
    .then((res) => {
      console.log(`response for ${type}: `, res);
      if (res.message && !res.message.toLowerCase().trim().includes('success')) {
        // TODO: error handling
        return;
      }

      if (callback !== null && callback !== undefined) {
        console.log(`${DEBUG_KEY} calling callback`);
        callback();
      }

      dispatch({
        type: MEET_UPDATE_FRIENDSHIP_DONE,
        payload: {
          type,
          tab,
          data: id
        }
      });
    })
    .catch((err) => {
      console.log(`update friendship ${type} fails: `, err);
      // dispatch({
      //   type: MEET_LOADING_DONE,
      //   payload: {
      //     type,
      //     tab,
      //     data: id
      //   }
      // });
      //TODO: show toaster for updating failure
      dispatch({
        type: MEET_UPDATE_FRIENDSHIP_DONE,
        payload: {
          type,
          tab,
          data: id
        }
      });
    });
};

// Update meet tabs filter criteria
export const meetChangeFilter = (tab, type, value) => (dispatch) => {
  dispatch({
    type: MEET_CHANGE_FILTER,
    payload: {
      tab,
      type,
      value
    }
  });
};

// Requesets tab actions
export const requestsSelectTab = (key) => {
  return {
    type: MEET_REQUESTS_CHANGE_TAB,
    payload: key
  };
};
