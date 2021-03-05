/** @format */

import _ from 'lodash'

import { USER_LOG_OUT } from './User'

import {
    LIKE_POST,
    LIKE_GOAL,
    UNLIKE_POST,
    UNLIKE_GOAL,
} from '../redux/modules/like/LikeReducers'

import {
    COMMENT_NEW_POST_SUGGESTION_SUCCESS,
    COMMENT_NEW_POST_SUCCESS,
} from '../redux/modules/feed/comment/NewCommentReducers'

import { COMMENT_DELETE_SUCCESS } from '../redux/modules/feed/comment/CommentReducers'

import { GOAL_CREATE_EDIT_SUCCESS } from '../redux/modules/goal/CreateGoal'

const INITIAL_NAVIGATION_STATE_V2 = {
    index: 0,
    routes: [
        { key: 'centralTab', title: 'CentralTab' },
        { key: 'focusTab', title: 'FocusTab' },
    ],
    focusType: undefined, // ['need', 'step', 'comment']
    focusRef: undefined,
}

const INITIAL_NAVIGATION_STATE = {
    index: 0,
    routes: [
        { key: 'comments', title: 'Comments' },
        { key: 'mastermind', title: 'Mastermind' },
    ],
}

const INITIAL_STATE = {
    goal: {
        navigationStateV2: { ...INITIAL_NAVIGATION_STATE_V2 },
        navigationState: {
            ...INITIAL_NAVIGATION_STATE,
        },
        goal: {},
        updating: false,
    },
    goalExploreTab: {
        navigationStateV2: { ...INITIAL_NAVIGATION_STATE_V2 },
        navigationState: {
            ...INITIAL_NAVIGATION_STATE,
        },
        goal: {},
        updating: false,
    },
    goalProfileTab: {
        navigationStateV2: { ...INITIAL_NAVIGATION_STATE_V2 },
        navigationState: {
            ...INITIAL_NAVIGATION_STATE,
        },
        goal: {},
        updating: false,
    },
    goalNotificationTab: {
        navigationStateV2: { ...INITIAL_NAVIGATION_STATE_V2 },
        navigationState: {
            ...INITIAL_NAVIGATION_STATE,
        },
        goal: {},
        updating: false,
    },
    goalChatTab: {
        navigationStateV2: { ...INITIAL_NAVIGATION_STATE_V2 },
        navigationState: {
            ...INITIAL_NAVIGATION_STATE,
        },
        goal: {},
        updating: false,
    },
}

export const GOAL_DETAIL_FETCH = 'goal_detail_fetch'
export const GOAL_DETAIL_FETCH_DONE = 'goal_detail_fetch_done'
export const GOAL_DETAIL_FETCH_ERROR = 'goal_detail_fetch_error'
export const GOAL_DETAIL_OPEN = 'goal_detail_open'
export const GOAL_DETAIL_CLOSE = 'goal_detail_close'
export const GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS =
    'goal_detail_mark_as_complete_success'
export const GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS =
    'goal_detail_share_to_mastermind_success'
export const GOAL_DETAIL_UPDATE_STEP_NEED_SUCCESS =
    'goal_detail_update_step_need_success'
export const GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS =
    'goal_detail_mark_step_as_complete_success'
export const GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS =
    'goal_detail_mark_need_as_complete_success'

export const GOAL_DETAIL_SWITCH_TAB = 'goal_detail_switch_tab'
export const GOAL_DETAIL_SWITCH_TAB_V2 = 'goal_detail_switch_tab_v2'
// Comment related constants
export const GOAL_DETAIL_GET_COMMENT = 'goal_detail_get_comment'
export const GOAL_DETAIL_CREATE_COMMENT = 'goal_detail_create_comment'
export const GOAL_DETAIL_UPDATE_COMMENT = 'goal_detail_create_comment'
export const GOAL_DETAIL_DELETE_COMMENT = 'goal_detail_create_comment'
// Like related constants
export const GOAL_DETAIL_GET_LIKE = 'goal_detail_get_like'
export const GOAL_DETAIL_CREATE_LIKE = 'goal_detail_create_like'
export const GOAL_DETAIL_DELETE_LIKE = 'goal_detail_create_like'

// Goal Updating constants
export const GOAL_DETAIL_UPDATE = 'goal_detail_update'
export const GOAL_DETAIL_UPDATE_DONE = 'goal_detail_update_done'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GOAL_DETAIL_FETCH: {
            const { tab, goalId } = action.payload
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal'
                    : `goal${capitalizeWord(tab)}`
            let newState = _.cloneDeep(state)
            const originalGoal = _.get(newState, `${path}.goal`)
            if (originalGoal._id === goalId) {
                newState = _.set(newState, `${path}.goal.loading`, true)
            }
            return newState
        }

        case GOAL_DETAIL_FETCH_DONE: {
            const { tab, goalId, goal } = action.payload
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal'
                    : `goal${capitalizeWord(tab)}`
            let newState = _.cloneDeep(state)
            const originalGoal = _.get(newState, `${path}.goal`)
            if (originalGoal._id === goalId) {
                newState = _.set(newState, `${path}.goal`, goal)
            }
            return newState
        }

        case GOAL_DETAIL_FETCH_ERROR: {
            const { tab, goalId } = action.payload
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal'
                    : `goal${capitalizeWord(tab)}`
            let newState = _.cloneDeep(state)
            const originalGoal = _.get(newState, `${path}.goal`)
            if (originalGoal._id === goalId) {
                newState = _.set(newState, `${path}.goal.loading`, false)
            }
            return newState
        }

        case GOAL_DETAIL_OPEN: {
            const { tab, goal } = action.payload
            let newState = _.cloneDeep(state)

            if (goal !== undefined && goal !== null && !_.isEmpty(goal)) {
                const path =
                    !tab || tab === 'homeTab'
                        ? 'goal.goal'
                        : `goal${capitalizeWord(tab)}.goal`
                newState = _.set(newState, `${path}`, { ...goal })
            }
            return newState
        }

        /**
         * Clear goal detail on user close or log out
         */
        case GOAL_DETAIL_CLOSE: {
            const { tab } = action.payload
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal'
                    : `goal${capitalizeWord(tab)}`
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${path}.navigationState`, {
                ...INITIAL_NAVIGATION_STATE,
            })
            newState = _.set(newState, `${path}.navigationStateV2`, {
                ...INITIAL_NAVIGATION_STATE_V2,
            })
            newState = _.set(newState, `${path}.updating`, false)
            return _.set(newState, `${path}.goal`, {})
        }

        case GOAL_DETAIL_SWITCH_TAB: {
            const { tab, index } = action.payload
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal.navigationState'
                    : `goal${capitalizeWord(tab)}.navigationState`
            const newState = _.cloneDeep(state)
            return _.set(newState, `${path}.index`, index)
        }

        case GOAL_DETAIL_SWITCH_TAB_V2: {
            const { tab, index, key, focusType, focusRef } = action.payload
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal.navigationStateV2'
                    : `goal${capitalizeWord(tab)}.navigationStateV2`
            let newState = _.cloneDeep(state)
            const navigationStateV2 = _.get(newState, `${path}`)
            let newIndex = index || 0
            if (key) {
                navigationStateV2.routes.forEach((route, i) => {
                    if (route.key === key) {
                        newIndex = i
                    }
                })
            }
            newState = _.set(newState, `${path}.focusRef`, focusRef)
            newState = _.set(newState, `${path}.focusType`, focusType)

            return _.set(newState, `${path}.index`, newIndex)
        }

        case USER_LOG_OUT: {
            return { ...INITIAL_STATE }
        }

        case LIKE_POST:
        case LIKE_GOAL:
        case UNLIKE_POST:
        case UNLIKE_GOAL: {
            const { id, likeId, tab, undo } = action.payload
            let newState = _.cloneDeep(state)

            const path =
                !tab || tab === 'homeTab'
                    ? 'goal.goal'
                    : `goal${capitalizeWord(tab)}.goal`
            const goal = _.get(newState, `${path}`)
            if (goal._id && goal._id.toString() === id.toString()) {
                newState = _.set(newState, `${path}.maybeLikeRef`, likeId)
                const oldLikeCount = _.get(newState, `${path}.likeCount`, 0)
                let newLikeCount = oldLikeCount || 0

                if (action.type === LIKE_POST || action.type === LIKE_GOAL) {
                    if (undo) {
                        newLikeCount = newLikeCount - 1
                    } else if (likeId === 'testId') {
                        newLikeCount = newLikeCount + 1
                    }
                } else if (
                    action.type === UNLIKE_POST ||
                    action.type === UNLIKE_GOAL
                ) {
                    if (undo) {
                        newLikeCount = newLikeCount + 1
                    } else if (likeId === undefined) {
                        newLikeCount = newLikeCount - 1
                    }
                }
                newState = _.set(newState, `${path}.likeCount`, newLikeCount)
            }
            return newState
        }

        case GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS: {
            const { tab, complete } = action.payload
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal.goal'
                    : `goal${capitalizeWord(tab)}.goal`
            const newState = _.cloneDeep(state)
            return _.set(newState, `${path}.isCompleted`, complete)
        }

        case GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS: {
            const { tab } = action.payload
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal.goal'
                    : `goal${capitalizeWord(tab)}.goal`
            const newState = _.cloneDeep(state)
            return _.set(newState, `${path}.shareToGoalFeed`, true)
        }

        // Comment with suggestion for need or step is posted successfully
        case COMMENT_NEW_POST_SUGGESTION_SUCCESS: {
            const { tab } = action.payload
            const newState = _.cloneDeep(state)
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal'
                    : `goal${capitalizeWord(tab)}`
            // set the navigationState to have comment as the tab
            return _.set(newState, `${path}.navigationState.index`, 0)
        }

        case COMMENT_DELETE_SUCCESS: {
            const { tab, commentId } = action.payload
            const newState = _.cloneDeep(state)
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal'
                    : `goal${capitalizeWord(tab)}`
            let currentCount = _.get(newState, `${path}.goal.commentCount`)
            if (!currentCount) return newState
            return _.set(newState, `${path}.goal.commentCount`, --currentCount)
        }

        case COMMENT_NEW_POST_SUCCESS: {
            const { tab, commentId } = action.payload
            const newState = _.cloneDeep(state)
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal'
                    : `goal${capitalizeWord(tab)}`
            let currentCount = _.get(newState, `${path}.goal.commentCount`) || 0
            return _.set(newState, `${path}.goal.commentCount`, ++currentCount)
        }

        // On goal edition success, update the current displayed goal
        case GOAL_CREATE_EDIT_SUCCESS: {
            const { tab, goal } = action.payload
            const newState = _.cloneDeep(state)
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal'
                    : `goal${capitalizeWord(tab)}`
            const currentGoal = _.get(newState, `${path}.goal`)
            if (!currentGoal || currentGoal._id !== goal._id) return

            const newGoalToPut = {
                ...goal,
                owner: { ...currentGoal.owner },
            }
            return _.set(newState, `${path}.goal`, newGoalToPut)
        }

        // Update goal updating status
        case GOAL_DETAIL_UPDATE: {
            const { tab, goalId } = action.payload
            const newState = _.cloneDeep(state)
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal'
                    : `goal${capitalizeWord(tab)}`
            const currentGoal = _.get(newState, `${path}.goal`)
            if (
                !currentGoal ||
                _.isEmpty(currentGoal) ||
                currentGoal._id !== goalId
            ) {
                return newState
            }
            return _.set(newState, `${path}.updating`, true)
        }

        case GOAL_DETAIL_UPDATE_DONE: {
            const { tab, goalId } = action.payload
            const newState = _.cloneDeep(state)
            const path =
                !tab || tab === 'homeTab'
                    ? 'goal'
                    : `goal${capitalizeWord(tab)}`
            const currentGoal = _.get(newState, `${path}.goal`)
            if (
                !currentGoal ||
                _.isEmpty(currentGoal) ||
                currentGoal._id !== goalId
            ) {
                return newState
            }
            return _.set(newState, `${path}.updating`, false)
        }

        default:
            return { ...state }
    }
}

// Find the object with id and update the object with the newValsMap
function findAndUpdate(id, data, newValsMap) {
    if (!data || data.length === 0) return []
    return data.map((item) => {
        if (item._id === id) {
            let newItem = _.cloneDeep(item)
            Object.keys(newValsMap).forEach((key) => {
                if (newValsMap[key] !== null) {
                    newItem = _.set(newItem, `${key}`, newValsMap[key])
                }
            })
            console.log(newItem)
            return newItem
        }
        return item
    })
}

const capitalizeWord = (word) => {
    if (!word) return ''
    return word.replace(/^\w/, (c) => c.toUpperCase())
}
