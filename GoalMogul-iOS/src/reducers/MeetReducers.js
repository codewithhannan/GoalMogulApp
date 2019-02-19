import _ from 'lodash';
import R from 'ramda';
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
  SETTING_BLOCK_BLOCK_REQUEST_DONE
} from '../actions/types';

import {
  PROFILE_FETCH_FRIEND_DONE,
  PROFILE_FETCH_FRIEND_COUNT_DONE
} from './Profile';

import {
  USER_LOG_OUT
} from './User';

const limit = 5;
const filter = {
  friends: {
    sortBy: ['alphabetical', 'lastadd']
  }
};

export const MEET_CONTACT_SYNC_FETCH_DONE = 'meet_contact_sync_fetch_done';
export const MEET_CONTACT_SYNC = 'meet_contact_sync';
export const MEET_CONTACT_SYNC_REFRESH_DONE = 'meet_contact_sync_refresh_done';

const INITIAL_STATE = {
  selectedTab: 'suggested',
  navigationState: {
    index: 0,
    routes: [
      { key: 'suggested', title: 'Suggested' },
      { key: 'friends', title: 'Friends' },
      { key: 'requests', title: 'Requests' },
      { key: 'contacts', title: 'Contacts' },
    ],
  },

  suggested: {
    data: [],
    loading: false,
    refreshing: false,
    hasNextPage: undefined,
    limit,
    skip: 0
  },
  requests: {
    selectedTab: 'incoming',
    navigationState: {
      index: 0,
      routes: [
        { key: 'incoming', title: 'Incoming' },
        { key: 'outgoing', title: 'Outgoing' }
      ]
    },
    incoming: {
      data: [],
      loading: false,
      refreshing: false,
      hasNextPage: undefined,
      limit,
      skip: 0
    },
    outgoing: {
      data: [],
      loading: false,
      refreshing: false,
      hasNextPage: undefined,
      limit,
      skip: 0
    }
  },
  friends: {
    filter: {
      sortBy: 'alphabetical'
    },
    data: [],
    loading: false,
    refreshing: false,
    hasNextPage: undefined,
    limit,
    skip: 0,
    count: undefined
  },
  contacts: {
    data: [],
    loading: false,
    refreshing: false,
    hasNextPage: undefined,
    limit,
    skip: 0
  },
  matchedContacts: {
    data: [],
    limit: 30,
    skip: 0,
    refreshing: true,
    hasNextPage: undefined
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Selection of tabs for meet
    case MEET_SELECT_TAB: {
      const newNavigationState = { ...state.navigationState };
      newNavigationState.index = action.payload;

      return {
        ...state,
        selectedTab: newNavigationState.routes[action.payload].key,
        navigationState: newNavigationState
      };
    }

    // Loading suggested cards
    case MEET_LOADING: {
      // method 1:
      // const newState = { ...state[action.payload.type] };
      // newState.loading = true;
      // return { ...state, [action.payload.type]: newState };

      // method 2:
      // const newState = _.cloneDeep(_.get(state, action.payload.type))
      // _.set(newState, [action.payload.type, 'loading'], true)
      // console.log('new state is: ', newState);
      // return { state: newState };
      const { type } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.loading`, true);
    }

    // Loading suggested cards done
    case MEET_LOADING_DONE: {
      const { data, type, skip, hasNextPage } = action.payload;
      // Method 1
      // const newState = { ...state[type] };
      // newState.data = data;
      // newState.loading = false;
      // return { ...state, [type]: newState };

      // Method 2
      // console.log('data is: ', data);
      // console.log('type is: ', type);
      // const newState = _.cloneDeep(state)
      // _.set(newState, [type, 'data'], data)
      // _.set(newState, [type, 'loading'], false)
      // return { newState };
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.loading`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${type}.skip`, skip);
      }
      newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
      const oldData = _.get(newState, `${type}.data`);
      return _.set(newState, `${type}.data`, arrayUnique(oldData.concat(data)));
    }

    /**
      Update friendship
      1. send friend request
      2. accept friend request
      3. delete friend request, remove corresponding user from the array
    */
    case MEET_UPDATE_FRIENDSHIP: {
      return { ...state };
    }

    /**
      Update friendship
      1. send friend request
      2. accept friend request
      3. delete friend request, remove corresponding user from the array
      payload: {
        data: userId,
        type: ['acceptFriend', 'deleteFriend', 'requestFriend'],
        tab: ['suggsted', 'friends', 'requests.outgoing', 'requests.incoming', 'contacts']
      }
    */
    case MEET_UPDATE_FRIENDSHIP_DONE: {
      let newState = _.cloneDeep(state);
      const { data, type, tab, message } = action.payload;
      const { friendshipId, userId } = data;
      if (message) {
        return { ...newState };
      }
      newState = ((updateType) => {
        switch (updateType) {
          case 'acceptFriend':
          case 'deleteFriend': {
            // console.log('tab is: ', tab);
            // console.log('new state is: ', newState);
            // console.log(
            //   'data before update is: ',
            //   R.path(R.split('.', `${tab}.data`))(newState)
            // );
            const filterFunction = filterFactory(tab);
            const newData = updateFriendshipData(tab, userId, filterFunction)(newState);
            // console.log('new data is: ', newData);
            return _.set(newState, `${tab}.data`, newData);
          }

          default:
            return { ...newState };
        }
      })(type);
      // console.log('new state is: ', newState);
      return { ...newState };
    }

    // Handle tab refresh
    case MEET_TAB_REFRESH: {
      const { type } = action.payload;
      const newState = _.cloneDeep(state);
      return _.set(newState, `${type}.refreshing`, true);
    }

    // Handle tab refresh
    case MEET_TAB_REFRESH_DONE: {
      const { type, data } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${type}.refreshing`, false);
      newState = _.set(newState, `${type}.skip`, action.payload.skip);
      newState = _.set(newState, `${type}.data`, data);
      return { ...newState };
    }

    // Handle tab change filter criteria
    case MEET_CHANGE_FILTER: {
      const { tab, type, value } = action.payload;
      const newTabState = { ...state[tab] };
      const newFilterState = newTabState.filter;
      newFilterState[type] = value;
      newTabState.filter = newFilterState;
      // console.log('new tab state is: ', newTabState);
      return { ...state, [tab]: newTabState };
    }

    // Requests Tab actions
    case MEET_REQUESTS_CHANGE_TAB: {
      let newState = _.cloneDeep(state);
      const { key, index } = action.payload;
      newState = _.set(newState, 'requests.selectedTab', key);
      return _.set(newState, 'requests.navigationState.index', index);
    }

    // User blocks a friend
    case SETTING_BLOCK_BLOCK_REQUEST_DONE: {
      const newFriends = { ...state.friends };
      newFriends.data = R.filter((a) => a._id !== action.payload)(newFriends.data);
      return { ...state, friends: newFriends };
    }

    // User fetch friend list in profile
    case PROFILE_FETCH_FRIEND_DONE: {
      return { ...state };
    }

    // fetch friends count when opening profile
    case PROFILE_FETCH_FRIEND_COUNT_DONE: {
      // console.log('payload is: ', action.payload);
      const { userId, data } = action.payload;
      const newState = _.cloneDeep(state);
      let newFriends = _.get(newState, 'friends');
      newFriends = _.set(newFriends, 'count', data);
      return _.set(newState, 'friends', newFriends);
    }

    case USER_LOG_OUT: {
      return { ...INITIAL_STATE };
    }

    // Contact sync
    // Contacts fetching done
    case MEET_CONTACT_SYNC_FETCH_DONE: {
      let newState = _.cloneDeep(state);
      let newMatchedContacts = _.cloneDeep(state.matchedContacts);
      const { data, skip, hasNextPage } = action.payload;
      newMatchedContacts.data = arrayUnique(newMatchedContacts.data.concat(data));
      newMatchedContacts.skip = skip;
      newMatchedContacts.refreshing = false;
      newMatchedContacts.hasNextPage = hasNextPage;
      console.log('contact sync fetch done.');
      newState.matchedContacts = newMatchedContacts;
      console.log('new state is: ', newState.matchedContacts);
      return { ...newState };
    }

    // Contact Sync requests
    case MEET_CONTACT_SYNC: {
      let newMatchedContacts = _.cloneDeep(state.matchedContacts);
      newMatchedContacts.refreshing = true;
      return { ...state, matchedContacts: newMatchedContacts };
    }

    // Refresh contact sync cards done
    case MEET_CONTACT_SYNC_REFRESH_DONE: {
      let newMatchedContacts = _.cloneDeep(state.matchedContacts);
      newMatchedContacts.data = action.payload.data;
      newMatchedContacts.refreshing = false;
      newMatchedContacts.skip = action.payload.skip;

      return { ...state, fetching: false, matchedContacts: newMatchedContacts };
    }

    default:
      return { ...state };
  }
};

// Curry function for getting user that is acted on
// const incomingGetUser = R.prop('initiator_id');
const incomingGetUser = R.pipe(R.prop('participants'), R.head, R.prop('users_id'));
const outgoingGetUser = R.pipe(R.prop('participants'), R.last, R.prop('users_id'));
const friendsGetUser = R.curry((state) => state); // Dummy function

// Filtering for [friendship] by userId with customized getUser function
const filterElementById = R.curry((getUser, _id) =>
  R.filter(
    // for each element performs
    R.pipe(
      // grab initiator_id
      getUser,
      // compare if current user is filtered
      (item) => item._id !== _id
    )
  ),
);

// Factory function for creating specific user filtering function
const filterFactory = (tab) => {
  const getUser = ((tabType) => {
    switch (tabType) {
      case 'requests.incoming':
        return incomingGetUser;
      case 'requests.outgoing':
        return outgoingGetUser;

      default:
        return friendsGetUser;
    }
  })(tab);
  return filterElementById(getUser);
};

const updateFriendshipData = R.curry((tab, _id, filterById) =>
  R.pipe(
    R.path(R.split('.', `${tab}.data`)),
    filterById(_id)
  ));

export function arrayUnique(array) {
  let a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i]._id === a[j]._id) {
        a.splice(j--, 1);
      }
    }
  }

  return a;
}
