import {
  REGISTRATION_ACCOUNT_FORM_CHANGE
} from './types';

import { Actions } from 'react-native-router-flux';

/* Registration Account Actions */
export const handleOnFormChange = (value, prop) => {
  return {
      type: REGISTRATION_ACCOUNT_FORM_CHANGE,
      payload: { value, prop }
  };
};

/* Profile Account Actions */
