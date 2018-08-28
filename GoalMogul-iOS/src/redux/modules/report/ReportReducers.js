import R from 'ramda';
import _ from 'lodash';

/**
 * This reducer is servered as denormalized comment stores
 */
const INITIAL_STATE = {
  details: '',
  creatorId: undefined,
  category: undefined,
  referenceId: undefined,
  error: undefined,
  loading: false,
  showingModal: false,
  showingModalInDetail: false
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

    case REPORT_POST: {
      return {
        ...state,
        loading: true
      };
    }

    case REPORT_POST_SUCCESS: {
      return {
        ...INITIAL_STATE
      };
    }

    case REPORT_POST_FAIL: {
      return {
        ...state,
        error: action.payload
      };
    }

    case REPORT_CREATE: {
      const { type, creatorId, category, referenceId } = action.payload;
      let newState = _.cloneDeep(state);
      if (type === 'detail') {
        newState = _.set(newState, 'showingModalInDetail', true);
      } else {
        newState = _.set(newState, 'showingModal', true);
      }
      newState = _.set(newState, 'creatorId', creatorId);
      newState = _.set(newState, 'category', category);
      return _.set(newState, 'referenceId', referenceId);
    }

    default:
      return { ...state };
  }
};
