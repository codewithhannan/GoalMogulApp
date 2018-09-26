// Post Detail Page related Actions
import { Actions } from 'react-native-router-flux';
import {
  POST_DETAIL_OPEN,
  POST_DETAIL_CLOSE
} from './PostReducers';


// open post detail
export const openPostDetail = (post) => (dispatch) => {
  dispatch({
    type: POST_DETAIL_OPEN,
    payload: post
  });

  Actions.push('post');
};

// close post detail
export const closePostDetail = () => (dispatch) => {
  Actions.pop();

  dispatch({
    type: POST_DETAIL_CLOSE,
  });
};

// open edit modal for post given post belongs to current user
export const editPost = () => {

};
