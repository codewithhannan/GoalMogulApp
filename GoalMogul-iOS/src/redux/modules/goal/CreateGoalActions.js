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
  
};
