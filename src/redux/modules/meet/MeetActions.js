/**
 * This is Actions for meet tab redesign. There are duplicate functionalities with
 * actions in ../actions
 *
 * @format
 */

import _ from 'lodash'
import { api as API } from '../../middleware/api'
import {
    MEET_LOADING,
    MEET_LOADING_DONE,
    MEET_TAB_REFRESH,
    MEET_TAB_REFRESH_DONE,
    MEET_CHANGE_FILTER,
    MEET_REQUESTS_CHANGE_TAB,
} from '../../../actions/types'

import {
    MEET_CONTACT_SYNC_FETCH_DONE,
    MEET_CONTACT_SYNC,
    MEET_CONTACT_SYNC_REFRESH_DONE,
} from '../../../reducers/MeetReducers'

import { PROFILE_FETCH_FRIEND_COUNT_DONE } from '../../../reducers/Profile'

const BASE_ROUTE = 'secure/user/'
// const BASE_ROUTE = 'dummy/user/';

const requestMap = {
    suggested: 'friendship/recommendations',
    requests: {
        outgoing: 'friendship/invitations/outgoing',
        incoming: 'friendship/invitations/incoming',
    },
    friends: 'friendship',
    contacts: 'ContactSync/stored-matches',
}

const DEBUG_KEY = '[ Actions MeetV2 ]'

/**
 * MeetTab refresh to reload incoming/outgoing requests and friends
 */
export const handleRefresh = () => (dispatch, getState) => {
    // Refresh incoming/outgoing requests
    handleRefreshRequests()(dispatch, getState)
    // Refresh user friend
    handleRefreshFriend()(dispatch, getState)
    getUserFriendCount()(dispatch, getState)
}

/**
 * Refresh user friends
 */
export const handleRefreshFriend = () => (dispatch, getState) => {
    refreshRequest('friends', true)(dispatch, getState)
}

/**
 * Refresh incoming / outgoing requests
 */
export const handleRefreshRequests = () => (dispatch, getState) => {
    refreshRequest('requests.outgoing')(dispatch, getState)
    refreshRequest('requests.incoming')(dispatch, getState)
}

const refreshRequest = (key, isPaginated) => (dispatch, getState) => {
    const { limit } = _.get(getState().meet, `${key}`)
    const route = _.get(requestMap, `${key}`)
    const url = isPaginated
        ? `${BASE_ROUTE}${route}?skip=0&limit=${limit}`
        : `${BASE_ROUTE}${route}`

    const onSuccess = (res) => {
        const { data } = res
        console.log(
            `${DEBUG_KEY}: refresh ${key} success with res: `,
            data ? data.length : 0
        )
        dispatch({
            type: MEET_TAB_REFRESH_DONE,
            payload: {
                type: key,
                data,
                skip: data.length,
                limit: 20,
                hasNextPage: !(data === undefined || data.length === 0),
            },
        })
    }

    const onError = (res) => {
        console.log(`${DEBUG_KEY}: refresh ${key} failed with err: `, res)
        dispatch({
            type: MEET_TAB_REFRESH_DONE,
            payload: {
                type: key,
                data: [],
                skip: 0,
                limit: 20,
                hasNextPage: undefined,
            },
        })
    }

    // Start refreshing for key
    dispatch({
        type: MEET_TAB_REFRESH,
        payload: {
            type: key,
        },
    })
    getOneType(url, onSuccess, onError)(getState)
}

/**
 * Loading more for a key. e.g. friends, requests.incoming, requests.outgoing, suggested
 * @param {*} key
 */
export const loadMoreRequest = (key) => (dispatch, getState) => {
    const { skip, limit, hasNextPage, refreshing, loading } = _.get(
        getState().meet,
        `${key}`
    )
    if (hasNextPage === false || refreshing || loading) return

    // Start loading for one key
    dispatch({
        type: MEET_LOADING,
        payload: {
            type: key,
        },
    })

    const route = _.get(requestMap, `${key}`)
    const url = `${BASE_ROUTE}${route}?skip=${skip}&limit=${limit}`
    const onSuccess = (res) => {
        const { data } = res
        console.log(
            `${DEBUG_KEY}: load more ${key} success with res: `,
            data ? data.length : res
        )
        dispatch({
            type: MEET_LOADING_DONE,
            payload: {
                type: key,
                data,
                skip: data ? skip + data.length : skip,
                limit,
                hasNextPage: !(data === undefined || data.length === 0),
            },
        })
    }

    const onError = (res) => {
        console.log(`${DEBUG_KEY}: load more ${key} failed with err: `, res)
        dispatch({
            type: MEET_LOADING_DONE,
            payload: {
                type: key,
                data: [],
                skip,
                limit,
                hasNextPage: undefined,
            },
        })
    }
    getOneType(url, onSuccess, onError)(getState)
}

/**
 * Send request for one type of the user friendship.
 * e.g. incoming requests, outgoing requests, friends
 */
const getOneType = (url, onSuccess, onError) => (getState) => {
    const { token } = getState().user
    API.get(url, token)
        .then((res) => {
            if (res.status === 200) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => onError(err))
}

/**
 * Fetch current user friend count
 */
const getUserFriendCount = () => (dispatch, getState) => {
    const { userId } = getState().user
    const url = `${BASE_ROUTE}friendship/count?userId=${userId}`
    const onSuccess = (res) => {
        console.log(`${DEBUG_KEY}: fetch friend count succeed with res: `, res)
        dispatch({
            type: PROFILE_FETCH_FRIEND_COUNT_DONE,
            payload: {
                data: res.count,
                userId,
            },
        })
    }
    const onError = (err) => {
        console.log(`${DEBUG_KEY}: fetch friend count failed with err: `, err)
    }
    getOneType(url, onSuccess, onError)(getState)
}

/**
 * RequestTabView change tab
 * @param {*} index
 */
export const handleRequestTabSwitchTab = (index) => (dispatch, getState) => {
    dispatch({
        type: MEET_REQUESTS_CHANGE_TAB,
        payload: {
            index,
        },
    })
    // Refresh tab if empty
    const { requests } = getState().meet
    const { key } = requests.navigationState.routes[index]
    const data = _.get(requests, `${key}.data`)
    if (_.isEmpty(data)) {
        refreshRequest(`requests.${key}`)(dispatch, getState)
    }
}
