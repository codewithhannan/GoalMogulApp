/** @format */

// New Tribe will mainly store in NewTribeModalForm. This reducer is called newTribe
import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

const INITIAL_STATE = {
    selected: {},
    tribeSeek: [],
}

export const GET_HELP_FROM = 'get_help_from'
export const CLEAR_SEEKHELP = 'clear_seekhelp'
export const SET_TRIBE_SEEK = 'set_tribe_seek'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_HELP_FROM: {
            return { ...state, selected: action.paylaod }
        }
        case CLEAR_SEEKHELP: {
            return {}
        }
        case SET_TRIBE_SEEK: {
            console.log('tribe reducerrr', action.payload)
            return { ...state, tribeSeek: action.payload }
        }
        default:
            return { ...state }
    }
}
