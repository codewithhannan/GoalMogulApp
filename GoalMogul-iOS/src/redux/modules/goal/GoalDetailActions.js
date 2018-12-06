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
  GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
  GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS,
  GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS,
  GOAL_DETAIL_SWITCH_TAB,
  GOAL_DETAIL_SWITCH_TAB_V2,
} from '../../../reducers/GoalDetailReducers';

import {
  getGoalDetailByTab
} from './selector';

const DEBUG_KEY = '[ Action GoalDetail ]';

// Basic request routes
const BASE_ROUTE = 'secure/feed';
const LIKE_BASE_ROUTE = `${BASE_ROUTE}/like`;
const COMMENT_BASE_ROUTE = `${BASE_ROUTE}/comment`;
const GOAL_BASE_ROUTE = 'secure/goal';

export const goalDetailSwitchTabV2ByKey = (key, focusRef, focusType) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: GOAL_DETAIL_SWITCH_TAB_V2,
    payload: {
      tab,
      key,
      focusRef,
      focusType
    }
  });
};

export const goalDetailSwitchTabV2 = (index, focusRef, focusType) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: GOAL_DETAIL_SWITCH_TAB_V2,
    payload: {
      tab,
      index,
      focusRef,
      focusType
    }
  });
};

export const goalDetailSwitchTab = (index) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: GOAL_DETAIL_SWITCH_TAB,
    payload: {
      tab,
      index
    }
  });
};

export const closeGoalDetail = () => (dispatch, getState) => {
  const { tab } = getState().navigation;
  // Return to previous page
  Actions.pop();
  // Clear the state
  dispatch({
    type: GOAL_DETAIL_CLOSE,
    payload: {
      tab
    }
  });
};

/**
 * If a step is already mark as completed, then it will change its state to incomplete
 * @param goal: if it's in the need card, then goal is passed in. Otherwise, goal is
 *              undefined
 */
export const markStepAsComplete = (stepId, goal) => (dispatch, getState) => {
  const { token } = getState().user;
  const goalToUpdate = goal || getGoalDetailByTab(getState()).goal;

  // const { goal } = getState().goalDetail;
  const { tab } = getState().navigation;
  const { _id, steps } = goalToUpdate;

  let isCompleted;
  const stepToUpdate = steps.map((item) => {
    const newItem = _.cloneDeep(item);
    if (item._id === stepId) {
      newItem.isCompleted = newItem.isCompleted === undefined ? true : !newItem.isCompleted;
      isCompleted = newItem.isCompleted;
    }
    return newItem;
  });

  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: mark step complete succeed with res: `, res);
    dispatch({
      type: GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS,
      payload: {
        id: stepId,
        isCompleted,
        goalId: _id,
        tab
      }
    });
  };
  const onError = (err) => {
    Alert.alert(
      'Update step status failed',
      'Please try again later.'
    );
    console.warn(`${DEBUG_KEY}: update step status failed with error: `, err);
  };

  updateGoalWithFields(_id, { steps: stepToUpdate }, token, onSuccess, onError);
};

// If a need is already mark as completed, then it will change its state to incomplete
export const markNeedAsComplete = (needId, goal) => (dispatch, getState) => {
  const { token } = getState().user;
  const goalToUpdate = goal || getGoalDetailByTab(getState()).goal;
  // const { goal } = getState().goalDetail;
  const { _id, needs } = goalToUpdate;
  const { tab } = getState().navigation;

  let isCompleted;
  const needToUpdate = needs.map((item) => {
    const newItem = _.cloneDeep(item);
    if (item._id === needId) {
      newItem.isCompleted = newItem.isCompleted === undefined ? true : !newItem.isCompleted;
      isCompleted = newItem.isCompleted;
    }
    return newItem;
  });

  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: mark need complete succeed with res: `, res);
    dispatch({
      type: GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS,
      payload: {
        id: needId,
        isCompleted,
        goalId: _id,
        tab
      }
    });
  };
  const onError = (err) => {
    Alert.alert(
      'Update need status failed',
      'Please try again later.'
    );
    console.warn(`${DEBUG_KEY}: update need status failed with error: `, err);
  };

  updateGoalWithFields(_id, { needs: needToUpdate }, token, onSuccess, onError);
};

// User marks a goal as completed
export const markGoalAsComplete = (goalId, complete) => (dispatch, getState) => {
  const { token } = getState().user;
  const { tab } = getState().navigation;

  const onSuccess = (data) => {
    dispatch({
      type: GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
      payload: {
        goalId,
        tab,
        complete
      }
    });
    // Alert.alert(
    //   'Success',
    //   `You have successfully marked this goal as ${complete ? 'complete' : 'incomplete'}.`
    // );
    console.log(
      `${DEBUG_KEY}: mark goal as
      ${complete ? 'complete' : 'incomplete'}
      succeed with data: `, data);
  };

  const onError = (err) => {
    Alert.alert(
      `Failed to mark goal as ${complete ? 'complete' : 'incomplete'}.`,
      'Please try again later.'
    );
    console.log(
      `${DEBUG_KEY}: mark goal as
      ${complete ? 'complete' : 'incomplete'}
      failed with err: `, err);
  };

  updateGoalWithFields(goalId, { isCompleted: complete }, token, onSuccess, onError);
};

// Load states to CreateGoal modal to edit.
export const editGoal = (goal) => (dispatch) => {
  Actions.push('createGoalModal', { initializeFromState: true, goal });
};

/**
 *Send updates to server and on Success Update the state of the goal detail
 * And the goal in profile if found
 */
export const editGoalDone = () => (dispatch, getState) => {

}

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
  const { tab } = getState().navigation;

  const onSuccess = (res) => {
    dispatch({
      type: GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
      payload: {
        goalId,
        tab
      }
    });
    Alert.alert('Success', 'You have successfully shared this goal to mastermind.');
    console.log(`${DEBUG_KEY}: shareToMastermind succeed with res: `, res);
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
      onError(err);
    });
};
