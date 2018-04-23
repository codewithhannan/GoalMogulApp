import {
  PROFILE_OPEN_PROFILE,
  PROFILE_FETCHING_SUCCESS,
  PROFILE_IMAGE_UPLOAD_SUCCESS,
  PROFILE_SUBMIT_UPDATE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL
} from '../actions/types';

const INITIAL_STATE = {
  userId: '',
  user: {
    profile: {
      image: undefined
    },
    email: {
      
    }
  }, // User model for profile
  uploading: false
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
      return state;
  }
};
