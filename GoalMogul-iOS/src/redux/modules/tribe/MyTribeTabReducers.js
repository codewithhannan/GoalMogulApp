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
} from './Tribes'

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
    data: [],
    hasNextPage: undefined,
    limit: 20,
    skip: 0,
    loading: false,
    // ['name', 'created']
    sortBy: 'created',
    // ['Admin', 'Member', 'JoinRequester', 'Invitee']
    filterForMembershipCategory: 'Admin',
    showModal: false,
    navigationState: {
        index: 0,
        routes: [
            { key: 'Admin', title: 'Admin' },
            { key: 'Member', title: 'Member' },
            { key: 'JoinRequester', title: 'Requested' },
            { key: 'Invitee', title: 'Invited' },
        ],
    },
    // Below are tribe hub related data
    favorite: _.cloneDeep(INITIAL_PAGE_STATE),
    managed: _.cloneDeep(INITIAL_PAGE_STATE),
    others: {
        ..._.cloneDeep(INITIAL_PAGE_STATE),
        // might need to add extra state for "others" tribes
    },
    feed: _.cloneDeep(INITIAL_PAGE_STATE),
}

const sortByList = ['name', 'created']

// TODO: tribe hub: rename these constants with prefix TRIBE_HUB
export const MYTRIBETAB_OPEN = 'mytribetab_open'
export const MYTRIBETAB_CLOSE = 'mytribetab_close'
export const MYTRIBETAB_REFRESH_DONE = 'mytribetab_refresh_done'
export const MYTRIBETAB_LOAD_DONE = 'mytribetab_load_done'
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

            const oldData = _.get(newState, 'data')
            const newData = arrayUnique(oldData.concat(data)).sort(
                (item1, item2) =>
                    new Date(item2.created) - new Date(item1.created)
            )
            newState = _.set(newState, 'data', newData)
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
            const newState = _.cloneDeep(state)
            const oldData = _.get(newState, 'data')
            const newData = oldData.filter((t) => t._id !== tribeId)
            return _.set(newState, 'data', newData)
        }

        // Tribe refresh done
        case MYTRIBETAB_REFRESH_DONE: {
            const { skip, data, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'loading', false)

            if (skip !== undefined) {
                newState = _.set(newState, 'skip', skip)
            }
            newState = _.set(newState, 'hasNextPage', hasNextPage)
            return _.set(newState, 'data', data)
        }

        // Tribe load done.
        case MYTRIBETAB_LOAD_DONE: {
            const { skip, data, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'loading', false)

            if (skip !== undefined) {
                newState = _.set(newState, 'skip', skip)
            }
            newState = _.set(newState, 'hasNextPage', hasNextPage)
            const oldData = _.get(newState, 'data')
            return _.set(newState, 'data', arrayUnique(oldData.concat(data)))
        }

        // Tribe tab starts any type of loading
        case MYTRIBETAB_LOAD: {
            let newState = _.cloneDeep(state)
            return _.set(newState, 'loading', true)
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

            // Update the corresponding state for filter since we just change
            // the filter bar option to tabs
            const { routes } = _.get(newState, 'navigationState')
            newState = _.set(
                newState,
                'filterForMembershipCategory',
                routes[index].key
            )
            return _.set(newState, 'navigationState.index', index)
        }

        case TRIBE_HUB_REFRESH: {
            const { type } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, `${type}.loading`)) {
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
            newState = _.set(newState, `${type}.data`, tribeRef)

            // Set page metadata
            newState = _.set(newState, `${type}.refreshing`, false)
            newState = _.set(newState, `${type}.skip`, data.length)
            newState = _.set(newState, `${type}.hasNextPage`, !data.length)

            return newState
        }

        case TRIBE_HUB_LOAD_DONE: {
            const { data, type } = action.payload

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
            newState = _.set(
                newState,
                `${type}.data`,
                _.uniq(curTribeRef, newTribeRef)
            )

            // Set page metadata
            newState = _.set(newState, `${type}.refreshing`, false)
            // Use data length and current data length to compute new skip
            newState = _.set(
                newState,
                `${type}.skip`,
                data.length + curTribeRef.length
            )
            newState = _.set(newState, `${type}.hasNextPage`, !data.length)

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
                _.uniq(curData.concat(data))
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
