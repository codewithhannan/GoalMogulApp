import { Actions } from 'react-native-router-flux';
import {
  TRIBE_SWITCH_TAB,
  TRIBE_DETAIL_OPEN,
  TRIBE_DETAIL_CLOSE
} from './TribeReducers';

export const tribeSelectTab = (index) => (dispatch) => {
  dispatch({
    type: TRIBE_SWITCH_TAB,
    payload: index
  });
};

export const tribeDetailOpen = (tribe) => (dispatch) => {
  dispatch({
    type: TRIBE_DETAIL_OPEN,
    payload: { ...tribe }
  });
  Actions.tribeDetail();
};

export const tribeDetailClose = () => (dispatch) => {
  Actions.pop();
  dispatch({
    type: TRIBE_DETAIL_CLOSE,
  });
};
