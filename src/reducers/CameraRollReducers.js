/** @format */

import { REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO } from '../actions/types'

const INITIAL_STATE = {}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO:
            return action.payload
        default:
            return { ...state }
    }
}
