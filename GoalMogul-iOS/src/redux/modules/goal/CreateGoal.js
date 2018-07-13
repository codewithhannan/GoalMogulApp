import R from 'ramda';
import _ from 'lodash';

const INITIAL_STATE = {
  owner: '',
  title: '',
  category: '',
  privacy: '',
  shareToGoalFeed: '',
  details: {},
  priority: '',
  start: '',
  end: '',
  needs: '',
  steps: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return { ...state };
  }
};
