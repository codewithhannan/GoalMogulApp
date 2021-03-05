/** @format */

import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

const INITIAL_STATE = {
    loading: false,
    hasNextPage: true,
    selectedItems: [],
    searchResults: [],
    searchQuery: '',
    shareMessage: '',
    submitting: false,
}

export const SHARE_TO_CHAT_RESET = 'SHARE_TO_CHAT_RESET'
export const SHARE_TO_CHAT_BEGIN_SEARCH = 'SHARE_TO_CHAT_BEGIN_SEARCH'
export const SHARE_TO_CHAT_SEARCH_COMPLETE = 'SHARE_TO_CHAT_SEARCH_COMPLETE'
export const SHARE_TO_CHAT_UPDATE_SELECTED_ITEMS =
    'SHARE_TO_CHAT_UPDATE_SELECTED_ITEMS'
export const SHARE_TO_CHAT_UPDATE_SEARCH_QUERY =
    'SHARE_TO_CHAT_UPDATE_SEARCH_QUERY'
export const SHARE_TO_CHAT_UPDATE_SHARE_MESSAGE =
    'SHARE_TO_CHAT_UPDATE_SHARE_MESSAGE'
export const SHARE_TO_CHAT_UPDATE_SUBMITTING = 'SHARE_TO_CHAT_UPDATE_SUBMITTING'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHARE_TO_CHAT_RESET: {
            return INITIAL_STATE
        }
        case SHARE_TO_CHAT_BEGIN_SEARCH: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'loading', true)
        }
        case SHARE_TO_CHAT_SEARCH_COMPLETE: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'searchResults', action.payload.results)
            newState = _.set(
                newState,
                'hasNextPage',
                action.payload.hasNextPage
            )
            return _.set(newState, 'loading', false)
        }
        case SHARE_TO_CHAT_UPDATE_SELECTED_ITEMS: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'selectedItems', arrayUnique(action.payload))
        }
        case SHARE_TO_CHAT_UPDATE_SEARCH_QUERY: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'searchQuery', action.payload)
        }
        case SHARE_TO_CHAT_UPDATE_SHARE_MESSAGE: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'shareMessage', action.payload)
        }
        case SHARE_TO_CHAT_UPDATE_SUBMITTING: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'submitting', action.payload)
        }

        default:
            return { ...state }
    }
}
