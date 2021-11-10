/**
 *
 * Chat Tab is a main page with two sub tabs including ChatRoomTab, MessageTab
 * July 2020: Chat Tab now only has one list rather than two tabs, w all chats
 * @format
 */

import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

const INITIAL_STATE = {
    navigationState: {
        index: 0,
        routes: [
            { key: 'directMessages', title: 'PRIVATE MESSAGES' },
            { key: 'chatRooms', title: 'GROUP CHATS' },
        ],
    },
    selectedTab: 'allChats',
    showPlus: true,
    directMessages: {
        unreadCount: 0,
        data: [],
        searchQuery: '',
        hasNextPage: true,
        limit: 5,
        skip: 0,
        loading: false,
        refreshing: false,
    },
    chatRooms: {
        unreadCount: 0,
        data: [],
        searchQuery: '',
        hasNextPage: true,
        limit: 5,
        skip: 0,
        loading: false,
        refreshing: false,
    },
    allChats: {
        unreadCount: 0,
        data: [],
        searchQuery: '',
        hasNextPage: true,
        limit: 10,
        skip: 0,
        loading: false,
        refreshing: false,
    },
}

export const CHAT_SWITCH_TAB = 'chat_switch_tab'
export const CHAT_ON_FOCUS = 'chat_on_focus'
export const CHAT_LOAD = 'chat_load'
export const CHAT_REFRESH = 'chat_refresh'
export const CHAT_REFRESH_DONE = 'chat_refresh_done'
export const CHAT_LOAD_DONE = 'chat_load_done'
export const PLUS_PRESSED = 'chat_plus_pressed'
export const PLUS_UNPRESSED = 'chat_plus_unpressed'
export const SEARCH_QUERY_UPDATED = 'chat_search_query_updated'
export const CHAT_UPDATE_TAB_UNREAD_COUNT = 'chat_update_tab_unread_count'
export const CHAT_EMPTY = 'chat_empty'

export const CHAT_LOAD_TYPES = {
    directMessages: 'directMessages',
    chatRooms: 'chatRooms',
    allChats: 'allChats',
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHAT_SWITCH_TAB: {
            const { index } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'navigationState.index', index)

            const selectedTab = state.navigationState.routes[index].key
            return _.set(newState, 'selectedTab', selectedTab)
        }

        case CHAT_LOAD: {
            const { type } = action.payload
            if (!(type in CHAT_LOAD_TYPES))
                throw new Error('Invalid load type: ' + type)
            const newState = _.cloneDeep(state)
            return _.set(newState, `${type}.loading`, true)
        }

        case CHAT_REFRESH: {
            const { type } = action.payload
            if (!(type in CHAT_LOAD_TYPES))
                throw new Error('Invalid load type: ' + type)
            const newState = _.cloneDeep(state)
            return _.set(newState, `${type}.refreshing`, true)
        }

        /**
         * @param type: CHAT_LOAD_TYPES#{directMessages, chatRooms}
         */
        case CHAT_REFRESH_DONE: {
            const { data, type } = action.payload
            if (!(type in CHAT_LOAD_TYPES))
                throw new Error('Invalid load type: ' + type)
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${type}.refreshing`, false)
            newState = _.set(newState, `${type}.skip`, 0)
            newState = _.set(newState, `${type}.hasNextPage`, true)

            return _.set(newState, `${type}.data`, data)
        }

        case CHAT_LOAD_DONE: {
            const { skip, data, hasNextPage, type } = action.payload
            if (!(type in CHAT_LOAD_TYPES))
                throw new Error('Invalid load type: ' + type)
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${type}.loading`, false)

            if (typeof skip !== 'undefined') {
                newState = _.set(newState, `${type}.skip`, skip)
            }
            if (typeof hasNextPage !== 'undefined') {
                newState = _.set(newState, `${type}.hasNextPage`, hasNextPage)
            }
            const oldData = _.get(newState, `${type}.data`)
            return _.set(
                newState,
                `${type}.data`,
                arrayUnique(oldData.concat(data))
            )
        }

        case PLUS_PRESSED: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'showPlus', false)
        }

        case PLUS_UNPRESSED: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'showPlus', true)
        }

        case SEARCH_QUERY_UPDATED: {
            let newState = _.cloneDeep(state)
            const { type, query } = action.payload
            return _.set(newState, `${type}.searchQuery`, query)
        }

        case CHAT_UPDATE_TAB_UNREAD_COUNT: {
            let newState = _.cloneDeep(state)
            const { type, count } = action.payload
            return _.set(newState, `${type}.unreadCount`, count)
        }
        case CHAT_EMPTY: {
            return { ...INITIAL_STATE }
        }

        default: {
            return { ...state }
        }
    }
}
