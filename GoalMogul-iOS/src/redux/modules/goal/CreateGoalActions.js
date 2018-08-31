import { reset } from 'redux-form';
import { api as API } from '../../middleware/api';

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
export const submitGoal = (values, userId, callback) => (dispatch, getState) => {
  const { token } = getState().user;
  const goal = goalAdapter(values, userId);
  console.log('Transformed goal is: ', goal);
  API
    .post(
      'secure/goal/',
      {
        goal: JSON.stringify({ ...goal })
      },
      token
    )
    .then((res) => {
      if (res.data && res.data !== null) {
        console.log(`${DEBUG_KEY}: creating goal success`);
        console.log(`${DEBUG_KEY}: result is`, res);
        // TODO: dispatch changes to feed and clear CreateGoalForm state
        callback();
        dispatch(reset('createGoalModal'));
      }
      console.log(`${DEBUG_KEY}: creating goal success without returning data, res is: `, res);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: Error in submitting new goal ${err}`);
    });
};

// Transform values from Goal form to server accepted format
const goalAdapter = (values, userId) => {
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
    privacy: privacy.toLowerCase(),
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
 * Transform an array of Strings to an array of acceptable Step
 * Step: { isCompleted, description, created, [order]}
 * Note:
 * 1. Things in [] is optional
 * 2. Right now, steps and needs share the same format
 */
const stepsNeedsAdapter = values => {
  if (values && values.length > 0) {
    return undefined;
  }
  return values.map((val) => ({
    isCompleted: false,
    description: val,
  }));
};

const detailsAdapter = value => {
  return {
    text: value,
    tag: undefined
  };
};