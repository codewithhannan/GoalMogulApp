/** @format */

import { createSelector } from 'reselect'
import _ from 'lodash'
import {
    TRIBE_USER_ROUTES,
    INITIAL_TRIBE_PAGE,
    TRIBE_NATIVATION_ROUTES,
} from './Tribes'
import { SentryRequestBuilder } from '../../../monitoring/sentry'
import {
    SENTRY_MESSAGE_TYPE,
    SENTRY_TAGS,
    SENTRY_MESSAGE_LEVEL,
    SENTRY_CONTEXT,
} from '../../../monitoring/sentry/Constants'

/**
 * get tribe member filter by tribeId and pageId
 * @param {*} state
 * @param {*} tribeId
 * @param {*} pageId
 */
const getMyTribeMembersFilter = (state, tribeId, pageId) =>
    _.get(state.tribes, `${tribeId}.${pageId}.membersFilters`, [
        'Admin',
        'Member',
    ])

/**
 * Get tribe members by tribeId
 * @param {*} state
 * @param {*} tribeId
 */
const getMyTribeMembers = (state, tribeId) => {
    const tribes = state.tribes
    return _.get(tribes, `${tribeId}.tribe.members`, [])
}

/**
 * Get tribe navigation states by tribeId and pageId
 * @param {*} state
 */
const getMyTribeNavigationStates = (state, tribeId, pageId) => {
    const tribes = state.tribes
    return {
        navigationState: _.get(
            tribes,
            `${tribeId}.${pageId}.navigationState`,
            _.cloneDeep(INITIAL_TRIBE_PAGE.navigationState)
        ),
        defaultRoutes: _.cloneDeep(TRIBE_NATIVATION_ROUTES.default),
    }
}

/**
 * Get tribe member navigation state by tribeId and pageId
 * @param {*} state
 * @param {*} tribeId
 * @param {*} pageId
 */
const getMyTribeMemberNavigationStates = (state, tribeId, pageId) => {
    const tribes = state.tribes
    if (!_.has(tribes, `${tribeId}.${pageId}`)) {
        new SentryRequestBuilder(
            "PageId doesn't exist in Tribes",
            SENTRY_MESSAGE_TYPE.MESSAGE
        )
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(
                SENTRY_TAGS.TRIBE.SELECTOR,
                'getMyTribeMemberNavigationStates'
            )
            .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
            .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
            .send()
        return {
            index: 0,
            routes: _.cloneDeep(TRIBE_USER_ROUTES.default),
        }
    }

    return _.get(tribes, `${tribeId}.${pageId}.memberNavigationState`)
}

const getMyTribeIsMemberCanInvite = (state, tribeId) => {
    const tribes = state.tribes
    return _.get(tribes, `${tribeId}.tribe`, false)
}

const getMyTribePage = (state, tribeId, pageId) =>
    _.cloneDeep(
        _.get(
            state.tribes,
            `${tribeId}.${pageId}`,
            _.cloneDeep(INITIAL_TRIBE_PAGE)
        )
    )
const getMyTribe = (state, tribeId, pageId) =>
    _.cloneDeep(_.get(state.tribes, `${tribeId}.tribe`, {}))
const getUserId = (state) => state.user.userId

const getMyTribeFeed = (state, tribeId, pageId) => {
    const tribes = state.tribes
    const posts = state.posts

    if (!_.has(tribes, tribeId) || !_.has(tribes, `${tribeId}.${pageId}`)) {
        console.error(
            `${DEBUG_KEY}: [getMyTribeFeed]: tribeId: ${tribeId} or pageId: ${pageId} not in tribes`
        )
        return []
    }

    const feedRefs = _.get(tribes, `${tribeId}.${pageId}.feed`)
    let ret = feedRefs
        .map((r) => {
            if (!_.has(posts, r)) {
                new SentryRequestBuilder(
                    "Posts doesn't have postRef for feed stored in Tribe",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.TRIBE.SELECTOR, 'getMyTribeFeed')
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .withExtraContext(SENTRY_CONTEXT.POST.POST_ID, r)
                    .send()
                return undefined
            }
            return _.cloneDeep(_.get(posts, `${r}.post`))
        })
        .filter((r) => r !== undefined)

    return ret
}

/**
 * Select tribe detail and tribe page detail by tribeId and pageId
 */
export const getMyTribeDetailById = createSelector(
    [getMyTribe, getMyTribePage],
    (tribe, tribePage) => {
        return { tribe, tribePage }
    }
)

export const getMyTribeFeedSelector = createSelector(
    [getMyTribeFeed],
    (feed) => feed
)

/**
 * Select current user membership for a tribe by tribeId
 */
export const getMyTribeUserStatus = createSelector(
    [getMyTribeMembers, getUserId],
    (members, userId) => {
        if (!members) return ''

        let status
        members.map((member) => {
            const { memberRef, category } = member
            if (memberRef && memberRef._id === userId) {
                status = category
            }
            return ''
        })
        return status
    }
)

/**
 * Select tribe members by filter
 */
export const myTribeMemberSelector = createSelector(
    // Select participants based on the filter option
    [getMyTribeMembersFilter, getMyTribeMembers],
    (filterOptions, members) => {
        if (!members || _.isEmpty(members)) return []
        return members.filter((member) =>
            filterOptions.includes(member.category)
        )
    }
)

/**
 * Select tribe navigationState, if not a member, obfuscate Post tab with default routes
 */
export const getMyTribeNavigationState = createSelector(
    [getMyTribeNavigationStates, getMyTribeMembers, getUserId],
    (navigationStates, members, userId) => {
        const { navigationState, defaultRoutes } = navigationStates
        const navigationStateToReturn = _.cloneDeep(navigationState)

        if (!members || members.length === 0) {
            return _.set(navigationStateToReturn, 'routes', defaultRoutes)
        }

        let isMember
        members.forEach((member) => {
            if (
                member.memberRef &&
                member.memberRef._id === userId &&
                (member.category === 'Admin' ||
                    member.category === 'Member' ||
                    member.category === 'Invitee')
            ) {
                isMember = true
            }
        })

        return isMember
            ? navigationStateToReturn
            : _.set(navigationStateToReturn, 'routes', defaultRoutes)
    }
)

/**
 * Select member tab navigationState
 */
export const getMyTribeMemberNavigationState = createSelector(
    [getMyTribeMemberNavigationStates, getMyTribeMembers, getUserId],
    (memberNavigationState, members, userId) => {
        const navigationStateToReturn = _.cloneDeep(memberNavigationState)

        if (!members || members.length === 0) {
            return null
        }

        let isAdmin
        members.forEach((member) => {
            if (member.memberRef && member.memberRef._id === userId) {
                if (member.category === 'Admin') {
                    isAdmin = true
                }
            }
        })

        return isAdmin ? navigationStateToReturn : null
    }
)
