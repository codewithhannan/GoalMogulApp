/** @format */

import {
    TRIBETAB_REFRESH_DONE,
    TRIBETAB_LOAD_DONE,
    TRIBETAB_LOAD,
    TRIBETAB_SORTBY,
    TRIBETAB_UPDATE_FILTEROPTIONS,
    TRIBETAB_REFRESH,
} from './TribeTabReducers'

import { api as API } from '../../middleware/api'
import { queryBuilder } from '../../middleware/utils'
import { Logger } from '../../middleware/utils/Logger'

const DEBUG_KEY = '[ Action Explore.TribeTab ]'
const BASE_ROUTE = 'secure/tribe/recommendations'

// update sortBy
export const updateSortBy = (value) => (dispatch, getState) => {
    dispatch({
        type: TRIBETAB_SORTBY,
        payload: value,
    })
    refreshTribe()(dispatch, getState)
}

/* Depreacted method */
// update filterForMembershipCategory
// export const updateFilterForMembershipCategory = (value) => (dispatch) =>
//   dispatch({
//     type: TRIBETAB_UPDATE_FILTEROPTIONS,
//     value
//   });
/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions, EventTabActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */

//Refresh feed for activity tab
export const refreshTribe = () => (dispatch, getState) => {
    const { token } = getState().user
    const { limit, sortBy } = getState().tribeTab

    dispatch({
        type: TRIBETAB_REFRESH,
    })

    loadTribe(
        0,
        limit,
        token,
        sortBy,
        { refresh: false },
        (data) => {
            console.log(`${DEBUG_KEY}: [ refreshTribe ] with res: `, data)
            dispatch({
                type: TRIBETAB_REFRESH_DONE,
                payload: {
                    type: 'tribetab',
                    data,
                    skip: data.length,
                    limit: 20,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        },
        (err) => {
            console.warn(`${DEBUG_KEY}: [ refreshTribe ] error: `, err)
            dispatch({
                type: TRIBETAB_REFRESH_DONE,
                payload: {
                    type: 'tribetab',
                    data,
                    skip: 0,
                    limit: 20,
                    hasNextPage: undefined,
                },
            })
        }
    )
}

// Load more goal for mastermind tab
export const loadMoreTribe = () => (dispatch, getState) => {
    const { token } = getState().user
    const { skip, limit, sortBy, hasNextPage, loading } = getState().tribeTab
    if (hasNextPage === false || loading) {
        return
    }

    dispatch({
        type: TRIBETAB_LOAD,
    })

    loadTribe(
        skip,
        limit,
        token,
        sortBy,
        {},
        (data) => {
            console.log(
                `${DEBUG_KEY}: [ loadMoreTribe ] with res: `,
                data.length
            )
            dispatch({
                type: TRIBETAB_LOAD_DONE,
                payload: {
                    type: 'tribetab',
                    data,
                    skip: data ? data.length + skip : skip,
                    limit: 20,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        },
        (err) => {
            console.warn(`${DEBUG_KEY}: [ loadMoreTribe ] error: `, err)
            dispatch({
                type: TRIBETAB_LOAD_DONE,
                payload: {
                    type: 'tribetab',
                    data,
                    skip,
                    limit: 20,
                    hasNextPage: false,
                },
            })
        }
    )
}

/**
 * Basic API to load goals based on skip and limit
 */
const loadTribe = (
    skip,
    limit,
    token,
    sortBy,
    filterForMembershipCategory,
    callback,
    onError
) => {
    API.get(
        `${BASE_ROUTE}?${queryBuilder(skip, limit, {
            sortBy,
            ...filterForMembershipCategory,
        })}`,
        token
    )
        .then((res) => {
            if (res && res.data) {
                // Right now return test data
                return callback(res.data)
            }
            onError(res)
        })
        .catch((err) => {
            console.log('ERRRORRR', err.message)
            onError(err)
        })
}
