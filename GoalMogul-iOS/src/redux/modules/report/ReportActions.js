import {
  REPORT_CREATE,
  REPORT_CREATE_CANCEL,
  REPORT_UPDATE_DETAILS,
  REPORT_POST,
  REPORT_POST_SUCCESS,
  REPORT_POST_FAIL
} from './ReportReducers';

// Creating a new report
export const createReport = () => (dispatch) => {
  // Set the basic information for a report
  dispatch({
    type: REPORT_CREATE,
    payload: {

    }
  });
};

// Updating a report detail
export const updateReportDetails = (text) => (dispatch) =>
  dispatch({
    type: REPORT_UPDATE_DETAILS,
    payload: text
  });

// Cancel a report
export const cancelReport = () => (dispatch) =>
  dispatch({
    type: REPORT_CREATE_CANCEL
  });

export const postingReport = () => (dispatch, getState) => {
  // Calling endpoint to post a report
};
