import {
  USERNAME_CHANGED,
  PASSWORD_CHANGED
} from './types';

export const userNameChanged = (username) => {
  return {
    type: USERNAME_CHANGED,
    payload: username
  };
};

export const passwordChanged = (password) => {
  return {
    type: PASSWORD_CHANGED,
    payload: password
  };
};

export const loginUser = ({ username, password }) => {
  // Call the endpoint to use username and password to signin
  // Obtain the credential

  // fetch(url, header).then((res) => {
  //  res.json().then((data) => {
  //     // Handle data
  //     dispatch({ type: , payload: });
  //  })
  // })
  return (dispatch) => {

  };
};
