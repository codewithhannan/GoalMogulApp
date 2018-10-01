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
  const goal = formToGoalAdapter(values, userId);
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

// Transform a goal object to
export const goalToFormAdaptor = (values) => {
  // Function to capitalize the first character
  const capitalizeWord = (word) => {
    if (!word) return '';
    word.replace(/^\w/, c => c.toUpperCase());
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
  } = values.goal;

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
  return values.map((val, index) => ({
    isCompleted: false,
    description: val,
    order: index
  }));
};

const detailsAdapter = value => {
  return {
    text: value,
    tag: undefined
  };
};

/**
 * Transform an array of needs object to a list of Strings for the form
 * in the order of order params
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
