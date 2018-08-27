import R from 'ramda';
import _ from 'lodash';

/**
 * This reducer is servered as denormalized comment stores
 */
const INITIAL_STATE = {
  details: '',
  creatorId: undefined,
  category: undefined,
  _id: undefined,
  error: undefined
};

// Set the basic information for a report
export const REPORT_CREATE = 'report_create';
// Cancel a report
export const REPORT_CREATE_CANCEL = 'report_create_cancel';
// Update the details for a report
export const REPORT_UPDATE_DETAILS = 'report_update_details';
// Posting a report
export const REPORT_POST = 'report_post';
// Report posting succeed
export const REPORT_POST_SUCCESS = 'report_post_success';
// Report posting fails
export const REPORT_POST_FAIL = 'report_post_fail';


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REPORT_UPDATE_DETAILS: {
      return {
        ...state,
        details: action.paylaod
      };
    }

    default:
      return { ...state };
  }
};
