/** @format */

import {
    CHAT_MEMBERS_SWITCH_TAB,
    CHAT_MEMBERS_RESET_STATE,
    CHAT_MEMBERS_REFRESH_COMPLETE,
    CHAT_MEMBERS_REFRESH_BEGIN,
} from './ChatRoomMembersReducers'
import { refreshChatRoom } from './ChatRoomActions'
import { Alert } from 'react-native'
import { api as API } from '../../middleware/api'
import {
    track,
    trackWithProperties,
    EVENT as E,
} from '../../../monitoring/segment'
import { SentryRequestBuilder } from '../../../monitoring/sentry'
import {
    SENTRY_MESSAGE_TYPE,
    SENTRY_MESSAGE_LEVEL,
    SENTRY_CONTEXT,
    SENTRY_TAGS,
} from '../../../monitoring/sentry/Constants'

const DEBUG_KEY = '[ UI ChatRoomMembersActions ]'

export const resetChatMembersTab = () => (dispatch) => {
    dispatch({
        type: CHAT_MEMBERS_RESET_STATE,
        payload: {},
    })
}

export const selectChatMembersTab = (index) => (dispatch) => {
    dispatch({
        type: CHAT_MEMBERS_SWITCH_TAB,
        payload: {
            index,
        },
    })
}

export const refreshChatMembersTab = (currentChatRoomId) => (
    dispatch,
    getState
) => {
    dispatch({
        type: CHAT_MEMBERS_REFRESH_BEGIN,
        payload: {},
    })
    const callback = (err, updatedChatRoom) => {
        /** We don't handle the error at the moment since the {@link refreshChatRoom} method already displays an alert. */
        // if (err) {
        //     Alert.alert('Error', 'Could not refresh members list.');
        // };
        dispatch({
            type: CHAT_MEMBERS_REFRESH_COMPLETE,
            payload: {},
        })
    }
    refreshChatRoom(currentChatRoomId, callback)(dispatch, getState)
}

export const promoteChatMember = (memberId, chatRoomId) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    API.post(
        'secure/chat/room/members/admin',
        {
            chatRoomId,
            promoteeId: memberId,
        },
        token
    )
        .then((resp) => {
            if (resp.status != 200) {
                Alert.alert(
                    'Error',
                    'Could not promote member. Please try again later.'
                )
                // TODO: error logging standardization
                console.log(`${DEBUG_KEY} error promoting member`, res.message)
                new SentryRequestBuilder(resp, SENTRY_MESSAGE_TYPE.MESSAGE)
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.CHAT.ACTION, 'promoteChatMember')
                    .withExtraContext(SENTRY_CONTEXT.CHAT.CHAT_ID, chatRoomId)
                    .withExtraContext(SENTRY_CONTEXT.CHAT.PROMOTEE_ID, memberId)
                    .send()
            } else {
                trackWithProperties(E.CHATROOM_MEMBER_PROMOTED, {
                    MemberId: memberId,
                    ChatRoomId: chatRoomId,
                    UserId: userId,
                })
                refreshChatMembersTab(chatRoomId)(dispatch, getState)
            }
        })
        .catch((err) => {
            Alert.alert(
                'Error',
                'Could not promote member. Please try again later.'
            )
            // TODO: error logging standardization
            console.log(`${DEBUG_KEY} error promoting member`, err)
            new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(SENTRY_TAGS.CHAT.ACTION, 'promoteChatMember')
                .withExtraContext(SENTRY_CONTEXT.CHAT.CHAT_ID, chatRoomId)
                .withExtraContext(SENTRY_CONTEXT.CHAT.PROMOTEE_ID, memberId)
                .send()
        })
}
export const demoteChatMember = (memberId, chatRoomId) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    API.delete(
        `secure/chat/room/members/admin?chatRoomId=${chatRoomId}&demoteeId=${memberId}`,
        {},
        token
    )
        .then((resp) => {
            if (resp.status != 200) {
                Alert.alert(
                    'Error',
                    'Could not demote member. Please try again later.'
                )
                // TODO: error logging standardization
                console.log(`${DEBUG_KEY} error demoting member`, res.message)

                new SentryRequestBuilder(resp, SENTRY_MESSAGE_TYPE.MESSAGE)
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.CHAT.ACTION, 'demoteChatMember')
                    .withExtraContext(SENTRY_CONTEXT.CHAT.CHAT_ID, chatRoomId)
                    .withExtraContext(SENTRY_CONTEXT.CHAT.DEMOTEE_ID, memberId)
                    .send()
            } else {
                trackWithProperties(E.CHATROOM_MEMBER_DEMOTED, {
                    MemberId: memberId,
                    ChatRoomId: chatRoomId,
                    UserId: userId,
                })
                refreshChatMembersTab(chatRoomId)(dispatch, getState)
            }
        })
        .catch((err) => {
            Alert.alert(
                'Error',
                'Could not demote member. Please try again later.'
            )
            // TODO: error logging standardization
            console.log(`${DEBUG_KEY} error demoting member`, err)
            new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(SENTRY_TAGS.CHAT.ACTION, 'demoteChatMember')
                .withExtraContext(SENTRY_CONTEXT.CHAT.CHAT_ID, chatRoomId)
                .withExtraContext(SENTRY_CONTEXT.CHAT.DEMOTEE_ID, memberId)
                .send()
        })
}
export const acceptChatMemberJoinRequest = (memberId, chatRoomId) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    API.post(
        'secure/chat/room/members/request/accept',
        {
            chatRoomId,
            requesterId: memberId,
        },
        token
    )
        .then((resp) => {
            if (resp.status != 200) {
                Alert.alert(
                    'Error',
                    'Could not accept request. Please try again later.'
                )
                console.log(
                    `${DEBUG_KEY} error accepting member request`,
                    res.message
                )

                new SentryRequestBuilder(resp, SENTRY_MESSAGE_TYPE.MESSAGE)
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(
                        SENTRY_TAGS.CHAT.ACTION,
                        'acceptChatMemberJoinRequest'
                    )
                    .withExtraContext(SENTRY_CONTEXT.CHAT.CHAT_ID, chatRoomId)
                    .withExtraContext(SENTRY_CONTEXT.CHAT.MEMBER_ID, memberId)
                    .send()
            } else {
                trackWithProperties(E.CHATROOM_JOIN_REQUEST_ACCEPTED, {
                    MemberId: memberId,
                    ChatRoomId: chatRoomId,
                    UserId: userId,
                })
                refreshChatMembersTab(chatRoomId)(dispatch, getState)
            }
        })
        .catch((err) => {
            Alert.alert(
                'Error',
                'Could not accept request. Please try again later.'
            )
            console.log(`${DEBUG_KEY} error accepting member request`, err)

            new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(SENTRY_TAGS.CHAT.ACTION, 'acceptChatMemberJoinRequest')
                .withExtraContext(SENTRY_CONTEXT.CHAT.CHAT_ID, chatRoomId)
                .withExtraContext(SENTRY_CONTEXT.CHAT.MEMBER_ID, memberId)
                .send()
        })
}
export const removeChatMember = (memberId, chatRoomId, maybeCallback) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    API.delete(
        `secure/chat/room/members?chatRoomId=${chatRoomId}&removeeId=${memberId}`,
        {},
        token
    )
        .then((resp) => {
            if (resp.status != 200) {
                console.log(`${DEBUG_KEY} error removing member`, resp.message)
                if (maybeCallback) {
                    // maybeCallback should handle Alerting to prevent double alerting due to different usecases
                    maybeCallback && maybeCallback(new Error(resp.message))
                } else {
                    Alert.alert(
                        'Error',
                        'Could not remove member. Please try again later.'
                    )
                }
                new SentryRequestBuilder(resp, SENTRY_MESSAGE_TYPE.MESSAGE)
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.CHAT.ACTION, 'removeChatMember')
                    .withExtraContext(SENTRY_CONTEXT.CHAT.CHAT_ID, chatRoomId)
                    .withExtraContext(SENTRY_CONTEXT.CHAT.MEMBER_ID, memberId)
                    .send()
            } else {
                trackWithProperties(E.CHATROOM_MEMBER_REMOVED, {
                    MemberId: memberId,
                    ChatRoomId: chatRoomId,
                    UserId: userId,
                })
                maybeCallback && maybeCallback(null, true)
                refreshChatMembersTab(chatRoomId)(dispatch, getState)
            }
        })
        .catch((err) => {
            Alert.alert(
                'Error',
                'Could not remove member. Please try again later.'
            )
            console.log(`${DEBUG_KEY} error removing member`, err)
            maybeCallback && maybeCallback(err)
            new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(SENTRY_TAGS.CHAT.ACTION, 'removeChatMember')
                .withExtraContext(SENTRY_CONTEXT.CHAT.CHAT_ID, chatRoomId)
                .withExtraContext(SENTRY_CONTEXT.CHAT.MEMBER_ID, memberId)
                .send()
        })
}
