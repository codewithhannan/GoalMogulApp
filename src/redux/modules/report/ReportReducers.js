/** @format */

import R from 'ramda'
import _ from 'lodash'

/**
 * This reducer is servered as denormalized comment stores
 */
const INITIAL_STATE = {
    details: '',
    title: '',
    creatorId: undefined,
    category: undefined,
    referenceId: undefined,
    error: undefined,
    loading: false,
    showingModal: false,
    showingModalInDetail: false,
    showingModalInPostDetail: false,
}

// Set the basic information for a report
export const REPORT_CREATE = 'report_create'
// Cancel a report
export const REPORT_CREATE_CANCEL = 'report_create_cancel'
// Update the details for a report
export const REPORT_UPDATE_DETAILS = 'report_update_details'
// Update the title for a report
export const REPORT_UPDATE_TITLE = 'report_update_title'
// Posting a report
export const REPORT_POST = 'report_post'
// Report posting succeed
export const REPORT_POST_SUCCESS = 'report_post_success'
// Report posting fails
export const REPORT_POST_FAIL = 'report_post_fail'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REPORT_UPDATE_DETAILS: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'details', action.payload)
        }

        case REPORT_UPDATE_TITLE: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'title', action.payload)
        }

        case REPORT_CREATE_CANCEL:
            return {
                ...INITIAL_STATE,
            }

        case REPORT_POST: {
            return {
                ...state,
                loading: true,
            }
        }

        case REPORT_POST_SUCCESS: {
            return {
                ...INITIAL_STATE,
            }
        }

        case REPORT_POST_FAIL: {
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        }

        case REPORT_CREATE: {
            const { type, creatorId, category, referenceId } = action.payload
            let newState = _.cloneDeep(state)
            // If there is type, it means it's using the modal in Component
            // Otherwise, it's using the router lightbox
            if (type) {
                if (type === 'detail') {
                    newState = _.set(newState, 'showingModalInDetail', true)
                } else if (type === 'postDetail') {
                    newState = _.set(newState, 'showingModalInPostDetail', true)
                } else {
                    newState = _.set(newState, 'showingModal', true)
                }
            }

            newState = _.set(newState, 'creatorId', creatorId)
            newState = _.set(newState, 'category', category)
            return _.set(newState, 'referenceId', referenceId)
        }

        default:
            return { ...state }
    }
}
