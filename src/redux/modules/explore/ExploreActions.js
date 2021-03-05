/** @format */

import _ from 'lodash'
import { EXPLORE_SWITCH_TAB, RecommendationRouteMap } from './ExploreReducers'

import { api as API } from '../../middleware/api'
import { queryBuilder } from '../../middleware/utils'

const DEBUG_KEY = '[ Actions Explore ]'

export const exploreSelectTab = (index) => (dispatch) => {
    dispatch({
        type: EXPLORE_SWITCH_TAB,
        payload: index,
    })
}

/**
 * Refresh people in discovery tab
 * @param {String} tab: ['people', 'chatRooms']
 */
export const exploreRefreshTab = (tab) => (dispatch, getState) => {
    const { token } = getState().user
    const { limit } = _.get(getState().explore, tab)
    const oldData = _.get(getState().explore, `${tab}.data`)

    // Load constants from reducer
    if (!_.has(RecommendationRouteMap, tab)) {
        console.warn(
            `${DEBUG_KEY}: [ exploreRefreshTab ]: undefined tab: `,
            tab
        )
        return
    }
    const { route, actions } = _.get(RecommendationRouteMap, tab)
    const initialAction = _.get(actions, 'refresh')
    const endingAction = _.get(actions, 'refresh_done')

    const onSuccess = (res) => {
        const { data } = res
        console.log(
            `${DEBUG_KEY}: [ exploreRefreshTab ] for tab ${tab} success with data length:`,
            data.length
        )
        dispatch({
            type: endingAction,
            payload: {
                data: res.data,
                hasNextPage: data && data.length === limit,
                skip: data ? data.length : 0,
                oldData,
            },
        })
    }

    const onError = (err) => {
        console.warn(
            `${DEBUG_KEY}: [ exploreRefreshTab ]: for tab ${tab} error with res:`,
            err
        )
        dispatch({
            type: endingAction,
            payload: {
                data: [],
                hasNextPage: false,
                skip: 0,
                oldData,
            },
        })
    }

    const url = `${route}?${queryBuilder(0, limit, { refresh: true })}`

    dispatch({
        // type: EXPLORE_PEOPLE_REFRESH
        type: initialAction,
    })
    exploreGetRequest(url, token, onSuccess, onError)
}

/**
 * Load more people in discovery tab
 */
export const exploreLoadMoreTab = (tab) => (dispatch, getState) => {
    const { token } = getState().user
    const { skip, limit, hasNextPage, refreshing, loading } = _.get(
        getState().explore,
        tab
    )
    const oldData = _.get(getState().explore, `${tab}.data`)

    // Load constants from reducer
    if (!_.has(RecommendationRouteMap, tab)) {
        console.warn(
            `${DEBUG_KEY}: [ exploreRefreshTab ]: undefined tab: `,
            tab
        )
        return
    }
    const { route, actions } = _.get(RecommendationRouteMap, tab)
    const initialAction = _.get(actions, 'load_more')
    const endingAction = _.get(actions, 'load_more_done')

    if (hasNextPage === false || refreshing || loading) return

    const onSuccess = (res) => {
        const { data } = res
        console.log(
            `${DEBUG_KEY}: [ exploreLoadMoreTab ] for tab: ${tab}, success with data length:`,
            data.length
        )
        dispatch({
            // type: EXPLORE_PEOPLE_LOAD_MORE_DONE,
            type: endingAction,
            payload: {
                data: res.data,
                hasNextPage: data && data.length !== 0 && data.length >= limit,
                skip: data ? data.length + skip : skip,
                oldData,
            },
        })
        // console.log(`${DEBUG_KEY}: [ ${tab} ] new skip is: `, data ? data.length + skip : skip);
    }

    const onError = (err) => {
        console.warn(
            `${DEBUG_KEY}: [ exploreLoadMoreTab ]: for tab: ${tab}, error with res:`,
            err
        )
        dispatch({
            // type: _.get(LOAD_MORE_DONE_ACTION_MAP, tab),
            type: endingAction,
            payload: {
                data: [],
                hasNextPage: false,
                skip,
                oldData,
            },
        })
    }

    const url = `${route}?${queryBuilder(skip, limit, {})}`

    dispatch({
        // type: EXPLORE_PEOPLE_LOAD_MORE
        type: initialAction,
    })
    exploreGetRequest(url, token, onSuccess, onError)
}

export const exploreGetRequest = (url, token, onSuccess, onError) => {
    // console.log(`${DEBUG_KEY}: [ exploreGetRequest ]: url:`, url);
    API.get(url, token, 1)
        .then((res) => {
            // console.log(`${DEBUG_KEY}: [ exploreGetRequest ]: res:`, res);
            if (res.status === 200) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => onError(err))
}
