/** @format */

import {
    EVENTTAB_REFRESH,
    EVENTTAB_REFRESH_DONE,
    EVENTTAB_LOAD_DONE,
    EVENTTAB_LOAD,
    EVENTTAB_SORTBY,
    EVENTTAB_UPDATE_FILTEROPTIONS,
} from './EventTabReducers'

import { api as API } from '../../middleware/api'
import { queryBuilder } from '../../middleware/utils'

const DEBUG_KEY = '[ Action Explore.EventTab ]'
const BASE_ROUTE = 'secure/event/recommendations'

// update sortBy
export const updateSortBy = (value) => (dispatch, getState) => {
    dispatch({
        type: EVENTTAB_SORTBY,
        payload: value,
    })

    refreshEvent()(dispatch, getState)
}

/*
 * Deprecated
 */
// update filterOptions
// export const updateFilterOptions = (value) => (dispatch) =>
//   dispatch({
//     type: EVENTTAB_UPDATE_FILTEROPTIONS,
//     value
//   });
/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions, TribeTabActions,
 * TribeActions, EventActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */

//Refresh feed for activity tab
export const refreshEvent = () => (dispatch, getState) => {
    const { token } = getState().user
    const { limit, sortBy } = getState().eventTab

    dispatch({
        type: EVENTTAB_REFRESH,
    })

    loadEvent(
        0,
        limit,
        token,
        sortBy,
        { refresh: true },
        (data) => {
            console.log(
                `${DEBUG_KEY}: [ refreshEvent ] with res: `,
                data.length
            )
            dispatch({
                type: EVENTTAB_REFRESH_DONE,
                payload: {
                    type: 'eventtab',
                    data,
                    pageId: 'EVENTTAB', // TODO: Note we are using
                    skip: data.length,
                    limit: 20,
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        },
        () => {
            console.warn(`${DEBUG_KEY}: [ refreshEvent ] error: `, err)
            dispatch({
                type: EVENTTAB_REFRESH_DONE,
                payload: {
                    type: 'eventtab',
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
export const loadMoreEvent = () => (dispatch, getState) => {
    const { token } = getState().user
    const { skip, limit, sortBy, hasNextPage, loading } = getState().eventTab
    if (hasNextPage === false || loading) {
        return
    }

    dispatch({
        type: EVENTTAB_LOAD,
    })

    loadEvent(
        skip,
        limit,
        token,
        sortBy,
        {},
        (data) => {
            console.log(
                `${DEBUG_KEY}: [ loadMoreEvent ] with res: `,
                data.length
            )
            dispatch({
                type: EVENTTAB_LOAD_DONE,
                payload: {
                    type: 'eventtab',
                    data,
                    skip: data ? data.length + skip : skip,
                    limit: 20,
                    pageId: 'EVENTTAB',
                    hasNextPage: !(data === undefined || data.length === 0),
                },
            })
        },
        () => {
            console.warn(`${DEBUG_KEY}: [ loadMoreEvent ] error: `, err)
            dispatch({
                type: EVENTTAB_LOAD_DONE,
                payload: {
                    type: 'eventtab',
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
const loadEvent = (
    skip,
    limit,
    token,
    sortBy,
    filterOptions,
    callback,
    onError
) => {
    API.get(
        `${BASE_ROUTE}?${queryBuilder(skip, limit, {
            sortBy,
            ...filterOptions,
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
            onError(err)
        })
}
