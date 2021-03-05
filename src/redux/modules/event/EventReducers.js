/** @format */

import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

import { LIKE_POST, UNLIKE_POST } from '../like/LikeReducers'

const INITIAL_STATE = {
    navigationState: {
        index: 0,
        routes: [
            { key: 'about', title: 'About' },
            { key: 'posts', title: 'Posts' },
            { key: 'attendees', title: 'Attendees' },
        ],
    },
    selectedTab: 'about',
    item: undefined,
    // Feed related vars
    feed: [],
    feedLoading: false,
    hasNextPage: undefined,
    skip: 0,
    limit: 10,
    // ['Invited', 'Interested', 'Going', 'Maybe', 'NotGoing']
    participantsFilter: 'Going',
}

export const EVENT_SWITCH_TAB = 'event_switch_tab'
export const EVENT_DETAIL_OPEN = 'event_detail_open'
export const EVENT_DETAIL_CLOSE = 'event_detail_close'
export const EVENT_FEED_FETCH = 'event_feed_fetch'
export const EVENT_FEED_FETCH_DONE = 'event_feed_fetch_done'
export const EVENT_FEED_REFRESH_DONE = 'event_feed_refresh_done'
export const EVENT_UPDATE_RSVP_STATUS = 'event_update_rsvp_status'
export const EVENT_UPDATE_RSVP_STATUS_SUCCESS =
    'event_update_rsvp_status_success'
export const EVENT_UPDATE_RSVP_STATUS_FAIL = 'event_update_rsvp_status_fail'
export const EVENT_PARTICIPANT_SELECT_FILTER = 'event_participant_select_filter'
export const EVENT_PARTICIPANT_INVITE_SUCCESS =
    'event_partitipant_invite_success'
export const EVENT_PARTICIPANT_INVITE_FAIL = 'event_partitipant_invite_fail'
export const EVENT_DELETE_SUCCESS = 'event_delete_success'
export const EVENT_EDIT = 'event_edit'
export const EVENT_DETAIL_LOAD = 'event_detail_load'
export const EVENT_DETAIL_LOAD_SUCCESS = 'event_detail_load_success'
export const EVENT_DETAIL_LOAD_FAIL = 'event_detail_load_fail'

// If an event is edited successfully and its _id is the same as the item._id
// Replace the event with information updated. EventTab, MyEventTab should also listen to the change
export const EVENT_EDIT_SUCCESS = 'event_edit_success'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case EVENT_SWITCH_TAB: {
            const newNavigationState = { ...state.navigationState }
            newNavigationState.index = action.payload

            return {
                ...state,
                selectedTab: newNavigationState.routes[action.payload].key,
                navigationState: newNavigationState,
            }
        }

        // Fetching feed for an event
        case EVENT_FEED_FETCH: {
            return {
                ...state,
                feedLoading: true,
            }
        }

        // Fetching feed done for an event
        case EVENT_FEED_FETCH_DONE: {
            const { skip, data, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'feedLoading', false)

            if (skip !== undefined) {
                newState = _.set(newState, 'skip', skip)
            }
            newState = _.set(newState, 'hasNextPage', hasNextPage)
            const oldData = _.get(newState, 'feed')
            return _.set(newState, 'feed', arrayUnique(oldData.concat(data)))
        }

        // Event refresh feed done
        case EVENT_FEED_REFRESH_DONE: {
            const { skip, data, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'feedLoading', false)

            if (skip !== undefined) {
                newState = _.set(newState, 'skip', skip)
            }
            newState = _.set(newState, 'hasNextPage', hasNextPage)
            return _.set(newState, 'feed', data)
        }

        case EVENT_DETAIL_LOAD_SUCCESS:
        case EVENT_DETAIL_OPEN: {
            const { event } = action.payload
            const newState = _.cloneDeep(state)
            return _.set(newState, 'item', { ...event })
        }

        case EVENT_DELETE_SUCCESS:
        case EVENT_DETAIL_CLOSE: {
            return {
                ...INITIAL_STATE,
            }
        }

        // Current user update RSVP status for an event
        case EVENT_UPDATE_RSVP_STATUS_SUCCESS: {
            const newState = _.cloneDeep(state)
            const {
                eventId,
                participantRef, // current user object
                rsvp,
            } = action.payload

            // Check if user is updating this event or myEvent
            if (!newState.item || eventId !== newState.item._id) return newState

            let isInEvent = false
            const newParticipant = {
                participantRef,
                rsvp,
            }
            let newItem = _.cloneDeep(newState.item)

            let participants = newItem.participants
            let participantCount = newItem.participantCount
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

            newItem = _.set(newItem, 'participants', participants)
            newItem = _.set(newItem, 'participantCount', participantCount)

            return _.set(newState, 'item', newItem)
        }

        // User selects participants filter
        case EVENT_PARTICIPANT_SELECT_FILTER: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'participantsFilter', action.payload.option)
        }

        case EVENT_EDIT_SUCCESS: {
            const { newEvent } = action.payload
            const newState = _.cloneDeep(state)
            const oldEvent = _.get(newState, 'item')
            if (!oldEvent || oldEvent._id !== newEvent._id) return newState
            const updatedEvent = updateEvent(oldEvent, newEvent)
            return _.set(newState, 'item', updatedEvent)
        }

        // Currently for a post like update, it will iterator through the feed to
        // Update the post
        case LIKE_POST:
        case UNLIKE_POST: {
            const { id, likeId, tab, undo } = action.payload
            let newState = _.cloneDeep(state)

            const oldEventFeed = _.get(newState, 'feed')
            const newEventFeed = oldEventFeed.map((post) => {
                if (post._id === id) {
                    const oldLikeCount = _.get(post, 'likeCount')
                    let newLikeCount = oldLikeCount
                    if (action.type === LIKE_POST) {
                        if (undo) {
                            newLikeCount = oldLikeCount - 1
                        } else if (likeId === 'testId') {
                            newLikeCount = oldLikeCount + 1
                        }
                    } else if (action.type === UNLIKE_POST) {
                        if (undo) {
                            newLikeCount = oldLikeCount + 1
                        } else if (likeId === undefined) {
                            newLikeCount = oldLikeCount - 1
                        }
                    }

                    return {
                        ...post,
                        maybeLikeRef: likeId,
                        likeCount: newLikeCount,
                    }
                }
                return post
            })

            return _.set(newState, 'feed', newEventFeed)
        }

        default:
            return { ...state }
    }
}

export const updateEvent = (oldEvent, newEvent) => {
    let updatedEvent = _.cloneDeep(oldEvent)
    Object.keys(newEvent).forEach((key) => {
        // oldEvent doesn't have the field
        if (!oldEvent[key] || oldEvent[key] !== newEvent[key]) {
            updatedEvent = _.set(updatedEvent, `${key}`, newEvent[key])
        }
    })
    return updatedEvent
}
