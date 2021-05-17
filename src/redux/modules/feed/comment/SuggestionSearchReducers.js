/** @format */

import R from 'ramda'
import _ from 'lodash'

import { COMMENT_NEW_SUGGESTION_UPDAET_TYPE } from './NewCommentReducers'

import { arrayUnique } from '../../../middleware/utils'

export const SUGGESTION_SEARCH_LIMIT = 10

const INITIAL_STATE_SEARCH = {
    data: [],
    queryId: undefined,
    loading: false,
    refreshing: false,
    skip: 0,
    limit: SUGGESTION_SEARCH_LIMIT,
    hasNextPage: undefined,
}

const INITIAL_STATE_PRELOAD_DATA = {
    data: [],
    loading: false,
    refreshing: false,
    skip: 0,
    limit: SUGGESTION_SEARCH_LIMIT,
    hasNextPage: undefined,
}

const INITIAL_STATE = {
    searchType: undefined,
    filterBar: {
        sortBy: 'relevance',
        category: 'people',
    },
    searchRes: {
        ...INITIAL_STATE_SEARCH,
    },
    preloadData: {
        User: {
            ...INITIAL_STATE_PRELOAD_DATA,
        },
        Event: {
            ...INITIAL_STATE_PRELOAD_DATA,
        },
        Tribe: {
            ...INITIAL_STATE_PRELOAD_DATA,
        },
        ChatConvoRoom: {
            ...INITIAL_STATE_PRELOAD_DATA,
        },
    },
    searchContent: '',
}

const BASE_ROUTE = 'secure'
export const SearchRouteMap = {
    Friend: {
        route: `${BASE_ROUTE}/user/friendship/es`,
    },
    User: {
        route: `${BASE_ROUTE}/user/profile/es`,
    },
    Event: {
        route: `${BASE_ROUTE}/event/es/myevents`,
    },
    Tribe: {
        route: `${BASE_ROUTE}/tribe/es/mytribes`,
    },
    ChatConvoRoom: {
        route: `${BASE_ROUTE}/chat/room/es`,
    },
    Default: {
        route: '',
    },
}

// Helper Functions
const dotPath = R.useWith(R.path, [R.split('.')])

// Constants for search reducers
export const SUGGESTION_SEARCH_CHANGE_FILTER = 'suggestion_search_change_filter'
export const SUGGESTION_SEARCH_REQUEST = 'suggestion_search_request'
export const SUGGESTION_SEARCH_REFRESH = 'suggestion_search_refresh'
export const SUGGESTION_SEARCH_REQUEST_DONE = 'suggestion_search_request_done'
export const SUGGESTION_SEARCH_REFRESH_DONE = 'suggestion_search_refresh_done'
export const SUGGESTION_SEARCH_SWITCH_TAB = 'suggestion_search_switch_tab'
export const SUGGESTION_SEARCH_ON_LOADMORE_DONE =
    'suggestion_search_on_loadmore_done'
export const SUGGESTION_SEARCH_CLEAR_STATE = 'suggestion_search_clear_state'
export const SUGGESTION_SEARCH_PRELOAD_REFRESH =
    'suggestion_search_preload_refresh'
export const SUGGESTION_SEARCH_PRELOAD_REFRESH_DONE =
    'suggestion_search_preload_refresh_done'
export const SUGGESTION_SEARCH_PRELOAD_LOAD = 'suggestion_search_preload_load'
export const SUGGESTION_SEARCH_PRELOAD_LOAD_DONE =
    'suggestion_search_preload_load_done'

const DEBUG_KEY = '[ Reducer SuggestionSearch ]'
/*
  TODO:
  1. populate initial set on profile fetch successfully
*/
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SUGGESTION_SEARCH_CHANGE_FILTER: {
            const { type, value } = action.payload
            const newFilterState = { ...state.filterBar }
            newFilterState[type] = value
            return { ...state, filterBar: newFilterState }
        }

        // Initiate suggestion_search request
        case SUGGESTION_SEARCH_REFRESH: {
            const { searchContent, queryId, type } = action.payload
            let newState = _.cloneDeep(state)
            newState.searchRes.refreshing = true
            newState.queryId = queryId
            newState.searchContent = searchContent
            return { ...newState }
        }

        case SUGGESTION_SEARCH_REQUEST: {
            const { searchContent, queryId, type } = action.payload
            let newState = _.cloneDeep(state)
            newState.searchRes.loading = true
            newState.queryId = queryId
            newState.searchContent = searchContent
            return { ...newState }
        }

        // Search refresh and request done
        case SUGGESTION_SEARCH_REFRESH_DONE: {
            const { queryId, skip, data, type, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            if (queryId === state.queryId) {
                newState.searchRes.data = data
                newState.searchRes.refreshing = false
                newState.searchRes.skip = skip
                newState.searchRes.hasNextPage = hasNextPage
            }
            return { ...newState }
        }

        case SUGGESTION_SEARCH_REQUEST_DONE: {
            const { queryId, skip, data, type, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            if (queryId === state.queryId) {
                newState.searchRes.data = data
                newState.searchRes.loading = false
                newState.searchRes.skip = skip
                newState.searchRes.hasNextPage = hasNextPage
            }
            return { ...newState }
        }

        // Search refresh done
        case SUGGESTION_SEARCH_ON_LOADMORE_DONE: {
            const { queryId, skip, data, type, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            if (queryId === state.queryId) {
                const oldData = _.get(newState, 'searchRes.data')
                newState = _.set(
                    newState,
                    'searchRes.data',
                    arrayUnique(oldData.concat([]))
                )
                newState.searchRes.loading = false
                newState.searchRes.skip = skip
                newState.searchRes.hasNextPage = hasNextPage
            }
            return { ...newState }
        }

        case SUGGESTION_SEARCH_CLEAR_STATE: {
            const { tab } = action.payload
            // if (!tab) {
            //   // No tab specified, clear all state
            //   return INITIAL_STATE;
            // }
            // // Clear state for specific tab
            // const tabInitialState = dotPath(tab, INITIAL_STATE);
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'searchContent', '')
            return _.set(newState, 'searchRes', { ...INITIAL_STATE_SEARCH })
        }

        // Update search type
        case COMMENT_NEW_SUGGESTION_UPDAET_TYPE: {
            let newState = _.cloneDeep(state)
            const { suggestionType, tab, pageId } = action.payload
            return _.set(newState, 'searchType', suggestionType)
        }

        case SUGGESTION_SEARCH_PRELOAD_REFRESH: {
            let newState = _.cloneDeep(state)
            const { searchType } = action.payload
            if (!_.has(newState, `preloadData.${searchType}`)) {
                console.log(
                    `${DEBUG_KEY}: [ ${action.type} ]: invalid searchType: `,
                    searchType
                )
                return newState
            }

            newState = _.set(
                newState,
                `preloadData.${searchType}.refreshing`,
                true
            )
            return newState
        }

        case SUGGESTION_SEARCH_PRELOAD_REFRESH_DONE: {
            let newState = _.cloneDeep(state)
            const { searchType, data, skip } = action.payload
            if (!_.has(newState, `preloadData.${searchType}`)) {
                console.log(
                    `${DEBUG_KEY}: [ ${action.type} ]: invalid searchType:`,
                    searchType
                )
                return newState
            }

            newState = _.set(
                newState,
                `preloadData.${searchType}.refreshing`,
                false
            )
            newState = _.set(newState, `preloadData.${searchType}.data`, data)
            newState = _.set(newState, `preloadData.${searchType}.skip`, skip)
            return newState
        }

        case SUGGESTION_SEARCH_PRELOAD_LOAD: {
            let newState = _.cloneDeep(state)
            const { searchType } = action.payload
            if (!_.has(newState, `preloadData.${searchType}`)) {
                console.log(
                    `${DEBUG_KEY}: [ ${action.type} ]: invalid searchType:`,
                    searchType
                )
                return newState
            }

            newState = _.set(
                newState,
                `preloadData.${searchType}.loading`,
                true
            )
            return newState
        }

        case SUGGESTION_SEARCH_PRELOAD_LOAD_DONE: {
            let newState = _.cloneDeep(state)
            const { searchType, data, skip } = action.payload
            if (!_.has(newState, `preloadData.${searchType}`)) {
                console.log(
                    `${DEBUG_KEY}: [ ${action.type} ]: invalid searchType:`,
                    searchType
                )
                return newState
            }

            newState = _.set(
                newState,
                `preloadData.${searchType}.loading`,
                false
            )

            const oldData = _.get(newState, `preloadData.${searchType}.data`)
            newState = _.set(
                newState,
                `preloadData.${searchType}.data`,
                arrayUnique(oldData.concat(data))
            )
            newState = _.set(newState, `preloadData.${searchType}.skip`, skip)
            return newState
        }

        default:
            return { ...state }
    }
}
