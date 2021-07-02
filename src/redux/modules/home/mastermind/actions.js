/** @format */

import { Actions } from 'react-native-router-flux'
import {
    HOME_CLOSE_CREATE_OVERLAY,
    HOME_MASTERMIND_OPEN_CREATE_OVERLAY,
    HOME_REFRESH_GOAL,
    HOME_REFRESH_GOAL_DONE,
    HOME_LOAD_GOAL,
    HOME_LOAD_GOAL_DONE,
    HOME_SET_GOAL_INDEX,
    HOME_UPDATE_FILTER,
} from '../../../../reducers/Home'
import { GOAL_DETAIL_OPEN } from '../../../../reducers/GoalDetailReducers'
import { EMPTY_GOAL } from '../../../../Utils/Constants'

import { api as API } from '../../../middleware/api'
import {
    queryBuilder,
    constructPageId,
    componentKeyByTab,
} from '../../../middleware/utils'
import { Logger } from '../../../middleware/utils/Logger'

const DEBUG_KEY = '[ Action Home Mastermind ]'
const BASE_ROUTE = 'secure/goal/'

export const openCreateOverlay = () => ({
    type: HOME_MASTERMIND_OPEN_CREATE_OVERLAY,
})

export const closeCreateOverlay = (tab) => ({
    type: HOME_CLOSE_CREATE_OVERLAY,
    payload: tab,
})

export const openGoalDetailById = (goalId, initialProps) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    let goal = EMPTY_GOAL
    goal._id = goalId

    // Generate pageId on open
    const pageId = constructPageId('goal')
    dispatch({
        type: GOAL_DETAIL_OPEN,
        payload: {
            tab,
            pageId,
            goalId,
            goal,
        },
    })

    // In the version 0.3.9 and later, loading goal and comment is done in goal detail
    // refreshGoalDetailById(goalId, pageId)(dispatch, getState);
    // refreshComments('Goal', goalId, tab, pageId)(dispatch, getState);
    // TODO: create new stack using Actions.create(React.Element) if needed
    const componentToOpen = componentKeyByTab(tab, 'goal')
    Actions.push(`${componentToOpen}`, {
        initial: initialProps,
        goalId,
        pageId,
    })
}

// Open goal detail
export const openGoalDetail = (goal, initialProps) => (dispatch, getState) => {
    const { tab } = getState().navigation
    const { _id } = goal

    // Generate pageId on open
    const pageId = constructPageId('goal')
    dispatch({
        type: GOAL_DETAIL_OPEN,
        payload: {
            goal,
            tab,
            pageId,
            goalId: _id,
        },
    })

    // console.log(`${DEBUG_KEY}: initialProps:`, initialProps);
    if (initialProps && initialProps.refreshGoal === false) {
        // Do not refresh goal if it's set to false
    } else {
        // No need to refresh since it's done on goal mounted
        // refreshGoalDetailById(_id, pageId)(dispatch, getState);
    }

    // In the version 0.3.9 and later, loading goal and comment is done in goal detail
    // refreshComments('Goal', _id, tab, pageId)(dispatch, getState);
    const componentToOpen = componentKeyByTab(tab, 'goal')
    console.log('Component to open =======================>', componentToOpen)
    Actions.push(`${componentToOpen}`, {
        initial: initialProps,
        goalId: _id,
        pageId,
    })
}

// set currentIndex to the prev one
export const getPrevGoal = () => (dispatch, getState) => {
    const { currentIndex } = getState().home.mastermind
    if (currentIndex <= 0) {
        return false
    }
    dispatch({
        type: HOME_SET_GOAL_INDEX,
        payload: currentIndex - 1,
    })
    return true
}

// set currentIndex to the next one
export const getNextGoal = () => (dispatch, getState) => {
    const { currentIndex, goals } = getState().home.mastermind
    if (currentIndex >= goals.length) {
        return false
    }
    dispatch({
        type: HOME_SET_GOAL_INDEX,
        payload: currentIndex + 1,
    })
    return true
}

// User update filter for specific tab in Mastermind
export const changeFilter = (tab, filterType, value) => (dispatch) => {
    dispatch({
        type: HOME_UPDATE_FILTER,
        payload: {
            tab,
            type: filterType,
            value,
        },
    })
}

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions
 */

//Refresh goal for mastermind tab
export const refreshGoalFeed = () => (dispatch, getState) => {
    const { token } = getState().user
    const { limit, filter, refreshing } = getState().home.mastermind
    const { categories, priorities, sortBy } = filter
    if (refreshing) return
    dispatch({
        type: HOME_REFRESH_GOAL,
        payload: {
            type: 'mastermind',
        },
    })
    loadGoals(
        0,
        limit,
        token,
        { priorities, categories, sortBy },
        (data) => {
            Logger.log(
                `${DEBUG_KEY}: refreshed goals with length: `,
                data.length,
                2
            )
            // console.log(`${DEBUG_KEY}: refreshed goals are: `, data);
            // data.forEach((d) => {
            //   console.log(`${DEBUG_KEY}: item: ${d.title} created: `, d);
            // });
            dispatch({
                type: HOME_REFRESH_GOAL_DONE,
                payload: {
                    type: 'mastermind',
                    data,
                    skip: data.length,
                    limit: 20,
                    hasNextPage: !(data === undefined || data.length === 0),
                    pageId: 'HOME',
                },
            })
        },
        () => {
            // TODO: implement for onError
        }
    )
}

// Load more goal for mastermind tab
export const loadMoreGoals = (callback) => (dispatch, getState) => {
    const { token } = getState().user
    const {
        skip,
        limit,
        filter,
        hasNextPage,
        refreshing,
        loadingMore,
    } = getState().home.mastermind
    if (hasNextPage === false || refreshing || loadingMore) {
        return
    }

    dispatch({
        type: HOME_LOAD_GOAL,
        payload: {
            type: 'mastermind',
        },
    })
    const { categories, priorities, sortBy } = filter
    loadGoals(
        skip,
        limit,
        token,
        { priorities, categories, sortBy },
        (data) => {
            Logger.log(
                `${DEBUG_KEY}: load more goals with data length: `,
                data.length,
                2
            )
            // console.log(`${DEBUG_KEY}: load more goals with data: `, data);
            // data.forEach((d) => {
            //   console.log(`${DEBUG_KEY}: item: ${d.title} created: `, d.created);
            // });
            dispatch({
                type: HOME_LOAD_GOAL_DONE,
                payload: {
                    type: 'mastermind',
                    data,
                    skip: skip + (data === undefined ? 0 : data.length),
                    limit: 20,
                    hasNextPage: !(data === undefined || data.length === 0),
                    pageId: 'HOME',
                },
            })
            if (callback) callback()
        },
        () => {
            // TODO: implement for onError
        }
    )
}

/**
 * Basic API to load goals based on skip and limit
 * @param isRefresh:
 * @param skip:
 * @param limit:
 * @param token:
 */
const loadGoals = (skip, limit, token, params, callback, onError) => {
    const route = 'feed'
    const { priorities, categories, sortBy } = params
    let priority
    if (priorities && priorities !== '') {
        priority = priorities
    }

    API.get(
        `${BASE_ROUTE}${route}?${queryBuilder(skip, limit, {
            priority,
            categories: categories === 'All' ? undefined : categories,
        })}`,
        token
    )
        .then((res) => {
            // console.log('loading goals in mastermind with res: ', res);
            if (res.status === 200 || (res && res.data)) {
                // Right now return test data
                callback(res.data)
                return
            }
            callback([]) // TODO: delete this line
            console.log(`${DEBUG_KEY}: Loading goal with no res`)
        })
        .catch((err) => {
            console.log(`${DEBUG_KEY} load goal error: ${err}`)
            onError(err)
            callback([])
        })
}
