import {
  REGISTRATION_ACCOUNT_FORM_CHANGE
} from './types';

export const handleOnFormChange = (value, prop) => {
  return {
      type: REGISTRATION_ACCOUNT_FORM_CHANGE,
      payload: { value, prop }
  };
};
