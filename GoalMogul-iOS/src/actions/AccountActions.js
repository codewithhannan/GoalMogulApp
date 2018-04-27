import {
  REGISTRATION_ACCOUNT_FORM_CHANGE
} from './types';

import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';

import { updatePassword } from '../Utils/ProfileUtils';

/* Registration Account Actions */
export const handleOnFormChange = (value, prop) => {
  return {
      type: REGISTRATION_ACCOUNT_FORM_CHANGE,
      payload: { value, prop }
  };
};

/* Profile Account Actions */
export const handleUpdatePassword = values => {
  console.log('values are: ', values);
  return async (dispatch, getState) => {
    console.log('values are: ', values);
    const { token } = getState().user;
    const { oldPassword, newPassword } = values;
    const result = await updatePassword({ oldPassword, newPassword, token })
      .then((res) => res.json())
      .catch((err) => {
        console.log('errro in updating password', err);
        throw new SubmissionError({
          _error: err
        });
      });
    if (result === undefined || !result.success) {
      throw new SubmissionError({
        _error: 'Error updating password. Please try later.'
      });
    }
    console.log('result: ', result);
  };
};
