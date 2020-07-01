/**
 * /*
 * Explore is a main page with several sub tabs including EventTab, TribeTab
 *
 * @format
 */

import _ from 'lodash'
import { arrayUnique } from '../../../reducers/MeetReducers'
import {
    CHAT_MEMBERS_CANCEL_JOIN_REQUEST,
    CHAT_MEMBERS_CANCEL_JOIN_REQUEST_ERROR,
    CHAT_MEMBERS_CANCEL_JOIN_REQUEST_DONE,
    CHAT_MEMBERS_SEND_JOIN_REQUEST,
    CHAT_MEMBERS_SEND_JOIN_REQUEST_ERROR,
    CHAT_MEMBERS_SEND_JOIN_REQUEST_DONE,
} from '../chat/ChatRoomMembersReducers'

const INITIAL_EXPLORE_CHAT_STATE = {
    data: [], // a list of user ids
    skip: 0,
    limit: 6,
    hasNextPage: undefined,
    refreshing: false, // Boolean to determine refreshing status
    loading: false, // Boolean to determine loading more status
}

/**
 * Note: Currently. event and tribe have separated reducer due to previous design choice.
 * Starting from people, we are standardizing the way we store data
 */
const INITIAL_STATE = {
    navigationState: {
        index: 1,
        routes: [
            { key: 'people', title: 'People' },
            { key: 'tribes', title: 'Tribes' },
            { key: 'events', title: 'Events' },
            { key: 'chatRooms', title: 'Chats' },
        ],
    },
    selectedTab: 'events',
    people: {
        data: [], // a list of user ids
        skip: 0,
        limit: 6,
        hasNextPage: undefined,
        refreshing: false, // Boolean to determine refreshing status
        loading: false, // Boolean to determine loading more status
    },
    chatRooms: { ...INITIAL_EXPLORE_CHAT_STATE },
    showPlus: true, // This is no longer being used
}

export const EXPLORE_SWITCH_TAB = 'explore_switch_tab'
export const EXPLORE_ON_FOCUS = 'explore_on_focus'

export const EXPLORE_PEOPLE_REFRESH = 'explore_people_refresh'
export const EXPLORE_PEOPLE_REFRESH_DONE = 'explore_people_refresh_done'
export const EXPLORE_PEOPLE_LOAD_MORE = 'explore_people_load_more'
export const EXPLORE_PEOPLE_LOAD_MORE_DONE = 'explore_people_load_more_done'

export const EXPLORE_CHAT_REFRESH = 'explore_chat_refresh'
export const EXPLORE_CHAT_REFRESH_DONE = 'explore_chat_refresh_done'
export const EXPLORE_CHAT_LOAD_MORE = 'explore_chat_load_more'
export const EXPLORE_CHAT_LOAD_MORE_DONE = 'explore_chat_load_more_done'

export const EXPLORE_REFRENCE_KEY = 'explore'

export const EXPLORE_PLUS_PRESSED = 'explore_press_pressed'
export const EXPLORE_PLUS_UNPRESSED = 'explore_press_unpressed'

// Note: Search has different route map than SuggestionSearch
const BASE_ROUTE = 'secure'
const DEBUG_KEY = '[ Reducer Explore ]'
export const RecommendationRouteMap = {
    people: {
        route: `${BASE_ROUTE}/user/friendship/recommendations`,
        actions: {
            refresh: EXPLORE_PEOPLE_REFRESH,
            refresh_done: EXPLORE_PEOPLE_REFRESH_DONE,
            load_more: EXPLORE_PEOPLE_LOAD_MORE,
            load_more_done: EXPLORE_PEOPLE_LOAD_MORE_DONE,
        },
    },
    events: {
        route: `${BASE_ROUTE}/event/recommendations`,
    },
    tribes: {
        route: `${BASE_ROUTE}/tribe/recommendations`,
    },
    chatRooms: {
        route: `${BASE_ROUTE}/chat/room/recommendations`,
        actions: {
            refresh: EXPLORE_CHAT_REFRESH,
            refresh_done: EXPLORE_CHAT_REFRESH_DONE,
            load_more: EXPLORE_CHAT_LOAD_MORE,
            load_more_done: EXPLORE_CHAT_LOAD_MORE_DONE,
        },
    },
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case EXPLORE_SWITCH_TAB: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'navigationState.index', action.payload)

            const selectedTab = state.navigationState.routes[action.payload].key
            return _.set(newState, 'navigationState.selectedTab', selectedTab)
        }

        case EXPLORE_PEOPLE_REFRESH: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'people.refreshing', true)
            return newState
        }

        case EXPLORE_PEOPLE_REFRESH_DONE: {
            let newState = _.cloneDeep(state)

            // Old data is used by Users.js to tentatively remove
            // unused reference
            const { data, oldData, skip, hasNextPage } = action.payload
            const dataToStore = data.map((d) => d._id)

            // Replace the old user ids
            newState = _.set(newState, 'people.data', dataToStore)

            newState = _.set(newState, 'people.skip', skip)
            newState = _.set(newState, 'people.hasNextPage', hasNextPage)
            newState = _.set(newState, 'people.refreshing', false)

            // For each old id that is not in the new id list, we attempt to clear in Users.post
            // Currently we don't handle the clean up at this stage. But this needs to be added
            // otherwise there will be dangling user
            return newState
        }

        case EXPLORE_PEOPLE_LOAD_MORE: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'people.loading', true)
            return newState
        }

        case EXPLORE_PEOPLE_LOAD_MORE_DONE: {
            let newState = _.cloneDeep(state)
            const { data, oldData, skip, hasNextPage } = action.payload

            // Get prev list of user ids
            const prevData = _.get(newState, 'people.data')
            // Transform new data to only keep user id
            const transformedNewData = data.map((d) => d._id)
            // Concat old and new user ids and dedup
            const dataToStore = _.uniq(prevData.concat(transformedNewData))

            newState = _.set(newState, 'people.data', dataToStore)
            newState = _.set(newState, 'people.skip', skip)
            newState = _.set(newState, 'people.hasNextPage', hasNextPage)
            newState = _.set(newState, 'people.loading', false)

            return newState
        }

        case EXPLORE_PLUS_PRESSED: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'showPlus', false)
        }

        case EXPLORE_PLUS_UNPRESSED: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'showPlus', true)
        }

        /* Chat related reducers */
        case EXPLORE_CHAT_REFRESH: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'chatRooms.refreshing', true)
            return newState
        }

        case EXPLORE_CHAT_REFRESH_DONE: {
            const { data, hasNextPage, skip } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'chatRooms.refreshing', false)
            newState = _.set(newState, 'chatRooms.data', data)
            newState = _.set(newState, 'chatRooms.hasNextPage', hasNextPage)
            newState = _.set(newState, 'chatRooms.skip', skip)
            return newState
        }

        case EXPLORE_CHAT_LOAD_MORE: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'chatRooms.loading', true)
            return newState
        }

        case EXPLORE_CHAT_LOAD_MORE_DONE: {
            let newState = _.cloneDeep(state)
            const { data, hasNextPage, skip } = action.payload
            newState = _.set(newState, 'chatRooms.loading', false)

            const oldData = _.get(newState, 'chatRooms.data')
            const newData = _.uniq(oldData.concat(data))

            newState = _.set(newState, 'chatRooms.data', newData)
            newState = _.set(newState, 'chatRooms.hasNextPage', hasNextPage)
            newState = _.set(newState, 'chatRooms.skip', skip)
            return newState
        }

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
            let newState = _.cloneDeep(state)
            const { chatRoomId, userId, user } = action.payload
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

        default: {
            return { ...state }
        }
    }
}
