/** @format */

import { Alert } from 'react-native'
import { api as API } from '../../middleware/api'
import { fetchUserProfile } from '../../../actions'
import _ from 'lodash'
import { refreshChatRoom } from './ChatRoomActions'
import { Logger } from '../../middleware/utils/Logger'
import { DropDownHolder } from '../../../Main/Common/Modal/DropDownModal'
import {
    CHAT_MEMBERS_CANCEL_JOIN_REQUEST,
    CHAT_MEMBERS_CANCEL_JOIN_REQUEST_DONE,
    CHAT_MEMBERS_CANCEL_JOIN_REQUEST_ERROR,
    CHAT_MEMBERS_SEND_JOIN_REQUEST,
    CHAT_MEMBERS_SEND_JOIN_REQUEST_DONE,
    CHAT_MEMBERS_SEND_JOIN_REQUEST_ERROR,
} from './ChatRoomMembersReducers'
import { trackWithProperties, EVENT as E } from '../../../monitoring/segment'
import { SentryRequestBuilder } from '../../../monitoring/sentry'
import {
    SENTRY_MESSAGE_TYPE,
    SENTRY_TAGS,
    SENTRY_MESSAGE_LEVEL,
    SENTRY_CONTEXT,
} from '../../../monitoring/sentry/Constants'

const DEBUG_KEY = '[ChatRoomOptionsActions]'

/**
 * User chooses to mute this chatRoom for duratoin
 * @param {*} duration duration of chatRoom being mute
 * @param {*} chatRoom chatRoom object
 */
export const muteChatRoom = (duration, chatRoom) => (dispatch, getState) => {
    // TODO: jia
    console.log('mute chatroom' + chatRoom + ' for ' + duration)
}

/**
 * Toggle chatroom mute status
 * @param {*} chatRoomId
 * @param {*} isMutedTargetState
 */
export const changeChatRoomMute = (chatRoomId, isMutedTargetState) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    if (isMutedTargetState) {
        // if we want to mute
        API.put(
            'secure/user/settings/muted-chatrooms',
            {
                chatRoomRef: chatRoomId,
            },
            token
        )
            .then((resp) => {
                if (resp.status == 200) {
                    fetchUserProfile(userId)(dispatch, getState)
                } else {
                    Alert.alert(
                        'Error',
                        'Could not mute this chat room. Please try again later'
                    )
                    console.log(
                        `${DEBUG_KEY} error muting chat room`,
                        resp.message
                    )
                }
            })
            .catch((err) => {
                Alert.alert(
                    'Error',
                    'Could not mute this chat room. Please try again later'
                )
                console.log(`${DEBUG_KEY} error muting chat room`, err)
            })
    } else {
        // if we want to unmute
        API.delete(
            `secure/user/settings/muted-chatrooms?chatRoomRef=${chatRoomId}`,
            {},
            token
        )
            .then((resp) => {
                if (resp.status == 200) {
                    fetchUserProfile(userId)(dispatch, getState)
                } else {
                    Alert.alert(
                        'Error',
                        'Could not unmute this chat room. Please try again later'
                    )
                    console.log(
                        `${DEBUG_KEY} error unmuting chat room`,
                        resp.message
                    )
                }
            })
            .catch((err) => {
                Alert.alert(
                    'Error',
                    'Could not unmute this chat room. Please try again later'
                )
                console.log(`${DEBUG_KEY} error unmuting chat room`, err)
            })
    }
}

/**
 * Send join request for a chat room
 * @param {string} chatRoomId
 */
export const sendJoinRequest = (chatRoomId) => (dispatch, getState) => {
    const { token, userId, user } = getState().user
    const onSuccess = (res) => {
        Logger.log(
            `${DEBUG_KEY}: [ sendJointRequest ]: succeed with res:`,
            res,
            2
        )
        DropDownHolder.alert(
            'success',
            'Request sent',
            'Your join request has been sent to the admin.'
        )
        dispatch({
            type: CHAT_MEMBERS_SEND_JOIN_REQUEST_DONE,
            payload: { chatRoomId, userId, user },
        })
    }

    const onError = (res) => {
        Logger.log(
            `${DEBUG_KEY}: [ sendJoinRequest ]: failed with res:`,
            res,
            2
        )
        DropDownHolder.alert(
            'error',
            'Error',
            "We're sorry that some error happened. Please try again later."
        )
        dispatch({
            type: CHAT_MEMBERS_SEND_JOIN_REQUEST_ERROR,
            payload: { chatRoomId },
        })
    }

    // For loading indicator
    dispatch({
        type: CHAT_MEMBERS_SEND_JOIN_REQUEST,
        payload: { chatRoomId },
    })

    API.post('secure/chat/room/members/request', { chatRoomId }, token)
        .then((res) => {
            if (res.status === 200) return onSuccess(res)
            return onError(res)
        })
        .catch((err) => onError(err))
}

/**
 * Cancel join request for user
 * @param {string} chatRoomId
 */
export const cancelJoinRequest = (chatRoomId) => (dispatch, getState) => {
    const { token, userId } = getState().user
    const onSuccess = (res) => {
        Logger.log(
            `${DEBUG_KEY}: [ cancelJoinRequest ]: succeed for user ${userId}: with res:`,
            res,
            2
        )
        DropDownHolder.alert(
            'success',
            'Request canceled',
            'Your join request has been canceled.'
        )
        dispatch({
            type: CHAT_MEMBERS_CANCEL_JOIN_REQUEST_DONE,
            payload: {
                chatRoomId,
                removeeId: userId,
            },
        })
        // TODO: show toaster
    }

    const onError = (res) => {
        Logger.log(
            `${DEBUG_KEY}: [ cancelJoinRequest ]: failed with res:`,
            res,
            2
        )
        DropDownHolder.alert(
            'error',
            'Error',
            "We're sorry that some error happened. Please try again later."
        )
        dispatch({
            type: CHAT_MEMBERS_CANCEL_JOIN_REQUEST_ERROR,
            payload: { chatRoomId },
        })
    }

    // For loading indicator
    dispatch({
        type: CHAT_MEMBERS_CANCEL_JOIN_REQUEST,
        payload: {
            chatRoomId,
            removeeId: userId,
        },
    })

    API.delete(
        `secure/chat/room/members?chatRoomId=${chatRoomId}&removeeId=${userId}`,
        {},
        token
    )
        .then((res) => {
            if (res.status === 200) return onSuccess(res)
            return onError(res)
        })
        .catch((err) => onError(err))
}

/**
 * Invite a list of addee to chat room
 * @param {*} chatRoomId
 * @param {*} addees
 */
export const addMemberToChatRoom = (chatRoomId, addeeIds) => async (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    trackWithProperties(E.CHAT_INTIVE_SENT, {
        UserId: userId,
        ChatId: chatRoomId,
    })
    let failedItems = []

    let addeeIdsFiltered = []
    addeeIds.forEach((maybeAddeeDoc) => {
        if (_.get(maybeAddeeDoc, '_id') !== undefined) {
            addeeIdsFiltered.push(maybeAddeeDoc._id)
        } else {
            addeeIdsFiltered.push(maybeAddeeDoc)
        }
    })

    for (let addeeId of addeeIdsFiltered) {
        // send the message
        const body = {
            chatRoomId,
            addeeId,
        }
        try {
            const resp = await API.post('secure/chat/room/members', body, token)

            if (resp.status !== 200) {
                failedItems.push(addeeId)
                new SentryRequestBuilder(e, SENTRY_MESSAGE_TYPE.ERROR)
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.CHAT.ACTION, 'addMemberToChatRoom')
                    .withExtraContext(SENTRY_CONTEXT.CHAT.CHAT_ID, chatRoomId)
                    .withExtraContext(SENTRY_CONTEXT.CHAT.ADDEE_ID, addeeId)
                    .send()
                // Once we standardize the error logging, this can be removed
                console.error(
                    `${DEBUG_KEY} error adding member to chat room`,
                    resp.message
                )
            }
        } catch (e) {
            failedItems.push(addeeId)
            new SentryRequestBuilder(e, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(SENTRY_TAGS.CHAT.ACTION, 'addMemberToChatRoom')
                .withExtraContext(SENTRY_CONTEXT.CHAT.CHAT_ID, chatRoomId)
                .withExtraContext(SENTRY_CONTEXT.CHAT.ADDEE_ID, addeeId)
                .send()

            // Once we standardize the error logging, this can be removed
            console.error(
                `${DEBUG_KEY} error adding member to chat room`,
                resp.message
            )
        }
    }

    // Refresh chat room regardless of error
    refreshChatRoom(chatRoomId)(dispatch, getState)

    if (failedItems && failedItems.length > 0) {
        let alertMessage =
            'Could not add selected member. Please try again later'
        Alert.alert('Error', alertMessage)
    }
}
