/** @format */

// import { AsyncStorage } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
// const ReactMoE = require('react-native-moengage')

/**
 * Actions for notification tab and general notification like subscribe
 */
import * as Linking from 'expo-linking'
import * as Notifications from 'expo-notifications'
import * as SecureStore from 'expo-secure-store'
import { Alert, Platform } from 'react-native'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import messaging from '@react-native-firebase/messaging'

// Components
import { DropDownHolder } from '../../../Main/Common/Modal/DropDownModal'

import {
    isString,
    queryBuilderBasicBuilder,
    isSharedPost,
} from '../../middleware/utils'
import { api as API } from '../../middleware/api'

import { openProfile } from '../../../actions'

import { openGoalDetailById, openGoalDetail } from '../home/mastermind/actions'

import { openPostDetailById, openPostDetail } from '../feed/post/PostActions'

import { openShareDetail, openShareDetailById } from '../feed/post/ShareActions'

import { myTribeDetailOpenWithId } from '../tribe/MyTribeActions'

import { myEventDetailOpenWithId } from '../event/MyEventActions'

/* Utils */
import { Logger } from '../../middleware/utils/Logger'

import ReactMoE from 'react-native-moengage'

import {
    NOTIFICATION_UNSUBSCRIBE,
    NOTIFICATION_SUBSCRIBE,
    NOTIFICATION_DELETE,
    NOTIFICATION_DELETE_SUCCESS,
    NOTIFICATION_DELETE_FAIL,
    NOTIFICATION_UNREAD_LOAD,
    NOTIFICATION_UNREAD_MARK_AS_READ,
    NOTIFICATION_UNREAD_MARK_AS_READ_BY_PARSEDNOTI,
} from './NotificationTabReducers'
import LiveChatService from '../../../socketio/services/LiveChatService'
import {
    EVENT as E,
    track,
    trackWithProperties,
} from '../../../monitoring/segment'

import { SentryRequestBuilder } from '../../../monitoring/sentry'
import {
    SENTRY_TAGS,
    SENTRY_MESSAGE_LEVEL,
    SENTRY_TAG_VALUE,
    SENTRY_MESSAGE_TYPE,
} from '../../../monitoring/sentry/Constants'
import { identifyWithTraits } from 'expo-analytics-segment'

const BASE_ROUTE = 'secure/notification'
const DEBUG_KEY = '[ Action Notification ]'
const NOTIFICATION_TOKEN_KEY = 'notification_token_key'
const NOTIFICATION_ALERT_SHOWN = 'notification_alert_shown'
const NOTIFICATION_UNREAD_QUEUE_PREFIX = 'notification_unread_queue_prefix'
const HAS_RUN_BEFORE = '@global:hasRunBefore'

const isValidItem = (item) =>
    item !== undefined && item !== null && !_.isEmpty(item)

/**
 * Handle when push notification is selected
 *
 * /goal/goalId/comment/commentId
 * /goal/goalId/smsplanner
 * /post/postId
 * /post/postId/comment/commentId
 * /post/postId/postType/{Enum:["General", "..."]} (If not General, then it's share)
 * /user/userId
 * /event/eventId
 * /tribe/tribeId
 *
 * @param {Object} notification
 */
export const handlePushNotification = (notification) => (
    dispatch,
    getState
) => {
    Logger.log(`${DEBUG_KEY}: notification is:`, notification, 2)
    const { data, origin, remote } = notification

    if (!data || !data.path) {
        console.warn(
            `${DEBUG_KEY}: [ _handleNotification ]: Invalid notification data:`,
            data
        )
        return
    }
    const path = data.path.split('/').filter((a) => a !== '')
    const entityType = path[0]
    const entityId = path[1]

    if (
        !entityId ||
        !entityType ||
        entityId.trim() === '' ||
        entityType.trim() === ''
    ) {
        console.warn(
            `${DEBUG_KEY}: [ _handleNotification ]: Invalid notification data path:`,
            data
        )
        return
    }

    // When user pressed on notification. origin is marked as selected.
    if (origin !== 'selected') {
        Logger.log(
            `${DEBUG_KEY}: [ handlePushNotification ]: unselected notification`,
            notification,
            5
        )
        return
    }

    trackWithProperties(E.NOTIFICATION_SELECTED, {
        Type: entityType,
        Id: entityId,
        Item: notification,
        source: 'push notification',
    })

    // Mark this notification as read
    if (data && data.notificationId) {
        markNotifAsReadById(data.notificationId)(dispatch, getState)
    } else {
        markNotifAsReadByEntity({ parsedNoti: data })(dispatch, getState)
    }

    if (entityType === 'goal') {
        let initialProps = {}
        if (path.length > 3) {
            if (path[2] === 'smsplanner' && path[3] === 'true') {
                initialProps = { ...initialProps, showCaret: true }
            }

            if (path[2] === 'comment' && !_.isEmpty(path[3])) {
                initialProps = {
                    ...initialProps,
                    focusType: 'comment',
                    focusRef: undefined,
                    initialScrollToComment: true,
                    commentId: path[3],
                }
            }
        }

        return openGoalDetailById(entityId, initialProps)(dispatch, getState)
    }

    if (entityType === 'user') {
        return openProfile(entityId)(dispatch, getState)
    }

    if (entityType === 'post') {
        let initialProps = {}
        if (path.length > 3) {
            if (path[2] === 'comment' && !_.isEmpty(path[3])) {
                initialProps = {
                    ...initialProps,
                    initialScrollToComment: true,
                    commentId: path[3],
                }
            }
        }

        if (checkIfShare(path)) {
            return openShareDetailById(entityId, initialProps)(
                dispatch,
                getState
            )
        } else {
            return openPostDetailById(entityId, initialProps)(
                dispatch,
                getState
            )
        }
    }

    if (entityType === 'event') {
        return myEventDetailOpenWithId(entityId)(dispatch, getState)
    }

    if (entityType === 'tribe') {
        let props = {}
        if (path.length === 3 && path[2] == 'request') {
            // handle path /tribe/{tribeId}/request
            props = { initialRoute: 'request' }
        }
        return myTribeDetailOpenWithId(entityId, props)(dispatch, getState)
    }

    if (entityType === 'chatroom') {
        if (!LiveChatService.isUserMounted) {
            LiveChatService.oneUserMounted(() =>
                setTimeout(
                    () =>
                        Actions.push('chatRoomConversation', {
                            chatRoomId: entityId,
                            showInitialLoader: true,
                        }),
                    1000
                )
            )
        } else {
            Actions.push('chatRoomConversation', {
                chatRoomId: entityId,
                showInitialLoader: true,
            })
        }
        return
    }

    // This is for navigation push notification
    if (entityType === 'navigation') {
        // path: navigation/friends to open friends tab
        if (entityId === 'friends') {
            Actions.push('friendsTab')
            return
        }

        // path: navigation/home/create-goal
        if (entityId === 'home') {
            if (path[2] && path[2] === 'create-goal') {
                Actions.jump('homeTab')
                // Actions.reset('home');
                setTimeout(() => {
                    Actions.createGoalModal()
                }, 500)
                return
            }
        }
    }
}

/**
 * If postType and its subsequent field is not General, then this is a share notification
 * @param {array} path
 */
const checkIfShare = (path = []) => {
    const postTypeIndex = path.findIndex((p) => p === 'postType')
    if (postTypeIndex === -1) return false
    if (
        path.length > postTypeIndex + 1 &&
        isSharedPost(path[postTypeIndex + 1])
    ) {
        return true
    }
    return false
}

/**
 *
 * @param {*} parsedNoti:{notificationMessage, icon, path}
 */
export const openNotificationDetail = (item) => (dispatch, getState) => {
    // TODO: use the parsedNoti.path to determine which detail to open
    // console.log(`${DEBUG_KEY}: [ openNotificationDetail ]: item is:`, item);
    if (!item) {
        console.warn(
            `${DEBUG_KEY}: [ openNotificationDetail ]: invalid notification item:`,
            item
        )
        return
    }
    const { parsedNoti, _id } = item
    console.log('item', item)
    console.log('parsedNoti', parsedNoti)
    const { path } = parsedNoti
    if (!isString(path)) {
        console.warn(`${DEBUG_KEY}: path in parsedNoti is not string: `, path)
        return
    }
    const p = path.split('/')
    console.log('this is p ', p)
    if (p.length < 2) {
        console.warn(`${DEBUG_KEY}: malformatted path:`, path)
        return
    }

    const entityType = p[0]
    const entityId = p[1]

    trackWithProperties(E.NOTIFICATION_DETAIL_OPENED, {
        Type: entityType,
        Id: entityId,
        Item: item,
    })

    // Mark this notification as read
    markNotifAsReadById(_id)(dispatch, getState)

    if (entityType === 'user') {
        // Open user goal list page

        return openProfile(entityId)(dispatch, getState)
    }

    if (entityType === 'post') {
        let initialProps = {}
        if (p.length > 3) {
            if (p[2] === 'comment' && !_.isEmpty(p[3])) {
                initialProps = {
                    ...initialProps,
                    initialScrollToComment: true,
                    commentId: p[3],
                }
            }
        }

        if (
            checkIfShare(p) ||
            (item.postRef &&
                item.postRef.postType &&
                item.postRef.postType.startsWith('Share'))
        ) {
            return openShareDetailById(entityId, initialProps)(
                dispatch,
                getState
            )
        } else {
            if (isValidItem(item.postRef)) {
                return openPostDetail(item.postRef, initialProps)(
                    dispatch,
                    getState
                )
            }
            return openPostDetailById(entityId, initialProps)(
                dispatch,
                getState
            )
        }
    }

    if (entityType === 'goal') {
        let initialProps = {}
        if (item.commentRef) {
            initialProps = {
                focusType: 'comment',
                focusRef: undefined,
                initialShowSuggestionModal: false,
            }
        }

        if (p.length > 3) {
            if (p[2] === 'smsplanner' && p[3] === 'true') {
                initialProps = { ...initialProps, showCaret: true }
            }

            if (p[2] === 'comment' && !_.isEmpty(p[3])) {
                initialProps = {
                    ...initialProps,
                    focusType: 'comment',
                    focusRef: undefined,
                    initialScrollToComment: true,
                    commentId: p[3],
                }
            }
        }

        console.log(`${DEBUG_KEY}: initialProps: `, initialProps)
        console.log(`${DEBUG_KEY}: path: `, p)
        if (isValidItem(item.goalRef)) {
            return openGoalDetail(item.goalRef, initialProps)(
                dispatch,
                getState
            )
        }
        return openGoalDetailById(entityId, initialProps)(dispatch, getState)
    }

    if (entityType === 'event') {
        return myEventDetailOpenWithId(entityId)(dispatch, getState)
    }

    if (entityType === 'tribe') {
        let props = {}
        if (p.length === 3 && p[2] == 'request') {
            // handle path /tribe/{tribeId}/request
            props = { initialRoute: 'request' }
        }
        return myTribeDetailOpenWithId(entityId, props)(dispatch, getState)
    }

    if (entityType === 'chatroom') {
        Actions.push('chatRoomConversation', { chatRoomId: entityId })
        return
    }
}

/**
 * User clicks to see more
 * @param type: ['notifications', 'needs']
 */
export const seeMore = (type) => (dispatch, getState) => {}

//RESGISTERING DEVICE WITH FCM FOR MOENGAGE
export const getFcmToken = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages()

    // Get the token
    const token = await messaging().getToken()
    console.log('FCM TOKEN', token)

    ReactMoE.passFcmPushToken(token)
    // Save the token
}

/**
 * Ask user for notification token to send over to subscribe for notification
 */
export const subscribeNotification = () => async (dispatch, getState) => {
    const { token, userId, user } = getState().user
    const { status: existingStatus } = await Notifications.getPermissionsAsync()

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        let finalStatus = existingStatus
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        console.log(
            `${DEBUG_KEY}: asking for notification permit status: `,
            existingStatus
        )

        // Every user should have his / her notification token set
        const USER_NOTIFICATION_ALERT_SHOWN = `${userId}_${NOTIFICATION_ALERT_SHOWN}`

        // request again for iOS
        if (Platform.OS == 'ios') {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            // we use AsyncStorage so that we can clear SecureStore every time the app is reinstalled (otherwise SecureStore persists on the keychain forever)
            if (!(await AsyncStorage.getItem(HAS_RUN_BEFORE))) {
                AsyncStorage.setItem(HAS_RUN_BEFORE, 'true')
                // await SecureStore.setItemAsync(
                //     USER_NOTIFICATION_ALERT_SHOWN,
                //     `0`,
                //     {}
                // )
                await AsyncStorage.setItem(USER_NOTIFICATION_ALERT_SHOWN, `0`)
            }

            // try and let the user know to update their settings
            // const hasShown = await SecureStore.getItemAsync(
            //     USER_NOTIFICATION_ALERT_SHOWN,
            //     {}
            // )
            const hasShown = await AsyncStorage.getItem(
                USER_NOTIFICATION_ALERT_SHOWN,
                {}
            )
            const hasShownNumber = hasShown ? parseInt(hasShown) : 0
            if (hasShownNumber > 1) {
                // We have shown notification enabling for more than 2 times
                return
            }
            Alert.alert(
                'Notifications',
                'To subscribe to notifications, change your app settings',
                [
                    {
                        text: 'Settings',
                        onPress: () => {
                            Linking.openURL('app-settings:')
                            trackWithProperties(E.ONBOARDING_STEP_COMPLETED, {
                                notification_enabled: true,
                            })
                            identifyWithTraits(userId, {
                                notificationEnabled: true,
                            })
                        },
                    },
                    {
                        text: 'Cancel',
                        onPress: () => {
                            console.log('User cancel share to enable')
                            trackWithProperties(E.ONBOARDING_STEP_COMPLETED, {
                                notification_enabled: false,
                            })
                            identifyWithTraits(userId, {
                                notificationEnabled: false,
                            })
                        },

                        style: 'cancel',
                    },
                ]
            )
            // Update alert count
            // await SecureStore.setItemAsync(
            //     USER_NOTIFICATION_ALERT_SHOWN,
            //     `${hasShownNumber + 1}`,
            //     {}
            // )
            await AsyncStorage.setItem(
                USER_NOTIFICATION_ALERT_SHOWN,
                `${hasShownNumber + 1}`
            )
            return
        }
    }

    // Get the token that uniquely identifies this device
    const {
        status: existingStatuss,
    } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatuss
    console.log('push token', existingStatuss)
    if (existingStatuss !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!')
        return
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'GoalMogul',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: 'blue',
            showBadge: true,
        })
        // Notifications.setNotificationChannelAsync('default', {
        //     name: 'default',
        //     importance: Notifications.AndroidImportance.MAX,
        //     vibrationPattern: [0, 250, 250, 250],
        //     lightColor: 'blue',
        // })
    }
    const notificationToken = await Notifications.getDevicePushTokenAsync()

    console.log('push token', notificationToken)

    // if (Platform.OS === 'android') {
    //     Notifications.setNotificationChannelAsync("default", {
    //         name: "GoalMogul",
    //         importance: Notifications.AndroidImportance.MAX,
    //         vibrationPattern: [0, 250, 250, 250],
    //         lightColor: "#FF231F7C",
    //         showBadge: true,
    //       });
    //     // Notifications.setNotificationChannelAsync('default', {
    //     //     name: 'default',
    //     //     importance: Notifications.AndroidImportance.MAX,
    //     //     vibrationPattern: [0, 250, 250, 250],
    //     //     lightColor: 'blue',
    //     // })
    // }
    // Get the token that an user has on this device
    // const hasToken = await SecureStore.getItemAsync(NOTIFICATION_TOKEN_KEY, {})

    const hasToken = await AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY)

    if (hasToken && hasToken !== '' && _.isEqual(hasToken, notificationToken)) {
        // Only if user has a token stored and cuurent fetched token is the same as the previous one
        // We skip the check
        console.log(
            `${DEBUG_KEY}: user has already provided the notification token: `,
            hasToken
        )
        return // Notification Token is already stored
    }

    const onSuccess = async (res) => {
        // await SecureStore.setItemAsync(
        //     NOTIFICATION_TOKEN_KEY,
        //     notificationToken,
        //     {}
        // )
        // await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, notificationToken)
        console.log('notificationToken', notificationToken)
        // ReactMoE.passFcmPushToken(notificationToken)

        console.log(
            `${DEBUG_KEY}: register notification succeed success with res: `,
            res
        )
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: register notification failed with err: `,
            err
        )
        new SentryRequestBuilder(res, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.INFO)
            .withTag(
                SENTRY_TAGS.ACTION.UNSUBSCRIBE_NOTIFICATIONS,
                SENTRY_TAG_VALUE.ACTIONS.FAILED
            )
            .withExtraContext(SENTRY_TAGS.ACTION.USERNAME, username)
            .send()
    }

    // POST the token to your backend server from
    // where you can retrieve it to send push notifications.

    return API.put(
        'secure/user/settings/device-token',
        { pushToken: JSON.stringify(notificationToken) },
        token
    )
        .then((res) => {
            // All 200 status imply success
            if (res.status >= 200 && res.status < 300) {
                console.log('NOTIFICATION RESPONSE', res)
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => {
            console.log('ERROR', err)
            onError(err)
        })
}

/**
 * unsubscribe notifications
 */
export const unsubscribeNotifications = () => async (dispatch, getState) => {
    const { token } = getState().user

    // Get the token that uniquely identifies this device
    // const notificationToken = await SecureStore.getItemAsync(
    //     NOTIFICATION_TOKEN_KEY
    // )
    const notificationToken = await AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY)

    const onSuccess = async (res) => {
        // await SecureStore.deleteItemAsync(NOTIFICATION_TOKEN_KEY)
        await AsyncStorage.removeItem(NOTIFICATION_TOKEN_KEY)
        console.log(
            `${DEBUG_KEY}: register notification succeed success with res: `,
            res
        )
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: register notification failed with err: `,
            err
        )
        new SentryRequestBuilder(res, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.INFO)
            .withTag(
                SENTRY_TAGS.ACTION.UNSUBSCRIBE_NOTIFICATIONS,
                SENTRY_TAG_VALUE.ACTIONS.FAILED
            )
            .withExtraContext(SENTRY_TAGS.ACTION.USERNAME, {
                username,
                notificationToken,
            })
            .send()
    }

    // POST the token to your backend server from
    // where you can retrieve it to send push notifications.
    return API.delete(
        'secure/user/settings/expo-token',
        { pushToken: notificationToken },
        token
    )
        .then((res) => {
            // All 200 status imply success
            if (res.status >= 200 && res.status < 300) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * User subscribes to the notification of an entity
 */
export const subscribeEntityNotification = (entityId, entityKind) => (
    dispatch,
    getState
) => {
    const { token } = getState().user

    const onSuccess = (res) => {
        console.log(
            `${DEBUG_KEY}: subscribe notification for entity: ${entityId}, type: ${entityKind}
      succeed with res: `,
            res
        )
        dispatch({
            type: NOTIFICATION_SUBSCRIBE,
            payload: {
                entityId,
                entityKind,
            },
        })

        setTimeout(() => {
            console.log(
                `${DEBUG_KEY}: [ subscribeEntityNotification ]: showing alert`
            )
            DropDownHolder.alert(
                'success',
                'Successfully subscribed to notifications',
                ''
            )
        }, 200)
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: subscribe notification for entity: ${entityId}, type: ${entityKind} 
      failed with error: `,
            err
        )
    }

    API.put(
        `${BASE_ROUTE}/subscription`,
        {
            entityId,
            entityKind,
        },
        token
    )
        .then((res) => {
            if (res.status === 200) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * User unsubscribes from the notification of an entity
 */
export const unsubscribeEntityNotification = (entityId, entityKind) => (
    dispatch,
    getState
) => {
    const requestBody = {
        entityId,
        entityKind,
    }

    const onSuccess = (res) => {
        console.log(
            `${DEBUG_KEY}: unsubscribe notification for entity: ${entityId}, type: ${entityKind}
      succeed with res: `,
            res
        )
        dispatch({
            type: NOTIFICATION_UNSUBSCRIBE,
            payload: {
                entityId,
                entityKind,
            },
        })
        setTimeout(() => {
            console.log(
                `${DEBUG_KEY}: [ unsubscribeEntityNotification ]: showing alert`
            )
            DropDownHolder.alert(
                'success',
                'Successfully unsubscribed to notifications',
                ''
            )
        }, 200)
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: unsubscribe notification for entity: ${entityId},  
      type: ${entityKind} failed with error: `,
            err
        )
    }

    unsubscribeNotification(requestBody, onSuccess, onError)(dispatch, getState)
}

/**
 * User unsubscribes from the notification of a stream
 */
export const unsubscribeStreamNotification = (notificationStreamRef) => (
    dispatch,
    getState
) => {
    const requestBody = {
        notificationStreamRef,
    }

    const onSuccess = (res) => {
        console.log(
            `${DEBUG_KEY}: unsubscribe notification for streamRef: ${notificationStreamRef} 
      succeed with res: `,
            res
        )
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: unsubscribe notification for entity: ${notificationStreamRef}  
      failed with error: `,
            err
        )
    }

    unsubscribeNotification(requestBody, onSuccess, onError)(dispatch, getState)
}

/**
 * Helper function to unsubscribe a notification
 * @param {} requestBody
 * @param {*} onSuccess
 * @param {*} onError
 */
const unsubscribeNotification = (requestBody, onSuccess, onError) => (
    dispatch,
    getState
) => {
    const { token } = getState().user

    API.delete(
        `${BASE_ROUTE}/subscription?${queryBuilderBasicBuilder(requestBody)}`,
        {},
        token
    )
        .then((res) => {
            if (res.status === 200) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * User deletes a notification
 */
export const removeNotification = (notificationId) => (dispatch, getState) => {
    const { token } = getState().user

    dispatch({
        type: NOTIFICATION_DELETE,
        payload: {
            type: 'notifications',
            notificationId,
        },
    })

    const onSuccess = (res) => {
        console.log(
            `${DEBUG_KEY}: delete notification with id: ${notificationId} 
      success with res: `,
            res
        )
        dispatch({
            type: NOTIFICATION_DELETE_SUCCESS,
            payload: {
                type: 'notifications',
                notificationId,
            },
        })
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: delete notification with id: ${notificationId} 
      failed with err: `,
            err
        )
        dispatch({
            type: NOTIFICATION_DELETE_FAIL,
            payload: {
                type: 'notifications',
                notificationId,
            },
        })
    }

    API.delete(`${BASE_ROUTE}/entity/${notificationId}`, {}, token)
        .then((res) => {
            if (res.status === 200) {
                return onSuccess(res)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/* Actions related to unread notification */
export const loadUnreadNotification = () => async (dispatch, getState) => {
    const { userId } = getState().user
    const unReadNotificationKey = `${NOTIFICATION_UNREAD_QUEUE_PREFIX}_${userId}`

    // SecureStore has a limit of 2048 bytes. Thus use AsyncStorage to store unread notif
    // which can potentially be 10k bytes.
    // const unreadQueue = await SecureStore.getItemAsync(unReadNotificationKey, {});
    const unreadQueue = await AsyncStorage.getItem(unReadNotificationKey)

    // Deserialize the json serialized object
    const parsedUnreadQueue = JSON.parse(unreadQueue)
    Logger.log(
        `${DEBUG_KEY}: [loadUnreadNotification]: get unread notification queue with res:`,
        parsedUnreadQueue ? parsedUnreadQueue.length : 0,
        2
    )

    if (!parsedUnreadQueue || _.isEmpty(parsedUnreadQueue)) {
        console.log(
            `${DEBUG_KEY}: [ Load Unread Queue ] abort as queue empty:`,
            parsedUnreadQueue
        )
        return
    }

    dispatch({
        type: NOTIFICATION_UNREAD_LOAD,
        payload: {
            data: parsedUnreadQueue,
        },
    })
}

/**
 * Mark a notification as read by comparing its parsedNoti.
 * This is used by push notification given that it's only passing parsedNoti
 * @param {object} parsedNoti
 */
export const markNotifAsReadByEntity = ({ parsedNoti }) => (
    dispatch,
    getState
) => {
    dispatch({
        type: NOTIFICATION_UNREAD_MARK_AS_READ_BY_PARSEDNOTI,
        payload: {
            parsedNoti,
        },
    })
}

// User opens up one notification and mark it as read
export const markNotifAsReadById = (notificationId) => (dispatch, getState) => {
    dispatch({
        type: NOTIFICATION_UNREAD_MARK_AS_READ,
        payload: {
            notificationId,
        },
    })
}

// On user logout or app state change, we store the unread notification
export const saveUnreadNotification = () => async (dispatch, getState) => {
    const { userId } = getState().user
    const { data } = getState().notification.unread
    const unReadNotificationKey = `${NOTIFICATION_UNREAD_QUEUE_PREFIX}_${userId}`

    if (!data || data.length === 0) {
        console.log(
            `${DEBUG_KEY}: [Save Unread Notification] abort as no data to save`
        )
        return
    }

    const dataToStore = JSON.stringify(data)
    console.log(
        `${DEBUG_KEY}: [Save Unread Notification] data to store has length:`,
        data.length
    )

    // SecureStore has a limit of 2048 bytes. Thus use AsyncStorage to store unread notif
    // which can potentially be 10k bytes.
    const res = await AsyncStorage.setItem(unReadNotificationKey, dataToStore)
    console.log(`${DEBUG_KEY}: [Save Unread Notification] done with res: `, res)
    return
}
