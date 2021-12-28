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
    MYTRIBE_SWITCH_TAB,
    MYTRIBE_NOT_FOUND,
    MYTRIBE_FEED_REFRESH,
    MYTRIBE_UPDATE_MEMBER_SUCCESS,
    MEMBER_UPDATE_TYPE,
    MYTRIBE_MEMBER_INVITE_SUCCESS,
    MYTRIBE_MEMBER_INVITE_FAIL,
    MYTRIBE_DELETE_SUCCESS,
    MYTRIBE_GOAL_LOAD_DONE,
    MYTRIBE_GOAL_REFRESH_DONE,
    MYTRIBE_GOAL_REFRESH,
    MYTRIBE_GOAL_LOAD,
    MYTRIBE_FRIEND_INVITE_SELECTED_ITEM,
    MYTRIBE_FRIEND_INVITE_UNSELECTED_ITEM,
    MYTRIBE_FRIEND_CLEAR,
} from './Tribes'
import { api as API } from '../../middleware/api'
import {
    queryBuilder,
    constructPageId,
    componentKeyByTab,
} from '../../middleware/utils'
import { Logger } from '../../middleware/utils/Logger'
import { REPORT_CREATE } from '../report/ReportReducers'
import { trackWithProperties, EVENT as E } from '../../../monitoring/segment'
import { SentryRequestBuilder } from '../../../monitoring/sentry'
import {
    SENTRY_MESSAGE_TYPE,
    SENTRY_TAGS,
    SENTRY_TAG_VALUE,
    SENTRY_MESSAGE_LEVEL,
    SENTRY_CONTEXT,
} from '../../../monitoring/sentry/Constants'
import { loadUserGoals } from '../goal/GoalActions'
import { is2xxRespose } from '../../middleware/utils'

const DEBUG_KEY = '[ MyTribe Actions ]'
const BASE_ROUTE = 'secure/tribe'

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

export const myTribeSelectMembersFilter = (routes, index, tribeId, pageId) => (
    dispatch
) => {
    dispatch({
        type: MYTRIBE_MEMBER_SELECT_FILTER,
        payload: {
            option: routes[index].membersFilters,
            index,
            tribeId,
            pageId,
        },
    })
}

export const tribeDetailClose = (tribeId, pageId) => (dispatch, getState) => {
    const tribes = getState().tribes
    const allFeedRefs = _.get(tribes, `${tribeId}.${pageId}.allFeedRefs`, [])
    dispatch({
        type: MYTRIBE_DETAIL_CLOSE,
        payload: {
            tribeId,
            pageId,
            allFeedRefs,
        },
    })
}

/**
 * Current behavior is to go to home page and opens up tribe detail
 * and then open tribe detail with id
 */
export const myTribeDetailOpenWithId = (tribeId, props) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
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
            Actions.push(componentToOpen, { pageId, tribeId, ...props })
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
        new SentryRequestBuilder(
            'Tribe or tribe._id is not defined',
            SENTRY_MESSAGE_TYPE.MESSAGE
        )
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.TRIBE.ACTION, 'TribeDetail Open')
            .send()
        return
    }
    const tribeId = tribe._id
    const { tab } = getState().navigation
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
        const componentToOpen = componentKeyByTab(tab, 'myTribeDetail')
        Actions.push(componentToOpen, { pageId, tribeId })
        // Only if status is 200, we open the detail
        if (res.status === 200) {
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
    fetchTribeDetail(
        tribeId,
        pageId,
        () => {
            // Refresh tribe feed after tribe detail is loaded
            // as tribe feed needs the tribe page to exist first
            refreshTribeFeed(tribeId, pageId, dispatch, getState, callback)
        },
        showIndicator
    )(dispatch, getState)
}

export const onFriendsItemSelect = (selectedItemFriend, pageId) => (
    dispatch,
    getState
) => {
    console.log('suggestion item selected with item: ', selectedItemFriend)
    const { tab } = getState().navigation
    dispatch({
        type: MYTRIBE_FRIEND_INVITE_SELECTED_ITEM,
        payload: {
            selectedItemFriend,
            tab,
            pageId,
        },
    })
}

export const onFriendsItemUnselect = (selectedItemFriend, pageId) => (
    dispatch,
    getState
) => {
    console.log('suggestion item unselected with item: ', selectedItemFriend)
    const { tab } = getState().navigation
    dispatch({
        type: MYTRIBE_FRIEND_INVITE_UNSELECTED_ITEM,
        payload: {
            selectedItemFriend,
            tab,
            pageId,
        },
    })
}

export const clearFriendsArray = (pageId) => (dispatch, getState) => {
    // console.log('suggestion item unselected with item: ', selectedItemFriend)
    const { tab } = getState().navigation
    dispatch({
        type: MYTRIBE_FRIEND_CLEAR,
        payload: {
            tab,
            pageId,
        },
    })
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
        // console.log(`${DEBUG_KEY}: load tribe detail success with data: `, data)
    }

    const onError = (err) => {
        dispatch({
            type: MYTRIBE_DETAIL_LOAD_FAIL,
            payload: { tribeId, pageId },
        })
        console.log(`${DEBUG_KEY}: failed to load tribe detail with err: `, err)
    }

    API.get(`${BASE_ROUTE}/documents/${tribeId}?getMemberTopGoals=true`, token)
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
 * Add friends to the tribe
 * @param {string} tribeId
 * @param {array} friendsToAdd boolean to determine if tribeLoading needs to be updated
 */
export const addFriends = (tribeId, friendsToAdd, callback) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    console.log('ADDING FRIENDS')

    //     dispatch({
    //         type: MYTRIBE_DETAIL_LOAD,
    //         payload: { tribeId, pageId },
    //     })

    // const onSuccess = (data) => {
    //     dispatch({
    //         type: MYTRIBE_DETAIL_LOAD_SUCCESS,
    //         payload: {
    //             tribe: data,
    //             pageId,
    //             tribeId,
    //         },
    //     })
    //     // console.log(`${DEBUG_KEY}: load tribe detail success with data: `, data)
    // }

    // const onError = (err) => {
    //     dispatch({
    //         type: MYTRIBE_DETAIL_LOAD_FAIL,
    //         payload: { tribeId, pageId },
    //     })
    //     console.log(`${DEBUG_KEY}: failed to load tribe detail with err: `, err)
    // }

    API.post(
        `${BASE_ROUTE}/member-inviting-others`,
        {
            invitees: friendsToAdd,
            tribeId,
        },
        token
    )
        .then((res) => {
            if (res.status === 200 || res.data) {
                if (callback) {
                    callback(res)
                }
                return
            } else {
                console.log('Request Failed with data:', res)
                console.log('Request failed with status:', res.status)
                Alert.alert('An Error Occured while performing this action!')
            }
        })
        .catch((err) => {
            // onError(err)
            console.log(err)
            Alert.alert('An Error Occured while performing this action!')
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
        'Are you sure you want to remove this user?',
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
        Alert.alert('Invitation has been withdrawn')
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
        'Are you sure you want to promote this user?',
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
        'Are you sure you want to demote this user?',
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

    API.delete(
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
    //   'Are you sure you want to accept this user?',
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
            console.log('tribe join response', res)
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
    const tribes = getState().tribes

    if (!_.has(tribes, tribeId) || !_.has(tribes, `${tribeId}.${pageId}`)) {
        new SentryRequestBuilder(
            "Tribes doesn't contain tribeId or pageId",
            SENTRY_MESSAGE_TYPE.MESSAGE
        )
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.TRIBE.ACTION, 'TribeDetail Refresh Feed')
            .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
            .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
            .send()
        // console.error(
        //     `${DEBUG_KEY}: pageId: ${pageId} or tribeId: ${tribeId} is not in tribes`
        // )
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
            const curTribes = getState().tribes
            if (!_.has(curTribes, `${tribeId}.${pageId}`)) {
                // Don't update as page already closed before data loaded
                return
            }

            dispatch({
                type: MYTRIBE_FEED_REFRESH_DONE,
                payload: {
                    tribeId,
                    pageId,
                    data,
                    skip: data.length,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })

            // Callback are from frontend to perform scolling
            if (callback) {
                callback()
            }
        },
        (err) => {
            new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(SENTRY_TAGS.TRIBE.ACTION, 'TribeDetail Refresh Feed')
                .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                .withExtraContext(SENTRY_CONTEXT.PAGINATION.SKIP, skip)
                .withExtraContext(SENTRY_CONTEXT.PAGINATION.LIMIT, limit)
                .send()
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
    const tribes = getState().tribes

    if (!_.has(tribes, tribeId) || !_.has(tribes, `${tribeId}.${pageId}`)) {
        new SentryRequestBuilder(
            "Tribes doesn't contain tribeId or pageId",
            SENTRY_MESSAGE_TYPE.MESSAGE
        )
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.TRIBE.ACTION, 'TribeDetail Load More Feed')
            .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
            .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
            .send()
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
            const curTribes = getState().tribes
            if (!_.has(curTribes, `${tribeId}.${pageId}`)) {
                // Don't update as page already closed before data loaded
                return
            }
            dispatch({
                type: MYTRIBE_FEED_FETCH_DONE,
                payload: {
                    tribeId,
                    pageId,
                    data,
                    skip: data.length + feed.length,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        },
        (err) => {
            new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(SENTRY_TAGS.TRIBE.ACTION, 'TribeDetail Refresh Feed')
                .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                .withExtraContext(SENTRY_CONTEXT.PAGINATION.SKIP, skip)
                .withExtraContext(SENTRY_CONTEXT.PAGINATION.LIMIT, limit)
                .send()
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
            if (is2xxRespose(res.status) || (res && res.data)) {
                console.log(
                    `${DEBUG_KEY}: loading tribe feed with res: `,
                    res.data.length
                )
                // Right now return test data
                return callback(res.data)
            }
            console.warn(
                `${DEBUG_KEY}: loading with no res. Message is: `,
                res.message
            )
            return callback([])
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * User request to join a tribe
 * @param type: if type is undefined or tribe, then it's requested from tribe page
 * Otherwise, it's from mytribe
 */
export const requestJoinTribe = (
    tribeId,
    join,
    pageId,
    isAutoAcceptEnabled
) => (dispatch, getState) => {
    const { token, userId, user } = getState().user
    let startActionType, endActionErrorType
    if (join) {
        startActionType = MYTRIBE_REQUEST_JOIN
        endActionErrorType = MYTRIBE_REQUEST_JOIN_ERROR
        //    trackWithProperties (E.TRIBE_JOIN_REQUESTED, {
        //         TribeId: tribeId,
        //         UserId: userId,
        //     })
    } else {
        startActionType = MYTRIBE_REQUEST_CANCEL_JOIN
        endActionErrorType = MYTRIBE_REQUEST_CANCEL_JOIN_ERROR
        // trackWithProperties(E.TRIBE_JOIN_CANCELLED, {
        //     TribeId: tribeId,
        //     UserId: userId,
        // })
    }

    console.log(
        `${DEBUG_KEY}: startActiontype: ${startActionType}, join: ${join}`
    )
    dispatch({
        type: startActionType,
        payload: {
            tribeId,
            pageId,
        },
    })

    const onSuccess = () => {
        if (join) {
            let category = 'JoinRequester'
            if (isAutoAcceptEnabled) {
                category = 'Member'
            }
            return dispatch({
                type: MYTRIBE_REQUEST_JOIN_SUCCESS,
                payload: {
                    tribeId,
                    userId,
                    pageId,
                    member: {
                        memberRef: {
                            ...user,
                        },
                        category: category,
                    },
                },
            })
        }
        return dispatch({
            type: MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
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
            Alert.alert('uest failed', 'Please try again later')
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

/**
 * Invite a single user to the tribe. This API is likely to be deprecated after
 * inviteMultipleUsersToTribe with the multi-select invite modal is implemented
 *
 * @param {String} tribeId
 * @param {String} inviteeId
 */
export const inviteUserToTribe = (tribeId, inviteeId) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    const onSuccess = (res) => {
        trackWithProperties(E.TRIBE_INVITE_SENT, {
            UserId: userId,
            TribeId: tribeId,
        })
        dispatch({
            type: MYTRIBE_MEMBER_INVITE_SUCCESS,
            payload: { tribeId, userId: inviteeId },
        })
        console.log(`${DEBUG_KEY}: invite user success: `, res)
        refreshMyTribeDetail(tribeId)(dispatch, getState)
        Actions.pop()
        Alert.alert('Success', 'You have successfully invited the user.')
    }

    const onError = (err) => {
        dispatch({
            type: MYTRIBE_MEMBER_INVITE_FAIL,
            payload: { tribeId, userId: inviteeId },
        })
        Alert.alert(
            'Error',
            'Failed to send invitation to user. Please try again later.'
        )
        console.log(`${DEBUG_KEY}: error sending invitation to user: `, err)
    }

    API.post(`${BASE_ROUTE}/member-invitation`, { tribeId, inviteeId }, token)
        .then((res) => {
            if (res && res.success) {
                return onSuccess(res.data)
            }
            return onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * User accept tribe invitation
 * type: ['mytribe', 'tribe'];
 */
export const acceptTribeInvit = (tribeId) => (dispatch, getState) => {
    const { token, userId, user } = getState().user
    const onSuccess = (res) => {
        trackWithProperties(E.TRIBE_INVITE_ACCEPTED, {
            UserId: userId,
            TribeId: tribeId,
        })

        dispatch({
            type: MYTRIBE_UPDATE_MEMBER_SUCCESS,
            payload: {
                tribeId,
                userId,
                updateType: MEMBER_UPDATE_TYPE.acceptMember,
            },
        })
        console.log(
            `${DEBUG_KEY}: success accept tribe invitation with res: `,
            res
        )
        // TODO: tribe: refresh page
    }

    const onError = (err) => {
        Alert.alert(
            'Error',
            'Failed to accept invitation. Please try again later.'
        )
        new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.TRIBE.ACTION, 'TribeDetail Accept Invite')
            .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
            .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
            .send()
    }

    API.put(`${BASE_ROUTE}/accept-invitation`, { tribeId }, token)
        .then((res) => {
            if (res && res.message) {
                return onSuccess(res)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * User chooses to leave a tribe
 * type: ['decline', undefined]
 */
export const leaveTribe = (tribeId, type) => (dispatch, getState) => {
    const { token, userId } = getState().user
    const onSuccess = () => {
        trackWithProperties(
            type == 'decline' ? E.TRIBE_INVITE_DECLINED : E.TRIBE_LEFT,
            { UserId: userId, TribeId: tribeId, RemoveeId: userId }
        )

        dispatch({
            type: MYTRIBE_UPDATE_MEMBER_SUCCESS,
            payload: {
                userId,
                tribeId,
                updateType: MEMBER_UPDATE_TYPE.removeMember,
            },
        })
        console.log(`${DEBUG_KEY}: leave tribe success.`)
    }

    const onError = (err) => {
        Alert.alert('Error', 'Failed to leave tribe. Please try again later.')
        new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.TRIBE.ACTION, 'TribeDetail Leave tribe')
            .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
            .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
            .withExtraContext(SENTRY_CONTEXT.TRIBE.LEAVE_TYPE, type)
            .send()
    }

    API.delete(
        `${BASE_ROUTE}/member?tribeId=${tribeId}&removeeId=${userId}`,
        {},
        token
    )
        .then((res) => {
            if (
                res.status === 200 ||
                (res && res.message && res.message.includes('Delete'))
            ) {
                return onSuccess()
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

// Decline tribe invitation is the same as leaving a tribe
export const declineTribeInvit = (tribeId) => (dispatch, getState) => {
    leaveTribe(tribeId, 'decline')(dispatch, getState)
}

// User deletes an tribe belongs to self
export const deleteTribe = (tribeId) => (dispatch, getState) => {
    const { token, userId } = getState().user
    const onSuccess = (res) => {
        trackWithProperties(E.TRIBE_DELETED, {
            UserId: userId,
            TribeId: tribeId,
        })
        Actions.pop()
        dispatch({
            type: MYTRIBE_DELETE_SUCCESS,
            payload: {
                tribeId,
            },
        })
        console.log(
            `${DEBUG_KEY}: tribe with id: ${tribeId}, is deleted with res: `,
            res
        )
        Alert.alert('Success', 'You have successfully deleted the tribe.')
    }

    const onError = (err) => {
        Alert.alert(
            'Error',
            'Failed to delete this tribe. Please try again later.'
        )
        new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.TRIBE.ACTION, 'TribeDetail Delete')
            .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
            .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
            .send()
    }

    API.delete(`${BASE_ROUTE}?tribeId=${tribeId}`, {}, token)
        .then((res) => {
            if (
                res.status === 200 ||
                (res.message && res.message.includes('Deleted'))
            ) {
                return onSuccess(res)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

// User edits a tribe. Open the create tribe modal with pre-populated item.
export const editTribe = (tribe) => (dispatch, getState) => {
    Actions.push('createTribeStack', { initializeFromState: true, tribe })
}

/**
 * Send invite requests to multiple users for a tribe
 * @param {*} tribeId
 * @param {*} users
 * @param {*} callback
 */
export const inviteMultipleUsersToTribe = (tribeId, users, callback) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    trackWithProperties(E.TRIBE_INVITE_SENT, {
        UserId: userId,
        TribeId: tribeId,
    })
    ;(async () => {
        let failedItems = []

        for (let user of users) {
            // send the message
            const body = {
                tribeId,
                inviteeId: user._id,
            }
            try {
                const resp = await API.post(
                    `${BASE_ROUTE}/member-invitation`,
                    body,
                    token
                )
                if (resp.status != 200) {
                    failedItems.push(user)
                }
            } catch (e) {
                failedItems.push(user)
            }
        }

        if (failedItems.length == 0) {
            Alert.alert('Success', 'Your Friend(s) have been invited')
            // Use callback if there is one
            if (callback) {
                callback()
            } else {
                Actions.pop()
            }
        } else {
            const failedUserNames = failedItems.reduce((accum, u) => {
                return `${accum}, ${u.name}`
            }, '')
            Alert.alert(
                'Error',
                `Could not invite some users: ${failedUserNames}`
            )
        }
    })()
}

export const openTribeInvitModal = ({
    tribeId,
    cardIconSource,
    cardIconStyle,
}) => (dispatch) => {
    const searchFor = {
        type: 'tribe',
        id: tribeId,
    }
    Actions.push('searchPeopleLightBox', {
        searchFor,
        cardIconSource,
        cardIconStyle,
    })
}

/**
 * Creating a new report
 * category: ['General', 'User', 'Post', 'Goal', 'Comment', 'Tribe', 'Event']
 * type: ['detail', something else]
 * @param {*} referenceId
 * @param {*} type
 */
export const reportTribe = (referenceId, type) => (dispatch, getState) => {
    const { userId } = getState().user
    trackWithProperties(E.TRIBE_REPORTED, {
        UserId: userId,
        ReferenceId: referenceId,
    })
    // Set the basic information for a report
    dispatch({
        type: REPORT_CREATE,
        payload: {
            type,
            creatorId: userId,
            category: 'Tribe',
            referenceId,
        },
    })
    Actions.push('createReportStack')
}

/**
 * Refresh user goals for a specific tribe page so that user can share
 * @param {*} tribeId
 * @param {*} pageId
 */
export const tribeRefreshUserGoals = (tribeId, pageId) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    const tribes = getState().tribes
    if (!_.has(tribes, `${tribeId}.${pageId}`)) {
        // tribe page has been closed
        return
    }

    const { skip, limit, refreshing, loading } = _.get(
        tribes,
        `${tribeId}.${pageId}.goals`
    )
    if (refreshing) return // Don't refresh if there is already pending request

    const onSuccess = (data) => {
        dispatch({
            type: MYTRIBE_GOAL_REFRESH_DONE,
            payload: {
                data,
                // skip: skip + data.length,
                hasNextPage: data.length && data.length !== 0, // no next page when data is empty
                tribeId,
                pageId,
            },
        })
    }

    const onError = (err) => {
        new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.TRIBE.ACTION, 'tribeRefreshUserGoals')
            .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
            .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
            .send()
        dispatch({
            type: MYTRIBE_GOAL_REFRESH_DONE,
            payload: {
                data: [],
                // skip: 0,
                hasNextPage: false,
                tribeId,
                pageId,
            },
        })
    }

    dispatch({
        type: MYTRIBE_GOAL_REFRESH,
        payload: {
            tribeId,
            pageId,
        },
    })

    return loadUserGoals(skip, limit, { userId }, token, onSuccess, onError)
}

/**
 * Load more user goals for a specific tribe page so that user can share
 * @param {*} tribeId
 * @param {*} pageId
 */
export const tribeLoadMoreUserGoals = (tribeId, pageId) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    const tribes = getState().tribes
    if (!_.has(tribes, `${tribeId}.${pageId}`)) {
        // tribe page has been closed
        return
    }

    const { skip, limit, hasNextPage, loading } = _.get(
        tribes,
        `${tribeId}.${pageId}.goals`
    )
    if (loading || hasNextPage == false) return // Don't load more if there is already pending request

    const onSuccess = (data) => {
        console.log(data.length)
        dispatch({
            type: MYTRIBE_GOAL_LOAD_DONE,
            payload: {
                data,
                // skip: skip + data.length,
                hasNextPage: !(data.length && data.length !== 0), // no next page when data is empty
                tribeId,
                pageId,
            },
        })
    }

    const onError = (err) => {
        // TODO: tribe: error handling
        new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.TRIBE.ACTION, 'tribeLoadMoreUserGoals')
            .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
            .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
            .send()
        dispatch({
            type: MYTRIBE_GOAL_LOAD_DONE,
            payload: {
                data: [],
                // skip,
                hasNextPage: false,
                tribeId,
                pageId,
            },
        })
    }

    dispatch({
        type: MYTRIBE_GOAL_LOAD,
        payload: {
            tribeId,
            pageId,
        },
    })

    return loadUserGoals(skip, limit, { userId }, token, onSuccess, onError)
}
