/** @format */

import {
    HOME_REFRESH_GOAL,
    HOME_REFRESH_GOAL_DONE,
    HOME_LOAD_GOAL,
    HOME_LOAD_GOAL_DONE,
    HOME_USER_INVITED_FRIENDS_COUNT,
} from '../../../../reducers/Home'

import { api as API } from '../../../middleware/api'
import { is2xxRespose, queryBuilder } from '../../../middleware/utils'
import { Logger } from '../../../middleware/utils/Logger'

const DEBUG_KEY = '[ Action Home Activity ]'
const BASE_ROUTE = 'secure/feed/activity'

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */

//Refresh feed for activity tab
export const refreshActivityFeed = () => (dispatch, getState) => {
    console.log('YE CHALA HAI')
    const { token } = getState().user
    const { limit, filter } = getState().home.activityfeed
    const { categories, priority } = filter
    dispatch({
        type: HOME_REFRESH_GOAL,
        payload: {
            type: 'activityfeed',
        },
    })
    loadFeed(
        0,
        limit,
        token,
        priority,
        categories,
        (data) => {
            Logger.log(
                `${DEBUG_KEY}: refresh activity with data length: `,
                data.length,
                2
            )
            // console.log(`${DEBUG_KEY}: refresh activity with data: `, data);
            dispatch({
                type: HOME_REFRESH_GOAL_DONE,
                payload: {
                    type: 'activityfeed',
                    data,
                    skip: data.length,
                    limit: 20,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        },
        () => {
            // TODO: implement for onError
        }
    )
}

// Load more goal for mastermind tab
export const loadMoreFeed = () => (dispatch, getState) => {
    const { token } = getState().user
    const {
        skip,
        limit,
        filter,
        hasNextPage,
        loadingMore,
    } = getState().home.activityfeed
    if (hasNextPage === false || loadingMore) {
        return
    }
    dispatch({
        type: HOME_LOAD_GOAL,
        payload: {
            type: 'activityfeed',
        },
    })
    const { categories, priority } = filter
    loadFeed(
        skip,
        limit,
        token,
        priority,
        categories,
        (data) => {
            Logger.log(
                `${DEBUG_KEY}: load more activity with data length: `,
                data.length,
                2
            )
            // console.log(`${DEBUG_KEY}: load more activity with data: `, data);
            dispatch({
                type: HOME_LOAD_GOAL_DONE,
                payload: {
                    type: 'activityfeed',
                    data,
                    skip: skip + (data === undefined ? 0 : data.length),
                    limit: 20,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        },
        () => {
            // TODO: implement for onError
        }
    )
}

/**
 * Basic API to load goals based on skip and limit
 */
const loadFeed = (
    skip,
    limit,
    token,
    priority,
    categories,
    callback,
    onError
) => {
    API.get(
        `${BASE_ROUTE}?${queryBuilder(skip, limit, { priority, categories })}`,
        token
    )
        .then((res) => {
            if (res && res.data) {
                return callback([...res.data])
            }
            console.log(
                `${DEBUG_KEY}: Loading activity feed with no data: `,
                res
            )
        })
        .catch((err) => {
            console.log(`${DEBUG_KEY} load activity feed with error: ${err}`)
            // if (skip === 0) {
            //   callback([]);
            // } else {
            //   callback([]);
            // }
            callback([])
        })
}

// for showing 'get your silver badge!' toast
export const loadUserInvitedFriendsCount = () => (dispatch, getState) => {
    const { token } = getState().user
    API.get(`secure/user/profile/stats/invited-user-count`, token).then(
        (res) => {
            if (res && is2xxRespose(res.status)) {
                dispatch({
                    type: HOME_USER_INVITED_FRIENDS_COUNT,
                    payload: res.data,
                })
            }
        }
    )
}
