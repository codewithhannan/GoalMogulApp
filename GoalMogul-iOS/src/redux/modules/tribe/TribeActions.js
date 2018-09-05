import { Actions } from 'react-native-router-flux';
import {
  TRIBE_SWITCH_TAB,
  TRIBE_DETAIL_OPEN,
  TRIBE_DETAIL_CLOSE,
  TRIBE_FEED_FETCH,
  TRIBE_FEED_FETCH_DONE
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

const fetchTribeFeed = (tribeId, token, dispatch) => {
  dispatch({
    type: TRIBE_FEED_FETCH,
  });

  // TODO: fetch tribe feed
};

export const tribeDetailClose = () => (dispatch) => {
  Actions.pop();
  dispatch({
    type: TRIBE_DETAIL_CLOSE,
  });
};
