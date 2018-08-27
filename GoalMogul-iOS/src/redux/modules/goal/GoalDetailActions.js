import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

import {
  GOAL_DETAIL_CLOSE
} from '../../../reducers/GoalDetailReducers';

const DEBUG_KEY = '[ Action GoalDetail ]';

// Basic request routes
const BASE_ROUTE = 'secure/feed';
const LIKE_BASE_ROUTE = `${BASE_ROUTE}/like`;
const COMMENT_BASE_ROUTE = `${BASE_ROUTE}/comment`;
const GOAL_BASE_ROUTE = 'secure/goal';

/**
 * Right now, we implement no cache system for such case.
 */
export const openGoalDetail = (id) => {
  // Fetch Goal and like and comment in three different requests with three futures

};

export const closeGoalDetail = () => (dispatch) => {
  // Return to previous page
  Actions.pop();
  // Clear the state
  dispatch({
    type: GOAL_DETAIL_CLOSE
  });
};

// Like module related actions
/**
 * action to get like for a goal / post / comment
 * @params parentId: goal/post/comment id
 * @params parentType: ['goal', 'post', 'comment']
 */
export const getLike = (parentId, parentType) => (dispatch, getState) => {
  const { token } = getState().user;
  API
    .get(`${LIKE_BASE_ROUTE}?parentId=${parentId}&parentType=${parentType}`)
    .then((res) => {
      // TODO: update comment reducer with specific selector
    })
    .catch((err) => {
      console.log('Error in getting like: ', err);
    })

};

/**
 * action to like a goal / post / comment
 * @params type: one of goal, post, comment
 * @params id: goal/post/comment id
 */
export const likeGoal = (type, id) => (dispatch, getState) => {
  const { token } = getState().user;
  const requestBody = ((request) => {
    switch (request) {
      case 'goal':
        return {
          goalRef: id
        };
      case 'post':
        return {
          postRef: id
        };

      default:
        return {
          commentRef: id
        };
    }
  })(type);

  API
    .post(`${LIKE_BASE_ROUTE}`, { ...requestBody }, token)
    .then((res) => {
      // TODO: update reducers
    })
    .catch((err) => {
      console.log(`Error when like ${type} with id: ${id}. Error is: `, err);
    })
};

/**
 * action to unlike a goal / post / comment
 * @params id: LikeId
 */
export const unLikeGoal = (likeId) => (dispatch, getState) => {
  const { token } = getState().user;
  API
    .delete(`${LIKE_BASE_ROUTE}`, { likeId }, token)
    .then((res) => {
      if (res && res.isSuccess) {
        console.log(`Remove like successfully for ${type} with id: ${id}`);
        // TODO: update reducers
      } else {
        console.warn(`Remove like return without error and success message. res is: `, res);
      }
    })
    .catch((err) => {
      console.log(`Error when like ${type} with id: ${id}. Error is: `, err);
    })
};
