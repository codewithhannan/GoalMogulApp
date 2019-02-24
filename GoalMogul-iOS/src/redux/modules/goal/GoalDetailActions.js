import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import {
  Alert
} from 'react-native';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

import {
  GOAL_DETAIL_UPDATE,
  GOAL_DETAIL_UPDATE_DONE,
  GOAL_DETAIL_FETCH,
  GOAL_DETAIL_FETCH_DONE,
  GOAL_DETAIL_FETCH_ERROR,
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

import {
  refreshComments
} from '../feed/comment/CommentActions';

const DEBUG_KEY = '[ Action GoalDetail ]';

// Basic request routes
const BASE_ROUTE = 'secure/feed';
const LIKE_BASE_ROUTE = `${BASE_ROUTE}/like`;
const COMMENT_BASE_ROUTE = `${BASE_ROUTE}/comment`;
const GOAL_BASE_ROUTE = 'secure/goal';

/**
 * Refresh goal detail and comments by goal Id
 */
export const refreshGoalDetailById = (goalId, pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  const { token } = getState().user;

  dispatch({
    type: GOAL_DETAIL_FETCH,
    payload: {
      goalId,
      tab,
      pageId
    }
  });

  const onError = (err) => {
    console.warn(`${DEBUG_KEY}: refresh goal error: `, err);
    if (err.status === 400 || err.status === 404) {
      Alert.alert(
        'Content not found',
        'This goal has been removed', 
        [
          { 
            text: 'Cancel', 
            onPress: () => Actions.pop()
          }
        ]
      );
    }
    dispatch({
      type: GOAL_DETAIL_FETCH_ERROR,
      payload: {
        goal: undefined,
        goalId,
        pageId,
        tab,
        error: err
      }
    });
  };

  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: refresh goal done with res: `, res);
    dispatch({
      type: GOAL_DETAIL_FETCH_DONE,
      payload: {
        goal: res.data,
        goalId,
        tab,
        pageId
      }
    });
  };

  API
    .get(`${GOAL_BASE_ROUTE}?goalId=${goalId}`, token)
    .then((res) => {
      if (res.status === 200) {
        return onSuccess(res);
      }
      onError(res);
    })
    .catch((err) => {
      onError(err);
    });

  refreshComments('Goal', goalId, tab, pageId)(dispatch, getState);
};

export const goalDetailSwitchTabV2ByKey = (key, focusRef, focusType, goalId, pageId) => 
(dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: GOAL_DETAIL_SWITCH_TAB_V2,
    payload: {
      tab,
      key,
      focusRef,
      focusType,
      goalId, 
      pageId
    }
  });
};

export const goalDetailSwitchTabV2 = (index, focusRef, focusType, goalId, pageId) => 
(dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: GOAL_DETAIL_SWITCH_TAB_V2,
    payload: {
      tab,
      index,
      focusRef,
      focusType,
      goalId, 
      pageId
    }
  });
};

// This is used in GoalDetailCardV2 which is currently deprecated so no need to update for now
export const goalDetailSwitchTab = (index, goalId, pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  dispatch({
    type: GOAL_DETAIL_SWITCH_TAB,
    payload: {
      tab,
      index,
      goalId, 
      pageId
    }
  });
};

export const closeGoalDetail = (goalId, pageId) => (dispatch, getState) => {
  // Return to previous page
  Actions.pop();
  // Clear the state
  closeGoalDetailWithoutPoping(goalId, pageId)(dispatch, getState);
};

export const closeGoalDetailWithoutPoping = (goalId, pageId) => (dispatch, getState) => {
  const { tab } = getState().navigation;
  // Clear the state
  dispatch({
    type: GOAL_DETAIL_CLOSE,
    payload: {
      tab,
      goalId, 
      pageId
    }
  });
};

/**
 * If a step is already mark as completed, then it will change its state to incomplete
 * @param goal: if it's in the need card, then goal is passed in. Otherwise, goal is
 *              undefined
 */
export const markStepAsComplete = (stepId, goal, pageId) => (dispatch, getState) => {
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
      type: GOAL_DETAIL_UPDATE_DONE,
      payload: {
        isCompleted,
        tab,
        goalId: _id,
        pageId,
        type: 'markStepAsComplete'
      }
    });

    dispatch({
      type: GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS,
      payload: {
        id: stepId,
        isCompleted,
        goalId: _id,
        tab,
        pageId
      }
    });
  };
  const onError = (err) => {
    dispatch({
      type: GOAL_DETAIL_UPDATE_DONE,
      payload: {
        isCompleted,
        tab,
        goalId: _id,
        type: 'markStepAsComplete',
        pageId
      }
    });

    Alert.alert(
      'Update step status failed',
      'Please try again later.'
    );
    console.warn(`${DEBUG_KEY}: update step status failed with error: `, err);
  };

  dispatch({
    type: GOAL_DETAIL_UPDATE,
    payload: {
      isCompleted,
      tab,
      goalId: _id,
      type: 'markStepAsComplete',
      pageId
    }
  });

  updateGoalWithFields(_id, { steps: stepToUpdate }, token, onSuccess, onError);
};

// If a need is already mark as completed, then it will change its state to incomplete
export const markNeedAsComplete = (needId, goal, pageId) => (dispatch, getState) => {
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
      type: GOAL_DETAIL_UPDATE_DONE,
      payload: {
        isCompleted,
        tab,
        goalId: _id,
        pageId,
        type: 'markNeedAsComplete'
      }
    });

    dispatch({
      type: GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS,
      payload: {
        id: needId,
        isCompleted,
        goalId: _id,
        pageId,
        tab
      }
    });
  };

  const onError = (err) => {
    dispatch({
      type: GOAL_DETAIL_UPDATE_DONE,
      payload: {
        isCompleted,
        tab,
        goalId: _id,
        type: 'markNeedAsComplete',
        pageId
      }
    });

    Alert.alert(
      'Update need status failed',
      'Please try again later.'
    );
    console.warn(`${DEBUG_KEY}: update need status failed with error: `, err);
  };

  dispatch({
    type: GOAL_DETAIL_UPDATE,
    payload: {
      isCompleted,
      tab,
      goalId: _id,
      type: 'markNeedAsComplete',
      pageId
    }
  });

  updateGoalWithFields(_id, { needs: needToUpdate }, token, onSuccess, onError);
};

// User marks a goal as completed
export const markGoalAsComplete = (goalId, complete, pageId) => (dispatch, getState) => {
  const { token } = getState().user;
  const { tab } = getState().navigation;

  const onSuccess = (data) => {
    dispatch({
      type: GOAL_DETAIL_UPDATE_DONE,
      payload: {
        complete,
        tab,
        goalId,
        type: 'markGoalAsComplete',
        pageId
      }
    });

    dispatch({
      type: GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
      payload: {
        goalId,
        tab,
        complete,
        pageId
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
    dispatch({
      type: GOAL_DETAIL_UPDATE_DONE,
      payload: {
        complete,
        tab,
        goalId,
        type: 'markGoalAsComplete',
        pageId
      }
    });

    Alert.alert(
      `Failed to mark goal as ${complete ? 'complete' : 'incomplete'}.`,
      'Please try again later.'
    );
    console.log(
      `${DEBUG_KEY}: mark goal as
      ${complete ? 'complete' : 'incomplete'}
      failed with err: `, err);
  };

  dispatch({
    type: GOAL_DETAIL_UPDATE,
    payload: {
      complete,
      tab,
      goalId,
      type: 'markGoalAsComplete',
      pageId
    }
  });

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
export const shareGoalToMastermind = (goalId, pageId) => (dispatch, getState) => {
  Alert.alert(
    'Are you sure you want to share this to the Goal Feed?',
    '',
    [
      {
        text: 'Confirm',
        onPress: () => shareToMastermind(goalId, pageId, dispatch, getState)
      },
      {
        text: 'Cancel',
        onPress: () => console.log('User cancel share to goal feed'),
        style: 'cancel'
      }
    ]
  );
};

const shareToMastermind = (goalId, pageId, dispatch, getState) => {
  console.log('user pressed confirm ');
  const { token } = getState().user;
  const { tab } = getState().navigation;

  const onSuccess = (res) => {
    dispatch({
      type: GOAL_DETAIL_UPDATE_DONE,
      payload: {
        tab,
        goalId,
        type: 'shareToMastermind',
        pageId
      }
    });

    dispatch({
      type: GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
      payload: {
        goalId,
        tab,
        pageId
      }
    });
    // Alert.alert('Success', 'You have successfully shared this goal to mastermind.');
    console.log(`${DEBUG_KEY}: shareToMastermind succeed with res: `, res);
  };

  const onError = (err) => {
    dispatch({
      type: GOAL_DETAIL_UPDATE_DONE,
      payload: {
        tab,
        goalId,
        type: 'shareToMastermind',
        pageId
      }
    });

    Alert.alert(
      'Share to mastermind failed',
      'Please try again later'
    );
    console.warn(`${DEBUG_KEY}: share to mastermind failed with error: `, err);
  };

  dispatch({
    type: GOAL_DETAIL_UPDATE,
    payload: {
      tab,
      goalId,
      type: 'shareToMastermind',
      pageId
    }
  });
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
