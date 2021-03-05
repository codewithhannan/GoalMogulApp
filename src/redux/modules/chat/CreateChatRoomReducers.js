/** @format */

import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

const INITIAL_STATE = {
    uploading: false,
    refreshing: false,
    loading: false,
    hasNextPage: true,
    pageSize: 5,
    pageOffset: 0,
    picture: undefined,
    selectedMembers: [],
    searchResults: [],
    modalPageNumber: 1,
    searchQuery: '',
}

export const CHAT_NEW_CANCEL = 'chat_new_cancel'
export const CHAT_NEW_SUBMIT = 'chat_new_submit'
export const CHAT_NEW_SUBMIT_SUCCESS = 'chat_new_submit_success'
export const CHAT_NEW_SUBMIT_FAIL = 'chat_new_submit_fail'
export const CHAT_NEW_UPDATE_SELECTED_MEMBERS =
    'chat_new_update_selected_members'
export const CHAT_NEW_MODAL_PAGE_CHANGE = 'chat_new_modal_page_change'
export const CHAT_NEW_SEARCH_QUERY_UPDATED = 'chat_new_search_query_updated'
export const CHAT_NEW_REFRESH_FRIENDS_SEARCH = 'chat_new_refresh_friends_search'
export const CHAT_NEW_REFRESH_FRIENDS_SEARCH_BEGIN =
    'chat_new_refresh_friends_search_begin'
export const CHAT_NEW_LOAD_MORE_FRIENDS_SEARCH =
    'chat_new_load_more_friends_search'
export const CHAT_NEW_LOAD_MORE_FRIENDS_SEARCH_BEGIN =
    'chat_new_load_more_friends_search_begin'
export const CHAT_NEW_RESET_COMPONENT = 'chat_new_reset_component'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHAT_NEW_RESET_COMPONENT: {
            return INITIAL_STATE
        }
        case CHAT_NEW_SUBMIT: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'uploading', true)
        }

        case CHAT_NEW_SUBMIT_FAIL: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'uploading', false)
        }

        case CHAT_NEW_SUBMIT_SUCCESS: {
            return INITIAL_STATE
        }

        case CHAT_NEW_UPDATE_SELECTED_MEMBERS: {
            const newState = _.cloneDeep(state)
            return _.set(
                newState,
                'selectedMembers',
                arrayUnique(action.payload)
            )
        }

        case CHAT_NEW_MODAL_PAGE_CHANGE: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'modalPageNumber', action.payload)
        }

        case CHAT_NEW_SEARCH_QUERY_UPDATED: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'searchQuery', action.payload)
        }

        case CHAT_NEW_REFRESH_FRIENDS_SEARCH_BEGIN: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'refreshing', true)
        }

        case CHAT_NEW_REFRESH_FRIENDS_SEARCH: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `refreshing`, false)
            newState = _.set(newState, 'pageOffset', 0)
            return _.set(newState, 'searchResults', action.payload)
        }

        case CHAT_NEW_LOAD_MORE_FRIENDS_SEARCH_BEGIN: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'loading', true)
        }

        case CHAT_NEW_LOAD_MORE_FRIENDS_SEARCH: {
            let newState = _.cloneDeep(state)
            const results = action.payload
            newState = _.set(
                newState,
                'pageOffset',
                state.pageOffset + state.pageSize
            )
            newState = _.set(newState, 'hasNextPage', results.length)
            newState = _.set(newState, `loading`, false)
            const oldResults = _.get(newState, `searchResults`)
            return _.set(
                newState,
                `searchResults`,
                arrayUnique(oldResults.concat(results))
            )
        }

        default:
            return { ...state }
    }
}
