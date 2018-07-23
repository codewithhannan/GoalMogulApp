import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

import {

} from '../../../reducers';

const DEBUG_KEY = '[ Action GoalDetail ]';

/**
 * Right now, we implement no cache system for such case.
 */
export const fetchGoalDetail = (id) => {
  // Fetch Goal and like and comment in three different requests with three futures
};

export const closeGoalDetail = () => {

}

// Comment module related actions

/**
 * action to update comments for a goal / post
 * @params parentId: goal/post id
 * @params parentType: ['goal', 'post' ]
 */
export const getComments = (parentId, parentType) => (dispatch, getState) {

};

/**
 * action to update a comment for a goal / post
 * @params commentId: id of the comment
 * @params updates: JsonObject of the updated comment
 */
export const updateComment = (commentId, udpates) => {

};

/**
 * action to create a comment for a goal / post
 * @params comment: a json object of a comment object
 */
export const createComment = (rawComment) => {
  // rawComment needs an adapter to transform to backend jsonObject
};

/**
 * action to delete a comment for a goal / post
 * @params commentId: id of the comment
 */
export const deleteComment = (commentId) => {

};

// Like module related actions
/**
 * action to get like for a goal / post / comment
 * @params parentId: goal/post/comment id
 * @params parentType: ['goal', 'post', 'comment']
 */
export const getLike = (parentId, parentType) => {

};

/**
 * action to like a goal / post / comment
 * @params id: goal/post/comment id
 */
export const likeGoal = (id) => {

};

/**
 * action to unlike a goal / post / comment
 * @params id: LikeId
 */
export const unLikeGoal = (likeId) => {

};
