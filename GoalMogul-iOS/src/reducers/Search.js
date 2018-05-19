import {
  SEARCH_CHANGE_FILTER
} from '../actions/types';

const INITIAL_STATE = {
  filterBar: {
    sortBy: 'relevance',
    category: 'people'
  },
  data: []
};

/*
  TODO:
  1. populate initial set on profile fetch successfully
*/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_CHANGE_FILTER: {
      const { type, value } = action.payload;
      const newFilterState = { ...state.filterBar };
      newFilterState[type] = value;
      return { ...state, filterBar: newFilterState };
    }

    default:
      return { ...state };
  }
};
