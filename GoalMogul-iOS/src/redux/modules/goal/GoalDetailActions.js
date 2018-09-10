import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

import { api as API } from '../../middleware/api';
import { queryBuilder } from '../../middleware/utils';

import {
  GOAL_DETAIL_CLOSE
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
