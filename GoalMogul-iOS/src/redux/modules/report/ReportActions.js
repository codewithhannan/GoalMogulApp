import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import {
  REPORT_CREATE,
  REPORT_CREATE_CANCEL,
  REPORT_UPDATE_DETAILS,
  REPORT_UPDATE_TITLE,
  REPORT_POST,
  REPORT_POST_SUCCESS,
  REPORT_POST_FAIL
} from './ReportReducers';

import { api as API } from '../../middleware/api';
import { switchCase } from '../../middleware/utils';

const BASE_ROUTE = 'secure/report';
const DEBUG_KEY = '[ Action Report ]';

// Creating a new report
// category: ['General', 'User', 'Post', 'Goal', 'Comment', 'Tribe', 'Event']
// type: ['detail', something else]
export const createReport = (referenceId, type, category = 'User') => (dispatch, getState) => {
  const { userId } = getState().user;
  // Set the basic information for a report
  dispatch({
    type: REPORT_CREATE,
    payload: {
      type: undefined,
      creatorId: userId,
      category,
      referenceId
    }
  });
  Actions.push('createReport');
};

// Updating a report detail
export const updateReportDetails = (text) => (dispatch) => {
  dispatch({
    type: REPORT_UPDATE_DETAILS,
    payload: text
  });
};

// Updating a report detail
export const updateReportTitle = (text) => (dispatch) => {
  dispatch({
    type: REPORT_UPDATE_TITLE,
    payload: text
  });
};


// Cancel a report
export const cancelReport = () => (dispatch) =>
  dispatch({
    type: REPORT_CREATE_CANCEL
  });

export const postingReport = (callback) => (dispatch, getState) => {
  // Calling endpoint to post a report
  const { token } = getState().user;
  const report = reportAdapter(getState().report);
  dispatch({
    type: REPORT_POST
  });
  console.log(`${DEBUG_KEY}: report to create is: `, report);

  const onSuccess = (data) => {
    if (callback) {
      callback();
      // alert('You have successfully created a report');
    }
    Actions.pop();
    dispatch({
      type: REPORT_POST_SUCCESS
    });
    console.log(`${DEBUG_KEY}: submit report success with return data: `, data);
  };

  const onError = (err) => {
    dispatch({
      type: REPORT_POST_FAIL
    });
    Alert.alert('Error', 'Failed to submit report. Please try again later.');
    console.log(`${DEBUG_KEY}: submit report errror with err: `, err);
  };

  API
    .post(`${BASE_ROUTE}`, { ...report }, token)
    .then((res) => {
      if (!res.message && res.data) {
        return onSuccess(res.data);
      }
      onError(res);
    })
    .catch((err) => {
      onError(err);
    });
};

const reportAdapter = (report) => {
  const {
    details,
    title,
    category,
    referenceId
  } = report;
  console.log('report is: ', report);
  return {
    category,
    title,
    details,
    created: new Date(),
    refs: switchRefs(referenceId, category)
  };
};

/**
 * @param category: ['General', 'User', 'Post', 'Goal', 'Comment', 'Tribe', 'Event']
 * @param referenceId: string
 */
const switchRefs = (referenceId, category) => switchCase({
  User: {
    usersRef: referenceId
  },
  Post: {
    postRef: referenceId
  },
  Goal: {
    goalRef: referenceId
  },
  Comment: {
    commentRef: referenceId
  },
  Tribe: {
    tribeRef: referenceId
  },
  Event: {
    eventRef: referenceId
  }
})('User')(category);
