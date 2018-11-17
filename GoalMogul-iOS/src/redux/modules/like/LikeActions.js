import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

import {
  LIKE_POST,
  LIKE_COMMENT,
  LIKE_GOAL,
  UNLIKE_POST,
  UNLIKE_COMMENT,
  UNLIKE_GOAL
} from './LikeReducers';

const DEBUG_KEY = '[ Action Like ]';
const LIKE_BASE_ROUTE = 'secure/feed/like';
// Like module related actions
/**
 * action to get like for a goal / post / comment
 * @params parentId: goal/post/comment id
 * @params parentType: ['goal', 'post', 'comment']
 */
export const getLike = (parentId, parentType) => (dispatch, getState) => {
  const { token } = getState().user;
  API
    .get(`${LIKE_BASE_ROUTE}?parentId=${parentId}&parentType=${parentType}`, token)
    .then((res) => {
      // TODO: update comment reducer with specific selector
      console.log(`${DEBUG_KEY}: get like with res, `, res);
    })
    .catch((err) => {
      console.log('Error in getting like: ', err);
    });
};

/**
 * action to like a goal / post / comment
 * @params type: one of goal, post, comment
 * @params id: goal/post/comment id
 */
export const likeGoal = (type, id) => (dispatch, getState) => {
  const { token } = getState().user;
  const { tab } = getState().navigation;
  const tmp = ((request) => {
    switch (request) {
      case 'goal':
        return {
          requestBody: {
            goalRef: id
          },
          action: (likeId) => dispatch({
            type: LIKE_GOAL,
            payload: {
              id,
              likeId,
              tab
            }
          })
        };
      case 'post':
        return {
          requestBody: {
            postRef: id
          },
          action: (likeId) => dispatch({
            type: LIKE_POST,
            payload: {
              id,
              likeId,
              tab
            }
          })
        };

      default:
        return {
          requestBody: {
            commentRef: id
          },
          action: (likeId) => dispatch({
            type: LIKE_COMMENT,
            payload: {
              id,
              likeId,
              tab
            }
          })
        };
    }
  })(type);

  API
    .post(`${LIKE_BASE_ROUTE}`, { ...tmp.requestBody }, token)
    .then((res) => {
      // TODO: update reducers
      console.log(`${DEBUG_KEY}: like goal res: `, res);
      tmp.action('testId');
    })
    .catch((err) => {
      console.log(`Error when like ${type} with id: ${id}. Error is: `, err);
    });
};

/**
 * action to unlike a goal / post / comment
 * @params id: LikeId
 */
export const unLikeGoal = (type, id, likeId, pageId) => (dispatch, getState) => {
  console.log('[ Action Like ]: id passed in is: ', id);
  const { token } = getState().user;
  const { tab } = getState().navigation;
  const tmp = ((request) => {
    switch (request) {
      case 'goal':
        return {
          action: () => dispatch({
            type: UNLIKE_GOAL,
            payload: {
              id,
              likeId: undefined,
              tab,
              pageId,
              type
            }
          })
        };
      case 'post':
        return {
          action: () => dispatch({
            type: UNLIKE_POST,
            payload: {
              id,
              likeId: undefined,
              tab,
              pageId
            }
          })
        };

      default:
        return {
          action: () => dispatch({
            type: UNLIKE_COMMENT,
            payload: {
              id,
              likeId: undefined,
              tab,
              pageId
            }
          })
        };
    }
  })(type);

  API
    .delete(`${LIKE_BASE_ROUTE}?likeId=${likeId}`, { likeId }, token)
    .then((res) => {
      if (res.status === 200 || (res && res.isSuccess)) {
        console.log(`Remove like successfully for ${type} with id: ${id}`);
        // TODO: update reducers
      } else {
        console.warn(`${DEBUG_KEY}: Remove like return without error and success message.
          res is: `, res);
      }
      tmp.action();
    })
    .catch((err) => {
      console.log(`Error when like ${type} with id: ${id}. Error is: `, err);
    });
};
