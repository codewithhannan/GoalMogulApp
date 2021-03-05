/**
 * This reducer is responsible for extra of goal creation and edition
 *
 * @format
 */

import _ from 'lodash'

const INITIAL_STATE = {
    uploading: true, // This is reversed. Need to update later.
    error: undefined,
    trendingGoals: {
        data: [],
        skip: 0,
        limit: 200,
        refreshing: false,
        loading: false,
        hasNextPage: undefined,
        category: undefined,
    },
    navigationState: {
        index: 0,
        routes: [
            { key: 'newGoal', title: 'New Goal' },
            {
                key: 'trendingGoal',
                title: 'Trending Goals',
                tutorial: {
                    tutorialText:
                        'Too busy to think about what goals to add? Try picking some from this list!',
                    order: 7,
                    name: 'create_goal_create_goal_modal_7',
                },
            },
        ],
    },
}

const DEBUG_KEY = '[ Reducers CreateGoal ]'

export const GOAL_CREATE_SUBMIT = 'goal_create_submit'
export const GOAL_CREATE_SUBMIT_SUCCESS = 'goal_create_submit_success'
export const GOAL_CREATE_SUBMIT_FAIL = 'goal_create_submit_fail'
export const GOAL_CREATE_EDIT_SUCCESS = 'goal_create_edit_success'
export const GOAL_CREATE_TRENDING_REFRESH = 'goal_create_trending_refresh'
export const GOAL_CREATE_TRENDING_REFRESH_DONE =
    'goal_create_trending_refresh_done'
export const GOAL_CREATE_TRENDING_LOADING_MORE =
    'goal_create_trending_loading_more'
export const GOAL_CREATE_TRENDING_LOADING_MORE_DONE =
    'goal_create_trending_loading_more_done'
export const GOAL_CREATE_TRENDING_SELECT_CATEGORY =
    'goal_create_trending_select_category'
export const GOAL_CREATE_SWITCH_TAB_BY_INDEX = 'goal_create_switch_tab_by_index'
export const GOAL_CREATE_SWITCH_TAB_BY_KEY = 'goal_create_switch_tab_by_key'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GOAL_CREATE_SUBMIT: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'uploading', false)
        }

        case GOAL_CREATE_SUBMIT_FAIL:
        case GOAL_CREATE_SUBMIT_SUCCESS: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'uploading', true)
        }

        case GOAL_CREATE_TRENDING_REFRESH: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'trendingGoals.refreshing', true)
        }

        case GOAL_CREATE_TRENDING_REFRESH_DONE: {
            const { data, hasNextPage, skip } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'trendingGoals.data', data.slice(0, 100))
            newState = _.set(newState, 'trendingGoals.skip', skip)
            newState = _.set(newState, 'trendingGoals.hasNextPage', hasNextPage)
            return _.set(newState, 'trendingGoals.refreshing', false)
        }

        case GOAL_CREATE_TRENDING_LOADING_MORE: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'trendingGoals.loading', true)
        }

        case GOAL_CREATE_TRENDING_LOADING_MORE_DONE: {
            const { data, skip, hasNextPage } = action.payload
            let newState = _.cloneDeep(state)
            const currentData = _.get(newState, 'trendingGoals.data')
            const newData = currentData.concat(data)
            // Only keep the first 100 goals
            const uniqueNewData = uniqueTrendingGoals(newData).slice(0, 100)

            newState = _.set(newState, 'trendingGoals.data', uniqueNewData)
            newState = _.set(newState, 'trendingGoals.skip', skip)
            newState = _.set(newState, 'trendingGoals.hasNextPage', hasNextPage)
            return _.set(newState, 'trendingGoals.loading', false)
        }

        case GOAL_CREATE_SWITCH_TAB_BY_INDEX: {
            const { index } = action.payload
            console.log(`${DEBUG_KEY}: index is: `, index)
            const newState = _.cloneDeep(state)
            return _.set(newState, 'navigationState.index', index)
        }

        case GOAL_CREATE_TRENDING_SELECT_CATEGORY: {
            const { category } = action.payload
            const newState = _.cloneDeep(state)
            return _.set(newState, 'trendingGoals.category', category)
        }

        default:
            return { ...state }
    }
}

const uniqueTrendingGoals = (array) => {
    let a = array.concat()
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i].title === a[j].title) {
                a.splice(j--, 1)
            }
        }
    }

    return a
}
