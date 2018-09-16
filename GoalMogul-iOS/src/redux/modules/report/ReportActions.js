import {
  REPORT_CREATE,
  REPORT_CREATE_CANCEL,
  REPORT_UPDATE_DETAILS,
  REPORT_POST,
  REPORT_POST_SUCCESS,
  REPORT_POST_FAIL
} from './ReportReducers';

const BASE_URL = 'secure/';

// Creating a new report
// category: ['General', 'User', 'Post', 'Goal', 'Comment', 'Tribe', 'Event']
// type: ['detail', something else]
export const createReport = (referenceId, type, category = 'User') => (dispatch, getState) => {
  const { userId } = getState().user;
  // Set the basic information for a report
  dispatch({
    type: REPORT_CREATE,
    payload: {
      type,
      creatorId: userId,
      category,
      referenceId
    }
  });
};

// Updating a report detail
export const updateReportDetails = (text) => (dispatch) => {
  console.log('text is: ', text);
  dispatch({
    type: REPORT_UPDATE_DETAILS,
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
  // const { token } = getState.user;
  dispatch({
    type: REPORT_POST
  });

  dispatch({
    type: REPORT_POST_SUCCESS
  });
  if (callback) {
    callback();
    // alert('You have successfully created a report');
  }
};
