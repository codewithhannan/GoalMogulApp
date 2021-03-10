/** @format */

// This stores informations for events under my events
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import {
    MYEVENTTAB_REFRESH_DONE,
    MYEVENTTAB_LOAD_DONE,
    MYEVENTTAB_LOAD,
    MYEVENTTAB_SORTBY,
    MYEVENTTAB_UPDATE_FILTEROPTIONS,
    MYEVENTTAB_OPEN,
    MYEVENTTAB_CLOSE,
    MYEVENTTAB_UPDATE_TAB,
} from './MyEventTabReducers'

import { api as API } from '../../middleware/api'
import { queryBuilder, componentKeyByTab } from '../../middleware/utils'
import { Logger } from '../../middleware/utils/Logger'

const DEBUG_KEY = '[ Action MyEventTab ]'
const BASE_ROUTE = 'secure/event'

// Open my event tab
export const openMyEventTab = () => (dispatch, getState) => {
    const { tab } = getState().navigation
    dispatch({
        type: MYEVENTTAB_OPEN,
    })
    const componentToOpen = componentKeyByTab(tab, 'myEventTab')
    Actions.push(componentToOpen)
    refreshEvent()(dispatch, getState)
}

// Close my event tab
export const closeMyEventTab = () => (dispatch) => {
    Actions.pop()
    dispatch({
        type: MYEVENTTAB_CLOSE,
    })
}

// update sortBy
export const updateSortBy = (value) => (dispatch, getState) => {
    dispatch({
        type: MYEVENTTAB_SORTBY,
        payload: value,
    })

    refreshEvent()(dispatch, getState)
}

// update filterOptions
export const updateFilterOptions = ({ type, value }) => (
    dispatch,
    getState
) => {
    dispatch({
        type: MYEVENTTAB_UPDATE_FILTEROPTIONS,
        payload: {
            type,
            value,
        },
    })

    refreshEvent()(dispatch, getState)
}

// Select tab for my event tab
export const myEventSelectTab = (index) => (dispatch, getState) => {
    dispatch({
        type: MYEVENTTAB_UPDATE_TAB,
        payload: {
            index,
        },
    })

    refreshEvent()(dispatch, getState)
}

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions, TribeTabActions,
 * TribeActions, EventActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */

// refresh for my event tab
export const refreshEvent = () => (dispatch, getState) => {
    const { token } = getState().user
    const { limit, filterOptions, sortBy } = getState().myEventTab

    dispatch({
        type: MYEVENTTAB_LOAD,
    })
    loadEvent(
        0,
        limit,
        token,
        sortBy,
        filterOptions,
        (data) => {
            dispatch({
                type: MYEVENTTAB_REFRESH_DONE,
                payload: {
                    type: 'myeventtab',
                    data,
                    skip: data.length,
                    limit: 20,
                    pageId: 'MYEVENTTAB',
                    hasNextPage: !(
                        data === undefined ||
                        data.length === 0 ||
                        data.length < limit
                    ),
                },
            })
        },
        () => {
            // TODO: implement for onError
        }
    )
}

// Load more for my event tab
export const loadMoreEvent = () => (dispatch, getState) => {
    const { token } = getState().user
    const {
        skip,
        limit,
        sortBy,
        filterOptions,
        hasNextPage,
    } = getState().myEventTab
    if (hasNextPage === false) {
        return
    }

    dispatch({
        type: MYEVENTTAB_LOAD,
    })
    loadEvent(
        skip,
        limit,
        token,
        sortBy,
        filterOptions,
        (data) => {
            dispatch({
                type: MYEVENTTAB_LOAD_DONE,
                payload: {
                    type: 'myeventtab',
                    data,
                    pageId: 'MYEVENTTAB',
                    skip: data.length,
                    limit: 20,
                    hasNextPage: !(
                        data === undefined ||
                        data.length === 0 ||
                        data.length < limit
                    ),
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
const loadEvent = (
    skip,
    limit,
    token,
    sortBy,
    filterOptions,
    callback,
    onError
) => {
    let filterOptionsToUse = _.cloneDeep(filterOptions)
    console.log(`${DEBUG_KEY}: filterOptionsToUse is:`, filterOptionsToUse)
    if (filterOptionsToUse.rsvp === 'All') {
        filterOptionsToUse = _.omit(filterOptionsToUse, 'rsvp')
        console.log(
            `${DEBUG_KEY}: filterOptionsToUse after removal:`,
            filterOptionsToUse
        )
    }

    API.get(
        `${BASE_ROUTE}?${queryBuilder(skip, limit, {
            sortBy,
            filterOptions: { ...filterOptionsToUse },
        })}`,
        token
    )
        .then((res) => {
            Logger.log('loading events with res: ', res, 3)
            if (res && res.data) {
                // Right now return test data
                return callback(res.data)
            }
            console.warn(`${DEBUG_KEY}: Loading goal with no res`)
        })
        .catch((err) => {
            console.log(`${DEBUG_KEY} load events error: ${err}`)
            onError(err)
        })
}
