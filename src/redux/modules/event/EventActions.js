/** @format */

import { Actions } from 'react-native-router-flux'
import { Alert } from 'react-native'
import _ from 'lodash'
import {
    EVENT_SWITCH_TAB,
    EVENT_DETAIL_CLOSE,
    EVENT_DETAIL_OPEN,
    EVENT_FEED_FETCH,
    EVENT_FEED_FETCH_DONE,
    EVENT_FEED_REFRESH_DONE,
    EVENT_UPDATE_RSVP_STATUS,
    EVENT_UPDATE_RSVP_STATUS_SUCCESS,
    EVENT_UPDATE_RSVP_STATUS_FAIL,
    EVENT_PARTICIPANT_SELECT_FILTER,
    EVENT_PARTICIPANT_INVITE_SUCCESS,
    EVENT_PARTICIPANT_INVITE_FAIL,
    EVENT_DELETE_SUCCESS,
    EVENT_EDIT,
    EVENT_DETAIL_LOAD,
    EVENT_DETAIL_LOAD_SUCCESS,
    EVENT_DETAIL_LOAD_FAIL,
} from './EventReducers'

import { REPORT_CREATE } from '../report/ReportReducers'

import { api as API } from '../../middleware/api'
import {
    queryBuilder,
    constructPageId,
    componentKeyByTab,
} from '../../middleware/utils'
import { trackWithProperties, EVENT as E } from '../../../monitoring/segment'

const DEBUG_KEY = '[ Event Actions ]'
const BASE_ROUTE = 'secure/event'

// Creating a new report
// category: ['General', 'User', 'Post', 'Goal', 'Comment', 'Tribe', 'Event']
// type: ['detail', something else]
export const reportEvent = (referenceId, type) => (dispatch, getState) => {
    const { userId } = getState().user
    trackWithProperties(E.EVENT_REPORTED, { CreatorId: userId, Type: type })
    // Set the basic information for a report
    dispatch({
        type: REPORT_CREATE,
        payload: {
            type,
            creatorId: userId,
            category: 'Event',
            referenceId,
        },
    })
    Actions.push('createReport')
}

// User deletes an event belongs to self
export const deleteEvent = (eventId) => (dispatch, getState) => {
    const { token, userId } = getState().user
    trackWithProperties(E.EVENT_DELETED, {
        CreatorId: userId,
        EventId: eventId,
    })
    const onSuccess = (res) => {
        Actions.pop()
        dispatch({
            type: EVENT_DELETE_SUCCESS,
            payload: {
                eventId,
            },
        })
        console.log(
            `${DEBUG_KEY}: event with id: ${eventId}, is deleted with res: `,
            res
        )
        Alert.alert('Success', 'You have successfully deleted the event.')
    }

    const onError = (err) => {
        Alert.alert(
            'Error',
            'Failed to delete this event. Please try again later.'
        )
        console.log(`${DEBUG_KEY}: delete event error: `, err)
    }

    API.delete(`${BASE_ROUTE}?eventId=${eventId}`, { eventId }, token)
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

// User edits an event. Open the create event page with pre-populated item.
export const editEvent = (event) => (dispatch, getState) => {
    Actions.push('createEventStack', { initializeFromState: true, event })
}

export const openEventInviteModal = ({
    eventId,
    cardIconSource,
    cardIconStyle,
    callback,
}) => (dispatch) => {
    const searchFor = {
        type: 'event',
        id: eventId,
    }
    Actions.push('searchPeopleLightBox', {
        searchFor,
        cardIconSource,
        cardIconStyle,
        callback,
    })
}

export const inviteParticipantToEvent = (eventId, inviteeId, callback) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    trackWithProperties(E.EVENT_PARTICIPANT_INVITED, {
        InviteeId: inviteeId,
        EventId: eventId,
        UserId: userId,
    })

    const onSuccess = (res) => {
        dispatch({
            type: EVENT_PARTICIPANT_INVITE_SUCCESS,
        })
        console.log(`${DEBUG_KEY}: invite user success: `, res)
        Actions.pop()
        if (callback) {
            // console.log(`${DEBUG_KEY}: invite user success with callback `, callback);
            callback()
        }
        Alert.alert('Success', 'You have successfully invited the user.')
    }

    const onError = (err) => {
        dispatch({
            type: EVENT_PARTICIPANT_INVITE_FAIL,
        })
        Alert.alert(
            'Error',
            'Failed to send invitation to user. Please try again later.'
        )
        console.log(`${DEBUG_KEY}: error sending invitation to user: `, err)
    }

    API.post(`${BASE_ROUTE}/participant`, { eventId, inviteeId }, token)
        .then((res) => {
            if ((res && res.success) || res.status === 200) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

// User updates his rsvp status for an event
export const rsvpEvent = (option, eventId, pageId) => (dispatch, getState) => {
    const { token, user, userId } = getState().user
    trackWithProperties(E.EVENT_RSVPED, { EventId: eventId, UserId: userId })

    const onSuccess = (res) => {
        dispatch({
            type: EVENT_UPDATE_RSVP_STATUS_SUCCESS,
            payload: {
                eventId,
                participantRef: {
                    ...user,
                },
                rsvp: option,
                pageId,
            },
        })
        console.log(`${DEBUG_KEY}: rsvp success with res: `, res)
    }

    const onError = (err) => {
        dispatch({
            type: EVENT_UPDATE_RSVP_STATUS_FAIL,
            payload: {
                eventId,
                pageId,
            },
        })
        Alert.alert('RSVP failed', 'Please try again later')
        console.log(`${DEBUG_KEY}: rsvp failed with err: `, err)
    }

    API.put(`${BASE_ROUTE}/rsvp`, { eventId, rsvpStatus: option }, token)
        .then((res) => {
            if (!res.message || res.status === 200) {
                return onSuccess(res)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

export const eventSelectParticipantsFilter = (option, eventId, pageId) => (
    dispatch
) => {
    dispatch({
        type: EVENT_PARTICIPANT_SELECT_FILTER,
        payload: {
            option,
            eventId,
            pageId,
        },
    })
}

export const eventSelectTab = (index) => (dispatch) => {
    dispatch({
        type: EVENT_SWITCH_TAB,
        payload: index,
    })
}

export const eventDetailClose = (eventId, pageId) => (dispatch) => {
    dispatch({
        type: EVENT_DETAIL_CLOSE,
        payload: {
            eventId,
            pageId,
        },
    })
}

/**
 * Current behavior is to go to explore page and opens up event detail
 * and then open event detail with id
 */
export const eventDetailOpenWithId = (eventId) => (dispatch, getState) => {
    const { tab } = getState().navigation
    const pageId = constructPageId('event')
    const componentToOpen = componentKeyByTab(tab, 'eventDetail')

    dispatch({
        type: EVENT_DETAIL_LOAD,
        payload: {
            pageId,
            eventId,
        },
    })
    const callback = (res) => {
        console.log(`${DEBUG_KEY}: res for verifying user identify: `, res)
        if (!res.data) {
            dispatch({
                type: EVENT_DETAIL_LOAD_FAIL,
                payload: {
                    eventId,
                    pageId,
                },
            })
            return Alert.alert('Event not found')
        }
        dispatch({
            type: EVENT_DETAIL_LOAD_SUCCESS,
            payload: {
                event: res.data,
                eventId,
                pageId,
            },
        })
        Actions.push(`${componentToOpen}`, { eventId, pageId })
    }

    dispatch({
        type: EVENT_DETAIL_OPEN,
        payload: {
            eventId,
            pageId,
        },
    })
    fetchEventDetail(eventId, callback, pageId)(dispatch, getState)
}

/**
 * Open an event detail
 */
export const eventDetailOpen = (event) => (dispatch, getState) => {
    const { userId } = getState().user
    const { tab } = getState().navigation
    const { _id } = event
    const eventId = _id
    const pageId = constructPageId('event')
    const componentToOpen = componentKeyByTab(tab, 'myEventDetail')

    // If user is not a member nor an invitee and event is not public visible,
    // Show not found for this tribe
    if (event.isInviteOnly && userId !== event.creator) {
        const callback = (res) => {
            console.log(`${DEBUG_KEY}: res for verifying user identify: `, res)
            if (!res.data) {
                return Alert.alert('Event not found')
            }
            dispatch({
                type: EVENT_DETAIL_LOAD_SUCCESS,
                payload: {
                    event: res.data,
                    pageId,
                    eventId,
                },
            })
            Actions.push(`${componentToOpen}`, { eventId, pageId })
        }
        fetchEventDetail(_id, callback, pageId)(dispatch, getState)
        return
    }

    const newEvent = _.cloneDeep(event)
    dispatch({
        type: EVENT_DETAIL_OPEN,
        payload: {
            event: _.set(newEvent, 'participants', []),
            pageId,
            eventId,
        },
    })
    Actions.push(`${componentToOpen}`, { eventId, pageId })
    fetchEventDetail(_id, undefined, pageId)(dispatch, getState)
    refreshEventFeed(_id, pageId)(dispatch, getState)
}

/**
 * Fetch event detail for an event
 */
export const fetchEventDetail = (eventId, callback, pageId) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    const onSuccess = (data) => {
        dispatch({
            type: EVENT_DETAIL_LOAD_SUCCESS,
            payload: {
                event: data,
                pageId,
                eventId,
            },
        })
        console.log(`${DEBUG_KEY}: load event detail success with data: `, data)
    }

    const onError = (err) => {
        dispatch({
            type: EVENT_DETAIL_LOAD_FAIL,
            payload: {
                pageId,
                eventId,
            },
        })
        console.log(`${DEBUG_KEY}: failed to load event detail with err: `, err)
    }

    API.get(`${BASE_ROUTE}/documents/${eventId}`, token)
        .then((res) => {
            trackWithProperties(E.EVENT_DETAIL_OPENED, {
                EventId: eventId,
                UserId: userId,
            })
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
export const refreshEventFeed = (eventId, pageId) => (dispatch, getState) => {
    const { token } = getState().user
    const { limit } = getState().event

    dispatch({
        type: EVENT_FEED_FETCH,
        payload: {
            eventId,
            pageId,
        },
    })
    loadEventFeed(
        0,
        limit,
        token,
        { eventId },
        (data) => {
            dispatch({
                type: EVENT_FEED_REFRESH_DONE,
                payload: {
                    type: 'eventfeed',
                    data,
                    skip: data.length,
                    pageId,
                    eventId,
                    limit,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
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
        type: EVENT_FEED_FETCH,
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
                type: EVENT_FEED_FETCH_DONE,
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
            console.log(`${DEBUG_KEY}: loading event feed with res: `, res)
            if (res && res.status === 200) {
                // Right now return test data
                if (skip === 0) {
                    callback(res)
                } else {
                    callback([])
                }
            }
            callback([])
            console.warn(`${DEBUG_KEY}: loading with no res`)
        })
        .catch((err) => {
            console.log(`${DEBUG_KEY}: loading event error: ${err}`)
        })
}
