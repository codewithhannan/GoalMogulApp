/** @format */

// This is the reducer for creating a new share. It's paired with shareModal(redux form)
import _ from 'lodash'
import {} from '../../../../reducers/GoalDetailReducers'
import { setState } from '../../../middleware/utils'
/**
 * This reducer is servered as denormalized comment stores
 */
const INITIAL_STATE = {
    owner: '',
    // ["General", "ShareUser", "SharePost", "ShareGoal", "ShareNeed"]
    postType: '',
    userRef: '',
    postRef: '',
    goalRef: '',
    needRef: '', // pairs with goalRef
    belongsToTribe: '',
    belongsToEvent: '',
    // Following parts are set in share modal
    // enum: ["public", "friends", "self"],
    privacy: {
        type: String,

        required: true,
    },
    content: {
        text: '',
        tags: [],
        links: [],
    },
    mediaRef: String,

    // Extra info to render
    belongsToTribeItem: undefined,
    belongsToEventItem: undefined,
    itemToShare: undefined,
    uploading: false,
}

// User chooses to share to ['feed', 'event', 'tribe']
export const SHARE_NEW_SHARE_TO = 'share_new_share_to'
// When user chooses a specific event or tribe to share to
export const SHARE_NEW_SELECT_DEST = 'share_new_select_dest'
export const SHARE_NEW_CANCEL = 'share_new_cancel'
export const SHARE_NEW_POST = 'share_new_post'
export const SHARE_NEW_POST_SUCCESS = 'share_new_post_success'
export const SHARE_NEW_POST_FAIL = 'share_new_post_fail'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHARE_NEW_SHARE_TO: {
            const {
                owner,
                postType,
                userRef,
                postRef,
                goalRef,
                needRef,
                stepRef,
                itemToShare,
            } = action.payload
            let newState = _.cloneDeep(state)
            newState = setState(newState, 'owner', owner)
            newState = setState(newState, 'postType', postType)
            newState = setState(newState, 'userRef', userRef)
            newState = setState(newState, 'postRef', postRef)
            newState = setState(newState, 'goalRef', goalRef)
            newState = setState(newState, 'stepRef', stepRef)
            newState = setState(newState, 'itemToShare', itemToShare)
            return setState(newState, 'needRef', needRef)
        }

        case SHARE_NEW_SELECT_DEST: {
            const { type, value } = action.payload
            let newState = _.cloneDeep(state)
            newState = setState(newState, `${type}`, value._id)
            return setState(newState, `${type}Item`, value)
        }

        // After new share is canceled or posted successfully, we clear the state
        case SHARE_NEW_CANCEL:
        case SHARE_NEW_POST_SUCCESS:
            return { ...INITIAL_STATE }

        case SHARE_NEW_POST: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'uploading', true)
        }

        case SHARE_NEW_POST_FAIL: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'uploading', false)
        }

        default:
            return { ...state }
    }
}
