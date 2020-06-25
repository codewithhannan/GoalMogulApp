/** @format */

// Reducers for an event that is opened from my event tab
import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

import {
    EVENT_EDIT_SUCCESS,
    EVENT_UPDATE_RSVP_STATUS_SUCCESS,
    updateEvent,
} from './EventReducers'

import { LIKE_POST, UNLIKE_POST } from '../like/LikeReducers'

const DEBUG_KEY = '[ Reducere MyEventReducers ]'
const INITIAL_STATE = {
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

export const MYEVENT_SWITCH_TAB = 'myevent_switch_tab'
export const MYEVENT_DETAIL_OPEN = 'myevent_detail_open'
export const MYEVENT_DETAIL_CLOSE = 'myevent_detail_close'
export const MYEVENT_FEED_FETCH = 'myevent_feed_fetch'
export const MYEVENT_FEED_FETCH_DONE = 'myevent_feed_fetch_done'
export const MYEVENT_FEED_REFRESH_DONE = 'myevent_feed_refresh_done'
export const MYEVENT_DETAIL_LOAD = 'myevent_detail_load'
export const MYEVENT_DETAIL_LOAD_SUCCESS = 'myevent_detail_load_success'
export const MYEVENT_DETAIL_LOAD_FAIL = 'myevent_detail_load_fail'
export const MYEVENT_MEMBER_SELECT_FILTER = 'myevent_member_select_filter'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MYEVENT_SWITCH_TAB: {
            const { index } = action.payload
            const newNavigationState = { ...state.navigationState }
            newNavigationState.index = index

            return {
                ...state,
                selectedTab: newNavigationState.routes[index].key,
                navigationState: newNavigationState,
            }
        }

        // Fetching feed for an myevent
        case MYEVENT_FEED_FETCH: {
            return {
                ...state,
                feedLoading: true,
            }
        }

        // Fetching feed done for an myevent
        case MYEVENT_FEED_FETCH_DONE: {
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
        case MYEVENT_FEED_REFRESH_DONE: {
            const { skip, data, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'feedLoading', false)

            if (skip !== undefined) {
                newState = _.set(newState, 'skip', skip)
            }
            newState = _.set(newState, 'hasNextPage', hasNextPage)
            return _.set(newState, 'feed', data)
        }

        case MYEVENT_DETAIL_LOAD: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'eventLoading', true)
        }

        case MYEVENT_DETAIL_LOAD_SUCCESS: {
            const { event } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'eventLoading', false)
            return _.set(newState, 'item', { ...event })
        }

        case MYEVENT_DETAIL_OPEN: {
            const { event } = action.payload
            const newState = _.cloneDeep(state)
            return _.set(newState, 'item', { ...event })
        }

        case MYEVENT_DETAIL_CLOSE: {
            return {
                ...INITIAL_STATE,
            }
        }

        case MYEVENT_MEMBER_SELECT_FILTER: {
            const { option, index } = action.payload
            let newState = _.cloneDeep(state)
            if (option) {
                newState = _.set(newState, 'participantsFilter', option)
            }
            if (index || index === 0) {
                newState = _.set(newState, 'memberNavigationState.index', index)
            }

            return newState
        }

        case EVENT_EDIT_SUCCESS: {
            const { newEvent } = action.payload
            const newState = _.cloneDeep(state)
            const oldEvent = _.get(newState, 'item')
            if (!oldEvent || oldEvent._id !== newEvent._id) return newState
            const updatedEvent = updateEvent(oldEvent, newEvent)
            return _.set(newState, 'item', updatedEvent)
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
