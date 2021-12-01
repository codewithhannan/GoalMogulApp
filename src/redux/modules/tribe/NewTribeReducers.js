/** @format */

// New Tribe will mainly store in NewTribeModalForm. This reducer is called newTribe
import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

const INITIAL_STATE = {
    // name: undefined,
    // membersCanInvite: undefined,
    // isPubliclyVisible: false,
    // membershipLimit: 100,
    // description: '',
    // picture: undefined,
    uploading: false,
    picture: undefined,
    tribeErr: { message: '', status: 200 },
}

export const TRIBE_NEW_CANCEL = 'tribe_new_cancel'
export const TRIBE_NEW_SUBMIT = 'tribe_new_submit'
export const TRIBE_NEW_SUBMIT_SUCCESS = 'tribe_new_submit_success'
export const TRIBE_NEW_SUBMIT_FAIL = 'tribe_new_submit_fail'
export const TRIBE_NEW_ERROR = 'tribe_new_error'
export const TRIBE_CLEAR_ERROR = 'tribe_clear_error'
export const TRIBE_NEW_UPLOAD_PICTURE_SUCCESS =
    'tribe_new_upload_picture_success'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TRIBE_NEW_SUBMIT: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'uploading', true)
        }
        case TRIBE_NEW_ERROR: {
            console.log('TRIBE ERROR')
            const newState = _.cloneDeep(state)
            return _.set(newState, 'tribeErr', action.payload)
        }
        case TRIBE_CLEAR_ERROR: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'tribeErr', { message: '', status: 200 })
        }
        case TRIBE_NEW_SUBMIT_FAIL: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'uploading', false)
        }
        case TRIBE_NEW_SUBMIT_SUCCESS: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'picture', undefined)
            return _.set(newState, 'uploading', false)
        }

        case TRIBE_NEW_UPLOAD_PICTURE_SUCCESS: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'tmpPicture', action.payload)
        }

        default:
            return { ...state }
    }
}
