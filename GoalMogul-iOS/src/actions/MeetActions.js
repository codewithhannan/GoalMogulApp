import { Actions } from 'react-native-router-flux';
import {
  MEET_SELECT_TAB,
  MEET_LOADING,
  MEET_LOADING_DONE,
  MEET_UPDATE_FRIENDSHIP,
  MEET_UPDATE_FRIENDSHIP_DONE,
  MEET_TAB_REFRESH,
  MEET_TAB_REFRESH_DONE
} from './types';

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
    const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/friendship?limit=100&skip=0';
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
        console.log('response for friendship: ', res);

        dispatch({
          type: MEET_LOADING_DONE,
          payload: {
            type: 'suggested',
            data: [] // TODO: replace this with actual data
          }
        });
      })
      .catch((err) => {
        console.log('fetching friendship fails: ', err);
        dispatch({
          type: MEET_LOADING_DONE,
          payload: {
            type: 'suggested',
            data: []
          }
        });
      });
  };
};

const loadOneTab = (type) => {

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

    // TODO: refresh and fetch
    dispatch({
      type: MEET_TAB_REFRESH_DONE,
      payload: {
        type: key
      }
    });
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
      console.log('original res is: ', res);
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
