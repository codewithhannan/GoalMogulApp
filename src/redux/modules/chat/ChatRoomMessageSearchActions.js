/** @format */

import {
    CHAT_ROOM_SEARCH_MESSAGES_UPDATE_QUERY,
    CHAT_ROOM_SEARCH_MESSAGES_BEGIN,
    CHAT_ROOM_SEARCH_MESSAGES_CLEAR,
    CHAT_ROOM_SEARCH_MESSAGES,
    CHAT_ROOM_SEARCH_MESSAGES_UPDATE_PREVIEW,
} from './ChatRoomReducers'
import MessageStorageService from '../../../services/chat/MessageStorageService'
import { MemberDocumentFetcher } from '../../../Utils/UserUtils'
import { _transformMessagesForGiftedChat } from './ChatRoomActions'

export const refreshChatMessageSearch = (
    chatRoomId,
    searchQuery,
    chatRoomMembersMap
) => (dispatch, getState) => {
    const { token } = getState().user
    if (!searchQuery.trim().length) {
        return dispatch({
            type: CHAT_ROOM_SEARCH_MESSAGES_CLEAR,
        })
    }
    dispatch({
        type: CHAT_ROOM_SEARCH_MESSAGES_BEGIN,
    })
    MessageStorageService.searchMessagesInConversation(
        chatRoomId,
        searchQuery,
        async (err, results) => {
            const messages = results || []
            let transformedMessages
            try {
                transformedMessages = await Promise.all(
                    messages.map(async (messageDoc) => {
                        try {
                            messageDoc.creator = await MemberDocumentFetcher.getUserDocument(
                                messageDoc.creator,
                                token,
                                chatRoomMembersMap
                            )
                        } catch (e) {
                            messageDoc.creator = null
                        }
                        return messageDoc
                    })
                )
            } catch (e) {
                return dispatch({
                    type: CHAT_ROOM_SEARCH_MESSAGES_CLEAR,
                })
            }
            dispatch({
                type: CHAT_ROOM_SEARCH_MESSAGES,
                payload: transformedMessages,
            })
        }
    )
}

export const searchQueryUpdated = (query) => (dispatch, getState) => {
    dispatch({
        type: CHAT_ROOM_SEARCH_MESSAGES_UPDATE_QUERY,
        payload: query,
    })
}

const SNAPSHOT_LIMIT = 5
export const getMessageSnapshots = (markerMessage, chatRoom) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    MessageStorageService.getMessagesBeforeAndAfterMarker(
        chatRoom._id,
        markerMessage,
        SNAPSHOT_LIMIT,
        async (err, messages) => {
            if (err || !messages) {
                Alert.alert(
                    'Error',
                    'Could not get preview for message. Please try again later.'
                )
            } else {
                let giftedChatMessages = []
                try {
                    giftedChatMessages = await _transformMessagesForGiftedChat(
                        messages,
                        chatRoom,
                        token
                    )
                } catch (e) {
                    /* best attempt */
                }
                dispatch({
                    type: CHAT_ROOM_SEARCH_MESSAGES_UPDATE_PREVIEW,
                    payload: giftedChatMessages,
                })
            }
        }
    )
}

export const clearMessageSnapshots = () => (dispatch, getState) => {
    dispatch({
        type: CHAT_ROOM_SEARCH_MESSAGES_UPDATE_PREVIEW,
        payload: [],
    })
}

export const deleteMessageFromSnapshots = (
    messageToDeleteId,
    markerMessage,
    chatRoom
) => (dispatch, getState) => {
    MessageStorageService.deleteMessage(messageToDeleteId, (err, succ) => {
        getMessageSnapshots(markerMessage, chatRoom)(dispatch, getState)
    })
}
