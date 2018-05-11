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
  return async (dispatch, getState) => {
    const { token } = getState().user;
    const { oldPassword, newPassword, confirmPassword } = values;

    if (oldPassword === newPassword) {
      throw new SubmissionError({
        _error: 'Password does\'t change.'
      });
    }

    if (newPassword !== confirmPassword) {
      throw new SubmissionError({
        _error: 'New passwords does\'t match.'
      });
    }

    const result = await updatePassword({ oldPassword, newPassword, token })
      .then((res) => {
        console.log('response for updating password is: ', res);
        return res;
      })
      .catch((err) => {
        console.log('errro in updating password', err);
        throw new SubmissionError({
          _error: err
        });
      });
    /*
      If result is not true, then update fails.
      Please look into custumeFetch in ProfileUtils.handleUpdatePassword
    */
    if (!result) {
      throw new SubmissionError({
        _error: 'Error updating password. Please try later.'
      });
    }
    console.log('result: ', result);
    Actions.pop();
  };
};
