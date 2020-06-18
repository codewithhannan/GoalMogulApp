/**
 * This file defines all the actions in Tribe Hub for design
 * https://www.figma.com/file/oj6EYFyRDjtDNljQTqd2PB/Tribe?node-id=0%3A1 section:
 * - All Tribe feed
 * - Your tribes (favorite tribe, managed tribes, others)
 * - Discover (tribe recommendations)
 *
 * All tribes loaded in tribe hub has pageId: "tribe_hub" rather than
 * pageId constructed from function constructPageId('tribe')
 *
 * @format
 */

import {} from './MyTribeTabReducers'
import { api as API } from '../../middleware/api'
import { queryBuilder } from '../../middleware/utils'

export const BASE_ROUTE = 'secure/tribe'

export const TRIBE_TYPE = {
    MANAGED: 'managed',
    FAVORITE: 'favorite',
    OTHERS: 'others',
}

const ROUTES = {
    managed: `${BASE_ROUTE}?filterForMembershipCategory=Admin`,
    favorite: `${BASE_ROUTE}`, // TODO: tribe: API was not made yet
    others: `${BASE_ROUTE}?filterForMembershipCategory=Member`,
}

/**
 * Refresh all types of tribe for tribe hub
 */
export const refreshTribeHub = () => (dispatch, getState) => {
    refreshTribes(TRIBE_TYPE.MANAGED)(dispatch, getState)
    refreshTribes(TRIBE_TYPE.FAVORITE)(dispatch, getState)
    refreshTribes(TRIBE_TYPE.OTHERS)(dispatch, getState)
}

/**
 * Refresh tribes based of a type
 * @param {*} type: ['managed', 'favorite', 'others']
 */
export const refreshTribes = (type) => (dispatch, getState) => {}

/**
 * Load more tribes for a type
 * @param {*} type: ['managed', 'favorite', 'others']
 */
export const loadMoreTribes = (type) => (dispatch, getState) => {}

/**
 * Fetching tribes with below parameters
 *
 * @param {*} skip
 * @param {*} limit
 * @param {*} token
 * @param {TRIBE_TYPE} type
 * @param {*} onSuccess
 * @param {*} onError
 */
const loadTribeByType = (skip, limit, token, type, onSuccess, onError) => {
    // TODO: define routes / construct routes based off types, skip and limit
    const route = _.get(ROUTES, type)
    const path = `${route}${queryBuilder(skip, limit)}`

    API.get(path, token)
        .then((res) => {
            if (res.status == 200 || res.data) {
                return onSuccess(res.data)
            }
            return onError(res)
        })
        .catch((err) => onError(err))
}
