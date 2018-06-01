import _ from 'lodash';

import {
  PROFILE_OPEN_PROFILE,
  PROFILE_FETCHING_SUCCESS,
  PROFILE_IMAGE_UPLOAD_SUCCESS,
  PROFILE_SUBMIT_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  SETTING_EMAIL_UPDATE_SUCCESS,
  PROFILE_SWITCH_TAB
} from '../actions/types';

export const PROFILE_FETCH_MUTUAL_FRIEND_DONE = 'profile_fetch_mutual_friend_done';
export const PROFILE_FETCH_FRIENDSHIP_DONE = 'profile_fetch_friendship_done';
export const PROFILE_FETCH_FRIEND_DONE = 'profile_fetch_friend_done';
export const PROFILE_FETCH_FRIEND_COUNT_DONE = 'profile_fetch_friend_count_done';
export const PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE = 'profile_fetch_mutual_friend_count_done';

const GOAL_FILTER_CONST = {
  sortBy: ['important', 'recent', 'popular'],
  orderBy: ['ascending', 'descending'],
  caterogy: ['all']
};

const INITIAL_STATE = {
  userId: '',
  // User model for profile
  user: {
    profile: {
      image: undefined
    },
    email: {

    }
  },
  // Me Page mutual friends count
  mutualFriends: {
    count: 0
  },
  // Overall loading status
  loading: false,
/**
  * Friendship between current user and current profile fetched
  * Ignore if it's self
  */
  friendship: {
    status: undefined // one of [undefined, 'Invited', 'Accepted']
  },

  uploading: false,
  // navigation state
  selectedTab: 'suggested',
  navigationState: {
    index: 0,
    routes: [
      { key: 'goals', title: 'Goals' },
      { key: 'posts', title: 'Posts' },
      { key: 'needs', title: 'Needs' }
    ]
  },
  // Individual tab state
  goals: {
    filterbar: {
      sortBy: {
        type: 'important'
      },
      orderBy: {
        type: 'ascending'
      },
      catergory: {
        type: 'all'
      }
    }
  },
  posts: {
    filterbar: {
      sortBy: {
        type: 'important'
      },
      orderBy: {
        type: 'ascending'
      },
      catergory: {
        type: 'all'
      }
    }
  },
  needs: {
    filterbar: {
      sortBy: {
        type: 'important'
      },
      orderBy: {
        type: 'ascending'
      },
      catergory: {
        type: 'all'
      }
    }
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROFILE_OPEN_PROFILE:
      return { ...state, userId: action.payload, loading: true };

    case PROFILE_FETCHING_SUCCESS:
      return { ...state, user: action.payload, loading: false };

    case PROFILE_IMAGE_UPLOAD_SUCCESS: {
      let user = _.cloneDeep(state.user);
      user.profile.image = action.payload;
      return { ...state, user };
    }

    case PROFILE_SUBMIT_UPDATE:
      return { ...state, uploading: true };

    case PROFILE_UPDATE_SUCCESS: {
      return { ...state, user: action.payload, uploading: false };
    }

    // Update navigation state when new tab is selected
    case PROFILE_SWITCH_TAB: {
      const newNavigationState = { ...state.navigationState };
      newNavigationState.index = action.payload;

      return {
        ...state,
        selectedTab: newNavigationState.routes[action.payload].key,
        navigationState: newNavigationState
      };
    }

    // profile fetch mutual friend request done
    case PROFILE_FETCH_MUTUAL_FRIEND_DONE: {
      let newMutualFriends = _.cloneDeep(state.mutualFriends);
      newMutualFriends.data = action.payload;
      return { ...state, mutualFriends: newMutualFriends };
    }

    case PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE: {
      let newMutualFriends = _.cloneDeep(state.mutualFriends);
      newMutualFriends.count = action.payload;
      return { ...state, mutualFriends: newMutualFriends };
    }

    // profile fetch friendship request done
    case PROFILE_FETCH_FRIENDSHIP_DONE: {
      return { ...state };
    }

    default:
      return { ...state };
  }
};
