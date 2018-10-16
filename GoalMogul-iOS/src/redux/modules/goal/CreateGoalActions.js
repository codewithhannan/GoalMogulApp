import { reset } from 'redux-form';
import { Alert } from 'react-native';
import _ from 'lodash';
import { api as API } from '../../middleware/api';

import {
  GOAL_CREATE_SUBMIT,
  GOAL_CREATE_SUBMIT_SUCCESS,
  GOAL_CREATE_SUBMIT_FAIL
} from './CreateGoal';

const DEBUG_KEY = '[ Action CreateGoal ]';

// Validate goal form
export const validate = values => {
  const errors = {};
  if (!values.title) {
    errors.title = 'Required';
  }
  if (!values.privacy) {
    errors.privacy = 'Required';
  }
  return errors;
};

// Submit values
export const submitGoal = (values, userId, isEdit, callback) => (dispatch, getState) => {
  const { token } = getState().user;
  const goal = formToGoalAdapter(values, userId);
  console.log('Transformed goal is: ', goal);

  dispatch({
    type: GOAL_CREATE_SUBMIT
  });

  // If user is editing the goal, then call another endpoint
  if (isEdit) {
    return submitEditGoal(goal, token, callback, dispatch);
  }

  const onError = () => {
    dispatch({
      type: GOAL_CREATE_SUBMIT_FAIL
    });
    Alert.alert(
      'Creating new goal failed',
      'Please try again later'
    );
  };

  const onSuccess = () => {
    dispatch({
      type: GOAL_CREATE_SUBMIT_SUCCESS
    });
    Alert.alert(
      'Success',
      'You have successfully created a goal.'
    );
  };

  // Creating new goal
  API
    .post(
      'secure/goal/',
      {
        goal: JSON.stringify({ ...goal })
      },
      token
    )
    .then((res) => {
      if (res.data && !_.isEmpty(res.data)) {
        console.log(`${DEBUG_KEY}: creating goal success`);
        console.log(`${DEBUG_KEY}: result is`, res);
        // TODO: dispatch changes to feed and clear CreateGoalForm state
        callback();
        onSuccess();
        dispatch(reset('createGoalModal'));
        return;
      }
      console.log(`${DEBUG_KEY}: creating goal success without returning data, res is: `, res);
      onError();
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: Error in submitting new goal ${err}`);
      onError();
    });
};

// Submit editting a goal
const submitEditGoal = (goal, token, callback, dispatch) => {
  const onError = () => {
    dispatch({
      type: GOAL_CREATE_SUBMIT_FAIL
    });
    Alert.alert(
      'Edit goal failed',
      'Please try again later'
    );
  };

  const onSuccess = () => {
    Alert.alert(
      'Success',
      'You have successfully edited a goal.'
    );
    dispatch({
      type: GOAL_CREATE_SUBMIT_SUCCESS
    });
  };

  API
    .put(
      'secure/goal/',
      {
        goal: JSON.stringify({ ...goal })
      },
      token
    )
    .then((res) => {
      if (res.data && res.data !== null) {
        console.log(`${DEBUG_KEY}: editing goal success`);
        console.log(`${DEBUG_KEY}: result is`, res);
        // TODO: dispatch changes to feed and clear CreateGoalForm state
        callback();
        onSuccess();
        dispatch(reset('createGoalModal'));
      }
      console.log(`${DEBUG_KEY}: editing goal success without returning data, res is: `, res);
      onError();
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: Error in editing new goal ${err}`);
      onError();
    });
};

// Transform values from Goal form to server accepted format
const formToGoalAdapter = (values, userId) => {
  const {
    title,
    category,
    privacy,
    // Following are not required
    shareToMastermind,
    needs,
    steps,
    details,
    priority,
    startTime,
    endTime
  } = values;
  return {
    owner: userId,
    title,
    category,
    privacy: privacy === 'Private' ? 'self' : privacy.toLowerCase(),
    shareToGoalFeed: shareToMastermind,
    needs: stepsNeedsAdapter(needs),
    steps: stepsNeedsAdapter(steps),
    details: detailsAdapter(details),
    priority,
    start: startTime.date,
    end: endTime.date
  };
};

/**
 * Transform a goal object to form format
 * Note: currently, if a goal is updated, then all its needs' and steps'
 * created will be updated to the current date
 */
export const goalToFormAdaptor = (values) => {
  // Function to capitalize the first character
  const capitalizeWord = (word) => {
    if (!word) return '';
    return word.replace(/^\w/, c => c.toUpperCase());
  };

  const {
    title,
    category,
    privacy,
    shareToGoalFeed,
    priority,
    details,
    needs,
    steps,
    start,
    end
  } = values;

  console.log('values are: ', values);

  return {
    title,
    category,
    privacy: privacy === 'self' ? 'Private' : capitalizeWord(privacy),
    // Following are not required
    shareToMastermind: shareToGoalFeed,
    needs: stepsNeedsReverseAdapter(needs),
    steps: stepsNeedsReverseAdapter(steps),
    // TODO: TAG:
    details: details.text,
    priority,
    startTime: {
      date: start ? new Date(`${start}`) : undefined,
      picker: false
    },
    endTime: {
      date: end ? new Date(`${end}`) : undefined,
      picker: false
    }
  };
};

/**
 * Transform an array of Strings to an array of acceptable Step
 * Step: { isCompleted, description, created, [order]}
 * Note:
 * 1. Things in [] is optional
 * 2. Right now, steps and needs share the same format
 */
const stepsNeedsAdapter = values => {
  if (!values && values.length < 0) {
    return undefined;
  }
  return values.map((val, index) => {
    if (!_.isEmpty(val)) {
      return {
        isCompleted: false,
        description: val,
        order: index,
        created: new Date()
      };
    }
    return '';
  }).filter((val) => val !== '');
};

const detailsAdapter = (value) => {
  if (!value || value.length === 0 || _.isEmpty(value[0])) return undefined;

  return {
    text: value[0],
    tag: undefined
  };
};

/**
 * Transform an array of needs object to a list of Strings for the form
 * in the order of order params
 * Note: currently, if a goal is updated, then all its needs' and steps'
 * created will be updated to the current date
 */
const stepsNeedsReverseAdapter = values => {
  if (!values || values.length <= 0) return undefined;

  return (
    values
      .sort((a, b) => {
        if (!a.order && !b.order) return a.description - b.description;
        if (!a.order && b.order) return 1;
        if (a.order && !b.order) return -1;
        return (a.order - b.order);
      })
      .map((item) => item.description)
  );
};
