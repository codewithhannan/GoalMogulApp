import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { Permissions } from 'expo';
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

import {
  MEET_CONTACT_SYNC_FETCH_DONE,
  MEET_CONTACT_SYNC,
  MEET_CONTACT_SYNC_REFRESH_DONE
} from '../reducers/MeetReducers';

import { handleUploadContacts, fetchMatchedContacts } from '../Utils/ContactUtils';

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
const loadOneTab = (type, skip, limit, token, dispatch, callback, onError) => {
  const route = _.get(requestMap, type);
  API
    .get(`${BASE_ROUTE}${route}?limit=${limit}&skip=${skip}`, token)
    .then((res) => {
      console.log(`loading type: ${type} with res length: `, res.data ? res.data.length : 0);

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
      if (onError) {
        onError(res);
      }
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
      if (onError) {
        onError(err);
      }
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
  const { token } = getState().user;
  const { limit } = _.get(getState().meet, key);
  dispatch({
    type: MEET_TAB_REFRESH,
    payload: {
      type: key
    }
  });

  const onError = (err) => {
    dispatch({
      type: MEET_TAB_REFRESH_DONE,
      payload: {
        type: key,
        data: [],
        skip: 0,
        limit: 20,
        hasNextPage: undefined
      }
    });
  };


  loadOneTab(key, 0, limit, token, dispatch, (data) => {
    dispatch({
      type: MEET_TAB_REFRESH_DONE,
      payload: {
        type: key,
        data,
        skip: data.length,
        limit: 20,
        hasNextPage: !(data === undefined || data.length === 0)
      }
    });
  }, onError);
};

// Load more data
export const meetOnLoadMore = (key) => (dispatch, getState) => {
  // TODO: dispatch onLoadMore start
  console.log(`${DEBUG_KEY} Loading more for ${key}`);
  const tabState = _.get(getState().meet, key);
  const { skip, limit, hasNextPage, refreshing } = tabState;
  if ((hasNextPage || hasNextPage === undefined)) {
    const { token } = getState().user;
    loadOneTab(key, skip, limit, token, dispatch, (data) => {
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
export const updateFriendship = (userId, friendshipId, type, tab, callback) =>
(dispatch, getState) => {
  // TODO: update type to MEET_UPDATE_FRIENDSHIP
  dispatch({
    type: MEET_UPDATE_FRIENDSHIP
  });

  const baseUrl = 'secure/user/friendship';

  const requestType = ((request) => {
    switch (request) {
      case 'requestFriend':
        return {
          type: 'POST',
          data: {
            userId
          },
          url: baseUrl
        };
      case 'acceptFriend':
        return {
          type: 'PUT',
          data: {
            friendshipId
          },
          url: baseUrl
        };
      case 'deleteFriend':
        return {
          type: 'DELETE',
          data: {
            friendshipId,
          },
          url: `${baseUrl}?friendshipId=${friendshipId}`
        };
      default:
        return 'POST';
    }
  })(type);
  const { token } = getState().user;
  if (type === 'requestFriend' && requestType.data === undefined) {
    console.warn('[ Meet Actions ] sending friend request with userId: ', userId);
  }

  singleFetch(requestType.url, _.cloneDeep(requestType.data), requestType.type, token)
    .then((res) => {
      console.log(`${DEBUG_KEY}: response for ${type}: `, res);
      if (res.status !== 200 || (res.message && !res.message.toLowerCase().trim().includes('success'))) {
        console.log(`${DEBUG_KEY}: update friendship failed for request type: with res: `, res);
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
          data: {
            friendshipId,
            userId,
            data: res.data
          }
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
          data: {
            friendshipId,
            userId
          },
          message: 'updating friendship fails'
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
export const requestsSelectTab = (key) => (dispatch) => {
  dispatch({
    type: MEET_REQUESTS_CHANGE_TAB,
    payload: {
      key
    }
  });
};

// Contact sync
export const meetContactSync = (callback, componentKey) => async (dispatch, getState) => {
    const permission = await Permissions.askAsync(Permissions.CONTACTS);
    if (permission.status !== 'granted') {
    // Permission was denied and dispatch an action
      alert('Please grant access to sync contact');
      return;
    }
    const { token } = getState().user;
    // Skip and limit for fetching matched contacts
    const { matchedContacts } = getState().meet;
    const { limit } = matchedContacts;

    dispatch({
      type: MEET_CONTACT_SYNC,
      payload: {
        refresh: true
      }
    });

    const componentKeyToUse = componentKey ? componentKey : 'meetContactSync';
    Actions.push(`${componentKeyToUse}`, { type: 'meet', actionCallback: callback });

    handleUploadContacts(token)
      .then((res) => {
        console.log(`${DEBUG_KEY}: response for uploading contacts is: `, res);

        /* TODO: load matched contacts */
        return fetchMatchedContacts(token, 0, limit);
      })
      .then((res) => {
        // console.log(`${DEBUG_KEY}: [ meetContactSync ]: [ fetchMatchedContacts ]: res is:`, res);
        console.log(`${DEBUG_KEY}: [ meetContactSync ]: [ fetchMatchedContacts ]: matched ` + 
          `contacts with res data length`, res && res.data ? res.data.length : 0);
        const { data } = res;
        if (data) {
          // User finish fetching
          return dispatch({
            type: MEET_CONTACT_SYNC_FETCH_DONE,
            payload: {
              data: data, // TODO: replaced with res
              skip: data.length,
              hasNextPage: data.length && data.length === limit,
              refresh: true
            }
          });
        }
        // TODO: error handling for fail to fetch contact cards
        // TODO: show toast for user to refresh
        console.warn('[ Action ContactSync ]: failed with res', res);
        dispatch({
          type: MEET_CONTACT_SYNC_FETCH_DONE,
          payload: {
            data: [], // TODO: replaced with res
            skip: 0,
            limit,
            hasNextPage: false,
            refresh: true
          }
        });
      })
      .catch((err) => {
        console.warn('[ Action ContactSync Fail ]: ', err);
        dispatch({
          type: MEET_CONTACT_SYNC_FETCH_DONE,
          payload: {
            data: [], // TODO: replaced with res
            skip: 0,
            limit,
            hasNextPage: false,
            refresh: true
          }
        });
      });
};


// Load more matched contacts for contact sync
export const meetContactSyncLoadMore = (refresh) => (dispatch, getState) => {
  dispatch({
    type: MEET_CONTACT_SYNC,
    payload: {
      refresh
    }
  });

  const { token } = getState().user;
  // Skip and limit for fetching matched contacts
  const { skip, limit, hasNextPage } = getState().registration.matchedContacts;
  const newSkip = refresh ? 0 : skip;
  const type = refresh ? MEET_CONTACT_SYNC_REFRESH_DONE : MEET_CONTACT_SYNC_FETCH_DONE;

  if (hasNextPage === undefined || hasNextPage) {
    // newSkip and limit is not needed since it will fetch all at once
    fetchMatchedContacts(token, newSkip, limit).then((res) => {
      if (res.data) {
        dispatch({
          type,
          payload: {
            data: res.data, // TODO: replaced with res
            skip: newSkip + res.data.length,
            limit,
            hasNextPage: res.data.length !== 0 && res.data !== undefined,
            refresh
          }
        });
      } else {
        dispatch({
          type,
          payload: {
            data: [], // TODO: replaced with res
            skip: newSkip,
            limit,
            hasNextPage: res.data !== undefined && res.data.length !== 0,
            refresh
          }
        });
      }
    })
    .catch((err) => {
      console.warn('[ Action ContactSync Loadmore Fail ]: ', err);
    });
  }
};

/* Contact Sync actions */
export const meetContactSyncDone = () => {
  // Passed in a list of contacts that user wants to add as friends

  return (dispatch) => {
    // dispatch({
    //   type: MEET_CONTACT_SYNC_DONE
    // });
    Actions.mainTabs();
  };
};
