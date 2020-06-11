/** @format */

import { Actions } from 'react-native-router-flux'
import { Alert } from 'react-native'
import _ from 'lodash'
import {
    MYTRIBE_DETAIL_OPEN,
    MYTRIBE_DETAIL_LOAD,
    MYTRIBE_DETAIL_LOAD_SUCCESS,
    MYTRIBE_DETAIL_LOAD_FAIL,
    MYTRIBE_DETAIL_CLOSE,
    MYTRIBE_FEED_FETCH,
    MYTRIBE_FEED_FETCH_DONE,
    MYTRIBE_FEED_REFRESH_DONE,
    MYTRIBE_MEMBER_SELECT_FILTER,
    MYTRIBE_RESET,
    MYTRIBE_REQUEST_JOIN_SUCCESS,
    MYTRIBE_REQUEST_JOIN_ERROR,
    MYTRIBE_REQUEST_JOIN,
    MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
    MYTRIBE_REQUEST_CANCEL_JOIN_ERROR,
    MYTRIBE_REQUEST_CANCEL_JOIN,
    MYTRIBE_SWITCH_TAB
} from './MyTribeReducers'
import {
    TRIBE_REQUEST_JOIN,
    TRIBE_REQUEST_JOIN_SUCCESS,
    TRIBE_REQUEST_JOIN_ERROR,
    TRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
    TRIBE_REQUEST_CANCEL_JOIN_ERROR,
    TRIBE_REQUEST_CANCEL_JOIN,
} from './TribeReducers';
import { api as API } from '../../middleware/api'
import {
    queryBuilder,
    constructPageId,
    componentKeyByTab,
} from '../../middleware/utils'
import { Logger } from '../../middleware/utils/Logger'
import {
    MYTRIBE_NOT_FOUND,
    MYTRIBE_FEED_REFRESH,
    MYTRIBE_UPDATE_MEMBER_SUCCESS,
    MEMBER_UPDATE_TYPE,
} from './Tribes'
import { trackWithProperties, EVENT as E } from '../../../monitoring/segment';

const DEBUG_KEY = '[ MyTribe Actions ]'
const BASE_ROUTE = 'secure/tribe'

// Reset myTribe page
export const myTribeReset = () => (dispatch) => {
    dispatch({
        type: MYTRIBE_RESET,
    })
}

export const tribeSelectTab = (index, tribeId, pageId) => (dispatch) => {
    dispatch({
        type: MYTRIBE_SWITCH_TAB,
        payload: {
            index,
            tribeId,
            pageId,
        },
    })
}

export const myTribeSelectMembersFilter = (option, index, tribeId, pageId) => (
    dispatch
) => {
    dispatch({
        type: MYTRIBE_MEMBER_SELECT_FILTER,
        payload: {
            option,
            index,
            tribeId,
            pageId,
        },
    })
}

export const tribeDetailClose = () => (dispatch) => {
    Actions.pop()
    dispatch({
        type: MYTRIBE_DETAIL_CLOSE,
    })
}

/**
 * Current behavior is to go to home page and opens up tribe detail
 * and then open tribe detail with id
 */
export const myTribeDetailOpenWithId = (tribeId) => (dispatch, getState) => {
    const { tab } = getState().navigation;
    const pageId = constructPageId('tribe')
    const callback = (res) => {
        console.log(`${DEBUG_KEY}: res for verifying user identify: `, res)
        if (!res.data || res.status === 400 || res.status === 404) {
            dispatch({
                type: MYTRIBE_NOT_FOUND,
                payload: { pageId, tribeId },
            })
            return Alert.alert('Tribe not found')
        }
        // Only if status is 200, we open the detail
        // TODO: tribe: contrust page Id and open corresponding page with componentByTab or something
        if (res.status === 200) {
            dispatch({
                type: MYTRIBE_DETAIL_LOAD_SUCCESS,
                payload: {
                    tribe: res.data,
                    tribeId,
                    pageId,
                },
            })
            const componentToOpen = componentKeyByTab(tab, 'myTribeDetail')
            Actions.push(componentToOpen, { pageId, tribeId })
            return
        }
        return
    }
    fetchTribeDetail(tribeId, pageId, callback)(dispatch, getState)
}

/**
 * Populate with the basic fields for the tribe detail.
 * Fetch tribe detail
 */
export const tribeDetailOpen = (tribe) => (dispatch, getState) => {
    Logger.log(`${DEBUG_KEY}: [ tribeDetailOpen ]: tribe is:`, tribe, 3)
    if (!tribe || !tribe._id) {
        // TODO: tribe: sentry error
        return
    }
    const tribeId = tribe._id
    const { tab } = getState().navigation;
    const pageId = constructPageId('tribe')
    const callback = (res) => {
        if (!res.data || res.status === 400 || res.status === 404) {
            // If user is not a member nor an invitee and tribe is not public visible,
            // Show not found for this tribe
            dispatch({
                type: MYTRIBE_NOT_FOUND,
                payload: { pageId, tribeId },
            })
            return Alert.alert('Tribe not found')
        }

        // Only if status is 200, we open the detail
        if (res.status === 200) {
            const componentToOpen = componentKeyByTab(tab, 'myTribeDetail')
            Actions.push(componentToOpen, { pageId, tribeId })
            dispatch({
                type: MYTRIBE_DETAIL_LOAD_SUCCESS,
                payload: {
                    tribe: res.data,
                    tribeId,
                    pageId,
                },
            })
            refreshTribeFeed(tribeId, pageId, dispatch, getState)
        }
    }

    fetchTribeDetail(tribeId, pageId, callback)(dispatch, getState)
}

/**
 * Refresh a tribe detail
 * NOTE: callback can be provided to execute on refresh finish
 * TODO: tribe: make sure caller inputs pageId
 */
export const refreshMyTribeDetail = (
    tribeId,
    pageId,
    callback,
    showIndicator
) => (dispatch, getState) => {
    const tribes = getState().tribes
    if (!_.has(tribes, tribeId) || !_.has(tribes, `${tribeId}.${pageId}`)) {

      // TODO: tribe: add sentry log
      console.error(`${DEBUG_KEY}: tribeId ${tribeId} or ${pageId} not in tribes for refreshMyTribeDetail`);
      return;
    }
    fetchTribeDetail(tribeId, pageId, null, showIndicator)(dispatch, getState)
    refreshTribeFeed(tribeId, pageId, dispatch, getState, callback)
}

/**
 * Fetch tribe detail for a tribe
 * TODO: tribe: make sure caller inputs pageId
 * @param {string} tribeId
 * @param {string} pageId
 * @param {func} callback
 * @param {boolean} showIndicator boolean to determine if tribeLoading needs to be updated
 */
export const fetchTribeDetail = (tribeId, pageId, callback, showIndicator) => (
    dispatch,
    getState
) => {
    const { token } = getState().user

    if (showIndicator !== false) {
        dispatch({
            type: MYTRIBE_DETAIL_LOAD,
            payload: { tribeId, pageId },
        })
    }

    const onSuccess = (data) => {
        dispatch({
            type: MYTRIBE_DETAIL_LOAD_SUCCESS,
            payload: {
                tribe: data,
                pageId,
                tribeId,
            },
        })
        console.log(`${DEBUG_KEY}: load tribe detail success with data: `, data)
    }

    const onError = (err) => {
        dispatch({
            type: MYTRIBE_DETAIL_LOAD_FAIL,
            payload: { tribeId, pageId },
        })
        console.log(`${DEBUG_KEY}: failed to load tribe detail with err: `, err)
    }

    API.get(`${BASE_ROUTE}/documents/${tribeId}`, token)
        .then((res) => {
            if (res.status === 200 || res.data) {
                onSuccess(res.data)
                if (callback) {
                    callback(res)
                }
                return
            }
            onError(res)
            if (callback) {
                callback(res)
            }
        })
        .catch((err) => {
            onError(err)
            if (callback) {
                callback(err)
            }
        })
}

/**
 * This function removes a user from tribe
 * @param userId: removeeId
 * @param tribeId: tribeId
 */
export const myTribeAdminRemoveUser = (userId, tribeId) => (
    dispatch,
    getState
) => {
    Alert.alert(
        'Confirmation',
        'Are you sure to remove this user?',
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Confirm',
                onPress: () =>
                    doMyTribeAdminRemoveUser(userId, tribeId)(
                        dispatch,
                        getState
                    ),
            },
        ],
        { cancelable: false }
    )
}

const doMyTribeAdminRemoveUser = (userId, tribeId) => (dispatch, getState) => {
    const { token } = getState().user
    const onSuccess = (res) => {
        console.log(
            `${DEBUG_KEY}: remove member ${userId} successfully with res: `,
            res
        )
        dispatch({
            type: MYTRIBE_UPDATE_MEMBER_SUCCESS,
            payload: {
                userId,
                tribeId,
                updateType: MEMBER_UPDATE_TYPE.removeMember,
            },
        })
        Alert.alert('Member is removed successfully')
        // refreshMyTribeDetail(tribeId)(dispatch, getState);
    }
    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: failed to remove member ${userId} with err: `,
            err
        )
        Alert.alert('Remove member failed', 'Please try again later')
    }

    API.delete(
        `${BASE_ROUTE}/member?removeeId=${userId}&tribeId=${tribeId}`,
        {},
        token
    )
        .then((res) => {
            if (res.status === 200 || (res.data && res.message)) {
                return onSuccess(res)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * This function promotes a user in tribe to Admin
 * @param userId: promoteeId
 * @param tribeId: tribeId
 */
export const myTribeAdminPromoteUser = (userId, tribeId) => (
    dispatch,
    getState
) => {
    Alert.alert(
        'Confirmation',
        'Are you sure to promote this user?',
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Confirm',
                onPress: () =>
                    doMyTribeAdminPromoteUser(userId, tribeId)(
                        dispatch,
                        getState
                    ),
            },
        ],
        { cancelable: false }
    )
}

const doMyTribeAdminPromoteUser = (userId, tribeId) => (dispatch, getState) => {
    const { token } = getState().user
    const onSuccess = (res) => {
        console.log(
            `${DEBUG_KEY}: promote member ${userId} successfully with res: `,
            res
        )
        dispatch({
            type: MYTRIBE_UPDATE_MEMBER_SUCCESS,
            payload: {
                userId,
                tribeId,
                updateType: MEMBER_UPDATE_TYPE.promoteAdmin,
            },
        })
    }
    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: failed to promote member ${userId} with err: `,
            err
        )
        Alert.alert('Promote member failed', 'Please try again later')
    }

    API.post(
        `${BASE_ROUTE}/admin`,
        {
            promoteeId: userId,
            tribeId,
        },
        token
    )
        .then((res) => {
            if (res.status === 200 || (res.data && res.message)) {
                return onSuccess(res)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * This function demotes a user in tribe to member from Admin
 * @param userId: demoteeId
 * @param tribeId: tribeId
 */
export const myTribeAdminDemoteUser = (userId, tribeId) => (
    dispatch,
    getState
) => {
    Alert.alert(
        'Confirmation',
        'Are you sure to demote this user?',
        [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Confirm',
                onPress: () =>
                    doMyTribeAdminDemoteUser(userId, tribeId)(
                        dispatch,
                        getState
                    ),
            },
        ],
        { cancelable: false }
    )
}

const doMyTribeAdminDemoteUser = (userId, tribeId) => (dispatch, getState) => {
    const { token } = getState().user
    const onSuccess = (res) => {
        console.log(
            `${DEBUG_KEY}: demote member ${userId} successfully with res: `,
            res
        )
        dispatch({
            type: MYTRIBE_UPDATE_MEMBER_SUCCESS,
            payload: {
                userId,
                tribeId,
                updateType: MEMBER_UPDATE_TYPE.demoteMember,
            },
        })
    }
    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: failed to demote member ${userId} with err: `,
            err
        )
        Alert.alert('Demote member failed', 'Please try again later')
    }

    API.post(
        `${BASE_ROUTE}/admin`,
        {
            demoteeId: userId,
            tribeId,
        },
        token
    )
        .then((res) => {
            if (res.status === 200 || (res.data && res.message)) {
                return onSuccess(res)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

export const myTribeAdminAcceptUser = (userId, tribeId) => (
    dispatch,
    getState
) => {
    // Starting 0.3.10, we don't show accept confirmation
    doAdminAcceptUser(userId, tribeId)(dispatch, getState)
    // Alert.alert(
    //   'Confirmation',
    //   'Are you sure to accept this user?',
    //   [
    //     { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
    //     {
    //       text: 'Confirm',
    //       onPress: () => doAdminAcceptUser(userId, tribeId)(dispatch, getState)
    //     }
    //   ],
    //   { cancelable: false }
    // );
}

const doAdminAcceptUser = (userId, tribeId) => (dispatch, getState) => {
    const { token, user } = getState().user
    const onSuccess = (res) => {
        console.log(
            `${DEBUG_KEY}: accept member ${userId} successfully with res: `,
            res
        )
        dispatch({
            type: MYTRIBE_UPDATE_MEMBER_SUCCESS,
            payload: {
                userId,
                tribeId,
                updateType: MEMBER_UPDATE_TYPE.acceptMember,
            },
        })
    }
    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: failed to accept member: ${userId} with err: `,
            err
        )
        Alert.alert(
            'Accept member join request failed',
            'Please try again later'
        )
    }

    API.put(
        `${BASE_ROUTE}/accept-join-request`,
        { joinerId: userId, tribeId },
        token
    )
        .then((res) => {
            if (res.status === 200 || (res.data && res.message)) {
                return onSuccess(res)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions,
 * TribeActions, TribeActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */
export const refreshTribeFeed = (
    tribeId,
    pageId,
    dispatch,
    getState,
    callback
) => {
    const { token } = getState().user
    const tribes = getState().tribes;

    if (!_.has(tribes, tribeId) || !_.has(tribes, `${tribeId}.${pageId}`)) {
        // TODO: tribe: sentry error logging
        console.error(
            `${DEBUG_KEY}: pageId: ${pageId} or tribeId: ${tribeId} is not in tribes`
        )
        return
    }
    const { limit, feedRefreshing } = _.get(tribes, `${tribeId}.${pageId}`)
    if (feedRefreshing) {
        // Don't send request again if already refreshing
        return
    }

    dispatch({
        type: MYTRIBE_FEED_REFRESH,
        payload: { tribeId, pageId },
    })
    loadTribeFeed(
        0,
        limit,
        token,
        { tribeId },
        (data) => {
            dispatch({
                type: MYTRIBE_FEED_REFRESH_DONE,
                payload: {
                    tribeId,
                    pageId,
                    type: 'tribefeed',
                    data,
                    skip: data.length,
                    limit,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })

            // Callback are from frontend to perform scolling
            if (callback) {
                callback()
            }
        },
        () => {
            // TODO: tribe: implement for onError
        }
    )
}

/**
 * TODO: tribe: when this is used, make sure pageId is passed in
 * @param {*} tribeId
 * @param {*} pageId
 */
export const loadMoreTribeFeed = (tribeId, pageId) => (dispatch, getState) => {
    const { token } = getState().user
    const tribes = getState().tribes;

    if (!_.has(tribes, tribeId) || !_.has(tribes, `${tribeId}.${pageId}`)) {
        // TODO: tribe: sentry error logging
        return
    }
    const {
        skip,
        limit,
        hasNextPage,
        feedLoading,
        feed,
        feedRefreshing,
    } = _.get(tribes, `${tribeId}.${pageId}`)

    // Do not load more in the following conditions
    // 1. No next page 2. already loading more 3. no feed item (when page is initial loading flatlist will invoke onEndReached) 4. feed is currently refreshing
    if (
        hasNextPage === false ||
        feedLoading ||
        feed.length == 0 ||
        feedRefreshing
    ) {
        return
    }
    // console.log(`loading more tribe: skip is: ${skip}, hasNextPage: ${hasNextPage}, feedLoading: ${feedLoading}`);
    dispatch({
        type: MYTRIBE_FEED_FETCH,
        payload: { tribeId, pageId },
    })
    loadTribeFeed(
        skip,
        limit,
        token,
        { tribeId },
        (data) => {
            dispatch({
                type: MYTRIBE_FEED_FETCH_DONE,
                payload: {
                    tribeId,
                    pageId,
                    type: 'tribefeed',
                    data,
                    skip: data.length + feed.length,
                    limit,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        },
        () => {
            // TODO: tribe: implement for onError
        }
    )
}

export const loadTribeFeed = (
    skip,
    limit,
    token,
    params,
    callback,
    onError
) => {
    API.get(
        `${BASE_ROUTE}/feed?${queryBuilder(skip, limit, { ...params })}`,
        token
    )
        .then((res) => {
            console.log(`${DEBUG_KEY}: loading with res: `, res.data.length)
            if (res.status === 200 || (res && res.data)) {
                // Right now return test data
                return callback(res.data)
            }
            console.warn(
                `${DEBUG_KEY}: loading with no res. Message is: `,
                res.message
            )
        })
        .catch((err) => {
            console.log(`${DEBUG_KEY}: loading comment error: ${err}`)
            // TODO: tribe: implement for onError
        })
}

/**
 * User request to join a tribe
 * type: ['mytribe', 'tribe']
 * @param type: if type is undefined or tribe, then it's requested from tribe page
 * Otherwise, it's from mytribe
 */
export const requestJoinTribe = (tribeId, join, type, pageId) => (
    dispatch,
    getState
) => {
    const { token, userId, user } = getState().user
    let startActionType, endActionErrorType
    if (join) {
        startActionType =
            type && type === 'mytribe'
                ? MYTRIBE_REQUEST_JOIN
                : TRIBE_REQUEST_JOIN
        endActionErrorType =
            type && type === 'mytribe'
                ? MYTRIBE_REQUEST_JOIN_ERROR
                : TRIBE_REQUEST_JOIN_ERROR
        trackWithProperties(E.TRIBE_JOIN_REQUESTED, {
            TribeId: tribeId,
            UserId: userId,
        })
    } else {
        startActionType =
            type && type === 'mytribe'
                ? MYTRIBE_REQUEST_CANCEL_JOIN
                : TRIBE_REQUEST_CANCEL_JOIN
        endActionErrorType =
            type && type === 'mytribe'
                ? MYTRIBE_REQUEST_CANCEL_JOIN_ERROR
                : TRIBE_REQUEST_CANCEL_JOIN_ERROR
        trackWithProperties(E.TRIBE_JOIN_CANCELLED, {
            TribeId: tribeId,
            UserId: userId,
        })
    }

    console.log(
        `${DEBUG_KEY}: startActiontype: ${startActionType}, join: ${join}, type:${type}`
    )
    dispatch({
        type: startActionType,
    })

    const onSuccess = () => {
        if (join) {
            return dispatch({
                type:
                    type && type === 'mytribe'
                        ? MYTRIBE_REQUEST_JOIN_SUCCESS
                        : TRIBE_REQUEST_JOIN_SUCCESS,
                payload: {
                    tribeId,
                    userId,
                    pageId,
                    member: {
                        memberRef: {
                            ...user,
                        },
                        category: 'JoinRequester',
                    },
                },
            })
        }
        return dispatch({
            type:
                type && type === 'mytribe'
                    ? MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS
                    : TRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
            payload: {
                tribeId,
                userId,
                pageId,
            },
        })
    }

    const onError = (err) => {
        if (join) {
            Alert.alert('Join request failed', 'Please try again later')
        } else {
            Alert.alert('Cancel request failed', 'Please try again later')
        }

        console.log(
            `${DEBUG_KEY}: request to join tribe failed with err: `,
            err
        )
        dispatch({
            type: endActionErrorType,
            payload: {
                tribeId,
                pageId,
            },
        })
    }

    if (!join) {
        API.delete(
            `${BASE_ROUTE}/member?tribeId=${tribeId}&removeeId=${userId}`,
            {},
            token
        )
            .then((res) => {
                if (
                    res.status === 200 ||
                    (res.message && res.message.includes('Delete'))
                ) {
                    return onSuccess()
                }
                return onError()
            })
            .catch((err) => {
                onError(err)
            })
        return
    }

    API.post(`${BASE_ROUTE}/join-request`, { tribeId }, token)
        .then((res) => {
            if (!res.message) {
                return onSuccess()
            }
            onError()
        })
        .catch((err) => {
            onError(err)
        })
}
