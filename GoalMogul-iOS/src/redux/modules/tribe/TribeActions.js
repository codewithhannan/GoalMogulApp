import {
  TRIBE_SWITCH_TAB
} from './TribeReducers';

export const tribeSelectTab = (index) => (dispatch) => {
  dispatch({
    type: TRIBE_SWITCH_TAB,
    payload: index
  });
};
