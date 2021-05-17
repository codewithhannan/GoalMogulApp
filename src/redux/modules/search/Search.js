/** @format */

import R from 'ramda'
import _ from 'lodash'

import {
    SHARE_NEW_CANCEL,
    SHARE_NEW_POST_SUCCESS,
} from '../feed/post/NewShareReducers'

import {
    CHAT_MEMBERS_CANCEL_JOIN_REQUEST,
    CHAT_MEMBERS_CANCEL_JOIN_REQUEST_DONE,
    CHAT_MEMBERS_CANCEL_JOIN_REQUEST_ERROR,
    CHAT_MEMBERS_SEND_JOIN_REQUEST,
    CHAT_MEMBERS_SEND_JOIN_REQUEST_DONE,
    CHAT_MEMBERS_SEND_JOIN_REQUEST_ERROR,
} from '../chat/ChatRoomMembersReducers'
import { arrayUnique } from '../../middleware/utils'

const INITIAL_SEARCH_STATE = {
    data: [],
    queryId: undefined,
    loading: false,
    skip: 0,
    limit: 20,
    hasNextPage: undefined,
    refreshing: false,
    preload: {
        data: [],
        loading: false,
        refreshing: false,
        hasNextPage: false,
        limit: 20,
    },
}

const INITIAL_STATE = {
    selectedTab: 'people',
    navigationState: {
        index: 0,
        routes: [
            { key: 'people', title: 'People' },
            { key: 'tribes', title: 'Tribes' },
            { key: 'chatRooms', title: 'Chat' },
        ],
    },
    filterBar: {
        sortBy: 'relevance',
        category: 'people',
    },
    people: { ...INITIAL_SEARCH_STATE },
    friends: { ...INITIAL_SEARCH_STATE },
    tribes: { ...INITIAL_SEARCH_STATE },
    events: { ...INITIAL_SEARCH_STATE },
    chatRooms: { ...INITIAL_SEARCH_STATE },
    searchContent: '',
}

// Helper Functions
const dotPath = R.useWith(R.path, [R.split('.')])
const propsDotPath = R.useWith(R.ap, [R.map(dotPath), R.of])
const BASE_ROUTE = 'secure'
const DEBUG_KEY = '[ Reducer Search ]'

// Constants for search reducers
export const SEARCH_CHANGE_FILTER = 'search_change_filter'
export const SEARCH_REQUEST = 'search_request'
export const SEARCH_REQUEST_DONE = 'search_request_done'
export const SEARCH_REFRESH_DONE = 'search_refresh_done'
export const SEARCH_SWITCH_TAB = 'search_switch_tab'
export const SEARCH_ON_LOADMORE_DONE = 'search_on_loadmore_done'
export const SEARCH_CLEAR_STATE = 'search_clear_state'
// Preload related
export const SEARCH_PRELOAD_REFRESH = 'search_preload_refresh'
export const SEARCH_PRELOAD_REFRESH_DONE = 'search_preload_refresh_done'
export const SEARCH_PRELOAD_LOAD = 'search_preload_load'
export const SEARCH_PRELOAD_LOAD_DONE = 'search_preload_load_done'

// Note: Search has different route map than SuggestionSearch
export const SearchRouteMap = {
    friends: {
        route: `${BASE_ROUTE}/user/friendship/es`,
    },
    people: {
        route: `${BASE_ROUTE}/user/profile/es`,
    },
    friends: {
        route: `${BASE_ROUTE}/user/friendship/es`,
    },
    myEvents: {
        route: `${BASE_ROUTE}/event/es/myevents`,
    },
    events: {
        route: `${BASE_ROUTE}/event/es`,
    },
    myTribes: {
        route: `${BASE_ROUTE}/tribe/es/mytribes`,
    },
    tribes: {
        route: `${BASE_ROUTE}/tribe/es`,
    },
    chatRooms: {
        route: `${BASE_ROUTE}/chat/room/es`,
    },
}

/*
  TODO:
  1. populate initial set on profile fetch successfully
*/
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SEARCH_CHANGE_FILTER: {
            const { type, value } = action.payload
            const newFilterState = { ...state.filterBar }
            newFilterState[type] = value
            return { ...state, filterBar: newFilterState }
        }

        // Initiate search request
        case SEARCH_REQUEST: {
            const { searchContent, queryId, type } = action.payload
            let newState = _.cloneDeep(state)
            newState[type].loading = true
            newState[type].refreshing = true
            newState.queryId = queryId
            newState.searchContent = searchContent
            return { ...newState }
        }

        // Search refresh and request done
        case SEARCH_REFRESH_DONE:
        case SEARCH_REQUEST_DONE: {
            const { queryId, skip, data, type, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            if (queryId === state.queryId) {
                newState[type].data = data
                newState[type].loading = false
                newState[type].refreshing = false
                newState[type].skip = skip
                newState[type].hasNextPage = hasNextPage
            }
            return { ...newState }
        }

        // Search refresh done
        case SEARCH_ON_LOADMORE_DONE: {
            const { queryId, skip, data, type, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            if (queryId === state.queryId) {
                const oldData = _.get(newState, `${type}.data`)
                const newData = oldData.concat([])
                newState = _.set(newState, `${type}.data`, newData)
                newState = _.set(newState, `${type}.loading`, false)
                newState = _.set(newState, `${type}.skip`, skip)
                newState = _.set(newState, `${type}.hasNextPage`, hasNextPage)

                // console.log(`${DEBUG_KEY}: new data is: `, newData);
            }
            return newState
        }

        // Search switch tab
        case SEARCH_SWITCH_TAB: {
            const newNavigationState = { ...state.navigationState }
            newNavigationState.index = action.payload

            return {
                ...state,
                selectedTab: newNavigationState.routes[action.payload].key,
                navigationState: newNavigationState,
            }
        }

        case SEARCH_CLEAR_STATE: {
            const { tab } = action.payload
            if (!tab) {
                // No tab specified, clear all state
                return INITIAL_STATE
            }
            // Clear state for specific tab
            const tabInitialState = dotPath(tab, INITIAL_STATE)
            let newState = _.cloneDeep(state)
            newState = _.set(newState, tab, tabInitialState)

            // User clears search content
            newState = _.set(newState, 'searchContent', '')

            // Clear the search result for all tabs
            let preload = _.get(newState, 'people.preload')
            newState = _.set(newState, 'people', { ...INITIAL_SEARCH_STATE })
            newState = _.set(newState, 'people.preload', preload)

            preload = _.get(newState, 'events.preload')
            newState = _.set(newState, 'events', { ...INITIAL_SEARCH_STATE })
            newState = _.set(newState, 'events.preload', preload)

            preload = _.get(newState, 'tribes.preload')
            newState = _.set(newState, 'tribes', { ...INITIAL_SEARCH_STATE })
            newState = _.set(newState, 'tribes.preload', preload)

            preload = _.get(newState, 'friends.preload')
            newState = _.set(newState, 'friends', { ...INITIAL_SEARCH_STATE })
            newState = _.set(newState, 'friends.preload', preload)

            preload = _.get(newState, 'chatRooms.preload')
            newState = _.set(newState, 'chatRooms', { ...INITIAL_SEARCH_STATE })
            newState = _.set(newState, 'chatRooms.preload', preload)

            return newState
        }

        /* Following cases is related to search for share */
        case SHARE_NEW_CANCEL:
        case SHARE_NEW_POST_SUCCESS: {
            let newState = _.cloneDeep(state)
            if (action.payload === 'event') {
                newState = _.set(newState, 'event', { ...INITIAL_STATE_EVENT })
            }
            if (action.payload === 'tribe') {
                newState = _.set(newState, 'tribe', { ...INITIAL_STATE_TRIBE })
            }
            return newState
        }

        /* Chat related reducers to update search result state. Note: this is the same the ones in ExploreReducers */
        case CHAT_MEMBERS_SEND_JOIN_REQUEST:
        case CHAT_MEMBERS_CANCEL_JOIN_REQUEST: {
            const { chatRoomId } = action.payload
            let newState = _.cloneDeep(state)
            const oldData = _.get(newState, 'chatRooms.data')
            const newData = oldData.map((c) => {
                if (c._id === chatRoomId) {
                    return {
                        ...c,
                        updating: true, // Setting the updating bit for this chat room
                    }
                }
                return c
            })
            newState = _.set(newState, 'chatRooms.data', newData)
            return newState
        }

        case CHAT_MEMBERS_SEND_JOIN_REQUEST_ERROR:
        case CHAT_MEMBERS_CANCEL_JOIN_REQUEST_ERROR: {
            const { chatRoomId } = action.payload
            let newState = _.cloneDeep(state)
            const oldData = _.get(newState, 'chatRooms.data')
            const newData = oldData.map((c) => {
                if (c._id === chatRoomId) {
                    return {
                        ...c,
                        updating: false, // Setting the updating bit for this chat room
                    }
                }
                return c
            })
            newState = _.set(newState, 'chatRooms.data', newData)
            return newState
        }

        case CHAT_MEMBERS_CANCEL_JOIN_REQUEST_DONE: {
            let newState = _.cloneDeep(state)
            const { chatRoomId, removeeId } = action.payload
            const oldData = _.get(newState, 'chatRooms.data')
            const newData = oldData.map((c) => {
                let dataToReturn = _.cloneDeep(c)
                // Find the matching chat room
                if (c._id === chatRoomId) {
                    // Get old members and remove the removee from the list
                    const oldMembers = _.get(dataToReturn, 'members')
                    if (!oldMembers) return dataToReturn
                    const newMembers = oldMembers.filter(
                        (m) =>
                            !(
                                m.memberRef._id === removeeId &&
                                m.status === 'JoinRequester'
                            )
                    )
                    // Update the member list
                    dataToReturn = _.set(dataToReturn, 'members', newMembers)
                    dataToReturn = _.set(dataToReturn, 'updating', false)
                }
                return dataToReturn
            })
            newState = _.set(newState, 'chatRooms.data', newData)
            return newState
        }

        case CHAT_MEMBERS_SEND_JOIN_REQUEST_DONE: {
            const { chatRoomId, userId, user } = action.payload
            let newState = _.cloneDeep(state)
            const oldData = _.get(newState, 'chatRooms.data')
            const userToAdd = {
                memberRef: user,
                status: 'JoinRequester',
            }
            const newData = oldData.map((c) => {
                let dataToReturn = _.cloneDeep(c)
                // Find the matching chat room
                if (c._id === chatRoomId) {
                    // Get old members and add the current user as the JoinRequester
                    let newMembers
                    const oldMembers = _.get(dataToReturn, 'members')
                    if (!oldMembers) {
                        newMembers = [userToAdd]
                    } else if (!oldMembers.find((m) => m._id === userId)) {
                        newMembers = oldMembers.concat(userToAdd)
                    }

                    // Update the member list
                    dataToReturn = _.set(dataToReturn, 'members', newMembers)
                    dataToReturn = _.set(dataToReturn, 'updating', false)
                }
                return dataToReturn
            })
            newState = _.set(newState, 'chatRooms.data', newData)
            return newState
        }

        // Preload related
        case SEARCH_PRELOAD_LOAD: {
            const { type, path } = action.payload
            let newState = _.cloneDeep(state)
            let dataToUpdate = _.get(newState, path)
            dataToUpdate = _.set(dataToUpdate, 'loading', true)

            newState = _.set(newState, path, dataToUpdate)
            return newState
        }

        case SEARCH_PRELOAD_LOAD_DONE: {
            const { type, path, data, hasNextPage, skip } = action.payload
            let newState = _.cloneDeep(state)
            let dataToUpdate = _.get(newState, path)
            dataToUpdate = _.set(dataToUpdate, 'loading', false)
            dataToUpdate = _.set(dataToUpdate, 'skip', skip)

            let oldData = _.get(dataToUpdate, 'data')
            dataToUpdate = _.set(
                dataToUpdate,
                'data',
                arrayUnique(oldData.concat(data))
            )
            dataToUpdate = _.set(dataToUpdate, 'hasNextPage', hasNextPage)

            newState = _.set(newState, path, dataToUpdate)
            return newState
        }

        case SEARCH_PRELOAD_REFRESH: {
            const { type, path } = action.payload
            let newState = _.cloneDeep(state)
            let dataToUpdate = _.get(newState, path)
            dataToUpdate = _.set(dataToUpdate, 'refreshing', true)

            newState = _.set(newState, path, dataToUpdate)
            return newState
        }

        case SEARCH_PRELOAD_REFRESH_DONE: {
            const { type, path, data, hasNextPage, skip } = action.payload
            let newState = _.cloneDeep(state)
            let dataToUpdate = _.get(newState, path)
            dataToUpdate = _.set(dataToUpdate, 'refreshing', false)
            dataToUpdate = _.set(dataToUpdate, 'skip', skip)
            dataToUpdate = _.set(dataToUpdate, 'data', data)
            dataToUpdate = _.set(dataToUpdate, 'hasNextPage', hasNextPage)

            newState = _.set(newState, path, dataToUpdate)
            return newState
        }

        default:
            return { ...state }
    }
}
