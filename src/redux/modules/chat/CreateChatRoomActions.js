/** @format */

import { Alert } from 'react-native'
import { Actions } from 'react-native-router-flux'
import ImageUtils from '../../../Utils/ImageUtils'
import { api as API } from '../../middleware/api'
import {
    CHAT_NEW_MODAL_PAGE_CHANGE,
    CHAT_NEW_UPDATE_SELECTED_MEMBERS,
    CHAT_NEW_REFRESH_FRIENDS_SEARCH,
    CHAT_NEW_LOAD_MORE_FRIENDS_SEARCH,
    CHAT_NEW_SEARCH_QUERY_UPDATED,
    CHAT_NEW_REFRESH_FRIENDS_SEARCH_BEGIN,
    CHAT_NEW_LOAD_MORE_FRIENDS_SEARCH_BEGIN,
    CHAT_NEW_SUBMIT_FAIL,
    CHAT_NEW_RESET_COMPONENT,
    CHAT_NEW_SUBMIT_SUCCESS,
    CHAT_NEW_SUBMIT,
} from './CreateChatRoomReducers'
import { refreshChatRoom } from './ChatRoomActions'

const DEBUG_KEY = '[CreateChatRoomActions]'

export const cancelCreateOrUpdateChatroom = () => (dispatch, getState) => {
    dispatch({ type: CHAT_NEW_RESET_COMPONENT })
    Actions.pop()
}

export const changeModalPage = (targetPageNumber) => (dispatch) => {
    dispatch({
        type: CHAT_NEW_MODAL_PAGE_CHANGE,
        payload: targetPageNumber,
    })
}

export const updateSelectedMembers = (selectedMembers) => (dispatch) => {
    dispatch({
        type: CHAT_NEW_UPDATE_SELECTED_MEMBERS,
        payload: selectedMembers,
    })
}

export const searchQueryUpdated = (query) => (dispatch) => {
    dispatch({
        type: CHAT_NEW_SEARCH_QUERY_UPDATED,
        payload: query,
    })
}

export const refreshFriendsSearch = (query, pageSize) => (
    dispatch,
    getState
) => {
    const { token } = getState().user

    if (!query.trim().length) {
        return dispatch({
            type: CHAT_NEW_REFRESH_FRIENDS_SEARCH,
            payload: [],
        })
    }

    dispatch({ type: CHAT_NEW_REFRESH_FRIENDS_SEARCH_BEGIN })

    API.get(
        `secure/user/friendship/es?query=${query}&limit=${pageSize}&skip=0`,
        token
    )
        .then((resp) => {
            const results = resp.data
            dispatch({
                type: CHAT_NEW_REFRESH_FRIENDS_SEARCH,
                payload: results.map((userDoc) => {
                    userDoc.isSearchResult = true
                    return userDoc
                }),
            })
        })
        .catch((err) => {
            dispatch({
                type: CHAT_NEW_REFRESH_FRIENDS_SEARCH,
                payload: [],
            })
            Alert.alert(
                'Error',
                'Could not load results. Please try again later.'
            )
        })
}

export const loadMoreFriendsSearch = (query, pageSize, prevOffset) => (
    dispatch,
    getState
) => {
    const { token } = getState().user

    dispatch({ type: CHAT_NEW_LOAD_MORE_FRIENDS_SEARCH_BEGIN })

    API.get(
        `secure/user/friendship/es?query=${query}&limit=${pageSize}&skip=${
            prevOffset + pageSize
        }`,
        token
    )
        .then((resp) => {
            const results = resp.data
            dispatch({
                type: CHAT_NEW_LOAD_MORE_FRIENDS_SEARCH,
                payload: results.map((userDoc) => {
                    userDoc.isSearchResult = true
                    return userDoc
                }),
            })
        })
        .catch((err) => {
            dispatch({
                type: CHAT_NEW_LOAD_MORE_FRIENDS_SEARCH,
                payload: [],
            })
            Alert.alert(
                'Error',
                'Could not load more results. Please try again later.'
            )
        })
}

export const createOrUpdateChatroom = (
    values,
    membersToAdd,
    chatId,
    isEdit,
    needsUpload
) => (dispatch, getState) => {
    const { token } = getState().user
    const newChat = formToChatRoomAdapter(values, membersToAdd, chatId, isEdit)

    dispatch({
        type: CHAT_NEW_SUBMIT,
    })

    const onSuccess = (result, chat) => {
        dispatch({
            type: CHAT_NEW_SUBMIT_SUCCESS,
            payload: result,
        })

        const createdOrUpdatedChat = result.data
        if (!createdOrUpdatedChat) {
            return
        }
        if (isEdit) {
            refreshChatRoom(createdOrUpdatedChat._id)(dispatch, getState)
            Actions.pop()
        } else {
            Actions.pop()
            Actions.push('chatRoomConversation', {
                chatRoomId: createdOrUpdatedChat._id,
            })
        }
    }
    const onError = (err) => {
        dispatch({
            type: CHAT_NEW_SUBMIT_FAIL,
        })
        Alert.alert(
            `Failed to ${isEdit ? 'update' : 'create'} Chat`,
            'Please try again later'
        )
        console.log(
            `${DEBUG_KEY}: ${
                isEdit ? 'update' : 'create'
            } chat failed with err: `,
            err
        )
    }

    const imageUri = isEdit ? newChat.changes.picture : newChat.picture
    if (needsUpload) {
        ImageUtils.getImageSize(imageUri)
            .then(({ width, height }) => {
                // Resize image
                return ImageUtils.resizeImage(imageUri, width, height)
            })
            .then((image) => {
                // Upload image to S3 server
                return ImageUtils.getPresignedUrl(
                    image.uri,
                    token,
                    (objectKey) => {},
                    'ChatFile'
                )
            })
            .then(({ signedRequest, file, objectKey }) => {
                return ImageUtils.uploadImage(file, signedRequest, objectKey)
            })
            .then((resultDoc) => {
                const image = resultDoc.objectKey
                const newChatObject = isEdit
                    ? {
                          ...newChat,
                          changes: { ...newChat.changes, picture: image },
                      }
                    : {
                          ...newChat,
                          picture: image,
                      }
                return sendCreateChatRequest(
                    newChatObject,
                    token,
                    isEdit,
                    onSuccess,
                    onError
                )
            })
            .catch(onError)
    } else {
        return sendCreateChatRequest(newChat, token, isEdit, onSuccess, onError)
    }
}
const sendCreateChatRequest = (newChat, token, isEdit, onSuccess, onError) => {
    let req
    if (isEdit) {
        req = API.put(`secure/chat/room`, { ...newChat }, token)
    } else {
        req = API.post(`secure/chat/room`, { ...newChat }, token)
    }
    req.then((res) => {
        if (res.status === 200) {
            return onSuccess(res, newChat)
        }
        onError(res)
    }).catch((err) => {
        console.log(err)
        onError(err)
    })
}
const formToChatRoomAdapter = (values, membersToAdd, chatId, isEdit) => {
    const {
        name,
        roomType,
        isPublic,
        membersCanAdd,
        memberLimit,
        picture,
        description,
    } = values
    if (isEdit) {
        return {
            chatRoomId: chatId,
            changes: {
                name,
                roomType,
                isPublic,
                membersCanAdd,
                memberLimit,
                picture,
                description,
            },
        }
    }

    return {
        name,
        roomType,
        isPublic,
        membersCanAdd,
        memberLimit,
        picture,
        membersToAdd,
        description,
    }
}
