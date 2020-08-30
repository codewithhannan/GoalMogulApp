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
import { TRIBE_TYPE } from './TribeHubActions'

const DEBUG_KEY = '[ Selector Tribes ]'

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

/**
 * Get feed for a specific tribe page
 * @param {*} state
 * @param {*} tribeId
 * @param {*} pageId
 */
const getMyTribeFeed = (state, tribeId, pageId) => {
    const tribes = state.tribes
    const posts = state.posts

    if (!_.has(tribes, tribeId) || !_.has(tribes, `${tribeId}.${pageId}`)) {
        return []
    }

    // Tribe feed is stored as _id in tribe page and it needs to be merged with actual
    // feed item in Posts.js
    const feedRefs = _.get(tribes, `${tribeId}.${pageId}.feed`)
    let ret = feedRefs
        .map((r) => {
            // Check if reducer Posts.js has the object by checkng the ref
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

const getUserGoals = (state, tribeId, pageId) => {
    const tribes = _.get(state, 'tribes')
    const goals = _.get(state, 'goals')
    if (!_.has(tribes, tribeId) || !_.has(tribes, `${tribeId}.${pageId}`)) {
        return []
    }

    const goalRefs = _.get(tribes, `${tribeId}.${pageId}.goals.refs`, [])
    let ret = goalRefs
        .map((r) => {
            if (!_.has(goals, r)) {
                new SentryRequestBuilder(
                    "Goals don't have goalRef stored in Tribe",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.TRIBE.SELECTOR, 'getUserGoals')
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .withExtraContext(SENTRY_CONTEXT.GOAL.GOAL_ID, r)
                    .send()
                return undefined
            }
            return _.cloneDeep(_.get(goals, `${r}.goal`))
        })
        .filter((r) => r !== undefined)
    return ret
}

/**
 * Merge tribe refs in tribe hub with actual tribe objects
 * @param {Object} state reducer
 * @param {String} type TRIBE_TYPE
 */
const getTribesByType = (state, type) => {
    if (!_.has(TRIBE_TYPE, type)) {
        // Debugging purpose
        console.error(`${DEBUG_KEY}: invalid tribe type used: ${type}`)
        return []
    }

    const tribes = _.get(state, 'tribes')
    // TODO: tribe hub: rename myTribeTab to tribeHub
    const tribeRefs = _.get(state, `myTribeTab.${type}.data`)

    const ret = tribeRefs
        .map((r) => {
            // tribe ref is not loaded in the tribes yet
            if (!_.has(tribes, r)) return undefined
            // copy and return the tribe object
            return _.cloneDeep(_.get(tribes, `${r}.tribe`))
        })
        .filter((r) => r !== undefined)

    return ret
}

/**
 * Get feed for all tribes (Tribe hub) by merging tribe feed refs with posts objects
 * @param {*} state
 */
const getTribeFeed = (state) => {
    const posts = _.get(state, 'posts')
    // TODO: tribe hub: rename myTribeTab to tribeHub
    const feedRefs = _.get(state, `myTribeTab.feed.data`)

    const ret = feedRefs
        .map((r) => {
            // post is not loaded in the posts yet
            if (!_.has(posts, r)) return undefined
            // copy and return the post object
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

export const makeGetMyTribeFeedSelector = () =>
    createSelector([getMyTribeFeed], (feed) => feed)

/**
 * Select current user membership for a tribe by tribeId
 */
export const getMyTribeUserStatus = createSelector(
    [getMyTribeMembers, getUserId],
    (members, userId) => {
        if (!members) return ''
        let status
        members.map((member) => {
            if (!member || !member.memberRef || !member.category) {
                return ''
            }
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
        return members.filter(
            (member) =>
                member &&
                member.memberRef &&
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
            if (member && member.memberRef && member.memberRef._id === userId) {
                if (member.category === 'Admin') {
                    isAdmin = true
                }
            }
        })

        return isAdmin ? navigationStateToReturn : null
    }
)

/**
 * Get user goals to share on tribe
 * Inputs are: state, tribeId, pageId
 */
export const getUserGoalsForTribeShare = createSelector(
    [getUserGoals],
    (goals) => goals
)

/**
 * Maker for tribe selector, e.g.
 *
 * // Create selector in makeMapStateToProps
 * favoribeTribeSelector = makeTribesSelector()
 * managedTribeSelector = makeTribesSelector()
 *
 * // Use selector in mapStateToProps to get required data.
 * // This way we get the benefit of memorization of selector
 * const favoriteTribes = favoriteTribeSelector(state, TRIBE_TYPE.favorite)
 * const favoriteTribes = managedTribeSelector(state, TRIBE_TYPE.managed)
 *
 * NOTE: this might need further refactoring for get "others" tribe with type
 * like reqested tribe vs invited tribe vs tribe that user is a member of
 */
export const makeTribesSelector = () =>
    createSelector([getTribesByType], (tribes) => tribes)

/**
 * Maker for tribe feed selector, e.g.
 *
 * // Create selector
 * tribeFeedSelector = makeTribeFeedSelector();
 *
 * // Use selector get required data. This way we get the benefit of memorization of selector
 * const allTribeFeed = tribeFeedSelector(state)
 */
export const makeTribeFeedSelector = () =>
    createSelector([getTribeFeed], (posts) => posts)
