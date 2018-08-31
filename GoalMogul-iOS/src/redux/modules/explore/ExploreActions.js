import {
  EXPLORE_SWITCH_TAB
} from './ExploreReducers';

export const exploreSelectTab = (index) => (dispatch) => {
  dispatch({
    type: EXPLORE_SWITCH_TAB,
    payload: index
  });
};
