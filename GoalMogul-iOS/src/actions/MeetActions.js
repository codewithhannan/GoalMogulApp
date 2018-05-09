import { Actions } from 'react-native-router-flux';
import {
  MEET_SELECT_TAB
} from './types';

export const selectTab = id => {
  return (dispatch) => {
    dispatch({
      type: MEET_SELECT_TAB,
      payload: id
    });
  };
};
