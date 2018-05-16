import {
  PROFILE_OPEN_PROFILE,
  PROFILE_FETCHING_SUCCESS,
  PROFILE_IMAGE_UPLOAD_SUCCESS,
  PROFILE_SUBMIT_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  SETTING_EMAIL_UPDATE_SUCCESS
} from '../actions/types';

const GOAL_FILTER_CONST = {
  sortBy: ['important', 'recent', 'popular'],
  orderBy: ['ascending', 'descending'],
  caterogy: ['all']
};

const INITIAL_STATE = {
  userId: '',
  user: {
    profile: {
      image: undefined
    },
    email: {

    }
  }, // User model for profile
  uploading: false,
  goalFilter: {
    sortBy: {
      overlay: false,
      type: 'important'
    },
    orderBy: {
      overlay: false,
      type: 'ascending'
    },
    catergory: {
      overlay: false,
      type: 'all'
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

    default:
      return { ...state };
  }
};
