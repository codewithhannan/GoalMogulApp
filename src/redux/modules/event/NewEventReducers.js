/** @format */

// New Tribe will mainly store in NewTribeModalForm. This reducer is called newTribe
import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

const INITIAL_STATE = {
    // title,
    // start,
    // durationHours,
    // participantsCanInvite,
    // isInviteOnly,
    // participantLimit,
    // location,
    // description,
    // picture,
    uploading: false,
    picture: undefined,
    tmpPicture: undefined,
}

export const EVENT_NEW_CANCEL = 'tribe_new_cancel'
export const EVENT_NEW_SUBMIT = 'tribe_new_submit'
export const EVENT_NEW_SUBMIT_SUCCESS = 'tribe_new_submit_success'
export const EVENT_NEW_SUBMIT_FAIL = 'tribe_new_submit_fail'
export const EVENT_NEW_UPLOAD_PICTURE_SUCCESS =
    'tribe_new_upload_picture_success'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case EVENT_NEW_SUBMIT: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'uploading', true)
        }

        case EVENT_NEW_SUBMIT_FAIL: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'uploading', false)
        }

        case EVENT_NEW_CANCEL:
        case EVENT_NEW_SUBMIT_SUCCESS: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'picture', undefined)
            return _.set(newState, 'uploading', false)
        }

        case EVENT_NEW_UPLOAD_PICTURE_SUCCESS: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'tmpPicture', action.payload)
        }

        default:
            return { ...state }
    }
}
