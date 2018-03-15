import { Actions } from 'react-native-router-flux';

// import {
//
// } from '../actions/types';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
