import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import {
  MEET_SELECT_TAB,
  MEET_LOADING,
  MEET_LOADING_DONE,
  MEET_UPDATE_FRIENDSHIP,
  MEET_UPDATE_FRIENDSHIP_DONE,
  MEET_TAB_REFRESH,
  MEET_TAB_REFRESH_DONE,
  MEET_CHANGE_FILTER,
  MEET_REQUESTS_CHANGE_TAB
} from './types';

const requestMap = {
  suggested: 'friendship/recommendations',
  requests: {
    outgoing: 'friendship/invitations/outgoing',
    incoming: 'friendship/invitations/incoming'
  },
  friends: 'friendship/',
  contacts: 'ContactSync/stored-matches'
};

const tabs = [
  'suggested', 'requests.outgoing', 'requests.incoming', 'friends', 'contacts'
];

export const selectTab = index => {
  return (dispatch) => {
    dispatch({
      type: MEET_SELECT_TAB,
      payload: index
    });
  };
};

// Preload meet tab
// TODO: abstract this method to accomodate four types of requests
export const preloadMeet = () => {
  return (dispatch, getState) => {
    dispatch({
      type: MEET_LOADING,
      payload: {
        type: 'suggested'
      }
    });
    const { token } = getState().user;
    // loadOneTab('suggested', 0, 20, token, dispatch);
    tabs.map((key) => loadOneTab(key, 0, 20, token, dispatch, (data) => {
      dispatch({
        type: MEET_LOADING_DONE,
        payload: {
          type: key,
          data // TODO: replace this with actual data
        }
      });
    }));
  };
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
  const url = `https://goalmogul-api-dev.herokuapp.com/api/secure/user/${route}?limit=${limit}&skip=${skip}`;
  // const url = 'http://192.168.0.3:8081/api/secure/user/friendship?limit=100&skip=0';
  const headers = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token
    }
  };
  fetchData(url, headers, null)
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
};

// Refresh current tab based on selected id
export const handleRefresh = (key) => {
  return (dispatch, getState) => {
    dispatch({
      type: MEET_TAB_REFRESH,
      payload: {
        type: key
      }
    });

    const { token } = getState().user;
    loadOneTab(key, 0, 20, token, dispatch, (data) => {
      dispatch({
        type: MEET_TAB_REFRESH_DONE,
        payload: {
          type: key,
          data,
          skip: 0,
          limit: 20
        }
      });
    });
  };
};

// Load more data
export const meetOnLoadMore = (key) => {
  return (dispatch, getState) => {
    // TODO: dispatch onLoadMore start

    const { token } = getState().user;
    const tabState = _.get(getState().meet, [key]);
    const { skip, limit } = tabState;

    // TODO: loadOneTab()
  };
};

/**
  Update friendship between two users
  1. requestFriend
  2. acceptFriend
  3. deleteFriend
*/
export const updateFriendship = (id, type, callback) => {
  return (dispatch, getState) => {
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
    const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/friendship';
    // const url = 'http://192.168.0.3:8081/api/secure/user/friendship';
    const headers = {
      method: `${requestType}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify({
        userId: id
      })
    };
    fetchData(url, headers, null)
      .then((res) => {
        console.log(`response for ${type}: `, res);
        if (res.message) {
          // TODO: error handling
          console.log('res status: ', res.status);
        }

        if (callback !== null && callback !== undefined) {
          callback();
          return;
        }

        dispatch({
          type: MEET_UPDATE_FRIENDSHIP_DONE,
          payload: {
            type: '',
            data: []
          }
        });
      })
      .catch((err) => {
        console.log(`update friendship ${type} fails: `, err);
        dispatch({
          type: MEET_LOADING_DONE,
          payload: {
            type,
            data: id
          }
        });
      });
  };
};

const fetchData = (url, headers, callback) => {
  return new Promise((resolve, reject) => {
    fetch(url, headers)
    .then((res) => res.json())
    .then((res) => {
      // console.log('original res is: ', res);
      if (res.status && res.status !== 200) {
        reject(res.message);
      }

      return resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

// Update meet tabs filter criteria
export const meetChangeFilter = (tab, type, value) => {
  return (dispatch) => {
    dispatch({
      type: MEET_CHANGE_FILTER,
      payload: {
        tab,
        type,
        value
      }
    });
  };
};

// Requesets tab actions
export const requestsSelectTab = (key) => {
  return {
    type: MEET_REQUESTS_CHANGE_TAB,
    payload: key
  };
};
