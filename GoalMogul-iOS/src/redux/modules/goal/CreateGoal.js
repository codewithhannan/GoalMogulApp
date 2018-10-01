import R from 'ramda';
import _ from 'lodash';

const INITIAL_STATE = {
  uploading: true, // This is reversed. Need to update later.
  error: undefined
};

export const GOAL_CREATE_SUBMIT = 'goal_create_submit';
export const GOAL_CREATE_SUBMIT_SUCCESS = 'goal_create_submit_success';
export const GOAL_CREATE_SUBMIT_FAIL = 'goal_create_submit_fail';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GOAL_CREATE_SUBMIT: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'uploading', false);
    }

    case GOAL_CREATE_SUBMIT_FAIL:
    case GOAL_CREATE_SUBMIT_SUCCESS: {
      const newState = _.cloneDeep(state);
      return _.set(newState, 'uploading', true);
    }

    default:
      return { ...state };
  }
};
