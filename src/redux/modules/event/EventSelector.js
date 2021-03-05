/** @format */

import { createSelector } from 'reselect'
import _ from 'lodash'
import { INITIAL_EVENT_PAGE } from './Events'

const DEBUG_KEY = '[ Selector Event ]'

const getEventParticipants = (state) => {
    if (state.event.item) {
        return state.event.item.participants
    }
    return []
}

const getMyEventParticipants = (state) => {
    if (state.myEvent.item) {
        return state.myEvent.item.participants
    }
    return []
}
const getUserId = (state) => state.user.userId
const getParticipantsFilter = (state) => state.event.participantsFilter

const getMyParticipantsFilter = (state) => state.myEvent.participantsFilter

const getMyEventMemberNavigationStates = (state) => {
    const { memberNavigationState, memberDefaultRoutes } = state.myEvent
    return {
        memberNavigationState,
        memberDefaultRoutes,
    }
}

/**
 * Get event participants by eventId
 * @param {*} state
 * @param {*} eventId
 */
const getEventParticipantsById = (state, eventId) => {
    const events = state.events
    if (_.has(events, eventId)) {
        return _.get(events, `${eventId}.event.participants`)
    }
    return []
}

/*
 * Transform a goal's need and step to become
 * [ {needTitle: 'needs'}, ..., {stepTitle: 'steps'}, ...]
 */
export const getUserStatus = createSelector(
    [getEventParticipants, getUserId],
    (participants, userId) => {
        if (!participants) return ''

        let status
        participants.map((participant) => {
            // Participant can be null
            if (
                participant.participantRef &&
                participant.participantRef._id === userId
            ) {
                status = participant.rsvp
            }
            return ''
        })
        return status
    }
)

export const makeGetEventUserStatusById = () =>
    createSelector(
        [getEventParticipantsById, getUserId],
        (participants, userId) => {
            if (!participants) return ''

            let status
            participants.map((participant) => {
                // console.log(`${DEBUG_KEY}: partiipant is: `, participant);
                // Participant can be null
                if (
                    participant.participantRef &&
                    participant.participantRef._id === userId
                ) {
                    status = participant.rsvp
                }
                return ''
            })
            return status
        }
    )

export const getMyEventUserStatus = createSelector(
    [getMyEventParticipants, getUserId],
    (participants, userId) => {
        if (!participants) return ''

        let status
        participants.map((participant) => {
            if (participant.participantRef._id === userId) {
                status = participant.rsvp
            }
            return ''
        })
        return status
    }
)

// Select participants based on the filter option
export const participantSelector = createSelector(
    [getParticipantsFilter, getEventParticipants],
    (filter, participants) => {
        if (!participants) return ''

        return participants.filter((participant) => participant.rsvp === filter)
    }
)

export const getParticipantsFilterById = (state, eventId, pageId) => {
    const item = getEventPageItem(state, eventId, pageId, 'participantsFilter')
    return item
}

export const makeGetEventParticipantSelector = () =>
    createSelector(
        [getEventById, getParticipantsFilterById],
        (event, participantsFilter) => {
            if (!event || _.isEmpty(event)) return ''
            const participants = _.get(event, 'participants')

            if (!participants || _.isEmpty(participants)) return ''
            return participants.filter(
                (participant) => participant.rsvp === participantsFilter
            )
        }
    )

export const myEventParticipantSelector = createSelector(
    [getMyParticipantsFilter, getMyEventParticipants],
    (filter, participants) => {
        if (!participants) return ''

        return participants.filter((participant) => participant.rsvp === filter)
    }
)

// For tribe reference
// export const makeGetEventMemberNavigationState = () => createSelector(
//   [getEventById, getEventPage, getUserId],
//   (event, eventPage, userId) => {
//     const { memberNavigationState, memberDefaultRoutes } = eventPage;
//     const navigationStateToReturn = _.cloneDeep(memberNavigationState);

//     if (!event || _.isEmpty(event)) return navigationStateToReturn;
//     const { participants } = event;

//     if (!participants || participants.length === 0) {
//       return _.set(navigationStateToReturn, 'routes', memberDefaultRoutes);
//     }

//     let isAdmin;
//     participants.forEach((participant) => {
//       if (participant.memberRef._id === userId
//         && (participant.category === 'Admin')) {
//         isAdmin = true;
//       }
//     });

//     return isAdmin
//       ? navigationStateToReturn
//       : _.set(navigationStateToReturn, 'routes', memberDefaultRoutes);
//   }
// );

// This function currently is not used since people can see all participants
export const getMyEventMemberNavigationState = createSelector(
    [getMyEventMemberNavigationStates, getMyEventParticipants, getUserId],
    (navigationStates, members, userId) => {
        const { memberNavigationState, memberDefaultRoutes } = navigationStates
        const navigationStateToReturn = _.cloneDeep(memberNavigationState)

        if (!members || members.length === 0) {
            return _.set(navigationStateToReturn, 'routes', memberDefaultRoutes)
        }

        let isAdmin
        members.forEach((member) => {
            if (
                member.memberRef._id === userId &&
                member.category === 'Admin'
            ) {
                isAdmin = true
            }
        })

        return isAdmin
            ? navigationStateToReturn
            : _.set(navigationStateToReturn, 'routes', memberDefaultRoutes)
    }
)

const getEventById = (state, eventId) => {
    const events = state.events
    if (_.has(events, eventId)) {
        return _.get(events, `${eventId}.event`)
    }
    return {}
}

const getEventPage = (state, eventId, pageId) => {
    const events = state.events
    if (!_.has(events, `${eventId}.${pageId}`)) {
        return {
            ...INITIAL_EVENT_PAGE,
        }
    }
    return _.get(events, `${eventId}.${pageId}`)
}

const getEntityByIds = (ids, entities, type) => {
    let ret = []
    ret = _.uniq(ids)
        .map((id) => {
            if (_.has(entities, id)) {
                return _.get(entities, `${id}.${type}`)
            }
            return {}
        })
        .filter((g) => !_.isEmpty(g))
    return ret
}

const getFeed = (state) => state.posts
const getEventFeed = (state, eventId, pageId) => {
    const events = state.events
    if (!_.has(events, `${eventId}`)) {
        return []
    }

    if (!_.has(events, `${eventId}.${pageId}`)) {
        return []
    }

    const item = getEventPageItem(state, eventId, pageId, 'feed')
    return item || []
}

const getEventPageItem = (state, eventId, pageId, path) => {
    const events = state.events
    if (!_.has(events, `${eventId}`)) {
        return undefined
    }

    if (!_.has(events, `${eventId}.${pageId}`)) {
        return undefined
    }

    const pathToGet = path
        ? `${eventId}.${pageId}.${path}`
        : `${eventId}.${pageId}`

    return _.get(events, `${pathToGet}`)
}

export const makeGetEventFeed = () =>
    createSelector([getEventFeed, getFeed], (feedIds, feed) =>
        getEntityByIds(feedIds, feed, 'post')
    )

export const makeGetEventPageById = () =>
    createSelector([getEventById, getEventPage], (event, eventPage) => {
        return {
            event,
            eventPage,
        }
    })
