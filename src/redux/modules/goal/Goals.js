/**
 * This reducer is the source of truth for Goals related Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 *
 * @format
 */

import _ from 'lodash'

// Constants
import {
    PROFILE_FETCH_TAB_DONE,
    PROFILE_REFRESH_TAB_DONE,
    PROFILE_GOAL_DELETE_SUCCESS,
} from '../../../reducers/Profile'

import { PROFILE_CLOSE_PROFILE } from '../../../actions/types'

import { USER_LOG_OUT } from '../../../reducers/User'

import {
    GOAL_DETAIL_OPEN,
    GOAL_DETAIL_FETCH,
    GOAL_DETAIL_FETCH_DONE,
    GOAL_DETAIL_FETCH_ERROR,
    GOAL_DETAIL_UPDATE,
    GOAL_DETAIL_UPDATE_DONE,
    GOAL_DETAIL_CLOSE,
    GOAL_DETAIL_UPDATE_STEP_NEED_SUCCESS,
    GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
    GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_SWITCH_TAB_V2,
} from '../../../reducers/GoalDetailReducers'

import { GOAL_CREATE_EDIT_SUCCESS } from '../goal/CreateGoal'

import {
    HOME_REFRESH_GOAL_DONE,
    HOME_LOAD_GOAL_DONE,
} from '../../../reducers/Home'

import { COMMENT_DELETE_SUCCESS } from '../feed/comment/CommentReducers'

import { COMMENT_NEW_POST_SUCCESS } from '../feed/comment/NewCommentReducers'

import {
    LIKE_POST,
    LIKE_GOAL,
    UNLIKE_POST,
    UNLIKE_GOAL,
} from '../like/LikeReducers'

import {
    NOTIFICATION_SUBSCRIBE,
    NOTIFICATION_UNSUBSCRIBE,
} from '../notification/NotificationTabReducers'
import {
    MYTRIBE_GOAL_REFRESH_DONE,
    MYTRIBE_GOAL_LOAD_DONE,
} from '../tribe/Tribes'
import { arrayUnique } from '../../middleware/utils'

export const MY_GOALS_REFRESH_START = 'my_goals_refresh_start'
export const MY_GOALS_REFRESH_SUCCESS = 'my_goals_refresh_success'
export const MY_GOALS_REFRESH_FAIL = 'my_goals_refresh_fail'

export const MY_GOALS_LOAD_MORE_START = 'my_goals_load_more_start'
export const MY_GOALS_LOAD_MORE_SUCCESS = 'my_goals_load_more_success'
export const MY_GOALS_LOAD_MORE_FAIL = 'my_goals_load_more_fail'

export const GOAL_UPDATES_REFRESH_START = 'goal_updates_refresh_start'
export const GOAL_UPDATES_REFRESH_SUCCESS = 'goal_updates_refresh_success'
export const GOAL_UPDATES_REFRESH_FAIL = 'goal_updates_refresh_fail'

export const GOAL_UPDATES_LOAD_MORE_START = 'goal_updates_load_more_start'
export const GOAL_UPDATES_LOAD_MORE_SUCCESS = 'goal_updates_load_more_success'
export const GOAL_UPDATES_LOAD_MORE_FAIL = 'goal_updates_load_more_fail'

/**
 * List of const to add
 *
 * Create Goal
 * GOAL_CREATE_EDIT_SUCCESS (done)
 *
 * Goal Detail related
 * GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS, (done)
 * GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS, (done)
 * GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS, (done)
 * GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS (done)
 * GOAL_DETAIL_UPDATE, (done)
 * GOAL_DETAIL_UPDATE_DONE, (done)
 * GOAL_DETAIL_FETCH, (done)
 * GOAL_DETAIL_FETCH_DONE, (done)
 * GOAL_DETAIL_FETCH_ERROR, (done)
 * GOAL_DETAIL_OPEN (done)
 * GOAL_DETAIL_CLOSE, (done)
 * GOAL_DETAIL_SWITCH_TAB, (no need)// This is used in GoalDetailCardV2 which is deprecated
 * GOAL_DETAIL_SWITCH_TAB_V2, (done)
 *
 * Profile related (done)
 * PROFILE_FETCH_TAB_DONE (done)
 * PROFILE_REFRESH_TAB_DONE (done)
 * PROFILE_GOAL_DELETE_SUCCESS (done)
 * PROFILE_CLOSE_PROFILE (done)
 *
 * Comment related
 * The ones that need to increase / decrease comment count
 * COMMENT_DELETE_SUCCESS, (done)
 * COMMENT_NEW_POST_SUCCESS (done)
 * COMMENT_NEW_POST_START
 * COMMENT_NEW_POST_FAIL
 *
 *
 * Home related (Goal Feed)
 * HOME_REFRESH_GOAL_DONE (done)
 * HOME_LOAD_GOAL_DONE (done)
 *
 * Like related
 * LIKE_POST,
 * LIKE_GOAL,
 * UNLIKE_POST,
 * UNLIKE_GOAL
 *
 * User related
 * USER_LOG_OUT (done)
 *
 */

const DEBUG_KEY = '[ Reducer Goals ]'

// Sample goal object in the map
const INITIAL_GOAL_OBJECT = {
    goal: {},
    // pageId: {
    //     refreshing: false
    // },
    reference: [],
}

// Sample goal object in the map
export const INITIAL_UPDATES_OBJECT = {
    refreshing: false,
    loading: false,
    limit: 10,
    skip: 0,
    data: [],
}

export const INITIAL_NAVIGATION_STATE_V2 = {
    index: 0,
    routes: [
        { key: 'centralTab', title: 'CentralTab' },
        { key: 'focusTab', title: 'FocusTab' },
    ],
    focusType: undefined, // ['need', 'step', 'comment']
    focusRef: undefined,
}

export const INITIAL_GOAL_PAGE = {
    refreshing: false,
    loading: false, // Indicator if goal on this page is loading
    updating: false, // Indicator if goal on this page is updating
    // Potential navigation state and etc. First focus on integration with Profile
    navigationStateV2: INITIAL_NAVIGATION_STATE_V2,
}

const INITIAL_STATE = {
    myGoals: {
        refreshing: false,
        loading: false,
        filter: false,
        limit: 10,
        skip: 0,
        data: [],
    },
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        /* My Goals related */
        case MY_GOALS_REFRESH_START: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'myGoals.refreshing', true)
            return newState
        }

        case MY_GOALS_REFRESH_SUCCESS: {
            const { data } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'myGoals.refreshing', false)
            newState = _.set(newState, 'myGoals.data', data)
            newState = _.set(newState, 'myGoals.skip', data.length)
            return newState
        }

        case MY_GOALS_REFRESH_FAIL: {
            let newState = _.cloneDeep(state)
            _.set(newState, 'myGoals.refreshing', false)
            return newState
        }

        case MY_GOALS_LOAD_MORE_START: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'myGoals.loading', true)
            return newState
        }

        case MY_GOALS_LOAD_MORE_SUCCESS: {
            const { data } = action.payload
            let newState = _.cloneDeep(state)

            const oldData = _.get(newState, 'myGoals.data', [])
            let newData = arrayUnique(oldData.concat(data))

            newState = _.set(newState, 'myGoals.loading', false)
            newState = _.set(newState, 'myGoals.data', newData)
            newState = _.set(newState, 'myGoals.skip', newData.length)
            return newState
        }

        case MY_GOALS_LOAD_MORE_FAIL: {
            const { goalId, pageId } = action.payload
            const path = `updates.${goalId}.${pageId}`
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${path}.loading`, false)
            return newState
        }

        /* Goal updates related */
        case GOAL_UPDATES_REFRESH_START: {
            const { goalId, pageId } = action.payload
            const path = `updates.${goalId}.${pageId}`
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${path}.refreshing`, true)
            return newState
        }

        case GOAL_UPDATES_REFRESH_SUCCESS: {
            const { goalId, pageId, data } = action.payload
            const path = `updates.${goalId}.${pageId}`
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${path}.refreshing`, false)
            newState = _.set(newState, `${path}.data`, data)
            newState = _.set(newState, `${path}.skip`, data.length)
            return newState
        }

        case GOAL_UPDATES_REFRESH_FAIL: {
            const { goalId, pageId } = action.payload
            const path = `updates.${goalId}.${pageId}`
            let newState = _.cloneDeep(state)
            _.set(newState, `${path}.refreshing`, false)
            return newState
        }

        case GOAL_UPDATES_LOAD_MORE_START: {
            const { goalId, pageId } = action.payload
            const path = `updates.${goalId}.${pageId}`
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${path}.loading`, true)
            return newState
        }

        case GOAL_UPDATES_LOAD_MORE_SUCCESS: {
            const { goalId, pageId, data } = action.payload
            const path = `updates.${goalId}.${pageId}`
            let newState = _.cloneDeep(state)

            const oldData = _.get(newState, `${path}.data`, [])
            let newData = arrayUnique(oldData.concat(data))

            newState = _.set(newState, `${path}.loading`, false)
            newState = _.set(newState, `${path}.data`, newData)
            newState = _.set(newState, `${path}.skip`, newData.length)
            return newState
        }

        case GOAL_UPDATES_LOAD_MORE_FAIL: {
            const { goalId, pageId } = action.payload
            const path = `updates.${goalId}.${pageId}`
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${path}.loading`, false)
            return newState
        }

        /* Goal Detail related */
        case GOAL_DETAIL_FETCH_DONE: {
            const { goal, goalId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            let reference = pageId !== undefined ? [pageId] : []
            let goalObjectToUpdate = _.has(newState, goalId)
                ? _.get(newState, `${goalId}`)
                : INITIAL_GOAL_OBJECT

            // Page should already exist for fetching a goal detail otherwise abort
            if (pageId === undefined || !_.has(state, `${goalId}.${pageId}`)) {
                return newState
            }

            // Set the goal to the latest
            if (goal !== undefined) {
                goalObjectToUpdate = _.set(goalObjectToUpdate, 'goal', goal)
            }

            // Update the reference
            const oldReference = _.get(goalObjectToUpdate, 'reference')
            if (oldReference !== undefined) {
                if (!oldReference.some((r) => r === pageId)) {
                    reference = reference.concat(oldReference)
                } else {
                    reference = oldReference
                }
            }

            goalObjectToUpdate = _.set(
                goalObjectToUpdate,
                `${pageId}.loading`,
                false
            )
            goalObjectToUpdate = _.set(
                goalObjectToUpdate,
                'reference',
                reference
            )

            newState = _.set(newState, `${goalId}`, goalObjectToUpdate)
            return newState
        }

        case GOAL_DETAIL_OPEN: {
            const { goal, goalId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            let reference = [pageId]
            let goalObjectToUpdate = _.has(newState, goalId)
                ? _.get(newState, `${goalId}`)
                : { ...INITIAL_GOAL_OBJECT }

            if (pageId === undefined) {
                // Abort something is wrong
                console.warn(
                    `${DEBUG_KEY}: [ ${GOAL_DETAIL_OPEN} ] with pageId: ${pageId}`
                )
                return newState
            }

            // Set the goal to the latest
            if (goal !== undefined) {
                goalObjectToUpdate = _.set(goalObjectToUpdate, 'goal', goal)
            }

            // Setup goal page for pageId if not initially setup
            if (!_.has(goalObjectToUpdate, pageId)) {
                goalObjectToUpdate = _.set(goalObjectToUpdate, pageId, {
                    ...INITIAL_GOAL_PAGE,
                })
            }

            // Update the reference
            const oldReference = _.get(goalObjectToUpdate, 'reference')
            if (oldReference !== undefined) {
                if (!oldReference.some((r) => r === pageId)) {
                    // Add new pageId to reference
                    reference = reference.concat(oldReference)
                } else {
                    // No ops since reference is already there
                    reference = oldReference
                }
            }
            goalObjectToUpdate = _.set(
                goalObjectToUpdate,
                'reference',
                reference
            )

            // Update goal object
            newState = _.set(newState, `${goalId}`, goalObjectToUpdate)
            return newState
        }

        case GOAL_CREATE_EDIT_SUCCESS: {
            const { goal } = action.payload
            let newState = _.cloneDeep(state)
            if (goal === undefined) return newState

            const goalId = goal._id
            if (!_.has(newState, goalId)) {
                // We don't update if no goal is already opened
                // Or not in any of the list
                return newState
            }

            newState = _.set(newState, `${goalId}.goal`, goal)
            return newState
        }

        /**
         * Setup the goal and page default object if not previously existed
         */
        case GOAL_DETAIL_FETCH: {
            const { goalId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, goalId)) {
                newState = _.set(newState, goalId, INITIAL_GOAL_OBJECT)
            }

            if (!_.has(newState, `${goalId}.${pageId}`)) {
                newState = _.set(
                    newState,
                    `${goalId}.${pageId}`,
                    INITIAL_GOAL_PAGE
                )
            }

            let reference = [pageId]
            // Update the reference
            const oldReference = _.get(newState, `${goalId}.reference`)
            if (oldReference !== undefined) {
                if (!oldReference.some((r) => r === pageId)) {
                    // Add new pageId to reference
                    reference = reference.concat(oldReference)
                } else {
                    // No ops since reference is already there
                    reference = oldReference
                }
            }
            newState = _.set(newState, `${goalId}.reference`, reference)
            return _.set(newState, `${goalId}.${pageId}.loading`, true)
        }

        case GOAL_DETAIL_FETCH_ERROR: {
            const { goalId, pageId } = action.payload
            const newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheckByPageId(
                newState,
                goalId,
                pageId,
                GOAL_DETAIL_FETCH_ERROR
            )
            if (!shouldUpdate) return newState
            return _.set(newState, `${goalId}.${pageId}.loading`, false)
        }

        case GOAL_DETAIL_UPDATE: {
            const { goalId, pageId } = action.payload
            const newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheckByPageId(
                newState,
                goalId,
                pageId,
                GOAL_DETAIL_UPDATE
            )
            if (!shouldUpdate) return newState
            return _.set(newState, `${goalId}.${pageId}.updating`, true)
        }

        case GOAL_DETAIL_UPDATE_DONE: {
            const { goalId, pageId } = action.payload
            const newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheckByPageId(
                newState,
                goalId,
                pageId,
                GOAL_DETAIL_UPDATE
            )
            if (!shouldUpdate) return newState
            return _.set(newState, `${goalId}.${pageId}.updating`, false)
        }

        case GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS: {
            const { id, isCompleted, goalId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheck(
                newState,
                goalId,
                GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS
            )
            if (!shouldUpdate) {
                return newState
            }

            const shouldUpdatePage = sanityCheckByPageId(
                newState,
                goalId,
                pageId,
                GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS
            )
            if (shouldUpdatePage) {
                newState = _.set(
                    newState,
                    `${goalId}.${pageId}.updating`,
                    false
                )
            }

            const oldNeeds = _.get(newState, `${goalId}.goal.needs`)
            // When mark need as complete, user might not be in goal detail view
            // so oldNeeds could be undefined
            if (oldNeeds !== undefined && oldNeeds.length > 0) {
                const newNeeds = findAndUpdate(id, oldNeeds, { isCompleted })
                newState = _.set(newState, `${goalId}.goal.needs`, newNeeds)
            }

            return newState
        }

        case GOAL_DETAIL_UPDATE_STEP_NEED_SUCCESS: {
            const { id, updates, type, goalId, pageId, isNew } = action.payload
            let newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheck(
                newState,
                goalId,
                GOAL_DETAIL_UPDATE_STEP_NEED_SUCCESS
            )
            if (!shouldUpdate) {
                return newState
            }

            const shouldUpdatePage = sanityCheckByPageId(
                newState,
                goalId,
                pageId,
                GOAL_DETAIL_UPDATE_STEP_NEED_SUCCESS
            )
            if (shouldUpdatePage) {
                newState = _.set(
                    newState,
                    `${goalId}.${pageId}.updating`,
                    false
                )
            }

            const oldSteps = _.get(newState, `${goalId}.goal.${type}`, [])
            // When mark step as complete, user might not be in goal detail view
            // so oldNeeds could be undefined
            if (isNew) {
                oldSteps.push(updates)
                newState = _.set(newState, `${goalId}.goal.${type}`, oldSteps)
            }
            if (oldSteps !== undefined && oldSteps.length > 0) {
                const newSteps = findAndUpdate(id, oldSteps, updates)
                newState = _.set(newState, `${goalId}.goal.${type}`, newSteps)
            }

            return newState
        }

        case GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS: {
            const { goalId } = action.payload
            let newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheck(
                newState,
                goalId,
                GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS
            )
            if (!shouldUpdate) {
                return newState
            }
            newState = _.set(newState, `${goalId}.goal.shareToGoalFeed`, true)
            return newState
        }

        case GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS: {
            const { goalId, complete, data } = action.payload
            let newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheck(
                newState,
                goalId,
                GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS
            )
            if (!shouldUpdate) {
                return newState
            }
            const owner = _.get(newState, `${goalId}.goal.owner`)

            const oldGoal = _.get(newState, `${goalId}.goal`)

            // Combine oldGoal and new returned goal as returned goal doesn't have comment count and other stuff
            const newGoal = {
                ...oldGoal,
                ...data,
            }
            newState = _.set(newState, `${goalId}.goal`, newGoal)
            // Reset owner since returned data doesn't populate owner
            newState = _.set(newState, `${goalId}.goal.owner`, owner)
            return newState
        }

        case GOAL_DETAIL_SWITCH_TAB_V2: {
            const {
                tab,
                index,
                key,
                focusType,
                focusRef,
                goalId,
                pageId,
            } = action.payload

            const path = `${goalId}.${pageId}.navigationStateV2`
            let newState = _.cloneDeep(state)
            // Sanity check by pageId because we need pageId to be present
            const shouldUpdate = sanityCheckByPageId(
                newState,
                goalId,
                pageId,
                GOAL_DETAIL_SWITCH_TAB_V2
            )
            if (!shouldUpdate) return newState

            const navigationStateV2 = _.get(newState, path)
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
            newState = _.set(newState, `${path}.index`, newIndex)

            return newState
        }

        /* Profile related */
        case MYTRIBE_GOAL_REFRESH_DONE:
        case MYTRIBE_GOAL_LOAD_DONE:
        case HOME_LOAD_GOAL_DONE: // pageId for goal feed is 'HOME'
        case HOME_REFRESH_GOAL_DONE: // pageId for goal feed is 'HOME'
        case PROFILE_REFRESH_TAB_DONE:
        case PROFILE_FETCH_TAB_DONE: {
            const { pageId, data, type } = action.payload
            let newState = _.cloneDeep(state)

            // Customized logics
            if (
                action.type === PROFILE_REFRESH_TAB_DONE ||
                action.type === PROFILE_FETCH_TAB_DONE
            ) {
                if (type !== 'goals') return newState
            }

            // Customized logics
            if (
                action.type === HOME_REFRESH_GOAL_DONE ||
                action.type === HOME_LOAD_GOAL_DONE
            ) {
                if (type !== 'mastermind') return newState
            }

            if (!data || _.isEmpty(data)) return newState

            data.forEach((goal) => {
                const goalId = goal._id

                let goalToUpdate = { ...INITIAL_GOAL_OBJECT }
                // Update goal
                if (_.has(newState, goalId)) {
                    goalToUpdate = _.get(newState, `${goalId}`)
                    // newState = _.set(newState, `${goalId}.goal`, goal);
                }

                // TODO: perform schema check
                if (goal !== undefined) {
                    goalToUpdate = _.set(goalToUpdate, 'goal', goal)
                }

                const oldReference = _.get(newState, `${goalId}.reference`)
                // console.log(`${DEBUG_KEY}: old reference is: `, oldReference);
                const hasPageReference =
                    oldReference !== undefined &&
                    oldReference.some((r) => r === pageId)
                // Update reference
                let newReference = [pageId]
                if (oldReference !== undefined) {
                    if (!hasPageReference) {
                        newReference = newReference.concat(oldReference)
                    } else {
                        newReference = oldReference
                    }
                }

                goalToUpdate = _.set(goalToUpdate, 'reference', newReference)
                newState = _.set(newState, `${goalId}`, goalToUpdate)
            })

            return newState
        }

        case GOAL_DETAIL_CLOSE:
        case PROFILE_GOAL_DELETE_SUCCESS: {
            const { pageId, goalId } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, goalId)) return newState // no reference to remove

            let goalToUpdate = _.get(newState, `${goalId}`)

            // Update reference
            const oldReference = _.get(goalToUpdate, 'reference')
            let newReference = oldReference
            if (
                oldReference !== undefined &&
                oldReference.some((r) => r === pageId)
            ) {
                newReference = newReference.filter((r) => r !== pageId)
            }

            // Remove pageId reference object
            goalToUpdate = _.omit(goalToUpdate, `${pageId}`)

            // Remove this goal if it's no longer referenced
            if (!newReference || _.isEmpty(newReference)) {
                newState = _.omit(newState, `${goalId}`)
                return newState
            }

            // Update the goal by goalId
            goalToUpdate = _.set(goalToUpdate, 'reference', newReference)
            newState = _.set(newState, `${goalId}`, goalToUpdate)
            return newState
        }

        case PROFILE_CLOSE_PROFILE: {
            const { goalList, pageId } = action.payload
            // console.log(`${DEBUG_KEY}: closing profile with pageId: ${pageId} and goalList:`, goalList);
            let newState = _.cloneDeep(state)
            if (!goalList || _.isEmpty(goalList)) return newState

            // console.log(`${DEBUG_KEY}: profile close before state: `, newState);

            goalList.forEach((goalId) => {
                // Check if goalId in the Goals
                if (!_.has(newState, goalId)) {
                    return
                }

                let goalToUpdate = _.get(newState, `${goalId}`)

                // Remove pageId reference object
                goalToUpdate = _.omit(goalToUpdate, `${pageId}`)

                const oldReference = _.get(newState, `${goalId}.reference`)
                const hasPageReference =
                    oldReference !== undefined &&
                    oldReference.some((r) => r === pageId)
                // Remove reference
                let newReference = oldReference
                if (hasPageReference) {
                    newReference = oldReference.filter((r) => r !== pageId)
                }

                // Remove this goal if it's no longer referenced
                if (!newReference || _.isEmpty(newReference)) {
                    newState = _.omit(newState, `${goalId}`)
                    return
                }
                goalToUpdate = _.set(goalToUpdate, 'reference', newReference)
                newState = _.set(newState, `${goalId}`, goalToUpdate)
            })

            // console.log(`${DEBUG_KEY}: profile close with newState: `, newState);
            return newState
        }

        /* Comment related */
        case COMMENT_DELETE_SUCCESS: {
            const {
                pageId,
                tab,
                commentId,
                parentRef,
                parentType, // ['Goal', 'Post']
            } = action.payload
            let newState = _.cloneDeep(state)
            // check parentType to determine to proceed
            if (parentType !== 'Goal') {
                return newState
            }
            // Check if goal of concerned is in the Goals
            if (!_.has(newState, parentRef)) return newState
            if (!_.has(newState, `${parentRef}.goal`)) {
                console.warn(
                    `${DEBUG_KEY}: goal is not in ${parentRef}: `,
                    _.get(newState, `${parentRef}`)
                )
                return newState
            }
            // Decrease comment count
            const oldCommentCount =
                _.get(newState, `${parentRef}.goal.commentCount`) || 0
            const newCommentCount =
                oldCommentCount - 1 < 0 ? 0 : oldCommentCount - 1

            newState = _.set(
                newState,
                `${parentRef}.goal.commentCount`,
                newCommentCount
            )
            return newState
        }

        // Temporarily disabled
        // case COMMENT_NEW_POST_START: {
        //     let newState = _.cloneDeep(state);
        //     const { pageId, entityId } = action.payload;
        //     if (!_.has(newState, entityId)) return newState;

        //     // Set the updating status for comment
        //     if (!_.has(newState, `${entityId}.${pageId}`)) {
        //         console.warn(`${DEBUG_KEY}: [ ${action.type} ]: comment starts to post on a non-referenced page:`, pageId);
        //     } else {
        //         // Set the updating status to false as we finished posting a comment
        //         newState = _.set(newState, `${entityId}.${pageId}.updating`, true);
        //     }

        //     return newState;
        // }

        // case COMMENT_NEW_POST_FAIL: {
        //     let newState = _.cloneDeep(state);
        //     const { pageId, entityId } = action.payload;
        //     if (!_.has(newState, entityId)) return newState;

        //     // Set the updating status for comment
        //     if (!_.has(newState, `${entityId}.${pageId}`)) {
        //         console.warn(`${DEBUG_KEY}: [ ${action.type} ]: comment failed to post on a non-referenced page:`, pageId);
        //     } else {
        //         // Set the updating status to false as we finished posting a comment
        //         newState = _.set(newState, `${entityId}.${pageId}.updating`, false);
        //     }

        //     return newState;
        // }

        case COMMENT_NEW_POST_SUCCESS: {
            let newState = _.cloneDeep(state)
            const { comment, pageId } = action.payload
            const { parentType, parentRef } = comment
            // check parentType to determine to proceed
            if (parentType !== 'Goal') {
                return newState
            }

            // Check if goal of concerned is in the Goals
            if (!_.has(newState, parentRef)) return newState

            if (!_.has(newState, `${parentRef}.goal`)) {
                console.warn(
                    `${DEBUG_KEY}: goal is not in ${parentRef}: `,
                    _.get(newState, `${parentRef}`)
                )
                return newState
            }

            // Increase comment count
            const oldCommentCount =
                _.get(newState, `${parentRef}.goal.commentCount`) || 0
            const newCommentCount = oldCommentCount + 1

            newState = _.set(
                newState,
                `${parentRef}.goal.commentCount`,
                newCommentCount
            )

            // Reset the updating status for comment
            if (!_.has(newState, `${parentRef}.${pageId}`)) {
                console.warn(
                    `${DEBUG_KEY}: [ COMMENT_NEW_POST_SUCCESS ]: comment is posted on a non-referenced page:`,
                    pageId
                )
            } else {
                // Set the updating status to false as we finished posting a comment
                newState = _.set(
                    newState,
                    `${parentRef}.${pageId}.updating`,
                    false
                )
            }

            return newState
        }

        /* Like related */
        case LIKE_POST:
        case LIKE_GOAL:
        case UNLIKE_POST:
        case UNLIKE_GOAL: {
            const { id, likeId, tab, undo } = action.payload
            let newState = _.cloneDeep(state)
            const goalId = id

            if (!_.has(newState, `${goalId}.goal`)) return newState

            let goalToUpdate = _.get(newState, `${goalId}.goal`)
            goalToUpdate = _.set(goalToUpdate, 'maybeLikeRef', likeId)

            const oldLikeCount = _.get(goalToUpdate, 'likeCount', 0)
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
            goalToUpdate = _.set(goalToUpdate, 'likeCount', newLikeCount)
            newState = _.set(newState, `${goalId}.goal`, goalToUpdate)
            return newState
        }

        // Notification to update maybeIsSubscribe state for goal
        case NOTIFICATION_UNSUBSCRIBE: {
            let newState = _.cloneDeep(state)
            const { entityId, entityKind } = action.payload
            if (entityKind !== 'Goal') return newState
            const shouldUpdate = sanityCheck(newState, entityId, action.type)

            if (shouldUpdate) {
                newState = _.set(
                    newState,
                    `${entityId}.goal.maybeIsSubscribed`,
                    false
                )
            }
            return newState
        }

        case NOTIFICATION_SUBSCRIBE: {
            let newState = _.cloneDeep(state)
            const { entityId, entityKind } = action.payload
            if (entityKind !== 'Goal') return newState
            const shouldUpdate = sanityCheck(newState, entityId, action.type)

            if (shouldUpdate) {
                newState = _.set(
                    newState,
                    `${entityId}.goal.maybeIsSubscribed`,
                    true
                )
            }
            return newState
        }

        case USER_LOG_OUT: {
            return { ...INITIAL_STATE }
        }

        default:
            return { ...state }
    }
}

const sanityCheck = (state, goalId, type) => {
    if (!_.has(state, goalId)) {
        console.warn(
            `${DEBUG_KEY}: [ ${type} ]: expecting goalId: ${goalId} but not found`
        )
        return false
    }
    return true
}

const sanityCheckByPageId = (state, goalId, pageId, type) => {
    if (!_.has(state, goalId)) {
        console.warn(
            `${DEBUG_KEY}: [ ${type} ]: expecting goalId: ${goalId} but not found`
        )
        return false
    }
    if (!_.has(state, `${goalId}.${pageId}`)) {
        console.warn(
            `${DEBUG_KEY}: [ ${type} ]: expecting goalId: ${goalId} and ` +
                `pageId: ${pageId} but not found`
        )
        return false
    }

    return true
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
            return newItem
        }
        return item
    })
}
