/**
 *
 * Chat Tab is a main page with two sub tabs including ChatRoomTab, MessageTab
 * July 2020: Chat Tab now only has one list rather than two tabs, w all chats
 *
 * @format
 */

import _ from 'lodash'

const INITIAL_STATE = {
    navigationState: {
        index: 0,
        routes: [
            { key: 'members', title: 'Members' },
            { key: 'admins', title: 'Admins' },
            { key: 'joinRequesters', title: 'Requesters' },
        ],
    },
    selectedTab: 'members',
    refreshing: false,
}

export const CHAT_MEMBERS_RESET_STATE = 'chat_members_reset_state'
export const CHAT_MEMBERS_SWITCH_TAB = 'chat_members_switch_tab'
export const CHAT_MEMBERS_REFRESH_BEGIN = 'chat_members_refresh_begin'
export const CHAT_MEMBERS_REFRESH_COMPLETE = 'chat_members_refresh_complete'
export const CHAT_MEMBERS_SEND_JOIN_REQUEST = 'chat_members_send_join_request'
export const CHAT_MEMBERS_SEND_JOIN_REQUEST_DONE =
    'chat_members_send_join_request_done'
export const CHAT_MEMBERS_SEND_JOIN_REQUEST_ERROR =
    'chat_members_send_join_request_error'
export const CHAT_MEMBERS_CANCEL_JOIN_REQUEST =
    'chat_members_cancel_join_request'
export const CHAT_MEMBERS_CANCEL_JOIN_REQUEST_DONE =
    'chat_members_cancel_join_request_done'
export const CHAT_MEMBERS_CANCEL_JOIN_REQUEST_ERROR =
    'chat_members_cancel_join_request_error'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHAT_MEMBERS_SWITCH_TAB: {
            const { index } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'navigationState.index', index)

            const selectedTab = state.navigationState.routes[index].key
            return _.set(newState, 'selectedTab', selectedTab)
        }
        case CHAT_MEMBERS_REFRESH_BEGIN: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'refreshing', true)
        }
        case CHAT_MEMBERS_REFRESH_COMPLETE: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'refreshing', false)
        }
        case CHAT_MEMBERS_RESET_STATE: {
            return INITIAL_STATE
        }
        default: {
            return { ...state }
        }
    }
}
