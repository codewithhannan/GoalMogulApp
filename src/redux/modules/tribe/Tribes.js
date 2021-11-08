/**
 * This reducer is the source of truth for Tribes related Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 *
 * @format
 */

import _ from 'lodash'
import { SentryRequestBuilder } from '../../../monitoring/sentry'
import {
    SENTRY_MESSAGE_TYPE,
    SENTRY_TAGS,
    SENTRY_MESSAGE_LEVEL,
    SENTRY_CONTEXT,
} from '../../../monitoring/sentry/Constants'
import {
    TRIBE_HUB_LOAD_DONE,
    TRIBE_HUB_REFRESH_DONE,
} from './MyTribeTabReducers'
/**
 * List of actions to add
 *
 * LIKE_POST
 * UNLIKE_POST
 *
 * MYTRIBE_EDIT_SUCCESS
 * (Done) MYTRIBE_SWITCH_TAB,
 * (Not used in actions) MYTRIBE_DETAIL_OPEN,
 * (Done) MYTRIBE_DETAIL_LOAD,
 * (Done) MYTRIBE_DETAIL_LOAD_SUCCESS,
 * (WIP) MYTRIBE_DETAIL_LOAD_FAIL,
 * (Done) MYTRIBE_DETAIL_CLOSE,
 * (Done) MYTRIBE_FEED_FETCH,
 * (Done) MYTRIBE_FEED_FETCH_DONE,
 * (Done) MYTRIBE_FEED_REFRESH,
 * (Done) MYTRIBE_FEED_REFRESH_DONE,
 * (Done) MYTRIBE_MEMBER_REMOVE_SUCCESS,  --> replaced by MYTRIBE_UPDATE_MEMBER_SUCCESS with updateType
 * (Done) MYTRIBE_PROMOTE_MEMBER_SUCCESS, --> replaced by MYTRIBE_UPDATE_MEMBER_SUCCESS with updateType
 * (Done) MYTRIBE_ACCEPT_MEMBER_SUCCESS,  --> replaced by MYTRIBE_UPDATE_MEMBER_SUCCESS with updateType
 * (Done) MYTRIBE_DEMOTE_MEMBER_SUCCESS,  --> replaced by MYTRIBE_UPDATE_MEMBER_SUCCESS with updateType
 * (Done) MYTRIBE_MEMBER_ACCEPT_SUCCESS,  --> replaced by MYTRIBE_UPDATE_MEMBER_SUCCESS with updateType
 * (Done) MYTRIBE_MEMBER_SELECT_FILTER,
 * (Done) MYTRIBE_REQUEST_JOIN_SUCCESS,
 * (Done) MYTRIBE_REQUEST_JOIN_ERROR,
 * (Done) MYTRIBE_REQUEST_JOIN,
 * (Done) MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
 * (Done) MYTRIBE_REQUEST_CANCEL_JOIN_ERROR,
 * (Done) MYTRIBE_REQUEST_CANCEL_JOIN
 * MYTRIBE_RESET --> change to MYTRIBE_CLOSE
 */
export const TRIBE_NATIVATION_ROUTES = {
    default: [
        { key: 'about', title: 'About' },
        { key: 'members', title: 'Participants' },
    ],
    member: [
        { key: 'about', title: 'About' },
        { key: 'posts', title: 'Posts' },
        { key: 'members', title: 'Participants' },
    ],
}

export const ALL_MEMBERS_FILTER_INDEX = 0
export const JOIN_REQUESTS_FILTER_INDEX = 1
export const PENDING_INVITES_FILTER_INDEX = 2
export const TRIBE_USER_ROUTES = {
    default: [
        { membersFilters: ['Admin', 'Member'], title: 'All Members' },
        { membersFilters: ['JoinRequester'], title: 'Join Requests' },
        { membersFilters: ['Invitee'], title: 'Pending Invite' },
    ],
}

export const MYTRIBE_NOT_FOUND = 'mytribe_not_found'
export const MYTRIBE_FEED_REFRESH = 'mytribe_feed_refresh'
export const MYTRIBE_UPDATE_MEMBER_SUCCESS = 'mytribe_update_member_success'
export const MYTRIBE_EDIT_SUCCESS = 'mytribe_edit_success'
export const MYTRIBE_MEMBER_INVITE_FAIL = 'mytribe_member_invite_fail'
export const MYTRIBE_MEMBER_INVITE_SUCCESS = 'mytribe_member_invite_success'
export const MYTRIBE_DELETE_SUCCESS = 'mytribe_delete_success'
export const MYTRIBE_SWITCH_TAB = 'mytribe_switch_tab'
export const MYTRIBE_DETAIL_OPEN = 'mytribe_detail_open'
export const MYTRIBE_DETAIL_LOAD = 'mytribe_detail_load'
// Successfully load tribe detail
export const MYTRIBE_DETAIL_LOAD_SUCCESS = 'mytribe_detail_load_success'
// Failed to load tribe detail
export const MYTRIBE_DETAIL_LOAD_FAIL = 'mytribe_detail_load_fail'
export const MYTRIBE_DETAIL_CLOSE = 'mytribe_detail_close'
export const MYTRIBE_FEED_FETCH = 'mytribe_feed_fetch'
export const MYTRIBE_FEED_FETCH_DONE = 'mytribe_feed_fetch_done'
export const MYTRIBE_FEED_REFRESH_DONE = 'mytribe_feed_refresh_done'
export const MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS =
    'mytribe_request_cancel_join_success'
export const MYTRIBE_REQUEST_CANCEL_JOIN_ERROR =
    'mytribe_request_cancel_join_error'
export const MYTRIBE_REQUEST_CANCEL_JOIN = 'mytribe_request_cancel_join'
export const MYTRIBE_REQUEST_JOIN_SUCCESS = 'mytribe_request_join_success'
export const MYTRIBE_REQUEST_JOIN_ERROR = 'mytribe_request_join_error'
export const MYTRIBE_REQUEST_JOIN = 'mytribe_request_join'
export const MYTRIBE_MEMBER_SELECT_FILTER = 'mytribe_member_select_filter'
// Either reject user join request or remove user from tribe
export const MYTRIBE_MEMBER_REMOVE_SUCCESS = 'mytribe_member_remove_success'
export const MYTRIBE_DEMOTE_MEMBER_SUCCESS = 'mytribe_demote_member_success'
export const MYTRIBE_PROMOTE_MEMBER_SUCCESS = 'mytribe_promote_member_success'
// admin accept join request
export const MYTRIBE_ACCEPT_MEMBER_SUCCESS = 'mytribe_accept_member_success'
// user accept invitation
export const MYTRIBE_MEMBER_ACCEPT_SUCCESS = 'mytribe_member_accept_success'
// Tribe goal related constants
export const MYTRIBE_GOAL_LOAD = 'mytribe_goal_load'
export const MYTRIBE_GOAL_LOAD_DONE = 'mytribe_goal_load_done'
export const MYTRIBE_GOAL_REFRESH = 'mytribe_goal_refresh'
export const MYTRIBE_GOAL_REFRESH_DONE = 'mytribe_goal_refresh_done'
export const MYTRIBE_FRIEND_INVITE_SELECTED_ITEM =
    'mytribe_friend_invite_selected_item'
export const MYTRIBE_FRIEND_INVITE_UNSELECTED_ITEM =
    'mytribe_friend_invite_unselected_item'
export const MYTRIBE_FRIEND_CLEAR = 'mytribe_friend_clear'

export const MEMBER_UPDATE_TYPE = {
    promoteAdmin: 'promoteAdmin',
    removeMember: 'removeMember',
    demoteMember: 'demoteMember',
    acceptMember: 'acceptMember', // can be either Admin accepts join request or user accepts invite
}

// page metadata related to a tribe page
export const INITIAL_TRIBE_PAGE = {
    navigationState: {
        index: 0,
        routes: _.cloneDeep(TRIBE_NATIVATION_ROUTES.member),
    },
    selectedTab: 'about',
    /*
     feed is put inside the TRIBE_PAGE as we don't want scrolling context to lose when other pages are refreshing
    */
    feed: [], // list of postIds that should be available in Posts
    feedLoading: false,
    feedRefreshing: false,
    allFeedRefs: [], // list of all post refs that this tribe has ever load. This is for cleanup purpose.
    tribeLoading: false,
    goals: {
        skip: 0,
        limit: 50,
        hasNextPage: undefined,
        refs: [], // current user's goal references
        allRefs: [], // all loaded user's goal references
        refreshing: false,
        loading: false,
    },
    hasNextPage: undefined,
    updating: false,
    membersFilters: ['Admin', 'Member'],
    skip: 0,
    limit: 10,
    memberNavigationState: {
        index: 0,
        routes: _.cloneDeep(TRIBE_USER_ROUTES.default),
    },
}

/**
 * tribe object in redux that is mapped to a tribeId. Whenever tribe
 * is opened in a new page, a new INITIAL_TRIBE_PAGE is created
 */
const INITIAL_TRIBE_OBJECT = {
    tribe: {},
    hasRequested: undefined,
    reference: [],
}

// keeps a map between tribeId --> tribe object
const INITIAL_STATE = { selectedItemFriend: [] }

const DEBUG_KEY = '[ Reducer Tribes ]'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // This case is currently not used anywhere
        // case MYTRIBE_DETAIL_OPEN:
        case MYTRIBE_DETAIL_CLOSE: // Tribe detail on close
        case MYTRIBE_NOT_FOUND: {
            // Tribe can't be opened as user has no previlege to view
            const { tribeId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (
                !_.has(newState, tribeId) ||
                !_.has(newState, `${tribeId}.${pageId}`)
            ) {
                // Nothing to cleanup
                return newState
            }

            let tribeToUpdate = _.get(newState, tribeId)
            let referenceToUpdate = removeReference(
                _.get(tribeToUpdate, 'reference'),
                pageId
            )

            // Remove page from tribe object
            tribeToUpdate = _.omit(tribeToUpdate, `${pageId}`)

            // Remove this tribe if it's no longer referenced
            if (!referenceToUpdate || _.isEmpty(referenceToUpdate)) {
                newState = _.omit(newState, `${tribeId}`)
                return newState
            }

            // Update the tribe object references
            tribeToUpdate = _.set(tribeToUpdate, 'reference', referenceToUpdate)

            // Update the tribe by tribeId in new state
            newState = _.set(newState, `${tribeId}`, tribeToUpdate)
            return newState
        }

        case MYTRIBE_DETAIL_LOAD: {
            // tribe detail starts loading. Preset the page data
            const { tribeId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            let tribeObjectToUpdate = _.has(newState, tribeId)
                ? _.get(newState, tribeId)
                : _.cloneDeep(INITIAL_TRIBE_OBJECT)

            if (!pageId) {
                new SentryRequestBuilder(
                    "PageId doesn't exist",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.TRIBE.REDUCER, MYTRIBE_DETAIL_LOAD)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                return newState
            }

            // initialize page for this tribe
            if (!_.has(tribeObjectToUpdate, pageId)) {
                tribeObjectToUpdate = _.set(
                    tribeObjectToUpdate,
                    pageId,
                    _.cloneDeep(INITIAL_TRIBE_PAGE)
                )
            }

            // Update the reference
            const referenceToUpdate = addReference(
                _.get(tribeObjectToUpdate, 'reference'),
                pageId
            )
            tribeObjectToUpdate = _.set(
                tribeObjectToUpdate,
                'reference',
                referenceToUpdate
            )

            // set page tribeLoading to true
            tribeObjectToUpdate = _.set(
                tribeObjectToUpdate,
                `${pageId}.tribeLoading`,
                true
            )

            // Update tribe object
            newState = _.set(newState, tribeId, tribeObjectToUpdate)
            return newState
        }
        case MYTRIBE_FRIEND_INVITE_SELECTED_ITEM: {
            const newState = _.cloneDeep(state)
            const { selectedItemFriend } = action.payload
            console.log('MY TRIBE FRIENDS', selectedItemFriend)
            if (state.selectedItemFriend.length > 0) {
                if (
                    !state.selectedItemFriend.some(
                        (e) => e._id === selectedItemFriend._id
                    )
                ) {
                    console.log('IF THIS CONDITION')
                    return _.set(newState, `selectedItemFriend`, [
                        ...state.selectedItemFriend,
                        selectedItemFriend,
                    ])
                } else {
                    return _.set(
                        newState,
                        `selectedItemFriend`,
                        state.selectedItemFriend
                    )
                }
            } else {
                return _.set(newState, `selectedItemFriend`, [
                    selectedItemFriend,
                ])
            }
        }

        case MYTRIBE_FRIEND_INVITE_UNSELECTED_ITEM: {
            const newState = _.cloneDeep(state)
            const { selectedItemFriend } = action.payload
            console.log('MY TRIBE FRIENDS', selectedItemFriend)

            if (
                state.selectedItemFriend.some(
                    (e) => e._id === selectedItemFriend._id
                )
            ) {
                console.log('IF THIS CONDITION UNSELECTED')
                var filtered = state.selectedItemFriend.filter(
                    (e) => e._id !== selectedItemFriend._id
                )
                return _.set(newState, `selectedItemFriend`, filtered)
            } else {
                return _.set(
                    newState,
                    `selectedItemFriend`,
                    state.selectedItemFriend
                )
            }
        }

        case MYTRIBE_FRIEND_CLEAR: {
            const newState = _.cloneDeep(state)
            return _.set(newState, `selectedItemFriend`, [])
        }
        case MYTRIBE_DETAIL_LOAD_SUCCESS: {
            // Tribe object load finishes.
            const { tribeId, pageId, tribe } = action.payload
            let newState = _.cloneDeep(state)
            let tribeObjectToUpdate = _.has(newState, tribeId)
                ? _.get(newState, tribeId)
                : _.cloneDeep(INITIAL_TRIBE_OBJECT)

            if (!pageId) {
                // pageId doesn't exist log error.
                new SentryRequestBuilder(
                    "PageId doesn't exist",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(
                        SENTRY_TAGS.TRIBE.REDUCER,
                        MYTRIBE_DETAIL_LOAD_SUCCESS
                    )
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                return newState
            }

            // initialize page for this tribe if not existing. But it should contain page by now.
            if (!_.has(tribeObjectToUpdate, pageId)) {
                tribeObjectToUpdate = _.set(
                    tribeObjectToUpdate,
                    pageId,
                    _.cloneDeep(INITIAL_TRIBE_PAGE)
                )
            }

            // Update the reference
            const referenceToUpdate = addReference(
                _.get(tribeObjectToUpdate, 'reference'),
                pageId
            )
            tribeObjectToUpdate = _.set(
                tribeObjectToUpdate,
                'reference',
                referenceToUpdate
            )

            // set tribe item that is loaded
            tribeObjectToUpdate = _.set(tribeObjectToUpdate, 'tribe', tribe)
            // set page tribeLoading to false
            tribeObjectToUpdate = _.set(
                tribeObjectToUpdate,
                `${pageId}.tribeLoading`,
                false
            )

            // Update tribe object
            newState = _.set(newState, tribeId, tribeObjectToUpdate)
            return newState
        }

        case MYTRIBE_FEED_REFRESH: {
            // feed starts refreshing
            const { pageId, tribeId } = action.payload
            let newState = _.cloneDeep(state)
            if (
                !_.has(newState, tribeId) ||
                !_.has(newState, `${tribeId}.${pageId}`)
            ) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId or pageId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.TRIBE.REDUCER, MYTRIBE_FEED_REFRESH)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: ${action.type}`
                // )
                return newState
            }

            // Set feedRefreshing to true
            newState = _.set(
                newState,
                `${tribeId}.${pageId}.feedRefreshing`,
                true
            )
            return newState
        }

        case MYTRIBE_FEED_FETCH: {
            // feed starts loading more
            const { pageId, tribeId } = action.payload
            let newState = _.cloneDeep(state)
            if (
                !_.has(newState, tribeId) ||
                !_.has(newState, `${tribeId}.${pageId}`)
            ) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId or pageId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.TRIBE.REDUCER, MYTRIBE_FEED_FETCH)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: ${action.type}`
                // )
                return newState
            }

            // Set feedLoading to true
            newState = _.set(newState, `${tribeId}.${pageId}.feedLoading`, true)
            return newState
        }

        case MYTRIBE_FEED_FETCH_DONE: {
            // load more of the tribe feed finish
            const { pageId, tribeId, hasNextPage, data, skip } = action.payload
            let newState = _.cloneDeep(state)
            if (
                !_.has(newState, tribeId) ||
                !_.has(newState, `${tribeId}.${pageId}`)
            ) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId or pageId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.TRIBE.REDUCER, MYTRIBE_FEED_FETCH_DONE)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: ${action.type}`
                // )
                return newState
            }

            let tribePageToUpdate = _.get(newState, `${tribeId}.${pageId}`)
            // Update metadata
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'hasNextPage',
                hasNextPage
            )
            tribePageToUpdate = _.set(tribePageToUpdate, 'skip', skip)
            tribePageToUpdate = _.set(tribePageToUpdate, 'feedLoading', false)

            // Merge new post references
            const postRefs = data ? data.map((d) => d._id) : []
            const currPostRefs = _.get(tribePageToUpdate, 'feed')
            const curAllFeedRefs = _.get(tribePageToUpdate, 'allFeedRefs')
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'feed',
                _.uniq(currPostRefs.concat(postRefs))
            )

            // Update all feed refs for cleanup
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'allFeedRefs',
                _.union(curAllFeedRefs, postRefs)
            )

            // Update tribe page in new state
            newState = _.set(
                newState,
                `${tribeId}.${pageId}`,
                tribePageToUpdate
            )

            return newState
        }

        case MYTRIBE_FEED_REFRESH_DONE: {
            // refresh tribe feed finish
            const { pageId, tribeId, hasNextPage, data, skip } = action.payload
            let newState = _.cloneDeep(state)
            if (
                !_.has(newState, tribeId) ||
                !_.has(newState, `${tribeId}.${pageId}`)
            ) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId or pageId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(
                        SENTRY_TAGS.TRIBE.REDUCER,
                        MYTRIBE_FEED_REFRESH_DONE
                    )
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: ${action.type}`
                // )
                return newState
            }

            let tribePageToUpdate = _.get(newState, `${tribeId}.${pageId}`)
            // Update metadata
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'hasNextPage',
                hasNextPage
            )
            tribePageToUpdate = _.set(tribePageToUpdate, 'skip', skip)
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'feedRefreshing',
                false
            ) // update feedRefreshing since this is refreshing on complete

            // Merge new post references
            const postRefs = data ? data.map((d) => d._id) : []
            const curAllFeedRefs = _.get(tribePageToUpdate, 'allFeedRefs')
            // replace feed
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'feed',
                _.uniq(postRefs)
            )

            // Update all feed refs for cleanup
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'allFeedRefs',
                _.union(curAllFeedRefs, postRefs)
            )

            // Update tribe page in new state
            newState = _.set(
                newState,
                `${tribeId}.${pageId}`,
                tribePageToUpdate
            )
            return newState
        }

        case MYTRIBE_UPDATE_MEMBER_SUCCESS: {
            const { userId, tribeId, updateType } = action.payload
            let newState = _.cloneDeep(state)
            if (!updateType) {
                return newState
            }

            if (!_.has(newState, tribeId)) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(
                        SENTRY_TAGS.TRIBE.REDUCER,
                        MYTRIBE_UPDATE_MEMBER_SUCCESS
                    )
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
                    .withExtraContext(
                        SENTRY_CONTEXT.MEMBER_UPDATE_TYPE,
                        updateType
                    )
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId: ${tribeId} doesn't exist in redux for action: `,
                //     action
                // )
                return newState
            }

            let tribeToUpdate = _.get(newState, tribeId)
            const oldMembers = _.get(tribeToUpdate, 'tribe.members', [])
            let newMembers = oldMembers
            if (updateType == MEMBER_UPDATE_TYPE.promoteAdmin) {
                newMembers = updateMemberStatus(oldMembers, userId, 'Admin')
            } else if (updateType == MEMBER_UPDATE_TYPE.removeMember) {
                newMembers = oldMembers.filter(
                    (member) =>
                        member &&
                        member.memberRef &&
                        member.memberRef._id !== userId
                )
            } else if (
                updateType == MEMBER_UPDATE_TYPE.demoteMember ||
                updateType == MEMBER_UPDATE_TYPE.acceptMember
            ) {
                newMembers = updateMemberStatus(oldMembers, userId, 'Member')
            } else {
                new SentryRequestBuilder(
                    'Member update type is not supported',
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(
                        SENTRY_TAGS.TRIBE.REDUCER,
                        MYTRIBE_UPDATE_MEMBER_SUCCESS
                    )
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
                    .withExtraContext(
                        SENTRY_CONTEXT.MEMBER_UPDATE_TYPE,
                        updateType
                    )
                    .send()
            }

            tribeToUpdate = _.set(tribeToUpdate, 'tribe.members', newMembers)
            // Set new tribe in new state
            newState = _.set(newState, tribeId, tribeToUpdate)
            return newState
        }

        case MYTRIBE_MEMBER_SELECT_FILTER: {
            const { option, index, tribeId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (
                !_.has(newState, tribeId) ||
                !_.has(newState, `${tribeId}.${pageId}`)
            ) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId or pageId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(
                        SENTRY_TAGS.TRIBE.REDUCER,
                        MYTRIBE_MEMBER_SELECT_FILTER
                    )
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: `,
                //     action
                // )
                return newState
            }

            let tribePageToUpdate = _.get(newState, `${tribeId}.${pageId}`)
            if (option) {
                tribePageToUpdate = _.set(
                    tribePageToUpdate,
                    'membersFilters',
                    option
                )
            }
            if (index || index === 0) {
                tribePageToUpdate = _.set(
                    tribePageToUpdate,
                    'memberNavigationState.index',
                    index
                )
            }

            newState = _.set(
                newState,
                `${tribeId}.${pageId}`,
                tribePageToUpdate
            )
            return newState
        }

        case MYTRIBE_REQUEST_JOIN_SUCCESS: {
            const { userId, tribeId, member, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (
                !_.has(newState, tribeId) ||
                !_.has(newState, `${tribeId}.${pageId}`)
            ) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId or pageId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(
                        SENTRY_TAGS.TRIBE.REDUCER,
                        MYTRIBE_REQUEST_JOIN_SUCCESS
                    )
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId: ${tribeId} or pageId: ${pageId} is not in redux for action`,
                //     action
                // )
                return newState
            }

            let tribeToUpdate = _.get(newState, tribeId)

            const oldMembers = _.get(tribeToUpdate, 'tribe.members')
            // on my Tribe Tab page, we haven't fetched tribe.members yet
            if (oldMembers) {
                let newMembers = oldMembers.filter(
                    (m) => m && m.memberRef && m.memberRef._id !== userId
                )
                newMembers = newMembers.concat(member)
                tribeToUpdate = _.set(
                    tribeToUpdate,
                    'tribe.members',
                    newMembers
                )
            } else {
                tribeToUpdate = _.set(tribeToUpdate, 'tribe.members', [member])
            }

            tribeToUpdate = _.set(tribeToUpdate, 'hasRequested', true)
            tribeToUpdate = _.set(tribeToUpdate, `${pageId}.updating`, false)
            newState = _.set(newState, tribeId, tribeToUpdate)
            return newState
        }

        case MYTRIBE_REQUEST_CANCEL_JOIN_ERROR:
        case MYTRIBE_REQUEST_JOIN_ERROR: {
            const { tribeId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (
                !_.has(newState, tribeId) ||
                !_.has(newState, `${tribeId}.${pageId}`)
            ) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId or pageId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(
                        SENTRY_TAGS.TRIBE.REDUCER,
                        MYTRIBE_REQUEST_JOIN_ERROR
                    )
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: `,
                //     action
                // )
                return newState
            }

            return _.set(newState, `${tribeId}.${pageId}.updating`, false)
        }

        case MYTRIBE_REQUEST_JOIN:
        case MYTRIBE_REQUEST_CANCEL_JOIN: {
            const { tribeId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (
                !_.has(newState, tribeId) ||
                !_.has(newState, `${tribeId}.${pageId}`)
            ) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId or pageId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.TRIBE.REDUCER, MYTRIBE_REQUEST_JOIN)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: `,
                //     action
                // )
                return newState
            }

            return _.set(newState, `${tribeId}.${pageId}.updating`, true)
        }

        case MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS: {
            const { userId, tribeId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (
                !_.has(newState, tribeId) ||
                !_.has(newState, `${tribeId}.${pageId}`)
            ) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId or pageId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(
                        SENTRY_TAGS.TRIBE.REDUCER,
                        MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS
                    )
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId: ${tribeId} or pageID ${pageId} is not in redux for action`,
                //     action
                // )
                return newState
            }

            let tribeToUpdate = _.get(newState, tribeId)

            const oldMembers = _.get(tribeToUpdate, 'tribe.members')

            if (oldMembers) {
                // Keep members that have no memberRef (invitee) or are not current user
                let newMembers = oldMembers.filter(
                    (m) => !m.memberRef || m.memberRef._id !== userId
                )
                tribeToUpdate = _.set(
                    tribeToUpdate,
                    'tribe.members',
                    newMembers
                )
            }

            tribeToUpdate = _.set(tribeToUpdate, 'hasRequested', false)
            tribeToUpdate = _.set(tribeToUpdate, `${pageId}.updating`, false)

            newState = _.set(newState, tribeId, tribeToUpdate)
            return newState
        }

        case MYTRIBE_SWITCH_TAB: {
            const { index, tribeId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (
                !_.has(newState, tribeId) ||
                !_.has(newState, `${tribeId}.${pageId}`)
            ) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId or pageId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.TRIBE.REDUCER, MYTRIBE_SWITCH_TAB)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.PAGE.PAGE_ID, pageId)
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId: ${tribeId} is not in redux for action`,
                //     action
                // )
                return newState
            }

            let newNavigationState = _.get(
                newState,
                `${tribeId}.${pageId}.navigationState`
            )
            newNavigationState = _.set(newNavigationState, 'index', index)

            newState = _.set(
                newState,
                `${tribeId}.${pageId}.navigationState`,
                newNavigationState
            )
            return newState
        }

        case MYTRIBE_EDIT_SUCCESS: {
            const { newTribe, tribeId } = action.payload
            let newState = _.cloneDeep(state)

            if (!_.has(newState, tribeId)) {
                new SentryRequestBuilder(
                    "Tribes doesn't contain tribeId",
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                    .withTag(SENTRY_TAGS.TRIBE.REDUCER, MYTRIBE_EDIT_SUCCESS)
                    .withExtraContext(SENTRY_CONTEXT.TRIBE.TRIBE_ID, tribeId)
                    .send()
                // console.error(
                //     `${DEBUG_KEY}: tribeId: ${tribeId} is not in redux for action`,
                //     action
                // )
                return newState
            }

            let tribeToUpdate = _.get(newState, tribeId)
            const oldTribe = _.get(tribeToUpdate, 'tribe')
            const updatedTribe = updateTribe(oldTribe, newTribe)
            tribeToUpdate = _.set(tribeToUpdate, 'tribe', updatedTribe)

            newState = _.set(newState, tribeId, tribeToUpdate)
            return newState
        }

        case MYTRIBE_GOAL_REFRESH: {
            const { tribeId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, `${tribeId}.${pageId}.goals`)) {
                return newState
            }
            newState = _.set(
                newState,
                `${tribeId}.${pageId}.goals.refreshing`,
                true
            )
            return newState
        }

        case MYTRIBE_GOAL_LOAD: {
            const { tribeId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, `${tribeId}.${pageId}.goals`)) {
                return newState
            }
            newState = _.set(
                newState,
                `${tribeId}.${pageId}.goals.loading`,
                true
            )
            return newState
        }

        case MYTRIBE_GOAL_LOAD_DONE: {
            const { tribeId, pageId, data, skip, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, `${tribeId}.${pageId}.goals`)) {
                return newState
            }

            let tribePageToUpdate = _.get(newState, `${tribeId}.${pageId}`)

            // Update metadata
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'goals.hasNextPage',
                hasNextPage
            )
            tribePageToUpdate = _.set(tribePageToUpdate, 'goals.skip', skip)
            tribePageToUpdate = _.set(tribePageToUpdate, 'goals.loading', false)

            // Merge new goal references
            const goalRefs = data ? data.map((d) => d._id) : []
            const currGoalRefs = _.get(tribePageToUpdate, 'goals.refs')
            const curAllGoalRefs = _.get(tribePageToUpdate, 'goals.allRefs')
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'goals.refs',
                _.uniq(currGoalRefs.concat(goalRefs))
            )

            // Update all goal refs for cleanup
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'goals.allRefs',
                _.union(curAllGoalRefs, goalRefs)
            )

            // Update tribe page in new state
            newState = _.set(
                newState,
                `${tribeId}.${pageId}`,
                tribePageToUpdate
            )
            return newState
        }

        case MYTRIBE_GOAL_REFRESH_DONE: {
            const { tribeId, pageId, data, skip, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, `${tribeId}.${pageId}.goals`)) {
                return newState
            }

            let tribePageToUpdate = _.get(newState, `${tribeId}.${pageId}`)

            // Update metadata
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'goals.hasNextPage',
                hasNextPage
            )
            tribePageToUpdate = _.set(tribePageToUpdate, 'goals.skip', skip)
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'goals.refreshing',
                false
            )

            // Merge new goal references
            const goalRefs = data ? data.map((d) => d._id) : []
            const curAllGoalRefs = _.get(tribePageToUpdate, 'goals.allRefs')
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'goals.refs',
                _.uniq(goalRefs)
            )

            // Update all goal refs for cleanup
            tribePageToUpdate = _.set(
                tribePageToUpdate,
                'goals.allRefs',
                _.union(curAllGoalRefs, goalRefs)
            )

            // Update tribe page in new state
            newState = _.set(
                newState,
                `${tribeId}.${pageId}`,
                tribePageToUpdate
            )
            return newState
        }

        // Tribe group load tribes
        case TRIBE_HUB_LOAD_DONE:
        case TRIBE_HUB_REFRESH_DONE: {
            const { data, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (!data || _.isEmpty(data)) return newState

            data.forEach((tribe) => {
                const tribeId = tribe._id

                let tribeToUpdate = { ...INITIAL_TRIBE_OBJECT }
                // Update goal
                if (_.has(newState, tribeId)) {
                    tribeToUpdate = _.get(newState, tribeId)
                }

                if (tribe !== undefined) {
                    // only update tribe's fields if not exist, do not overwrite tribe object
                    const oldTribe = _.get(tribeToUpdate, 'tribe')
                    const updatedTribe = updateTribe(oldTribe, tribe)
                    tribeToUpdate = _.set(tribeToUpdate, 'tribe', updatedTribe)
                }

                // Put pageId onto reference if not previously existed
                let newReference = [`${pageId}`]
                if (_.has(newState, tribeId)) {
                    const oldReference = _.get(newState, `${tribeId}.reference`)
                    newReference = _.uniq(oldReference.concat(pageId))
                }
                tribeToUpdate = _.set(tribeToUpdate, 'reference', newReference)
                if (!_.has(tribeToUpdate, pageId)) {
                    tribeToUpdate = _.set(
                        tribeToUpdate,
                        pageId,
                        _.cloneDeep(INITIAL_TRIBE_PAGE)
                    )
                }
                newState = _.set(newState, tribeId, tribeToUpdate)
            })
            return newState
        }

        case MYTRIBE_DETAIL_LOAD_FAIL: // TODO: tribe: Load tribe detail failed
        default:
            return { ...state }
    }
}

/**
 * Check if oldReference contains newPageId. Otherwise, add to the reference and return
 * @param {*} oldReference
 * @param {*} newPageId
 */
const addReference = (oldReference, newPageId) => {
    let referenceToReturn = _.cloneDeep(oldReference)
    if (referenceToReturn !== undefined) {
        if (!referenceToReturn.some((r) => r === newPageId)) {
            // Add new pageId to reference
            referenceToReturn = referenceToReturn.concat(newPageId)
        }
    }
    return referenceToReturn
}

/**
 * Remove pageId from oldReference if it contains pageId
 * @param {*} oldReference
 * @param {*} pageId
 */
const removeReference = (oldReference, pageId) => {
    let referenceToUpdate = _.cloneDeep(oldReference)
    if (
        referenceToUpdate !== undefined &&
        referenceToUpdate.some((r) => r === pageId)
    ) {
        referenceToUpdate = referenceToUpdate.filter((r) => r !== pageId)
    }
    return referenceToUpdate
}

/**
 * Update member status in member list to new category
 * @param {*} members
 * @param {*} memberIdToUpdate
 * @param {*} newCategory
 */
const updateMemberStatus = (members, memberIdToUpdate, newCategory) => {
    const newMembers = members.map((member) => {
        if (member.memberRef._id === memberIdToUpdate) {
            return _.set(member, 'category', newCategory)
        }
        return member
    })
    return newMembers
}

/**
 * Update the field of oldTribe
 * @param {*} oldTribe
 * @param {*} newTribe
 */
const updateTribe = (oldTribe, newTribe) => {
    let updatedTribe = _.cloneDeep(oldTribe)
    Object.keys(newTribe).forEach((key) => {
        // oldEvent doesn't have the field
        if (!oldTribe[key] || oldTribe[key] !== newTribe[key]) {
            updatedTribe = _.set(updatedTribe, `${key}`, newTribe[key])
        }
    })
    return updatedTribe
}
