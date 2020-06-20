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
    managed: 'managed',
    favorite: 'favorite',
    others: 'others',
}

const ROUTES = {
    tribes: (type) => {
        switch (type) {
            case TRIBE_TYPE.managed: return () => `${BASE_ROUTE}?filterForMembershipCategory=Admin`;
            case TRIBE_TYPE.favorite: return () => `${BASE_ROUTE}`; // TODO: tribe: API was not made yet
            case TRIBE_TYPE.others: return () => `${BASE_ROUTE}?filterForMembershipCategory=Member`;
        }
    },
    feed: (skip, limit) => `${BASE_ROUTE}/feed?${queryBuilder(skip, limit, {})}`
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

export const refreshTribeHubFeed = () => (dispatch, getState) => {

}

export const loadMoreTribeHubFeed = () => (dispatch, getState) => {
    
}

const loadTribeFeed = (skip, limit, params, onSuccess, onError) => (getState) => {
    const { token } = getState().user;
    API.get(`${BASE_ROUTE}/feed?${queryBuilder(skip, limit)}`, token)
        .then((res) => {
            if (res.status == 200 || res.data) {
                return onSuccess(res.data)
            }
            return onError(res)
        })
        .catch((err) => onError(err))
}

/** */
const tribeGetter = (routeMaker, skip, limit, params, onSuccess, onError) => (getState) => {
    const { token } = getState().user;
    API.get(routeMaker(skip, limit, params), token)
        .then((res) => {
            if (res.status == 200 || res.data) {
                return onSuccess(res.data)
            }
            return onError(res)
        })
        .catch((err) => onError(err))
}

const tribeUpdator = (routeMaker, onSuccess, onError) => (getState) => {
    const { token } = getState().user;
};

/**
 * Action to favorite a tribe
 * @param {String} tribeId 
 * @param {String} action: ['favorite', 'unfavorite'] 
 */
export const favoriteTribe = (tribeId, action) => (dispatch, getState) => {

}
