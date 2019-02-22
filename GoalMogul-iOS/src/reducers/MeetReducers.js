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

const DEBUG_KEY = '[ Reducer Meet ]';
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
        data: { userId, friendshipId, data: new friendship object or undefined },
        type: ['acceptFriend', 'deleteFriend', 'requestFriend'],
        tab: ['suggsted', 'friends', 'requests.outgoing', 'requests.incoming', 'contacts']
      }
      Note: requestFriend won't happen at the meet tab so it's fine not to have that. We need to 
            add that later on
    */
    case MEET_UPDATE_FRIENDSHIP_DONE: {
      let newState = _.cloneDeep(state);
      const { data, type, tab, message } = action.payload;
      console.log(`${DEBUG_KEY}: [ ${action.type}]: payload is: `, action.payload);
      const { friendshipId, userId } = data;
      if (message) {
        return { ...newState };
      }

      if (type === 'acceptFriend') {
        // Step 1: Remove the friendship object with _id = friendshipId 
        //         from the queue with path 'requests.incoming.data'
        const oldData = _.get(newState, 'requests.incoming.data');
        // console.log(`${DEBUG_KEY}: old data is: `, oldData);
        // console.log(`${DEBUG_KEY}: friendshpId is: ${friendshipId}`);
        const newData = oldData.filter(d => d._id !== friendshipId);
        newState = _.set(newState, 'requests.incoming.data', newData);
        // Step 2: increase friend count
        const oldCount = _.get(newState, 'friends.count');
        newState = _.set(newState, 'friends.count', oldCount + 1);
        // Step 3: Add the user from the new Friendship object with users_id._id  = userId
        //         to the friends tab. We could ignore this step for now since refresh
        //         will pull in the data
        return newState;
      }

      if (type === 'deleteFriend') {
        // possible tab are 'friends' and 'requests.outgoing' and 'requests.incoming'
        // 'friends': remove object from 'friends.data' where maybeFriendshipRef._id = friendshipId
        // And then decrease friend count
        if (tab === 'friends') {
          const oldData = _.get(newState, 'friends.data');
          console.log(`${DEBUG_KEY}: new data is: `, oldData);
          const newData = oldData.filter((d) => 
            _.has(d, 'maybeFriendshipRef._id') && _.get(d, 'maybeFriendshipRef._id') !== friendshipId);
          console.log(`${DEBUG_KEY}: new data is: `, oldData);
          newState = _.set(newState, 'friends.data', newData);
          
          const oldCount = _.get(newState, 'friends.count');
          newState = _.set(newState, 'friends.count', oldCount + 1);
          return newState;
        }
        // 'requests.outgoing': remove object from 'requests.outgoing.data' where _id = friendshipId
        // 'requests.incoming': remove object from 'requests.incoming.data' where _id = friendshipId
        if (tab === 'requests.outgoing' || tab === 'requests.incoming') {
          const oldData = _.get(newState, `${tab}.data`);
          console.log(`${DEBUG_KEY}: new data is: `, oldData);
          const newData = oldData.filter(d => _.has(d, '_id') && d._id !== friendshipId);
          console.log(`${DEBUG_KEY}: new data is: `, oldData);
          newState = _.set(newState, `${tab}.data`, newData);
          return newState;
        }
      }

      if (type === 'requestFriend') {
        if (tab === 'requests.outgoing') {
          // Add the data.data to the requests.outgoing.data and dedup
          const oldData = _.get(newState, 'requests.outgoing.data');
          const newData = oldData.concat(data.data);
          newState = _.set(newState, 'requests.outgoing.data', arrayUnique(newData));
          return newState;
        }
      }

      // Following is the old implementation
      // newState = ((updateType) => {
      //   switch (updateType) {
      //     case 'acceptFriend':
      //     case 'deleteFriend': {
      //       // console.log('tab is: ', tab);
      //       // console.log('new state is: ', newState);
      //       // console.log(
      //       //   'data before update is: ',
      //       //   R.path(R.split('.', `${tab}.data`))(newState)
      //       // );
      //       const filterFunction = filterFactory(tab);
      //       const newData = updateFriendshipData(tab, userId, filterFunction)(newState);
      //       // console.log('new data is: ', newData);
      //       return _.set(newState, `${tab}.data`, newData);
      //     }

      //     default:
      //       return { ...newState };
      //   }
      // })(type);
      // console.log(`${DEBUG_KEY}: new state is:`, newState);
      // return { ...newState };
      return newState;
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
