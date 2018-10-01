import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import {
  Alert
} from 'react-native';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

import {
  GOAL_DETAIL_CLOSE,
  GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
  GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS
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

  const onSuccess = () => {
    dispatch({
      type: GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
      payload: goalId
    });
  };

  const onError = () => {
    Alert.alert(
      'Mark goal as complete failed',
      'Please try again later'
    );
  };

  updateGoalWithFields(goalId, { isCompleted: true }, token, onSuccess, onError);
};

// Load states to CreateGoal modal to edit.
export const editGoal = () => (dispatch) => {
  Actions.push('createGoalModal', { initializeFromState: true });
};

// Show a popup to confirm if user wants to share this goal to mastermind
export const shareGoalToMastermind = (goalId) => (dispatch, getState) => {
  Alert.alert(
    'Are you sure to share this goal to mastermind?',
    '',
    [
      {
        text: 'Confirm',
        onPress: () => shareToMastermind(goalId, dispatch, getState)
      },
      {
        text: 'Cancel',
        onPress: () => console.log('User cancel share to mastermind'),
        style: 'cancel'
      }
    ]
  );
};

const shareToMastermind = (goalId, dispatch, getState) => {
  console.log('user pressed confirm ');
  const { token } = getState().user;

  const onSuccess = (data) => {
    dispatch({
      type: GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
      payload: goalId
    });
  };

  const onError = (err) => {
    Alert.alert(
      'Share to mastermind failed',
      'Please try again later'
    );
    console.warn(`${DEBUG_KEY}: share to mastermind failed with error: `, err);
  };
  updateGoalWithFields(goalId, { shareToGoalFeed: true }, token, onSuccess, onError);
};

/**
 * This is a API to send updates for a goal
 * @param fields: fields for the goal that needs updates
 * @param goalId: the goal that is updated
 * @param token: current user token
 * @param dispatch
 */
const updateGoalWithFields = (goalId, fields, token, onSuccessFunc, onErrorFunc) => {
  const onError = onErrorFunc ||
    ((err) => console.log(`${DEBUG_KEY}: updating fields with Error: `, err));
  const onSuccess = onSuccessFunc ||
    ((message) => console.log(`${DEBUG_KEY}: updating fields succeed with message: `, message));
  API
    .put('secure/goal', { goalId, updates: JSON.stringify({ ...fields }) }, token)
    .then((res) => {
      if (!res.message) {
        return onSuccess(res.data);
      }
      console.log(`${DEBUG_KEY}: updating fields ${fields} with with message: `, res);
      onError(res);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: updating fields ${fields} with err: `, err);
      if (onError && onError instanceof Function) {
        onError(err);
      }
    });
};
