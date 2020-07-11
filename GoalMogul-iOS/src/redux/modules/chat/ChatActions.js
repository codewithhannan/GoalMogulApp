/**
 * Actions for Chat tab
 *
 * @format
 */

import Bluebird from 'bluebird'
import _ from 'lodash'
import { Alert, AsyncStorage } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { CHAT_TAB_LAST_INDEX } from '../../../Main/Chat/Chat'
import MessageStorageService from '../../../services/chat/MessageStorageService'
import { api as API } from '../../middleware/api'
import {
    CHAT_LOAD,
    CHAT_LOAD_DONE,
    CHAT_LOAD_TYPES,
    CHAT_REFRESH,
    CHAT_REFRESH_DONE,
    CHAT_SWITCH_TAB,
    CHAT_UPDATE_TAB_UNREAD_COUNT,
    PLUS_PRESSED,
    PLUS_UNPRESSED,
    SEARCH_QUERY_UPDATED,
} from './ChatReducers'

export const selectChatTab = (index) => (dispatch) => {
    AsyncStorage.setItem(CHAT_TAB_LAST_INDEX, index.toString())
    dispatch({
        type: CHAT_SWITCH_TAB,
        payload: {
            index,
        },
    })
}

export const plusPressed = () => (dispatch) => {
    dispatch({
        type: PLUS_PRESSED,
    })
}

export const plusUnpressed = () => (dispatch) => {
    dispatch({
        type: PLUS_UNPRESSED,
    })
}

export const searchQueryUpdated = (tab, query) => (dispatch) => {
    dispatch({
        type: SEARCH_QUERY_UPDATED,
        payload: {
            query,
            type: tab,
        },
    })
}

export const createOrGetDirectMessage = (userId, maybeCallback) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    const body = {
        roomType: 'Direct',
        membersToAdd: userId,
    }
    API.post(`secure/chat/room`, body, token)
        .then((resp) => {
            if (resp.status != 200) {
                if (maybeCallback) {
                    return maybeCallback(new Error('Error creating chat.'))
                }
                return Alert.alert(
                    'Error',
                    'Could not start the conversation. Please try again later.'
                )
            }
            const chatRoom = resp.data
            if (!chatRoom) {
                if (maybeCallback) {
                    return maybeCallback(new Error('Error creating chat.'))
                }
                return Alert.alert(
                    'Error',
                    'Could not start the conversation. Please try again later.'
                )
            }
            if (maybeCallback) {
                maybeCallback(null, chatRoom)
            } else {
                Actions.push('chatRoomConversation', {
                    chatRoomId: chatRoom._id,
                })
            }
        })
        .catch((err) => {
            if (maybeCallback) {
                return maybeCallback(err)
            }
            Alert.alert(
                'Error',
                'Could not create a conversation with specified user.'
            )
        })
}

export const updateCurrentChatRoomsList = (
    tab,
    currentChatRoomsList,
    minPageSize,
    maybeSearchQuery
) => (dispatch, getState) => {
    if (maybeSearchQuery || maybeSearchQuery.trim().length) {
        return
    }
    const pageSize = Math.max(currentChatRoomsList.length, minPageSize)
    const { token } = getState().user
    switch (tab) {
        case CHAT_LOAD_TYPES.allChats:
            API.get(
                `secure/chat/room/latest?roomType=All&limit=${pageSize}&skip=0`,
                token
            )
                .then((res) => {
                    const chatRooms = res.data
                    transformChatRoomResultsAndDispatch(
                        CHAT_REFRESH_DONE,
                        {
                            type: tab,
                            data: chatRooms,
                        },
                        dispatch
                    )
                })
                .catch((err) =>
                    console.log(`Error live updating chat room list`, err)
                )
            break
        case CHAT_LOAD_TYPES.directMessages:
            API.get(
                `secure/chat/room/latest?roomType=Direct&limit=${pageSize}&skip=0`,
                token
            )
                .then((res) => {
                    const chatRooms = res.data
                    transformChatRoomResultsAndDispatch(
                        CHAT_REFRESH_DONE,
                        {
                            type: tab,
                            data: chatRooms,
                        },
                        dispatch
                    )
                })
                .catch((err) =>
                    console.log(`Error live updating chat room list`, err)
                )
            break
        case CHAT_LOAD_TYPES.chatRooms:
            API.get(
                `secure/chat/room/latest?roomType=Group&limit=${pageSize}&skip=0`,
                token
            )
                .then((res) => {
                    const chatRooms = res.data
                    transformChatRoomResultsAndDispatch(
                        CHAT_REFRESH_DONE,
                        {
                            type: tab,
                            data: chatRooms.map((chatDoc) => {
                                chatDoc.isChatRoom = true
                                return chatDoc
                            }),
                        },
                        dispatch
                    )
                })
                .catch((err) =>
                    console.log(`Error live updating chat room list`, err)
                )
            break
    }
}

/* Following are actions to load chat rooms */
export const refreshChatRooms = (tab, pageSize, maybeSearchQuery) => (
    dispatch,
    getState
) => {
    const { refreshing } = _.get(getState().chat, tab)
    if (refreshing) return // Don't refresh when there is a request on flight
    dispatch({
        type: CHAT_REFRESH,
        payload: {
            type: tab,
        },
    })
    const { token } = getState().user
    switch (tab) {
        case CHAT_LOAD_TYPES.allChats:
            API.get(
                `secure/chat/room/latest?roomType=All&limit=${pageSize}&skip=0`,
                token
            )
                .then((res) => {
                    const chatRooms = res.data
                    transformChatRoomResultsAndDispatch(
                        CHAT_REFRESH_DONE,
                        {
                            type: tab,
                            data: chatRooms,
                        },
                        dispatch
                    )
                })
                .catch((err) => {
                    Alert.alert(
                        'Error',
                        'Error loading data. Please try again.'
                    )
                    console.log(err)
                    dispatch({
                        type: CHAT_REFRESH_DONE,
                        payload: { type: tab, data: [] },
                    })
                })
            break
        case CHAT_LOAD_TYPES.directMessages:
            if (maybeSearchQuery && maybeSearchQuery.trim().length) {
                API.get(
                    `secure/user/friendship/es?query=${maybeSearchQuery}&limit=${pageSize}&skip=0`,
                    token
                )
                    .then((res) => {
                        const userFriends = res.data
                        dispatch({
                            type: CHAT_REFRESH_DONE,
                            payload: {
                                type: tab,
                                data: userFriends.map((userDoc) => {
                                    userDoc.isFriend = true
                                    return userDoc
                                }),
                            },
                        })
                    })
                    .catch((err) => {
                        Alert.alert(
                            'Error',
                            'Error loading data. Please try again.'
                        )
                        console.log(err)
                        dispatch({
                            type: CHAT_REFRESH_DONE,
                            payload: { type: tab, data: [] },
                        })
                    })
            } else {
                API.get(
                    `secure/chat/room/latest?roomType=Direct&limit=${pageSize}&skip=0`,
                    token
                )
                    .then((res) => {
                        const chatRooms = res.data
                        transformChatRoomResultsAndDispatch(
                            CHAT_REFRESH_DONE,
                            {
                                type: tab,
                                data: chatRooms,
                            },
                            dispatch
                        )
                    })
                    .catch((err) => {
                        Alert.alert(
                            'Error',
                            'Error loading data. Please try again.'
                        )
                        console.log(err)
                        dispatch({
                            type: CHAT_REFRESH_DONE,
                            payload: { type: tab, data: [] },
                        })
                    })
            }
            break
        case CHAT_LOAD_TYPES.chatRooms:
            if (maybeSearchQuery && maybeSearchQuery.trim().length) {
                API.get(
                    `secure/chat/room/es?query=${maybeSearchQuery}&limit=${pageSize}&skip=0&forceRefresh=true`,
                    token
                )
                    .then((res) => {
                        const chatRooms = res.data
                        transformChatRoomResultsAndDispatch(
                            CHAT_REFRESH_DONE,
                            {
                                type: tab,
                                data: chatRooms,
                            },
                            dispatch
                        )
                    })
                    .catch((err) => {
                        Alert.alert(
                            'Error',
                            'Error loading data. Please try again.'
                        )
                        console.log(err)
                        dispatch({
                            type: CHAT_REFRESH_DONE,
                            payload: { type: tab, data: [] },
                        })
                    })
            } else {
                API.get(
                    `secure/chat/room/latest?roomType=Group&limit=${pageSize}&skip=0`,
                    token
                )
                    .then((res) => {
                        const chatRooms = res.data
                        transformChatRoomResultsAndDispatch(
                            CHAT_REFRESH_DONE,
                            {
                                type: tab,
                                data: chatRooms,
                            },
                            dispatch
                        )
                    })
                    .catch((err) => {
                        Alert.alert(
                            'Error',
                            'Error loading data. Please try again.'
                        )
                        dispatch({
                            type: CHAT_REFRESH_DONE,
                            payload: { type: tab, data: [] },
                        })
                    })
            }
            break
    }
}

export const loadMoreChatRooms = (
    tab,
    pageSize,
    prevResultsOffset,
    maybeSearchQuery
) => (dispatch, getState) => {
    const { loading } = _.get(getState().chat, tab)

    if (loading) return // Don't load more when there is a request on flight
    dispatch({
        type: CHAT_LOAD,
        payload: {
            type: tab,
        },
    })
    const { token } = getState().user
    const resultsOffset = prevResultsOffset + pageSize
    switch (tab) {
        case CHAT_LOAD_TYPES.allChats:
            API.get(
                `secure/chat/room/latest?roomType=All&limit=${pageSize}&skip=${resultsOffset}`,
                token
            )
                .then((res) => {
                    const chatRooms = res.data
                    transformChatRoomResultsAndDispatch(
                        CHAT_LOAD_DONE,
                        {
                            type: tab,
                            data: chatRooms,
                            skip: resultsOffset,
                            hasNextPage: !!chatRooms.length,
                        },
                        dispatch
                    )
                })
                .catch((err) => {
                    Alert.alert(
                        'Error',
                        'Error loading data. Please try again.'
                    )
                    dispatch({
                        type: CHAT_LOAD_DONE,
                        payload: {
                            type: tab,
                            data: [],
                            skip: prevResultsOffset,
                        },
                    })
                })
            break
        case CHAT_LOAD_TYPES.directMessages:
            if (maybeSearchQuery && maybeSearchQuery.trim().length) {
                API.get(
                    `secure/user/friendship/es?query=${maybeSearchQuery}&limit=${pageSize}&skip=${resultsOffset}`,
                    token
                )
                    .then((res) => {
                        const userFriends = res.data
                        dispatch({
                            type: CHAT_LOAD_DONE,
                            payload: {
                                type: tab,
                                data: userFriends.map((userDoc) => {
                                    userDoc.isFriend = true
                                    return userDoc
                                }),
                                skip: resultsOffset,
                                hasNextPage: !!userFriends.length,
                            },
                        })
                    })
                    .catch((err) => {
                        Alert.alert(
                            'Error',
                            'Error loading data. Please try again.'
                        )
                        dispatch({
                            type: CHAT_LOAD_DONE,
                            payload: {
                                type: tab,
                                data: [],
                                skip: prevResultsOffset,
                            },
                        })
                    })
            } else {
                API.get(
                    `secure/chat/room/latest?roomType=Direct&limit=${pageSize}&skip=${resultsOffset}`,
                    token
                )
                    .then((res) => {
                        const chatRooms = res.data
                        transformChatRoomResultsAndDispatch(
                            CHAT_LOAD_DONE,
                            {
                                type: tab,
                                data: chatRooms,
                                skip: resultsOffset,
                                hasNextPage: !!chatRooms.length,
                            },
                            dispatch
                        )
                    })
                    .catch((err) => {
                        Alert.alert(
                            'Error',
                            'Error loading data. Please try again.'
                        )
                        dispatch({
                            type: CHAT_LOAD_DONE,
                            payload: {
                                type: tab,
                                data: [],
                                skip: prevResultsOffset,
                            },
                        })
                    })
            }
            break
        case CHAT_LOAD_TYPES.chatRooms:
            if (maybeSearchQuery && maybeSearchQuery.trim().length) {
                API.get(
                    `secure/chat/room/es?query=${maybeSearchQuery}&limit=${pageSize}&skip=${resultsOffset}`,
                    token
                )
                    .then((res) => {
                        const chatRooms = res.data
                        transformChatRoomResultsAndDispatch(
                            CHAT_LOAD_DONE,
                            {
                                type: tab,
                                data: chatRooms,
                                skip: resultsOffset,
                                hasNextPage: !!chatRooms.length,
                            },
                            dispatch
                        )
                    })
                    .catch((err) => {
                        Alert.alert(
                            'Error',
                            'Error loading data. Please try again.'
                        )
                        console.log(err)
                        dispatch({
                            type: CHAT_LOAD_DONE,
                            payload: {
                                type: tab,
                                data: [],
                                skip: prevResultsOffset,
                            },
                        })
                    })
            } else {
                API.get(
                    `secure/chat/room/latest?roomType=Group&limit=${pageSize}&skip=${resultsOffset}`,
                    token
                )
                    .then((res) => {
                        const chatRooms = res.data
                        transformChatRoomResultsAndDispatch(
                            CHAT_LOAD_DONE,
                            {
                                type: tab,
                                data: chatRooms,
                                skip: resultsOffset,
                                hasNextPage: !!chatRooms.length,
                            },
                            dispatch
                        )
                    })
                    .catch((err) => {
                        Alert.alert(
                            'Error',
                            'Error loading data. Please try again.'
                        )
                        dispatch({
                            type: CHAT_LOAD_DONE,
                            payload: {
                                type: tab,
                                data: [],
                                skip: prevResultsOffset,
                            },
                        })
                    })
            }
            break
    }
}

export const refreshUnreadCountForTabs = () => (dispatch, getState) => {
    MessageStorageService.getUnreadMessageCountByRoomType(
        'Direct',
        (err, directCount) => {
            dispatch({
                type: CHAT_UPDATE_TAB_UNREAD_COUNT,
                payload: {
                    type: CHAT_LOAD_TYPES.directMessages,
                    count: directCount,
                },
            })
        }
    )
    MessageStorageService.getUnreadMessageCountByRoomType(
        'Group',
        (err, groupCount) => {
            dispatch({
                type: CHAT_UPDATE_TAB_UNREAD_COUNT,
                payload: {
                    type: CHAT_LOAD_TYPES.chatRooms,
                    count: groupCount,
                },
            })
        }
    )
}

const getUnreadMessageCountByConversations = Bluebird.promisify(
    MessageStorageService.getUnreadMessageCountByConversations
)
const getLatestMessagesByConversation = Bluebird.promisify(
    MessageStorageService.getLatestMessagesByConversation
)
async function transformChatRoomResultsAndDispatch(
    dispatchType,
    dispatchPayload,
    dispatch
) {
    let transformedPayload = _.cloneDeep(dispatchPayload)
    let chatRooms = dispatchPayload.data
    let unreadMessageCountByConversationMap = {}
    try {
        unreadMessageCountByConversationMap = await getUnreadMessageCountByConversations(
            chatRooms.map((doc) => doc._id)
        )
    } catch (e) {
        /* we tried */
    }

    try {
        transformedPayload.data = !chatRooms.length
            ? []
            : await Promise.all(
                  chatRooms.map(async (chatRoom) => {
                      chatRoom.isChatRoom = true
                      chatRoom.unreadMessageCount =
                          unreadMessageCountByConversationMap[chatRoom._id]
                      try {
                          chatRoom.latestMessage = (
                              await getLatestMessagesByConversation(
                                  chatRoom._id,
                                  1,
                                  0
                              )
                          )[0]
                      } catch (e) {
                          /* we tried */
                      }
                      chatRoom.members =
                          chatRoom.members &&
                          chatRoom.members.filter(
                              (memberDoc) => memberDoc.memberRef
                          )
                      return chatRoom
                  })
              )
    } catch (e) {
        /* should never happen */
    }

    dispatch({
        type: dispatchType,
        payload: transformedPayload,
    })
}
