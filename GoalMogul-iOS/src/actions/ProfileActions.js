import { Actions } from 'react-native-router-flux';

export const openProfileDetail = () => {
  return (dispatch) => {
    dispatch({
      type: ''
    });
    Actions.profileDetail();
  };
};
