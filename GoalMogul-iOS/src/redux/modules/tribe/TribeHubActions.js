/**
 * This file defines all the actions in Tribe Hub for design
 * https://www.figma.com/file/oj6EYFyRDjtDNljQTqd2PB/Tribe?node-id=0%3A1 section:
 * - All Tribe feed
 * - Your tribes (favorite tribe, managed tribes, others)
 * - Discover (tribe recommendations)
 *
 * All tribes loaded in tribe hub has pageId: "tribe_hub_pageId" rather than
 * pageId constructed from function constructPageId('tribe')
 *
 * @format
 */

import {
    TRIBE_HUB_FEED_REFRESH_DONE,
    TRIBE_HUB_FEED_REFRESH,
    TRIBE_HUB_FEED_LOAD,
    TRIBE_HUB_FEED_LOAD_DONE,
    TRIBE_HUB_REFRESH_DONE,
    TRIBE_HUB_REFRESH,
    TRIBE_HUB_LOAD_DONE,
    TRIBE_HUB_LOAD,
    MYTRIBETAB_UPDATE_TAB,
} from './MyTribeTabReducers'
import { api as API } from '../../middleware/api'
import { queryBuilder } from '../../middleware/utils'
import _ from 'lodash'

const DEBUG_KEY = '[ Actions Tribe Hub ]'

export const BASE_ROUTE = 'secure/tribe'

export const TRIBE_TYPE = {
    admin: 'admin',
    member: 'member',
    invited: 'invited',
    requested: 'requested',
    favorite: 'favorite',
}

const ROUTES = {
    tribes: (type) => {
        switch (type) {
            case TRIBE_TYPE.admin:
                return () =>
                    `${BASE_ROUTE}?filterForMembershipCategory=Admin&sortBy=name`
            case TRIBE_TYPE.favorite:
                return () => `${BASE_ROUTE}` // TODO: tribe: API was not made yet
            case TRIBE_TYPE.member:
                return () =>
                    `${BASE_ROUTE}?filterForMembershipCategory=Member&sortBy=name`
            case TRIBE_TYPE.requested:
                return () =>
                    `${BASE_ROUTE}?filterForMembershipCategory=JoinRequester&sortBy=name`
            case TRIBE_TYPE.invited:
                return () =>
                    `${BASE_ROUTE}?filterForMembershipCategory=Invitee&sortBy=name`
        }
    },
    feed: (skip, limit) =>
        `${BASE_ROUTE}/feed?${queryBuilder(skip, limit, {})}`,
}

const PAGE_ID = 'tribe_hub_pageId'

/**
 * Refresh all types of tribe for tribe hub
 */
export const refreshTribeHub = () => (dispatch, getState) => {
    refreshTribes(TRIBE_TYPE.admin)(dispatch, getState)
    refreshTribes(TRIBE_TYPE.favorite)(dispatch, getState)
    refreshTribes(TRIBE_TYPE.member)(dispatch, getState)
    refreshTribes(TRIBE_TYPE.invited)(dispatch, getState)
    refreshTribes(TRIBE_TYPE.requested)(dispatch, getState)
}

/**
 * Refresh tribes based of a type {@code TRIBE_TYPE}
 * @param {*} type: see TRIBE_TYPE
 */
export const refreshTribes = (type) => (dispatch, getState) => {
    //TODO:for admin page, it should not have limit
    const tribeHub = getState().myTribeTab // TODO: tribe hub: rename myTribeTab to tribeHub
    if (!_.has(tribeHub, type)) {
        // For debugging purpose since type passed isn't one of defined ['favorite', 'managed', 'others']
        console.error(
            `${DEBUG_KEY}: refreshTribes: incorrect type: ${type} used in action`
        )
        return
    }

    const { limit } = _.get(tribeHub, type)
    const onSuccess = (data) => {
        dispatch({
            type: TRIBE_HUB_REFRESH_DONE,
            payload: {
                pageId: PAGE_ID,
                data,
                hasNextPage: !data.length,
                type,
            },
        })
    }

    const onError = (err) => {
        dispatch({
            type: TRIBE_HUB_REFRESH_DONE,
            payload: {
                pageId: PAGE_ID,
                data: [],
                hasNextPage: false,
                type,
            },
        })
        // TODO: tribe hub: sentry error log
    }

    dispatch({
        type: TRIBE_HUB_REFRESH,
        payload: {
            type,
        },
    })

    tribeGetter(ROUTES.tribes(type), 0, limit, {}, onSuccess, onError)(getState)
}

/**
 * Load more tribes for a type
 * @param {*} type: ['managed', 'favorite', 'others']
 */
export const loadMoreTribes = (type) => (dispatch, getState) => {
    const tribeHub = getState().myTribeTab // TODO: tribe hub: rename myTribeTab to tribeHub
    if (!_.has(tribeHub, type)) {
        // For debugging purpose since type passed isn't one of defined ['favorite', 'managed', 'others']
        console.error(
            `${DEBUG_KEY}: loadMoreTribes: incorrect type: ${type} used in action`
        )
        return
    }

    const { skip, limit, loading, refreshing, hasNextPage } = _.get(
        tribeHub,
        type
    )
    if (loading || refreshing || hasNextPage == false) return
    const onSuccess = (data) => {
        dispatch({
            type: TRIBE_HUB_LOAD_DONE,
            payload: {
                pageId: PAGE_ID,
                data,
                hasNextPage: !data.length,
                type,
            },
        })
    }

    const onError = (err) => {
        dispatch({
            type: TRIBE_HUB_LOAD_DONE,
            payload: {
                pageId: PAGE_ID,
                data: [],
                hasNextPage: false,
                type,
            },
        })
        // TODO: tribe hub: sentry error log
    }

    dispatch({
        type: TRIBE_HUB_LOAD,
        payload: {
            type,
        },
    })

    tribeGetter(
        ROUTES.tribes(type),
        skip,
        limit,
        {},
        onSuccess,
        onError
    )(getState)
}

/**
 * Refresh all feeds in tribe hub
 */
export const refreshTribeHubFeed = () => (dispatch, getState) => {
    const { skip, limit, refreshing } = getState().myTribeTab.feed
    if (refreshing) {
        // Don't refresh when it's already refreshing
        return
    }
    const onSuccess = (data) => {
        dispatch({
            type: TRIBE_HUB_FEED_REFRESH_DONE,
            payload: {
                pageId: PAGE_ID,
                data,
            },
        })
    }

    const onError = (err) => {
        dispatch({
            type: TRIBE_HUB_FEED_REFRESH_DONE,
            payload: {
                pageId: PAGE_ID,
                data: [],
            },
        })
        // TODO: tribe hub: sentry error log
    }

    dispatch({
        type: TRIBE_HUB_FEED_REFRESH,
    })

    tribeGetter(ROUTES.feed, skip, limit, {}, onSuccess, onError)(getState)
}

export const loadMoreTribeHubFeed = () => (dispatch, getState) => {
    const {
        skip,
        limit,
        hasNextPage,
        refreshing,
        loading,
    } = getState().myTribeTab.feed
    if (refreshing || loading || hasNextPage == false) {
        // Don't refresh when it's already loading or there is no next page.
        return
    }

    const onSuccess = (newData) => {
        dispatch({
            type: TRIBE_HUB_FEED_LOAD_DONE,
            payload: {
                pageId: PAGE_ID,
                data: newData,
            },
        })
    }

    const onError = (err) => {
        dispatch({
            type: TRIBE_HUB_FEED_LOAD_DONE,
            payload: {
                pageId: PAGE_ID,
                data: [],
            },
        })
        // TODO: tribe hub: sentry error log
    }

    dispatch({
        type: TRIBE_HUB_FEED_LOAD,
    })

    tribeGetter(ROUTES.feed, skip, limit, {}, onSuccess, onError)(getState)
}

/**
 * Action to favorite a tribe
 * @param {String} tribeId
 * @param {String} action: ['favorite', 'unfavorite']
 */
export const favoriteTribe = (tribeId, action) => (dispatch, getState) => {}

/**
 * Action to update index when switch tabs.
 */
export const myTribeSelectTab = (index) => (dispatch, getState) => {
    dispatch({
        type: MYTRIBETAB_UPDATE_TAB,
        payload: {
            index,
        },
    })
}

/**
 * Send get request for tribe related queries based off routes
 * @param {*} routeMaker function to create route based off passed in params including skip, limit and params
 * @param {*} skip
 * @param {*} limit
 * @param {*} params
 * @param {*} onSuccess
 * @param {*} onError
 */
const tribeGetter = (routeMaker, skip, limit, params, onSuccess, onError) => (
    getState
) => {
    const { token } = getState().user
    API.get(routeMaker(skip, limit, params), token)
        .then((res) => {
            if (res.status == 200 || res.data) {
                return onSuccess(res.data)
            }
            return onError(res)
        })
        .catch((err) => onError(err))
}
