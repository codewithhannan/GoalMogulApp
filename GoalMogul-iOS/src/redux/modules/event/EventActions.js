import {
  EVENT_SWITCH_TAB
} from './EventReducers';

export const eventSelectTab = (index) => (dispatch) => {
  dispatch({
    type: EVENT_SWITCH_TAB,
    payload: index
  });
};
