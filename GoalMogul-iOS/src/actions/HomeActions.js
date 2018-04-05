import { Actions } from 'react-native-router-flux';

import {
  REGISTRATION_BACK,
} from './types';

export const openProfile = (userId) => {
  // TODO: update visiting profile userId using params
  return (dispatch) => {
    dispatch({
      type: ''
    });
    Actions.profile();
  };
};
