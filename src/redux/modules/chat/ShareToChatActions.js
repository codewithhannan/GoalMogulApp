/** @format */

import { Alert } from 'react-native'
import {
    SHARE_TO_CHAT_RESET,
    SHARE_TO_CHAT_UPDATE_SEARCH_QUERY,
    SHARE_TO_CHAT_UPDATE_SHARE_MESSAGE,
    SHARE_TO_CHAT_UPDATE_SELECTED_ITEMS,
    SHARE_TO_CHAT_SEARCH_COMPLETE,
    SHARE_TO_CHAT_UPDATE_SUBMITTING,
    SHARE_TO_CHAT_BEGIN_SEARCH,
} from './ShareToChatReducers'
import { api as API } from '../../../redux/middleware/api'
import { Actions } from 'react-native-router-flux'

const FRIEND_SEARCH_ROUTE = 'secure/user/friendship/es'
const CHAT_SEARCH_ROUTE = 'secure/chat/room/es'

export const shareToChatReset = () => (dispatch) => {
    dispatch({
        type: SHARE_TO_CHAT_RESET,
    })
}

export const shareToChatChangeSearchQuery = (searchQuery) => (dispatch) => {
    dispatch({
        type: SHARE_TO_CHAT_UPDATE_SEARCH_QUERY,
        payload: searchQuery,
    })
}

export const shareToChatChangeShareMessage = (shareMessage) => (dispatch) => {
    dispatch({
        type: SHARE_TO_CHAT_UPDATE_SHARE_MESSAGE,
        payload: shareMessage,
    })
}

export const shareToChatChangeSelectedItems = (selectedItems) => (dispatch) => {
    dispatch({
        type: SHARE_TO_CHAT_UPDATE_SELECTED_ITEMS,
        payload: selectedItems,
    })
}

export const shareToChatClearSearch = () => (dispatch) => {
    dispatch({
        type: SHARE_TO_CHAT_SEARCH_COMPLETE,
        payload: {
            results: [],
            hasNextPage: true,
        },
    })
}

export const shareToChatSearch = (
    searchQuery,
    currentResults,
    limit,
    searchType
) => (dispatch, getState) => {
    const { token } = getState().user
    dispatch({
        type: SHARE_TO_CHAT_BEGIN_SEARCH,
    })
    let path
    if (searchType == 'Direct') {
        path = FRIEND_SEARCH_ROUTE
    } else {
        path = CHAT_SEARCH_ROUTE
    }
    path += `?query=${searchQuery}&skip=${currentResults.length}&limit=${limit}`
    API.get(path, token)
        .then((resp) => {
            const results = resp.data
            dispatch({
                type: SHARE_TO_CHAT_SEARCH_COMPLETE,
                payload: {
                    results: currentResults.concat(results || []),
                    hasNextPage: !!(results && results.length),
                },
            })
        })
        .catch((err) => {
            dispatch({
                type: SHARE_TO_CHAT_SEARCH_COMPLETE,
                payload: {
                    results: [],
                    hasNextPage: true,
                },
            })
            Alert.alert(
                'Error',
                'Could not load results. Please try again later.'
            )
        })
}

export const shareToSelectedChats = (
    selectedItems,
    shareMessage,
    userToShare,
    chatRoomType
) => (dispatch, getState) => {
    const { token } = getState().user
    dispatch({
        type: SHARE_TO_CHAT_UPDATE_SUBMITTING,
        payload: true,
    })
    ;(async () => {
        let chatRoomsToSendTo = []
        let failedItems = []

        if (chatRoomType == 'Direct') {
            // get chat rooms associated with selected users
            for (let userDoc of selectedItems) {
                try {
                    const body = {
                        roomType: 'Direct',
                        membersToAdd: userDoc._id,
                    }
                    const resp = await API.post(`secure/chat/room`, body, token)
                    if (resp.status != 200) {
                        failedItems.push(userDoc)
                    } else {
                        let chatRoom = resp.data
                        if (!chatRoom) {
                            failedItems.push(userDoc)
                        } else {
                            // add name so that if there's an error, we can let user know which chats errored
                            chatRoom.name = userDoc.name
                            chatRoomsToSendTo.push(chatRoom)
                        }
                    }
                } catch (e) {
                    failedItems.push(userDoc)
                }
            }
        } else {
            chatRoomsToSendTo = selectedItems
        }

        for (let chatRoom of chatRoomsToSendTo) {
            // send the message
            const body = {
                chatRoomRef: chatRoom._id,
                content: {
                    message: shareMessage,
                },
                sharedEntity: {
                    userRef: userToShare._id,
                },
            }
            try {
                const resp = await API.post(`secure/chat/message`, body, token)
                if (resp.status != 200) {
                    failedItems.push(chatRoom)
                }
            } catch (e) {
                failedItems.push(chatRoom)
            }
        }

        if (failedItems.length == 0) {
            Alert.alert(
                'Success',
                'User has been shared to the selected chat(s)'
            )
            dispatch({
                type: SHARE_TO_CHAT_RESET,
            })
            Actions.pop()
        } else {
            const failedChatRoomNames = failedItems.reduce((accum, room) => {
                return `${accum}, ${room.name}`
            }, '')
            Alert.alert(
                'Error',
                `Could not send message to some chats: ${failedChatRoomNames}`
            )
            dispatch({
                type: SHARE_TO_CHAT_UPDATE_SUBMITTING,
                payload: false,
            })
        }
    })()
}
