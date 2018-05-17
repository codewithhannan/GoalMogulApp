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
  uploading: false,
  // navigation state
  selectedTab: 'suggested',
  navigationState: {
    index: 0,
    routes: [
      { key: 'goals', title: 'MY GOALS' },
      { key: 'posts', title: 'MY POSTS' },
      { key: 'needs', title: 'MY NEEDS' }
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
      return { ...state, userId: action.payload };

    case PROFILE_FETCHING_SUCCESS:
      return { ...state, user: action.payload };

    case PROFILE_IMAGE_UPLOAD_SUCCESS: {
      let user = { ...state.user };
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

    default:
      return { ...state };
  }
};
