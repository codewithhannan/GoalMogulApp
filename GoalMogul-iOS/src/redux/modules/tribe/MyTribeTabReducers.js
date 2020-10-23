/**
 * In V1, this reducer stores information for my tribes. In V2, this reducer has been refactored to
 * store related information for tribe hub including
 * - All tribe feed
 * - Your tribes (favorite tribe, managed tribes, others)
 * - Discover (tribe recommendations)
 *
 * Tribe id is stored as reference and tribe object is stored in Tribes.js as the
 * source of truth for all tribe.
 *
 * Code / section with comment "// TODO: cleanup" refers to legacy code that
 * should be cleaned up once tribe hub is finished
 *
 * This file is to be renamed as TribeHub.js once legacy code is cleaned up
 *
 * @format
 */

import _ from 'lodash'
import { arrayUnique } from '../../middleware/utils'

import {
    MYTRIBE_DETAIL_OPEN,
    MYTRIBE_DETAIL_CLOSE,
    MYTRIBE_DELETE_SUCCESS,
    MYTRIBE_UPDATE_MEMBER_SUCCESS,
    MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
    MEMBER_UPDATE_TYPE,
} from './Tribes'

import { TRIBE_TYPE } from './TribeHubActions'

import { TRIBE_NEW_SUBMIT_SUCCESS } from './NewTribeReducers'

// initial state for a list page
const INITIAL_PAGE_STATE = {
    data: [],
    skip: 0,
    limit: 10,
    hasNextPage: undefined,
    loading: false,
    refreshing: false,
}

const INITIAL_STATE = {
    sortBy: 'created',
    // ['Admin', 'Member', 'JoinRequester', 'Invitee']
    filterForMembershipCategory: 'MyTribes',
    navigationState: {
        index: 0,
        routes: [
            { key: 'MyTribes', title: 'My Tribes' },
            { key: 'Invitee', title: 'Invited' },
            { key: 'JoinRequester', title: 'Requested' },
        ],
    },
    // Below are tribe hub related data
    favorite: _.cloneDeep(INITIAL_PAGE_STATE),
    admin: _.cloneDeep(INITIAL_PAGE_STATE),
    member: _.cloneDeep(INITIAL_PAGE_STATE),
    requested: _.cloneDeep(INITIAL_PAGE_STATE),
    invited: _.cloneDeep(INITIAL_PAGE_STATE),
    feed: _.cloneDeep(INITIAL_PAGE_STATE),
}

const sortByList = ['name', 'created']

// TODO: tribe hub: rename these constants with prefix TRIBE_HUB
export const MYTRIBETAB_OPEN = 'mytribetab_open'
export const MYTRIBETAB_CLOSE = 'mytribetab_close'
export const MYTRIBETAB_REFRESH_DONE = 'mytribetab_refresh_done'
export const MYTRIBETAB_LOAD = 'mytribetab_load'
export const MYTRIBETAB_SORTBY = 'mytribetab_sortby'
export const MYTRIBETAB_UPDATE_FILTEROPTIONS = 'mytribetab_update_filteroptions'
export const MYTRIBETAB_UPDATE_TAB = 'mytribetab_update_tab'

/* Backward compatible constants for tribe hub */
// tribes
export const TRIBE_HUB_REFRESH = 'tribe_hub_refresh'
export const TRIBE_HUB_REFRESH_DONE = 'tribe_hub_refresh_done'
export const TRIBE_HUB_LOAD = 'tribe_hub_load'
export const TRIBE_HUB_LOAD_DONE = 'tribe_hub_load_done'
// TODO: tribe hub: feed
export const TRIBE_HUB_FEED_REFRESH = 'tribe_hub_feed_refresh'
export const TRIBE_HUB_FEED_REFRESH_DONE = 'tribe_hub_feed_refresh_done'
export const TRIBE_HUB_FEED_LOAD = 'tribe_hub_feed_load'
export const TRIBE_HUB_FEED_LOAD_DONE = 'tribe_hub_feed_load_done'
// TODO: tribe hub: manage tribe states
export const TRIBE_HUB_FAVORITE_TRIBE = 'tribe_hub_favorite_tribe'
export const TRIBE_HUB_FAVORITE_TRIBE_DONE = 'tribe_hub_favorite_tribe_done'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // Open my tribe modal
        case MYTRIBE_DETAIL_CLOSE:
        case MYTRIBETAB_OPEN: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'showModal', true)
        }

        // New tribe is created
        case TRIBE_NEW_SUBMIT_SUCCESS: {
            let newState = _.cloneDeep(state)
            const { data } = action.payload
            if (!data) return newState

            const admin = TRIBE_TYPE.admin
            const oldData = _.get(newState, `${admin}.data`)
            const newData = arrayUnique(oldData.concat(data)).sort(
                (item1, item2) =>
                    new Date(item2.created) - new Date(item1.created)
            )
            newState = _.set(newState, `${admin}.data`, newData)
            return newState
        }

        // Open my event modal
        case MYTRIBE_DETAIL_OPEN:
        case MYTRIBETAB_CLOSE: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'showModal', false)
        }

        // One tribe is deleted
        case MYTRIBE_DELETE_SUCCESS: {
            const { tribeId } = action.payload
            let newState = _.cloneDeep(state)

            const admin = TRIBE_TYPE.admin
            const curAdminTribeRef = _.get(newState, `${admin}.data`)
            const newAdminTribeRef = curAdminTribeRef.filter(
                (d) => d && d !== tribeId
            )
            newState = _.set(newState, `${admin}.data`, newAdminTribeRef)

            return newState
        }

        // case related to filtering
        case MYTRIBETAB_SORTBY: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'sortBy', action.payload)
        }

        case MYTRIBETAB_UPDATE_FILTEROPTIONS: {
            // TODO: valid filter options
            let newState = _.cloneDeep(state)
            return _.set(
                newState,
                'filterForMembershipCategory',
                action.payload
            )
        }

        // Update tab selection
        case MYTRIBETAB_UPDATE_TAB: {
            const { index } = action.payload
            let newState = _.cloneDeep(state)

            return _.set(newState, 'navigationState.index', index)
        }

        case TRIBE_HUB_REFRESH: {
            const { type } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, `${type}.refreshing`)) {
                // For debugging purpose since type passed isn't one of defined ['favorite', 'managed', 'others']
                console.error(
                    `${DEBUG_KEY}: ${action.type}: incorrect type: ${type} used in action`
                )
                return newState
            }
            newState = _.set(newState, `${type}.refreshing`, true)
            return newState
        }

        case TRIBE_HUB_LOAD: {
            const { type } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, `${type}.loading`)) {
                // For debugging purpose since type passed isn't one of defined ['favorite', 'managed', 'others']
                console.error(
                    `${DEBUG_KEY}: ${action.type}: incorrect type: ${type} used in action`
                )
                return newState
            }
            newState = _.set(newState, `${type}.loading`, true)
            return newState
        }

        case TRIBE_HUB_REFRESH_DONE: {
            const { data, type } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, `${type}`)) {
                // For debugging purpose since type passed isn't one of defined ['favorite', 'managed', 'others']
                console.error(
                    `${DEBUG_KEY}: ${action.type}: incorrect type: ${type} used in action`
                )
                return newState
            }
            // Set tribe reference
            // NOTE: we might lose reference here
            const tribeRef = data
                .map((d) => d._id)
                .filter((d) => d !== undefined)
            //TODO: instead of set data, set reference.
            newState = _.set(newState, `${type}.data`, tribeRef)

            // Set page metadata
            newState = _.set(newState, `${type}.refreshing`, false)
            newState = _.set(newState, `${type}.skip`, data.length)
            newState = _.set(newState, `${type}.hasNextPage`, !data.length)
            return newState
        }

        case TRIBE_HUB_LOAD_DONE: {
            const { data, type } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, `${type}`)) {
                // For debugging purpose since type passed isn't one of defined ['favorite', 'managed', 'others']
                console.error(
                    `${DEBUG_KEY}: ${action.type}: incorrect type: ${type} used in action`
                )
                return newState
            }

            // Set tribe reference
            // NOTE: we might lose reference here
            const curTribeRef = _.get(newState, `${type}.data`)
            const newTribeRef = data
                .map((d) => d._id)
                .filter((d) => d !== undefined)
            // newState = _.set(
            //     newState,
            //     `${type}.data`,
            //     _.uniq(curTribeRef, newTribeRef)
            // )
            newState = _.set(newState, `${type}.data`, newTribeRef)

            // Set page metadata
            newState = _.set(newState, `${type}.loading`, false)
            // Use data length and current data length to compute new skip
            newState = _.set(
                newState,
                `${type}.skip`,
                data.length + curTribeRef.length
            )
            newState = _.set(newState, `${type}.hasNextPage`, !data.length)

            return newState
        }

        case MYTRIBE_UPDATE_MEMBER_SUCCESS: {
            const { tribeId, updateType } = action.payload
            let newState = _.cloneDeep(state)
            if (
                updateType == MEMBER_UPDATE_TYPE.acceptMember ||
                updateType == MEMBER_UPDATE_TYPE.removeMember
            ) {
                const invited = TRIBE_TYPE.invited
                const curInvitedTribeRef = _.get(newState, `${invited}.data`)
                const newInvitedTribeRef = curInvitedTribeRef.filter(
                    (d) => d !== tribeId
                )
                newState = _.set(
                    newState,
                    `${invited}.data`,
                    newInvitedTribeRef
                )

                if (updateType == MEMBER_UPDATE_TYPE.acceptMember) {
                    const member = TRIBE_TYPE.member
                    const curMemberTribeRef = _.get(newState, `${member}.data`)
                    const newMemberTribeRef = curMemberTribeRef.concat([
                        tribeId,
                    ])
                    newState = _.set(
                        newState,
                        `${member}.data`,
                        newMemberTribeRef
                    )
                } else {
                    const member = TRIBE_TYPE.member
                    const curMemberTribeRef = _.get(newState, `${member}.data`)
                    const newMemberTribeRef = curMemberTribeRef.filter(
                        (d) => d !== tribeId
                    )
                    newState = _.set(
                        newState,
                        `${member}.data`,
                        newMemberTribeRef
                    )
                }
            }
            return newState
        }

        case MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS: {
            const { tribeId } = action.payload
            let newState = _.cloneDeep(state)
            requested = TRIBE_TYPE.requested

            const curTribeRef = _.get(newState, `${requested}.data`)
            const newTribeRef = curTribeRef.filter((d) => d !== tribeId)
            newState = _.set(newState, `${requested}.data`, newTribeRef)
            return newState
        }

        case TRIBE_HUB_FEED_REFRESH: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'feed.refreshing', true)
            return newState
        }

        case TRIBE_HUB_FEED_LOAD: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'feed.loading', true)
            return newState
        }

        case TRIBE_HUB_FEED_REFRESH_DONE: {
            const { data } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(
                newState,
                'feed.data',
                data.map((d) => d._id).filter((d) => d !== undefined)
            )
            newState = _.set(newState, 'feed.skip', data ? data.length : 0)
            newState = _.set(
                newState,
                'feed.hasNextPage',
                data !== undefined && data.length > 0
            )
            newState = _.set(newState, 'feed.refreshing', false)
            return newState
        }

        case TRIBE_HUB_FEED_LOAD_DONE: {
            const { data } = action.payload
            let newState = _.cloneDeep(state)
            const curData = _.get(newState, 'feed.data', [])
            newState = _.set(
                newState,
                'feed.data',
                _.uniq(
                    curData.concat(
                        data.map((d) => d._id).filter((d) => d !== undefined)
                    )
                )
            )
            newState = _.set(
                newState,
                'feed.skip',
                data !== undefined
                    ? curData.length + data.length
                    : curData.length
            )
            newState = _.set(
                newState,
                'feed.hasNextPage',
                data !== undefined && data.length > 0
            )
            newState = _.set(newState, 'feed.loading', false)
            return newState
        }

        default:
            return { ...state }
    }
}
