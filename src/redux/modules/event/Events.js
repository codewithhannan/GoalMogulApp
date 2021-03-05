/**
 * This reducer is the source of truth for Events related Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 *
 * @format
 */

import _ from 'lodash'

import {
    EVENT_DETAIL_OPEN,
    EVENT_DETAIL_CLOSE,
    EVENT_FEED_FETCH,
    EVENT_FEED_FETCH_DONE,
    EVENT_FEED_REFRESH_DONE,
    EVENT_DETAIL_LOAD_SUCCESS,
    EVENT_DETAIL_LOAD_FAIL,
    EVENT_EDIT_SUCCESS,
    EVENT_SWITCH_TAB,
    EVENT_UPDATE_RSVP_STATUS_SUCCESS,
    EVENT_PARTICIPANT_SELECT_FILTER,
} from './EventReducers'

import { EVENTTAB_REFRESH_DONE, EVENTTAB_LOAD_DONE } from './EventTabReducers'

import {
    MYEVENTTAB_REFRESH_DONE,
    MYEVENTTAB_LOAD_DONE,
} from './MyEventTabReducers'

import {
    MYEVENT_DETAIL_OPEN,
    MYEVENT_DETAIL_CLOSE,
    MYEVENT_FEED_FETCH,
    MYEVENT_FEED_FETCH_DONE,
    MYEVENT_FEED_REFRESH_DONE,
    MYEVENT_DETAIL_LOAD_SUCCESS,
    MYEVENT_DETAIL_LOAD_FAIL,
    MYEVENT_SWITCH_TAB,
    MYEVENT_MEMBER_SELECT_FILTER,
} from './MyEventReducers'

import { PROFILE_POST_DELETE_SUCCESS } from '../../../reducers/Profile'
import { hasTypePrefix } from '../../middleware/utils'
import { Logger } from '../../middleware/utils/Logger'

/**
 * Related Consts
 *
 * Explore related
 * EVENT_DETAIL_OPEN (done)
 * EVENT_DETAIL_CLOSE (done)
 * EVENTTAB_REFRESH_DONE, (done)
 * EVENTTAB_LOAD_DONE, (done)
 * EVENTTAB_LOAD, (no need)
 * EVENT_SWITCH_TAB,
 * EVENT_FEED_FETCH, (done)
 * EVENT_FEED_FETCH_DONE, (done)
 * EVENT_FEED_REFRESH_DONE, (done)
 * EVENT_EDIT_SUCCESS, (done)
 * EVENT_DETAIL_LOAD_SUCCESS (done)
 * EVENT_DETAIL_LOAD_FAIL (done)
 * EVENT_SWITCH_TAB (done)
 * EVENT_UPDATE_RSVP_STATUS_SUCCESS (done)
 * EVENT_PARTICIPANT_SELECT_FILTER (done)
 *      --> should have same function as MYEVENT_MEMBER_SELECT_FILTER
 *
 * My Event related
 * MYEVENTTAB_REFRESH_DONE (done)
 * MYEVENTTAB_LOAD_DONE (done)
 * MYEVENT_DETAIL_LOAD_SUCCESS (done)
 * MYEVENT_DETAIL_LOAD_FAIL (done)
 * MYEVENT_FEED_FETCH (done)
 * MYEVENT_FEED_FETCH_DONE (done)
 * MYEVENT_FEED_REFRESH_DONE (done)
 * MYEVENT_SWITCH_TAB (done)
 * MYEVENT_MEMBER_SELECT_FILTER (done) // Check why this is only in MYEVENT
 *
 */
export const INITIAL_EVENT_OBJECT = {
    event: {},
    // pageId: {
    //     refreshing: false
    // },
    reference: [],
}

export const INITIAL_EVENT_PAGE = {
    navigationState: {
        index: 0,
        routes: [
            { key: 'about', title: 'About' },
            { key: 'posts', title: 'Posts' },
            { key: 'attendees', title: 'Participants' },
        ],
    },
    selectedTab: 'about',
    item: undefined,
    // Feed related vars
    feed: [],
    feedLoading: false,
    eventLoading: false,
    hasNextPage: undefined,
    skip: 0,
    limit: 10,
    // ['Invited', 'Interested', 'Going', 'Maybe', 'NotGoing']
    participantsFilter: 'Going',
    memberNavigationState: {
        index: 0,
        routes: [
            { key: 'Going', title: 'Going' },
            { key: 'Interested', title: 'Interested' },
            { key: 'Invited', title: 'Invited' },
        ],
    },
    memberDefaultRoutes: [
        { key: 'Admin', title: 'Admin' },
        { key: 'Member', title: 'Member' },
    ],
}

const INITIAL_STATE = {}

const DEBUG_KEY = '[ Reducers Events ]'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        /**
         * eventId and pageId are required
         */
        case MYEVENT_DETAIL_OPEN:
        case EVENT_DETAIL_OPEN: {
            const { event, eventId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            let reference = [pageId]
            let eventObjectToUpdate = _.has(newState, eventId)
                ? _.get(newState, `${eventId}`)
                : { ...INITIAL_EVENT_OBJECT }

            if (pageId === undefined) {
                // Abort something is wrong
                console.warn(
                    `${DEBUG_KEY}: [ ${action.type} ] with pageId: ${pageId}`
                )
                return newState
            }

            // Set the event to the latest
            if (event !== undefined) {
                eventObjectToUpdate = _.set(eventObjectToUpdate, 'event', event)
            }

            // Setup event page for pageId if not initially setup
            if (!_.has(eventObjectToUpdate, pageId)) {
                eventObjectToUpdate = _.set(eventObjectToUpdate, pageId, {
                    ...INITIAL_EVENT_PAGE,
                })
            }

            // Update the reference
            const oldReference = _.get(eventObjectToUpdate, 'reference')
            if (oldReference !== undefined) {
                if (!oldReference.some((r) => r === pageId)) {
                    reference = reference.concat(oldReference)
                } else {
                    reference = oldReference
                }
            }

            eventObjectToUpdate = _.set(
                eventObjectToUpdate,
                'reference',
                reference
            )

            // Update goal object
            newState = _.set(newState, `${eventId}`, eventObjectToUpdate)
            return newState
        }

        case MYEVENT_DETAIL_LOAD_FAIL:
        case MYEVENT_DETAIL_LOAD_SUCCESS:
        case EVENT_DETAIL_LOAD_FAIL:
        case EVENT_DETAIL_LOAD_SUCCESS: {
            const { event, eventId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            let reference = pageId !== undefined ? [pageId] : []
            let eventObjectToUpdate = _.has(newState, eventId)
                ? _.get(newState, `${eventId}`)
                : { ...INITIAL_EVENT_OBJECT }

            // Page should already exist for fetching a event detail otherwise abort
            if (pageId === undefined || !_.has(state, `${eventId}.${pageId}`)) {
                return newState
            }

            // Set the event to the latest
            if (event !== undefined) {
                eventObjectToUpdate = _.set(eventObjectToUpdate, 'event', event)
            }

            // Update the reference
            const oldReference = _.get(eventObjectToUpdate, 'reference')
            if (oldReference !== undefined) {
                if (!oldReference.some((r) => r === pageId)) {
                    reference = reference.concat(oldReference)
                } else {
                    reference = oldReference
                }
            }

            eventObjectToUpdate = _.set(
                eventObjectToUpdate,
                `${pageId}.eventLoading`,
                false
            )
            eventObjectToUpdate = _.set(
                eventObjectToUpdate,
                'reference',
                reference
            )

            newState = _.set(newState, `${eventId}`, eventObjectToUpdate)
            return newState
        }

        case EVENT_EDIT_SUCCESS: {
            const newState = _.cloneDeep(state)
            const { newEvent } = action.payload
            const eventId = newEvent._id
            const shouldUpdate = sanityCheck(newState, eventId, action.type)
            if (!shouldUpdate) return newState

            return _.set(newState, `${eventId}.event`, newEvent)
        }

        case EVENT_SWITCH_TAB:
        case MYEVENT_SWITCH_TAB: {
            let newState = _.cloneDeep(state)
            const { index, pageId, eventId } = action.payload
            const shouldUpdate = sanityCheckPageId(
                newState,
                eventId,
                pageId,
                action.type
            )
            if (!shouldUpdate) return newState

            let navigationState = _.get(
                newState,
                `${eventId}.${pageId}.navigationState`
            )
            navigationState = _.set(navigationState, 'index', index)
            newState = _.set(
                newState,
                `${eventId}.${pageId}.navigationState`,
                navigationState
            )
            newState = _.set(
                newState,
                `${eventId}.${pageId}.selectedTab`,
                navigationState.routes[index].key
            )

            return newState
        }

        case EVENT_PARTICIPANT_SELECT_FILTER:
        case MYEVENT_MEMBER_SELECT_FILTER: {
            const { option, index, eventId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheckPageId(
                newState,
                eventId,
                pageId,
                action.type
            )
            if (!shouldUpdate) return newState

            const path = `${eventId}.${pageId}`
            if (option) {
                newState = _.set(newState, `${path}.participantsFilter`, option)
            }
            if (index || index === 0) {
                newState = _.set(
                    newState,
                    `${path}.memberNavigationState.index`,
                    index
                )
            }

            return newState
        }

        case EVENT_UPDATE_RSVP_STATUS_SUCCESS: {
            let newState = _.cloneDeep(state)
            const {
                eventId,
                participantRef, // current user object
                rsvp,
                pageId,
            } = action.payload

            const shouldUpdate = sanityCheckPageId(
                newState,
                eventId,
                pageId,
                action.type
            )
            if (!shouldUpdate) return newState

            let isInEvent = false
            const newParticipant = {
                participantRef,
                rsvp,
            }
            let eventToUpdate = _.get(newState, `${eventId}.event`)

            let participants = eventToUpdate.participants
            let participantCount = eventToUpdate.participantCount
            if (
                !participants ||
                participants.length === 0 ||
                participantCount === 0
            ) {
                // If there is no participants originally
                participants = participants.concat(newParticipant)
                participantCount += 1
                isInEvent = true
            } else {
                // If user has rsvped before
                participants = participants.map((participant) => {
                    if (
                        participant.participantRef._id ===
                        newParticipant.participantRef._id
                    ) {
                        isInEvent = true
                        return newParticipant
                    }
                    return participant
                })
            }

            if (!isInEvent) {
                // user has never rsvped before
                participants = participants.concat(newParticipant)
                participantCount += 1
                isInEvent = true
            }

            eventToUpdate = _.set(eventToUpdate, 'participants', participants)
            eventToUpdate = _.set(
                eventToUpdate,
                'participantCount',
                participantCount
            )

            return _.set(newState, `${eventId}.event`, eventToUpdate)
        }

        /**
         * eventId and pageId are required
         */
        case MYEVENT_DETAIL_CLOSE:
        case EVENT_DETAIL_CLOSE: {
            const { pageId, eventId } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, eventId)) return newState // no reference to remove

            let eventToUpdate = _.get(newState, `${eventId}`)

            // Update reference
            const oldReference = _.get(eventToUpdate, 'reference')
            let newReference = oldReference
            if (
                oldReference !== undefined &&
                oldReference.some((r) => r === pageId)
            ) {
                newReference = newReference.filter((r) => r !== pageId)
            }

            // Remove pageId reference object
            eventToUpdate = _.omit(eventToUpdate, `${pageId}`)

            // Remove this event if it's no longer referenced
            if (!newReference || _.isEmpty(newReference)) {
                newState = _.omit(newState, `${eventId}`)
                return newState
            }

            // Update the goal by goalId
            eventToUpdate = _.set(eventToUpdate, 'reference', newReference)
            newState = _.set(newState, `${eventId}`, eventToUpdate)
            Logger.log(
                `${DEBUG_KEY}: newState after event closing is: `,
                newState,
                4
            )
            return newState
        }

        case PROFILE_POST_DELETE_SUCCESS: {
            const { postId } = action.payload
            // Brute force to remove all related postId
            let newState = _.cloneDeep(state)
            Object.keys(newState).forEach((eventId) => {
                let eventObject = _.get(newState, eventId)
                Object.keys(eventObject).forEach((objectKey) => {
                    if (hasTypePrefix('event', objectKey)) {
                        const newFeed = _.get(
                            eventObject,
                            `${objectKey}.feed`
                        ).filter((f) => f !== postId)
                        eventObject = _.set(
                            eventObject,
                            `${objectKey}.feed`,
                            newFeed
                        )
                    }
                })
                newState = _.set(newState, `${eventId}`, eventObject)
            })

            return newState
        }

        /**
         * pageId and data are required
         */
        case MYEVENTTAB_LOAD_DONE:
        case MYEVENTTAB_REFRESH_DONE:
        case EVENTTAB_LOAD_DONE:
        case EVENTTAB_REFRESH_DONE: {
            const { pageId, data } = action.payload
            let newState = _.cloneDeep(state)

            if (!data || _.isEmpty(data)) return newState

            data.forEach((event) => {
                const eventId = event._id
                // Get event object to update
                let eventObjectToUpdate = { ...INITIAL_EVENT_OBJECT }
                if (_.has(newState, eventId)) {
                    eventObjectToUpdate = _.get(newState, `${eventId}`)
                }

                // TODO: perform schema check
                if (event !== undefined) {
                    // Update the event
                    eventObjectToUpdate = _.set(
                        eventObjectToUpdate,
                        'event',
                        event
                    )
                }

                const oldReference = _.get(newState, `${eventId}.reference`)
                const hasPageReference =
                    oldReference !== undefined &&
                    oldReference.some((r) => r === pageId)
                // Update reference
                let newReference = [pageId]
                if (oldReference !== undefined) {
                    if (!hasPageReference) {
                        newReference = newReference.concat(oldReference)
                    } else {
                        newReference = oldReference
                    }
                }

                // Update object reference
                eventObjectToUpdate = _.set(
                    eventObjectToUpdate,
                    'reference',
                    newReference
                )
                newState = _.set(newState, `${eventId}`, eventObjectToUpdate)
            })

            return newState
        }

        case MYEVENT_FEED_FETCH:
        case EVENT_FEED_FETCH: {
            const { eventId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheckPageId(
                newState,
                eventId,
                pageId,
                action.type
            )
            if (shouldUpdate) {
                newState = _.set(
                    newState,
                    `${eventId}.${pageId}.feedLoading`,
                    true
                )
            }
            return newState
        }

        case MYEVENT_FEED_FETCH_DONE:
        case EVENT_FEED_FETCH_DONE: {
            const { eventId, pageId, data, skip, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheckPageId(
                newState,
                eventId,
                pageId,
                action.type
            )
            if (!shouldUpdate) {
                return newState
            }

            const path = `${eventId}.${pageId}`
            const oldData = _.get(newState, `${path}.data`)
            let newData = data
            newData = transformData(newData) // only keep an array of ids

            newState = _.set(
                newState,
                `${path}.feed`,
                _.uniq(oldData.concat(newData))
            )
            newState = _.set(newState, `${path}.feedLoading`, false)
            newState = _.set(newState, `${path}.skip`, skip)
            newState = _.set(newState, `${path}.hasNextPage`, hasNextPage)

            return newState
        }

        case MYEVENT_FEED_REFRESH_DONE:
        case EVENT_FEED_REFRESH_DONE: {
            const { eventId, pageId, data, skip, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheckPageId(
                newState,
                eventId,
                pageId,
                action.type
            )
            if (!shouldUpdate) {
                return newState
            }

            const path = `${eventId}.${pageId}`
            let newData = data
            newData = transformData(newData) // only keep an array of ids

            newState = _.set(newState, `${path}.feed`, newData)
            newState = _.set(newState, `${path}.feedLoading`, false)
            newState = _.set(newState, `${path}.skip`, skip)
            newState = _.set(newState, `${path}.hasNextPage`, hasNextPage)

            return newState
        }

        default:
            return { ...state }
    }
}

const transformData = (data) => data.map((d) => d._id)

const sanityCheck = (state, entityId, type) => {
    if (!_.has(state, entityId)) {
        // This is bad since app user is updating a profile image that is never loaded
        console.warn(
            `${DEBUG_KEY}: [ ${type} ]` +
                `no user object found for userId: ${entityId}`
        )
        return false
    }
    return true
}

const sanityCheckPageId = (state, entityId, pageId, type) => {
    if (!_.has(state, entityId)) {
        // This is bad since app user is updating a profile image that is never loaded
        console.warn(
            `${DEBUG_KEY}: [ ${type} ]` +
                `no user object found for entityId: ${entityId}`
        )
        return false
    }

    const entity = _.get(state, `${entityId}`)
    const isPageIdInReference =
        entity.reference !== undefined &&
        entity.reference.some((r) => r === pageId)

    if (!_.has(entity, `${pageId}`)) {
        if (isPageIdInReference) {
            console.warn(
                `${DEBUG_KEY}: [ ${type} ]: pageId ${pageId} ` +
                    'is in reference but missing from object'
            )
        } else {
            console.warn(
                `${DEBUG_KEY}: [ ${type} ]: pageId ${pageId} ` +
                    'is not in reference and also missing from object'
            )
        }
        return false
    }

    if (!isPageIdInReference) {
        console.warn(
            `${DEBUG_KEY}: pageId ${pageId} is not in reference but is part of the object. ` +
                'Potential memory leak'
        )
        return false
    }
    return true
}
