/**
 * This file is created to consolidate all goal related group fetch actions.
 *
 * @format
 */

import { queryBuilder, is2xxRespose } from '../../middleware/utils'
import { api as API } from '../../middleware/api'
import {
    MY_GOALS_REFRESH_START,
    MY_GOALS_REFRESH_SUCCESS,
    MY_GOALS_REFRESH_FAIL,
    MY_GOALS_LOAD_MORE_START,
    MY_GOALS_LOAD_MORE_SUCCESS,
    MY_GOALS_LOAD_MORE_FAIL,
} from './Goals'
import _ from 'lodash'

export const refreshMyUserGoals = (filter) => (dispatch, getState) => {
    const { userId } = _.get(getState(), 'auth.user')
    const { token } = getState().user
    const { limit } = getState().goals.myGoals

    if (!userId) return

    dispatch({ type: MY_GOALS_REFRESH_START })

    const onSuccess = (data) => {
        dispatch({ type: MY_GOALS_REFRESH_SUCCESS, payload: { data } })
    }

    const onError = (err) => {
        dispatch({ type: MY_GOALS_REFRESH_FAIL })
    }

    loadUserGoals(0, 10, { userId }, token, onSuccess, onError)
}

export const loadMoreMyUserGoals = (filter, skip) => (dispatch, getState) => {
    const { userId } = _.get(getState(), 'auth.user')
    const { token } = getState().user
    const { limit, skip } = getState().goals.myGoals

    if (!userId) return

    dispatch({ type: MY_GOALS_LOAD_MORE_START })

    const onSuccess = (data) => {
        dispatch({ type: MY_GOALS_LOAD_MORE_SUCCESS, payload: { data } })
    }

    const onError = (err) => {
        dispatch({ type: MY_GOALS_LOAD_MORE_FAIL })
    }

    loadUserGoals(skip, limit, { userId }, token, onSuccess, onError)
}

export const loadUserGoals = (
    skip,
    limit,
    filter,
    token,
    onSuccess,
    onError
) => {
    // Todo: base route depends on tab selection
    const route = `secure/goal/user?${queryBuilder(skip, limit, filter)}`
    return API.get(route, token)
        .then((res) => {
            // console.log(`${DEBUG_KEY}: res for fetching for tab: ${tab}, is: `, res);
            if (is2xxRespose(res.status) || (res && res.data)) {
                // TODO: change this
                return onSuccess(res.data)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}
