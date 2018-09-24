import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import {
  Alert
} from 'react-native';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

import {
  GOAL_DETAIL_CLOSE,
  GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS
} from '../../../reducers/GoalDetailReducers';

const DEBUG_KEY = '[ Action GoalDetail ]';

// Basic request routes
const BASE_ROUTE = 'secure/feed';
const LIKE_BASE_ROUTE = `${BASE_ROUTE}/like`;
const COMMENT_BASE_ROUTE = `${BASE_ROUTE}/comment`;
const GOAL_BASE_ROUTE = 'secure/goal';

export const closeGoalDetail = () => (dispatch) => {
  // Return to previous page
  Actions.pop();
  // Clear the state
  dispatch({
    type: GOAL_DETAIL_CLOSE
  });
};

// User marks a goal as completed
export const markGoalAsComplete = (goalId) => (dispatch, getState) => {
  const { token } = getState().user;

  API
    .put('secure/goal', { goalId, updates: JSON.stringify({ isCompleted: true }) }, token)
    .then((res) => {
      if (!res.message) {
        dispatch({
          type: GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
          payload: goalId
        });
      }
      console.log(`${DEBUG_KEY}: markGoalAsComplete return with message: `, res);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: Error in markGoalAsComplete: `, err);
    });
};

// Load states to CreateGoal modal to edit.
export const editGoal = () => (dispatch) => {

};

// Show a popup to confirm if user wants to share this goal to mastermind
export const shareGoalToMastermind = () => (dispatch, getState) => {
  Alert.alert(
    'Are you sure to share this goal to mastermind?',
    '',
    [
      {
        text: 'Confirm',
        onPress: () => shareToMastermind(dispatch, getState)
      },
      {
        text: 'Cancel',
        onPress: () => console.log('User cancel share to mastermind'),
        style: 'cancel'
      }
    ]
  );
};

const shareToMastermind = (dispatch, getState) => {
  console.log('user pressed confirm ')
};
