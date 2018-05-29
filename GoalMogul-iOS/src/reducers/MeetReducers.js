import _ from 'lodash';
import R from 'ramda';
import set from 'lodash/fp/set';
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

const TabNames = ['SUGGESTED', 'REQUESTS', 'FRIENDS', 'CONTACTS'];
const limit = 20;
const filter = {
  friends: {
    sortBy: ['alphabetical', 'lastadd']
  }
}

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
    selectedTab: 'outgoing',
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
    skip: 0
  },
  contacts: {
    data: [],
    loading: false,
    refreshing: false,
    hasNextPage: undefined,
    limit,
    skip: 0
  }
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
      return set([action.payload.type, 'loading'], true, state);
    }

    // Loading suggested cards done
    case MEET_LOADING_DONE: {
      const { data, type, skip } = action.payload;
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

      let newState = set([type, 'loading'], false, state);
      if (skip !== undefined) {
        newState = set([type, 'skip'], skip, newState);
      }
      return set([type, 'data'], data, newState);
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
      let newState = { ...state };
      const { data, type, tab } = action.payload;
      newState = ((updateType) => {
        switch (updateType) {
          case 'deleteFriend': {
            console.log('tab is: ', tab);
            console.log('new state is: ', newState);
            // TODO: i can't get data like this
            console.log('data before update is: ', R.path(`${tab}.data`)(newState));
            const newData = R.pipe(
              R.path(`${tab}.data`),
              R.filter((item) => item._id === data
            ))(newState);
            console.log('new data is: ', newData);
            return _.set(newState, `${type}.data`, newData);
          }

          default:
            return { ...newState };
        }
      })(type);
      return { ...newState };
    }

    // Handle tab refresh
    case MEET_TAB_REFRESH: {
      const { type } = action.payload;
      // Method 1:
      // const newState = { ...state[action.payload.type] };
      // newState.refreshing = true;
      // newState.loading = true;
      // return { ...state, [action.payload.type]: newState };

      // Method 2
      let newState = set([type, 'loading'], true, state);
      return set([type, 'refreshing'], true, newState);
    }

    // Handle tab refresh
    case MEET_TAB_REFRESH_DONE: {
      // TODO: update the data
      const { type, data } = action.payload;
      // Method 1
      // const newState = { ...state[action.payload.type] };
      // newState.refreshing = false;
      // newState.loading = false;
      // newState.data = action.payload.data;
      // return { ...state, [action.payload.type]: newState };

      // Method 2
      let newState = _.set({ ...state }, `${type}.loading`, false);
      newState = _.set({ ...newState }, `${type}.refreshing`, false);
      newState = _.set({ ...newState }, `${type}.skip`, action.payload.limit);
      newState = _.set({ ...newState }, `${type}.data`, data);
      return { ...newState };
    }

    // Handle tab change filter criteria
    case MEET_CHANGE_FILTER: {
      const { tab, type, value } = action.payload;
      const newTabState = { ...state[tab] };
      const newFilterState = newTabState.filter;
      newFilterState[type] = value;
      newTabState.filter = newFilterState
      console.log('new tab state is: ', newTabState);
      return { ...state, [tab]: newTabState };
    }

    // Requests Tab actions
    case MEET_REQUESTS_CHANGE_TAB: {
      const newRequests = { ...state['requests'] };
      newRequests.selectedTab = action.payload;
      return { ...state, requests: newRequests };
    }

    // User blocks a friend
    case SETTING_BLOCK_BLOCK_REQUEST_DONE: {
      const newFriends = { ...state.friends };
      newFriends.data = R.filter((a) => a._id !== action.payload)(newFriends.data);
      return { ...state, friends: newFriends };
    }

    default:
      return { ...state };
  }
};

const updateFriendshipData = (type, _id) =>
  R.pipe(
    R.path(`${type}.data`),
    R.filter((item) => item._id === _id
  ));
