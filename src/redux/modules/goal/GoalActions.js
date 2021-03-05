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
    GOAL_UPDATES_REFRESH_START,
    GOAL_UPDATES_REFRESH_SUCCESS,
    GOAL_UPDATES_REFRESH_FAIL,
    GOAL_UPDATES_LOAD_MORE_START,
    GOAL_UPDATES_LOAD_MORE_SUCCESS,
    GOAL_UPDATES_LOAD_MORE_FAIL,
} from './Goals'
import _ from 'lodash'

export const refreshMyUserGoals = () => (dispatch, getState) => {
    const { userId } = _.get(getState(), 'auth.user')
    const { token } = getState().user

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

export const loadMoreMyUserGoals = () => (dispatch, getState) => {
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

export const refreshGoalUpdates = (goalId, pageId) => (dispatch, getState) => {
    const { userId } = _.get(getState(), 'auth.user')
    const { token } = getState().user

    if (!userId) return

    dispatch({ type: GOAL_UPDATES_REFRESH_START, payload: { goalId, pageId } })

    const onSuccess = (data) => {
        dispatch({
            type: GOAL_UPDATES_REFRESH_SUCCESS,
            payload: { goalId, pageId, data },
        })
    }

    const onError = (err) => {
        dispatch({
            type: GOAL_UPDATES_REFRESH_FAIL,
            payload: { goalId, pageId },
        })
    }

    loadUpdatesByGoalId(0, 10, goalId, token, onSuccess, onError)
}

export const loadMoreGoalUpdates = (goalId, pageId) => (dispatch, getState) => {
    const { userId } = _.get(getState(), 'auth.user')
    const { token } = getState().user
    const { limit, skip } = _.get(
        getState(),
        `goals.updates.${goalId}.${pageId}`
    )

    if (!userId) return

    dispatch({
        type: GOAL_UPDATES_LOAD_MORE_START,
        payload: { goalId, pageId },
    })

    const onSuccess = (data) => {
        dispatch({
            type: GOAL_UPDATES_LOAD_MORE_SUCCESS,
            payload: { goalId, pageId, data },
        })
    }

    const onError = (err) => {
        dispatch({
            type: GOAL_UPDATES_LOAD_MORE_FAIL,
            payload: { goalId, pageId },
        })
    }

    loadUpdatesByGoalId(skip, limit, goalId, token, onSuccess, onError)
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

const loadUpdatesByGoalId = (
    skip,
    limit,
    goalId,
    token,
    onSuccess,
    onError
) => {
    // Todo: base route depends on tab selection
    const route = `secure/feed/post/${goalId}/updates?${queryBuilder(
        skip,
        limit
    )}`
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
