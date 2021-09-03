/** @format */

import {
    NOTIFICATION_REFRESH_SUCCESS,
    NOTIFICATION_REFRESH,
    NOTIFICATION_LOAD,
    NOTIFICATION_LOAD_SUCCESS,
    NOTIFICATION_LOAD_FAIL,
    NOTIFICATION_SEE_MORE,
    NOTIFICATION_SEE_LESS,
    NOTIFICATION_UNREAD_COUNT_UPDATE,
    NOTIFICATION_MARK_ALL_READ,
    NOTIFICATION_REFRESH_FAIL,
} from './NotificationTabReducers'

import { queryBuilder } from '../../middleware/utils'
import { api as API } from '../../middleware/api'
import { Logger } from '../../middleware/utils/Logger'

import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

// Constants
const DEBUG_KEY = '[ Actions NotificationTab ]'
const BASE_ROUTE = 'secure/notification'

/**
 * clicks to see more notification for a type
 * @param type: ['needs', 'notifications']
 */
export const seeMoreNotification = (type) => (dispatch) => {
    dispatch({
        type: NOTIFICATION_SEE_MORE,
        payload: {
            type,
        },
    })
}

/**
 * clicks to see less notification for a type
 * @param type: ['needs', 'notifications']
 */
export const seeLessNotification = (type) => (dispatch) => {
    dispatch({
        type: NOTIFICATION_SEE_LESS,
        payload: {
            type,
        },
    })
}

/* Following are actions to load notifications */

/**
 * Refresh notifications and needs
 */
export const refreshNotificationTab = () => (dispatch, getState) => {
    refreshNotifications({
        refreshForUnreadNotif: true,
        shouldRefreshNeeds: true,
    })(dispatch, getState)
    // refreshNeeds()(dispatch, getState);
}

export const setBadgeNumberAsyncByPlatform = Platform.select({
    ios: async (number) => {
        // console.log('THIS IS NUMBER OF NOTIFICATION', number)
        Notifications.setBadgeCountAsync(number)
    },

    // TODO: android: investigate why Notifications.setBadgeNumberAsync throws errors
    android: async (number) => {},
})

/**
 * refreshNeeds: boolean to determine should refresh needs on notification loads
 * refreshForUnreadNotif: boolean to determine should refresh unread notif
 *
 * @param {object} param: { refreshForUnreadNotif, shouldRefreshNeeds }
 */
export const refreshNotifications = (params) => (dispatch, getState) => {
    const { skip, limit, refreshing } = getState().notification.notifications

    const { refreshForUnreadNotif, shouldRefreshNeeds } = params
    const skipToUse = refreshForUnreadNotif ? 0 : skip

    // if (refreshing) return; // Do not refresh again if already refreshing
    if (
        params === undefined ||
        params.showIndicator === undefined ||
        params.showIndicator === true
    ) {
        dispatch({
            type: NOTIFICATION_REFRESH,
            payload: {
                type: 'notifications',
            },
        })
    }

    const onSuccess = (res) => {
        // Clear app badge count
        setBadgeNumberAsyncByPlatform(0)

        Logger.log(
            `${DEBUG_KEY}: refresh notifications succeed with res length: `,
            res.notis.length,
            3
        )
        const data = res.notis
        dispatch({
            type: NOTIFICATION_REFRESH_SUCCESS,
            payload: {
                refresh: refreshForUnreadNotif,
                type: 'notifications',
                data,
                skip: skipToUse + data.length, // The first refresh we use 0, but the next refresh we use the skip
                limit,
                hasNextPage: !(data === undefined || data.length === 0),
            },
        })

        if (refreshForUnreadNotif && data.length <= limit) {
            console.log(
                `${DEBUG_KEY}: refresh notification again since data.length ${data.length} is smaller than limit ${limit}`
            )
            refreshNotifications({
                refreshForUnreadNotif: false,
                shouldRefreshNeeds,
            })(dispatch, getState)
            return
        }

        // Should refresh notification needs. This function will be called after notification is loaded
        if (shouldRefreshNeeds) {
            refreshNeeds()(dispatch, getState)
        }
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: refresh notifications failed with err: `,
            err
        )
        dispatch({
            type: NOTIFICATION_LOAD_FAIL,
            payload: {
                type: 'notifications',
            },
        })
    }

    // Because for server, refresh: true will only pull in new notifications
    const paramsToPass = refreshForUnreadNotif ? { refresh: true } : {}

    loadNotifications(
        skipToUse,
        limit,
        paramsToPass,
        onSuccess,
        onError
    )(dispatch, getState)
}

/**
 * Load more notifications based on skip and limit and hasNextPage
 */
export const loadMoreNotifications = () => (dispatch, getState) => {
    const {
        skip,
        limit,
        hasNextPage,
        refreshing,
    } = getState().notification.notifications
    if (hasNextPage === false || refreshing) return

    dispatch({
        type: NOTIFICATION_LOAD,
        payload: {
            type: 'notifications',
        },
    })

    const onSuccess = (res) => {
        const data = res.notis
        console.log(
            `${DEBUG_KEY}: load more notifications succeed with data length: `,
            data.length
        )
        dispatch({
            type: NOTIFICATION_LOAD_SUCCESS,
            payload: {
                type: 'notifications',
                data,
                skip: skip + data.length,
                limit,
                hasNextPage: !(data === undefined || data.length === 0),
            },
        })
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: load more notifications failed with err: `,
            err
        )
        dispatch({
            type: NOTIFICATION_LOAD_FAIL,
            payload: {
                type: 'notifications',
            },
        })
    }

    loadNotifications(skip, limit, {}, onSuccess, onError)(dispatch, getState)
}

export const loadNotifications = (skip, limit, params, onSuccess, onError) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    API.get(
        `secure/notification/entity?${queryBuilder(skip, limit, {
            ...params,
        })}`,
        token
    )
        .then((res) => {
            if (res.status === 200 || (res && res.data)) {
                return onSuccess(res)
            }
            onError(res)
        })
        .catch((err) => onError(err))
}

/* Following are actions to load needs */
export const refreshNeeds = () => (dispatch, getState) => {
    const { limit, refreshing } = getState().notification.needs
    // console.log(`${DEBUG_KEY}: refresh needs with params: ${skip}, ${limit}, ${refreshing}`);
    if (refreshing) return
    dispatch({
        type: NOTIFICATION_REFRESH,
        payload: {
            type: 'needs',
        },
    })

    const onSuccess = (data) => {
        console.log(
            `${DEBUG_KEY}: refresh needs succeed with data length: `,
            data.length
        )
        dispatch({
            type: NOTIFICATION_REFRESH_SUCCESS,
            payload: {
                type: 'needs',
                data,
                skip: data.length,
                limit,
                hasNextPage: !(data === undefined || data.length === 0),
            },
        })
    }

    const onError = (err) => {
        console.log(`${DEBUG_KEY}: refresh needs failed with err: `, err)
        dispatch({
            type: NOTIFICATION_REFRESH_FAIL,
            payload: {
                type: 'needs',
                data: [],
                skip: 0,
                limit,
                hasNextPage: false,
            },
        })
    }

    loadNeeds(0, limit, onSuccess, onError)(dispatch, getState)
}

/**
 * Load more notifications based on skip and limit
 */
export const loadMoreNeeds = () => (dispatch, getState) => {
    const {
        skip,
        limit,
        hasNextPage,
        refreshing,
    } = getState().notification.needs
    if (hasNextPage === false || refreshing) return

    dispatch({
        type: NOTIFICATION_LOAD,
        payload: {
            type: 'needs',
        },
    })

    const onSuccess = (data) => {
        console.log(
            `${DEBUG_KEY}: load more needs succeed with data length: `,
            data.length
        )
        dispatch({
            type: NOTIFICATION_LOAD_SUCCESS,
            payload: {
                type: 'needs',
                data,
                skip: skip + data.length,
                limit,
                hasNextPage: !(data === undefined || data.length === 0),
            },
        })
    }

    const onError = (err) => {
        console.log(`${DEBUG_KEY}: load more needs failed with err: `, err)
        dispatch({
            type: NOTIFICATION_LOAD_FAIL,
            payload: {
                type: 'needs',
            },
        })
    }

    loadNeeds(skip, limit, onSuccess, onError)(dispatch, getState)
}

export const loadNeeds = (skip, limit, onSuccess, onError) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    API.get(`secure/goal/needs/feed?${queryBuilder(skip, limit, {})}`, token)
        .then((res) => {
            if (res.status === 200 || (res && res.data)) {
                return onSuccess(res.data)
            }
            onError(res)
        })
        .catch((err) => onError(err))
}

/**
 * User marks all of the notifications as read
 */
export const markAllNotificationAsRead = () => (dispatch, getState) => {
    const { token } = getState().user

    const onSuccess = (res) => {
        console.log(
            `${DEBUG_KEY}: mark all notification read succeed with res:`,
            res
        )
        dispatch({
            type: NOTIFICATION_MARK_ALL_READ,
        })
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: mark all notification read failed with err:`,
            err
        )
    }

    API.post(`${BASE_ROUTE}/entity/read`, {}, token)
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

// User opens notification tab and clears the notification count
export const clearUnreadCount = () => (dispatch, getState) => {
    dispatch({
        type: NOTIFICATION_UNREAD_COUNT_UPDATE,
        payload: {
            data: 0,
        },
    })
}

// Fetch notification unread count
export const fetchUnreadCount = () => (dispatch, getState) => {
    const { token } = getState().user
    const { unreadCount } = getState().notification.unread

    const onSuccess = (res) => {
        Logger.log(`${DEBUG_KEY}: fetch unread count success: `, res, 4)
        dispatch({
            type: NOTIFICATION_UNREAD_COUNT_UPDATE,
            payload: {
                data: res.count,
            },
        })

        const preUnreadCount = unreadCount || 0

        Logger.log(
            `${DEBUG_KEY}: prev unreadCount: ${preUnreadCount}, new unreadCount: ${res.count},` +
                `should refresh: ${res.count > unreadCount}`,
            null,
            4
        )
        // refresh data quietly
        if (res.count > preUnreadCount) {
            Logger.log(`${DEBUG_KEY}: refresh notification quietly`, null, 4)
            refreshNotifications({
                showIndicator: false,
                refreshForUnreadNotif: true,
            })(dispatch, getState)
        }
    }

    const onError = (err) => {
        console.warn(`${DEBUG_KEY}: fetch unread count failed with err: `, err)
    }

    API.get('secure/notification/entity/unread-count', token, 4)
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
