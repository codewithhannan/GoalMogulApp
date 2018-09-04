import { Actions } from 'react-native-router-flux';
import {
  EVENT_SWITCH_TAB,
  EVENT_DETAIL_CLOSE,
  EVENT_DETAIL_OPEN,
} from './EventReducers';

export const eventSelectTab = (index) => (dispatch) => {
  dispatch({
    type: EVENT_SWITCH_TAB,
    payload: index
  });
};

export const eventDetailClose = () => (dispatch) => {
  Actions.pop();
  dispatch({
    type: EVENT_DETAIL_CLOSE
  });
};

export const eventDetailOpen = (event) => (dispatch) => {
  dispatch({
    type: EVENT_DETAIL_OPEN,
    payload: { ...event }
  });
  Actions.eventDetail();
};
