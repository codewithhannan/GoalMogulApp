import { api as API } from '../../middleware/api';

const DEBUG_KEY = '[ Action CreateGoal ]';

// Validate goal form
export const validate = values => {
  const errors = {};
  if (!values.owner || values.owner === null) {
    errors.owner = 'Required';
  }
  if (!values.title) {
    errors.title = 'Required';
  }
  if (!values.privacy) {
    errors.privacy = 'Required';
  }
  return errors;
};

// Submit values
export const submitGoal = values => (dispatch, getState) => {
  const { token } = getState().user;
  const goal = goalAdapter(values);
  API
    .post(
      'secure/goal/',
      {
        goal: { ...goal }
      },
      token
    )
    .then((res) => {
      console.log(`${DEBUG_KEY}: creating goal result ${res}`);
    })
    .catch((err) => {
      console.log(`${DEBUG_KEY}: Error in submitting new goal ${err}`);
    });
};

// Transform values from Goal form to server accepted format
const goalAdapter = values => {
  const {
    owner,
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
    owner,
    title,
    category: category.toLowerCase,
    privacy: privacy.toLowerCase,
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
const stepsNeedsAdapter = values =>
  values.map((val) => ({
    isCompleted: false,
    description: val,
  }));

const detailsAdapter = value => {
  return {
    text: value,
    tag: undefined
  };
};
