/** @format */

// Actions for an event that belongs to my event tab
import { Actions } from 'react-native-router-flux'
import { Alert } from 'react-native'
import _ from 'lodash'
import {
    MYEVENT_SWITCH_TAB,
    MYEVENT_DETAIL_CLOSE,
    MYEVENT_DETAIL_OPEN,
    MYEVENT_FEED_FETCH,
    MYEVENT_FEED_FETCH_DONE,
    MYEVENT_FEED_REFRESH_DONE,
    MYEVENT_DETAIL_LOAD,
    MYEVENT_DETAIL_LOAD_SUCCESS,
    MYEVENT_DETAIL_LOAD_FAIL,
    MYEVENT_MEMBER_SELECT_FILTER,
} from './MyEventReducers'

import { getMyEventUserStatus } from './EventSelector'

import { api as API } from '../../middleware/api'
import {
    queryBuilder,
    constructPageId,
    componentKeyByTab,
} from '../../middleware/utils'
import { Logger } from '../../middleware/utils/Logger'

const DEBUG_KEY = '[ Event Actions ]'
const BASE_ROUTE = 'secure/event'

export const eventSelectTab = (index, eventId, pageId) => (dispatch) => {
    dispatch({
        type: MYEVENT_SWITCH_TAB,
        payload: {
            eventId,
            pageId,
            index,
        },
    })
}

export const eventDetailClose = (eventId, pageId) => (dispatch) => {
    dispatch({
        type: MYEVENT_DETAIL_CLOSE,
        payload: {
            eventId,
            pageId,
        },
    })
}

/**
 * Refresh an event detail
 * NOTE: callback can be provided to execute on refresh finish
 */
export const refreshMyEventDetail = (eventId, callback, pageId) => (
    dispatch,
    getState
) => {
    const { item } = getState().myEvent
    if (!item || item._id !== eventId) return
    fetchEventDetail(eventId, undefined, pageId)(dispatch, getState)
    refreshEventFeed(eventId, dispatch, getState, callback, pageId)
}

/**
 * Current behavior is to go to explore page and opens up event detail
 * and then open event detail with id
 */
export const myEventDetailOpenWithId = (eventId) => (dispatch, getState) => {
    const { tab } = getState().navigation
    const pageId = constructPageId('event')
    const componentToOpen = componentKeyByTab(tab, 'myEventDetail')

    dispatch({
        type: MYEVENT_DETAIL_LOAD,
        payload: {
            pageId,
            eventId,
        },
    })
    const callback = (res) => {
        console.log(`${DEBUG_KEY}: res for verifying user identify: `, res)
        if (!res.data) {
            dispatch({
                type: MYEVENT_DETAIL_LOAD_FAIL,
                payload: {
                    eventId,
                    pageId,
                },
            })
            return Alert.alert('Event not found')
        }
        dispatch({
            type: MYEVENT_DETAIL_LOAD_SUCCESS,
            payload: {
                event: res.data,
                eventId,
                pageId,
            },
        })
        Actions.push(`${componentToOpen}`, { eventId, pageId })
    }

    dispatch({
        type: MYEVENT_DETAIL_OPEN,
        payload: {
            pageId,
            eventId,
        },
    })
    fetchEventDetail(eventId, callback, pageId)(dispatch, getState)
}

export const eventDetailOpen = (event) => (dispatch, getState) => {
    // const isMember = getMyEventUserStatus(getState());
    const { userId } = getState().user
    const { tab } = getState().navigation
    const { _id } = event
    const eventId = _id
    const pageId = constructPageId('event')
    const componentToOpen = componentKeyByTab(tab, 'myEventDetail')

    // If user is not a member nor an invitee and event is not public visible,
    // Show not found for this tribe
    if (event.isInviteOnly && userId !== event.creator) {
        console.log(`${DEBUG_KEY}: i am here`)
        dispatch({
            type: MYEVENT_DETAIL_OPEN,
            payload: {
                pageId,
                eventId,
            },
        })

        const callback = (res) => {
            if (!res.data) {
                return Alert.alert('Event not found')
            }
            dispatch({
                type: MYEVENT_DETAIL_LOAD_SUCCESS,
                payload: {
                    event: res.data,
                    eventId,
                    pageId,
                },
            })
            Actions.push(`${componentToOpen}`, { eventId, pageId })
        }
        fetchEventDetail(_id, callback, pageId)(dispatch, getState)
        return
    }

    console.log(`${DEBUG_KEY}: componentToOpen: `, componentToOpen)

    const newEvent = _.cloneDeep(event)
    dispatch({
        type: MYEVENT_DETAIL_OPEN,
        payload: {
            event: _.set(newEvent, 'participants', []),
            pageId,
            eventId,
        },
    })
    Actions.push(`${componentToOpen}`, { eventId, pageId })
    fetchEventDetail(_id, undefined, pageId)(dispatch, getState)
    refreshEventFeed(_id, dispatch, getState, undefined, pageId)
}

export const myEventSelectMembersFilter = (option, index, eventId, pageId) => (
    dispatch
) => {
    dispatch({
        type: MYEVENT_MEMBER_SELECT_FILTER,
        payload: {
            option,
            index,
            eventId,
            pageId,
        },
    })
}

/**
 * Fetch event detail for an event
 */
export const fetchEventDetail = (eventId, callback, pageId) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    const onSuccess = (data) => {
        dispatch({
            type: MYEVENT_DETAIL_LOAD_SUCCESS,
            payload: {
                event: data,
                pageId,
                eventId,
            },
        })
        Logger.log(
            `${DEBUG_KEY}: load event detail success with data: `,
            data,
            3
        )
    }

    const onError = (err) => {
        dispatch({
            type: MYEVENT_DETAIL_LOAD_FAIL,
            payload: {
                pageId,
                eventId,
            },
        })
        Logger.log(
            `${DEBUG_KEY}: failed to load event detail with err: `,
            err,
            1
        )
    }

    API.get(`${BASE_ROUTE}/documents/${eventId}`, token)
        .then((res) => {
            if (callback) {
                return callback(res)
            }
            if (res.data) {
                return onSuccess(res.data)
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
 * EventActions, TribeActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */
export const refreshEventFeed = (
    eventId,
    dispatch,
    getState,
    callback,
    pageId
) => {
    const { token } = getState().user
    const { limit } = getState().event

    dispatch({
        type: MYEVENT_FEED_FETCH,
        payload: {
            pageId,
            eventId,
        },
    })
    loadEventFeed(
        0,
        limit,
        token,
        { eventId },
        (data) => {
            dispatch({
                type: MYEVENT_FEED_REFRESH_DONE,
                payload: {
                    type: 'eventfeed',
                    data,
                    skip: data.length,
                    limit,
                    hasNextPage: !(data === undefined || data.length === 0),
                    pageId,
                    eventId,
                },
            })

            // This is callback is to perform actions like scrollToIndex in frontend
            if (callback) {
                callback()
            }
        },
        () => {
            // TODO: implement for onError
        }
    )
}

export const loadMoreEventFeed = (eventId, pageId) => (dispatch, getState) => {
    const { token } = getState().user
    const { skip, limit, hasNextPage } = getState().event
    if (hasNextPage === false) {
        return
    }
    dispatch({
        type: MYEVENT_FEED_FETCH,
        payload: {
            eventId,
            pageId,
        },
    })
    loadEventFeed(
        skip,
        limit,
        token,
        { eventId },
        (data) => {
            dispatch({
                type: MYEVENT_FEED_FETCH_DONE,
                payload: {
                    type: 'eventfeed',
                    data,
                    skip: data.length,
                    limit,
                    hasNextPage: !(data === undefined || data.length === 0),
                    pageId,
                    eventId,
                },
            })
        },
        () => {
            // TODO: implement for onError
        }
    )
}

export const loadEventFeed = (
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
            console.log(`${DEBUG_KEY}: loading with res: `, res)
            if (res.status === 200 && res.data) {
                return callback(res.data)
            }
            callback([])
            console.warn(`${DEBUG_KEY}: loading with no res`)
        })
        .catch((err) => {
            console.log(`${DEBUG_KEY}: loading event error: ${err}`)
        })
}

/**
 * Send invite requests to multiple users for an event
 * @param {*} eventId
 * @param {*} users
 * @param {*} callback
 */
export const inviteMultipleUsersToEvent = (eventId, users, callback) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    ;(async () => {
        let failedItems = []

        for (let user of users) {
            // send the message
            const body = {
                eventId,
                inviteeId: user._id,
            }
            try {
                const resp = await API.post(
                    `${BASE_ROUTE}/participant`,
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
