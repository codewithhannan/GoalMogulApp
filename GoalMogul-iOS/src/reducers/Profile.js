import {
  PROFILE_OPEN_PROFILE,
  PROFILE_FETCHING_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  userId: '',
  user: {} // User model for profile
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROFILE_OPEN_PROFILE:
      return { ...state, userId: action.payload };

    case PROFILE_FETCHING_SUCCESS:
      return { ...state, user: action.payload };

    default:
      return state;
  }
};
