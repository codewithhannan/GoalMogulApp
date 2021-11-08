/**
 *
 * Chat Tab is a main page with two sub tabs including ChatRoomTab, MessageTab
 * July 2020: Chat Tab now only has one list rather than two tabs, w all chats
 *
 * @format
 */

import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

const INITIAL_STATE = {
    initializing: true,
    chatRoomsMap: {},
    currentlyTypingUserIds: [],
    activeChatRoomId: null,
    messageMediaRef: null, // for attaching media to message to send
    messageVoiceRef: null,
    messageVideoRef: null,
    messages: [],
    ghostMessages: null,
    limit: 15,
    skip: 0,
    hasNextPage: false,
    loading: false,
    searchQuery: '',
    searchResults: [],
    searchResultPreviewMessages: [],
    searching: false,
    messageDoc: {},
}

export const CHAT_ROOM_LOAD_INITIAL_BEGIN = 'chat_room_load_initial_begin'
export const CHAT_ROOM_LOAD_INITIAL = 'chat_room_load_initial'
export const CHAT_ROOM_UPDATE_CHAT_ROOM = 'chat_room_update_chat_room'
export const CHAT_ROOM_LOAD_MORE_MESSAGES_BEGIN =
    'chat_room_load_more_messages_begin'
export const CHAT_ROOM_LOAD_MORE_MESSAGES = 'chat_room_load_more_messages'
export const CHAT_ROOM_UPDATE_MESSAGES = 'chat_room_update_messages' // we update the entire message list when a new message comes in for consistency purposes
export const CHAT_ROOM_UPDATE_CURRENTLY_TYPING_USERS =
    'chat_room_update_currently_typing_users'
export const CHAT_ROOM_UPDATE_MESSAGE_MEDIA_REF =
    'chat_room_update_message_media_ref'
export const CHAT_ROOM_UPDATE_MESSAGE_VOICE_REF =
    'chat_room_update_message_voice_ref'
export const CHAT_ROOM_UPDATE_MESSAGE_VIDEO_REF =
    'chat_room_update_message_video_ref'
export const CHAT_ROOM_UPDATE_GHOST_MESSAGES = 'chat_room_update_ghost_messages'
export const CHAT_ROOM_CLOSE_ACTIVE_ROOM = 'chat_room_close_active_room'
export const CHAT_ROOM_SEARCH_MESSAGES_BEGIN = 'chat_room_search_messages_begin'
export const CHAT_ROOM_SEARCH_MESSAGES_CLEAR = 'chat_room_search_messages_clear'
export const CHAT_ROOM_SEARCH_MESSAGES = 'chat_room_search_messages'
export const CHAT_ROOM_SEARCH_MESSAGES_UPDATE_QUERY =
    'chat_room_search_messages_update_query'
export const CHAT_ROOM_SEARCH_MESSAGES_UPDATE_PREVIEW =
    'chat_room_search_messages_update_preview'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHAT_ROOM_LOAD_INITIAL_BEGIN: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'activeChatRoomId', null)
            newState = _.set(newState, 'currentlyTypingUserIds', [])
            newState = _.set(newState, 'messages', [])

            newState = _.set(newState, 'ghostMessages', null)
            newState = _.set(newState, 'loading', false)
            newState = _.set(newState, 'searchResults', [])
            newState = _.set(newState, 'searching', false)
            newState = _.set(newState, 'messageMediaRef', null)
            newState = _.set(newState, 'messageVoiceRef', null)
            newState = _.set(newState, 'messageVideoRef', null)
            return _.set(newState, 'initializing', true)
        }
        case CHAT_ROOM_LOAD_INITIAL: {
            const { messages, chatRoom } = action.payload

            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'initializing', false)
            if (messages) {
                newState = _.set(newState, 'messages', messages)
                newState = _.set(newState, 'skip', messages.length)

                if (messages.length > 5) {
                    newState = _.set(newState, 'hasNextPage', !!messages.length)
                }
            }
            if (chatRoom) {
                let chatRoomsMap = _.get(newState, 'chatRoomsMap')
                chatRoomsMap[chatRoom._id] = chatRoom
                newState = _.set(newState, 'chatRoomsMap', chatRoomsMap)
                newState = _.set(newState, 'activeChatRoomId', chatRoom._id)
            }
            return newState
        }
        case CHAT_ROOM_UPDATE_CHAT_ROOM: {
            let newState = _.cloneDeep(state)
            const chatRoom = action.payload
            if (chatRoom) {
                let chatRoomsMap = _.get(newState, 'chatRoomsMap')
                chatRoomsMap[chatRoom._id] = chatRoom
                newState = _.set(newState, 'chatRoomsMap', chatRoomsMap)
            }
            return newState
        }
        case CHAT_ROOM_CLOSE_ACTIVE_ROOM: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'activeChatRoomId', null)
            newState = _.set(newState, 'currentlyTypingUserIds', [])
            newState = _.set(newState, 'messages', [])
            newState = _.set(newState, 'ghostMessages', null)
            newState = _.set(newState, 'loading', false)
            newState = _.set(newState, 'searchResults', [])
            newState = _.set(newState, 'searching', false)
            newState = _.set(newState, 'messageMediaRef', null)
            newState = _.set(newState, 'messageVoiceRef', null)
            newState = _.set(newState, 'messageVideoRef', null)
            return newState
        }
        case CHAT_ROOM_UPDATE_MESSAGE_MEDIA_REF: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'messageMediaRef', action.payload)
        }
        case CHAT_ROOM_UPDATE_MESSAGE_VOICE_REF: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'messageVoiceRef', action.payload)
        }
        case CHAT_ROOM_UPDATE_MESSAGE_VIDEO_REF: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'messageVideoRef', action.payload)
        }
        case CHAT_ROOM_LOAD_MORE_MESSAGES_BEGIN: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'loading', true)
        }
        case CHAT_ROOM_LOAD_MORE_MESSAGES: {
            let newState = _.cloneDeep(state)
            const messages = action.payload
            const oldMessages = _.get(newState, `messages`)
            const mergedMessages = arrayUnique(oldMessages.concat(messages))
            newState = _.set(newState, 'loading', false)
            newState = _.set(newState, 'skip', mergedMessages.length)
            newState = _.set(newState, 'hasNextPage', !!messages.length)
            return _.set(newState, `messages`, mergedMessages)
        }
        case CHAT_ROOM_UPDATE_MESSAGES: {
            let newState = _.cloneDeep(state)
            const messages = action.payload
            newState = _.set(newState, 'skip', messages.length)
            return _.set(newState, `messages`, messages)
        }
        case CHAT_ROOM_UPDATE_GHOST_MESSAGES: {
            let newState = _.cloneDeep(state)
            const ghostMessages = action.payload
            return _.set(newState, 'ghostMessages', ghostMessages)
        }
        case CHAT_ROOM_SEARCH_MESSAGES_BEGIN: {
            let newState = _.cloneDeep(state)
            return _.set(newState, `searching`, true)
        }
        case CHAT_ROOM_SEARCH_MESSAGES_CLEAR: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'searchResults', [])
            return _.set(newState, `searching`, false)
        }
        case CHAT_ROOM_SEARCH_MESSAGES: {
            let newState = _.cloneDeep(state)
            const messages = action.payload
            newState = _.set(newState, 'searchResults', messages)
            return _.set(newState, `searching`, false)
        }
        case CHAT_ROOM_SEARCH_MESSAGES_UPDATE_PREVIEW: {
            let newState = _.cloneDeep(state)
            const messages = action.payload
            return _.set(newState, 'searchResultPreviewMessages', messages)
        }
        case CHAT_ROOM_SEARCH_MESSAGES_UPDATE_QUERY: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'searchQuery', action.payload)
        }
        case CHAT_ROOM_UPDATE_CURRENTLY_TYPING_USERS: {
            let newState = _.cloneDeep(state)
            return _.set(newState, `currentlyTypingUserIds`, action.payload)
        }
        default: {
            return { ...state }
        }
    }
}
