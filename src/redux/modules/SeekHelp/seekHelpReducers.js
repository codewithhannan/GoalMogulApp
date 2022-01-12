/** @format */

// New Tribe will mainly store in NewTribeModalForm. This reducer is called newTribe
import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

const INITIAL_STATE = {
    selected: {},
    tribeSeek: [],
    selectedItemFriend: [],
}

export const GET_HELP_FROM = 'get_help_from'
export const CLEAR_SEEKHELP = 'clear_seekhelp'
export const SET_TRIBE_SEEK = 'set_tribe_seek'
export const SEEKHELP_FRIEND_SELECTED_ITEM = 'seekhelp_friend_selected_item'
export const SEEKHELP_FRIEND_UNSELECTED_ITEM = 'seekhelp_friend_unselected_item'
export const SEEKHELP_FRIEND_CLEAR = 'seekhelp_friend_clear'
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
        case SEEKHELP_FRIEND_SELECTED_ITEM: {
            const newState = _.cloneDeep(state)
            const { selectedItemFriend } = action.payload
            // console.log('MY TRIBE FRIENDS', selectedItemFriend)
            if (state.selectedItemFriend.length > 0) {
                if (
                    !state.selectedItemFriend.some(
                        (e) => e._id === selectedItemFriend._id
                    )
                ) {
                    // console.log('IF THIS CONDITION')
                    return _.set(newState, `selectedItemFriend`, [
                        ...state.selectedItemFriend,
                        selectedItemFriend,
                    ])
                } else {
                    return _.set(
                        newState,
                        `selectedItemFriend`,
                        state.selectedItemFriend
                    )
                }
            } else {
                return _.set(newState, `selectedItemFriend`, [
                    selectedItemFriend,
                ])
            }
        }
        case SEEKHELP_FRIEND_UNSELECTED_ITEM: {
            const newState = _.cloneDeep(state)
            const { selectedItemFriend } = action.payload
            console.log('MY TRIBE FRIENDS', selectedItemFriend)

            if (
                state.selectedItemFriend.some(
                    (e) => e._id === selectedItemFriend._id
                )
            ) {
                console.log('IF THIS CONDITION UNSELECTED')
                var filtered = state.selectedItemFriend.filter(
                    (e) => e._id !== selectedItemFriend._id
                )
                return _.set(newState, `selectedItemFriend`, filtered)
            } else {
                return _.set(
                    newState,
                    `selectedItemFriend`,
                    state.selectedItemFriend
                )
            }
        }

        case SEEKHELP_FRIEND_CLEAR: {
            const newState = _.cloneDeep(state)
            return _.set(newState, `selectedItemFriend`, [])
        }
        default:
            return { ...state }
    }
}
