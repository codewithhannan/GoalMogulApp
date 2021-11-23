/** @format */

// New Tribe will mainly store in NewTribeModalForm. This reducer is called newTribe
import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

const INITIAL_STATE = {
    selected: {},
}

export const GET_HELP_FROM = 'get_help_from'
export const CLEAR_SEEKHELP = 'clear_seekhelp'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_HELP_FROM: {
            return { ...state, selected: action.paylaod }
        }
        case CLEAR_SEEKHELP: {
            return {}
        }
        default:
            return { ...state }
    }
}
