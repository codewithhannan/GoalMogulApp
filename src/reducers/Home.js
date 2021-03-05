/** @format */

import _ from 'lodash'
import { HOME_SWITCH_TAB } from '../actions/types'

import {
    LIKE_GOAL,
    LIKE_POST,
    UNLIKE_POST,
    UNLIKE_GOAL,
} from '../redux/modules/like/LikeReducers'

import { COMMENT_DELETE_SUCCESS } from '../redux/modules/feed/comment/CommentReducers'

import { COMMENT_NEW_POST_SUCCESS } from '../redux/modules/feed/comment/NewCommentReducers'

import {
    PROFILE_GOAL_DELETE_SUCCESS,
    PROFILE_POST_DELETE_SUCCESS,
} from './Profile'

import { USER_LOG_OUT } from './User'

import {
    GOAL_DETAIL_UPDATE_DONE,
    GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS,
} from '../reducers/GoalDetailReducers'

import { POST_NEW_POST_SUBMIT_SUCCESS } from '../redux/modules/feed/post/PostReducers'

import {
    NOTIFICATION_SUBSCRIBE,
    NOTIFICATION_UNSUBSCRIBE,
} from '../redux/modules/notification/NotificationTabReducers'

export const HOME_MASTERMIND_OPEN_CREATE_OVERLAY =
    'home_mastermind_open_create_overlay'
export const HOME_CLOSE_CREATE_OVERLAY = 'home_mastermind_close_create_overlay'
// Goal related constants
export const HOME_REFRESH_GOAL = 'home_refresh_goal'
export const HOME_REFRESH_GOAL_DONE = 'home_refresh_goal_done'
export const HOME_LOAD_GOAL = 'home_load_goal'
export const HOME_LOAD_GOAL_DONE = 'home_load_goal_done'
export const HOME_SET_GOAL_INDEX = 'home_set_goal_index' // set current goal viewing index
export const HOME_UPDATE_FILTER = 'home_update_filter'

// Feed related constants
export const HOME_REFRESH_FEED = 'home_refresh_feed'
export const HOME_REFRESH_FEED_DONE = 'home_refresh_feed_done'
export const HOME_LOAD_FEED_DONE = 'home_load_feed_done'
export const HOME_SET_FEED_INDEX = 'home_set_feed_index' // set current goal viewing index
export const HOME_UPDATE_FEED_FILTER = 'home_update_feed_filter'
// for showing 'get your silver badge!' toast
export const HOME_USER_INVITED_FRIENDS_COUNT = 'home_user_friends_count'

const DEBUG_KEY = '[ Action Home ]'
const INITIAL_STATE = {
    tabIndex: 0,
    mastermind: {
        showPlus: true,
        data: [],
        limit: 4,
        skip: 0,
        currentIndex: 0,
        filter: {
            sortBy: 'shared',
            orderBy: 'descending',
            categories: 'All',
            completedOnly: 'false',
            priorities: '',
        },
        hasNextPage: undefined,
        loading: false, // Set to true when refreshing
        loadingMore: false, // Set to true when loading more
        refreshing: false, // Set to true when refreshing
    },
    activityfeed: {
        showPlus: true,
        data: [],
        limit: 4,
        skip: 0,
        currentIndex: 0,
        filter: {
            sortBy: 'created',
            orderBy: 'descending',
            categories: 'All',
            completedOnly: 'false',
            priorities: '',
        },
        hasNextPage: undefined,
        loading: false,
        loadingMore: false,
        refreshing: false,
        // for showing 'get your silver badge!' toast
        userInvitedFriendsCount: Number.MAX_SAFE_INTEGER,
        randomNumber: Math.random(),
    },
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case HOME_SWITCH_TAB:
            return { ...state, tabIndex: action.payload }

        case HOME_MASTERMIND_OPEN_CREATE_OVERLAY: {
            let newState = _.cloneDeep(state)
            newState.mastermind.showPlus = false
            return { ...newState }
        }

        case HOME_CLOSE_CREATE_OVERLAY: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${action.payload}.showPlus`, true)
            return { ...newState }
        }

        case HOME_USER_INVITED_FRIENDS_COUNT: {
            let newState = _.cloneDeep(state)
            return _.set(
                newState,
                `activityfeed.userInvitedFriendsCount`,
                action.payload
            )
        }

        /**
         * Please refer to the refactoring in Profile.js (reducer) for TODO
         */
        case HOME_REFRESH_GOAL: {
            const { type } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${type}.refreshing`, true)
            return _.set(newState, `${type}.loading`, true)
        }

        case HOME_REFRESH_GOAL_DONE: {
            const { skip, data, hasNextPage, type } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${type}.loading`, false)
            newState = _.set(newState, `${type}.refreshing`, false)

            if (skip !== undefined) {
                newState = _.set(newState, `${type}.skip`, skip)
            }
            newState = _.set(newState, `${type}.hasNextPage`, hasNextPage)

            let sortedData = []
            if (type === 'mastermind') {
                sortedData = data.sort(
                    (a, b) =>
                        new Date(b.feedInfo.publishDate) -
                        new Date(a.feedInfo.publishDate)
                )
            } else {
                sortedData = data.sort(
                    (a, b) => new Date(b.created) - new Date(a.created)
                )
            }

            return _.set(newState, `${type}.data`, sortedData)
        }

        case HOME_LOAD_GOAL: {
            const { type } = action.payload
            let newState = _.cloneDeep(state)
            return _.set(newState, `${type}.loadingMore`, true)
        }

        case HOME_LOAD_GOAL_DONE: {
            const { skip, data, hasNextPage, type } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${type}.loading`, false)
            newState = _.set(newState, `${type}.loadingMore`, false)
            // console.log(`${DEBUG_KEY}: new skip for type: ${type} is: `, skip);
            if (skip !== undefined) {
                newState = _.set(newState, `${type}.skip`, skip)
            }
            newState = _.set(newState, `${type}.hasNextPage`, hasNextPage)
            const oldData = _.get(newState, `${type}.data`)
            const newData = arrayUnique(oldData.concat(data))

            let sortedData = []
            if (type === 'mastermind') {
                sortedData = newData.sort(
                    (a, b) =>
                        new Date(b.feedInfo.publishDate) -
                        new Date(a.feedInfo.publishDate)
                )
            } else {
                sortedData = newData.sort(
                    (a, b) => new Date(b.created) - new Date(a.created)
                )
            }

            return _.set(newState, `${type}.data`, sortedData)
        }

        case HOME_SET_GOAL_INDEX: {
            const { type, index } = action.payload
            const newState = _.cloneDeep(state)
            return _.set(newState, `${type}.currentIndex`, index)
        }

        // Update one of the home tab filters
        case HOME_UPDATE_FILTER: {
            const { tab, type, value } = action.payload
            const newState = _.cloneDeep(state)
            if (type === 'priorities') {
                const oldPriorities = _.get(
                    newState,
                    `${tab}.filter.priorities`
                )
                const newPriorities = updatePriorities(oldPriorities, value)
                return _.set(
                    newState,
                    `${tab}.filter.priorities`,
                    newPriorities
                )
            }
            return _.set(newState, `${tab}.filter.${type}`, value)
        }

        // When user deletes his/her own goals from Goals Feed, remove the corresponding
        // Item from the goal feed list
        case PROFILE_GOAL_DELETE_SUCCESS: {
            const { goalId } = action.payload
            let newState = _.cloneDeep(state)
            const oldGoalData = _.get(newState, 'mastermind.data')
            // Filter out the goal
            const newGoalData = oldGoalData.filter(({ _id }) => _id !== goalId)

            // Filter out the goal from activity feed
            const oldActivityData = _.get(newState, 'activityfeed.data')
            const newActivityData = oldActivityData.filter(
                ({ actedUponEntityId }) => actedUponEntityId !== goalId
            )

            newState = _.set(newState, 'activityfeed.data', newActivityData)
            return _.set(newState, 'mastermind.data', newGoalData)
        }

        // When user deletes his/her own posts from activity Feed, remove the corresponding
        // Item from the activity feed list
        case PROFILE_POST_DELETE_SUCCESS: {
            const { postId } = action.payload
            const newState = _.cloneDeep(state)
            const oldData = _.get(newState, 'activityfeed.data')
            // Filter out the activity feed that relates to this deleted post
            const newData = oldData.filter(
                ({ actedUponEntityId }) => actedUponEntityId !== postId
            )
            return _.set(newState, 'activityfeed.data', newData)
        }

        // Update like
        case UNLIKE_GOAL:
        case UNLIKE_POST:
        case LIKE_GOAL:
        case LIKE_POST: {
            const { id, likeId, type, undo } = action.payload
            let newState = _.cloneDeep(state)
            const oldGoalFeedData = _.get(newState, 'mastermind.data')
            const oldActivityData = _.get(newState, 'activityfeed.data')

            // Update activity feed
            newState = _.set(
                newState,
                'activityfeed.data',
                updateLike(oldActivityData, id, likeId, type, undo, action.type)
            )
            // Update goal feed
            newState = _.set(
                newState,
                'mastermind.data',
                updateLike(oldGoalFeedData, id, likeId, type, undo, action.type)
            )
            return newState
        }

        // Comment delete success to update goalcard / activitycard commentCount
        case COMMENT_DELETE_SUCCESS: {
            let newState = _.cloneDeep(state)
            const { parentRef, parentType } = action.payload

            const oldMastermindData = _.get(newState, 'mastermind.data')
            const newMastermindData = oldMastermindData.map((d) => {
                if (parentType === 'Goal' && d._id === parentRef) {
                    const oldCommentCount = d.commentCount
                    return {
                        ...d,
                        commentCount: oldCommentCount - 1,
                    }
                }
                return d
            })
            newState = _.set(newState, 'mastermind.data', newMastermindData)

            const oldActivityData = _.get(newState, 'activityfeed.data')
            const newActivityData = oldActivityData.map((d) => {
                if (
                    (d.goalRef &&
                        d.goalRef._id === parentRef &&
                        parentType === 'Goal') ||
                    (d.postRef &&
                        d.postRef._id === parentRef &&
                        parentType === 'Post')
                ) {
                    const oldCommentCount = d.commentCount
                    return {
                        ...d,
                        commentCount: oldCommentCount - 1,
                    }
                }
                return d
            })

            newState = _.set(newState, 'activityfeed.data', newActivityData)
            return newState
        }

        case COMMENT_NEW_POST_SUCCESS: {
            const { comment } = action.payload
            const { parentRef, parentType } = comment
            let newState = _.cloneDeep(state)

            const oldMastermindData = _.get(newState, 'mastermind.data')
            const newMastermindData = oldMastermindData.map((d) => {
                if (parentType === 'Goal' && d._id === parentRef) {
                    const oldCommentCount = d.commentCount
                    return {
                        ...d,
                        commentCount: oldCommentCount + 1,
                    }
                }
                return d
            })
            newState = _.set(newState, 'mastermind.data', newMastermindData)

            const oldActivityData = _.get(newState, 'activityfeed.data')
            const newActivityData = oldActivityData.map((d) => {
                if (
                    (d.goalRef &&
                        d.goalRef._id === parentRef &&
                        parentType === 'Goal') ||
                    (d.postRef &&
                        d.postRef._id === parentRef &&
                        parentType === 'Post')
                ) {
                    const oldCommentCount = d.commentCount
                    return {
                        ...d,
                        commentCount: oldCommentCount + 1,
                    }
                }
                return d
            })

            newState = _.set(newState, 'activityfeed.data', newActivityData)
            return newState
        }

        /**
         * Only if it's update then check
         */
        case POST_NEW_POST_SUBMIT_SUCCESS: {
            let newState = _.cloneDeep(state)
            const { post, update } = action.payload
            if (!update) return newState

            // Update activity feed
            const oldActivityFeed = _.get(newState, 'activityfeed.data')
            const newActivityFeed = oldActivityFeed.map((activity) => {
                const { actedUponEntityType, postRef } = activity
                let newActivity = _.cloneDeep(activity)
                if (
                    actedUponEntityType === 'Post' &&
                    postRef &&
                    postRef._id === post._id
                ) {
                    console.log(`${DEBUG_KEY}: new post is:`, post)
                    newActivity = _.set(newActivity, 'postRef', post)
                }

                return newActivity
            })

            newState = _.set(newState, 'activityfeed.data', newActivityFeed)
            return newState
        }

        /**
         * Update goal in goal feed and activity feed after its status for completeness is updated
         */
        case GOAL_DETAIL_UPDATE_DONE: {
            const { type, goalId, complete } = action.payload
            let newState = _.cloneDeep(state)
            // Only handle mark goal as complete case
            if (type !== 'markGoalAsComplete') {
                return newState
            }

            // Update goal feed
            const oldGoalFeed = _.get(newState, 'mastermind.data')
            const newGoalFeed = oldGoalFeed.map((goal) => {
                if (goal._id === goalId) {
                    return {
                        ...goal,
                        isCompleted: complete,
                    }
                }
                return goal
            })

            newState = _.set(newState, 'mastermind.data', newGoalFeed)

            // Update activity feed
            const oldActivityFeed = _.get(newState, 'activityfeed.data')
            const newActivityFeed = oldActivityFeed.map((activity) => {
                const { actedUponEntityType, goalRef } = activity
                let newActivity = _.cloneDeep(activity)
                if (
                    actedUponEntityType === 'Goal' &&
                    goalRef &&
                    goalRef._id === goalId
                ) {
                    newActivity = _.set(
                        newActivity,
                        'goalRef.isCompleted',
                        complete
                    )
                }

                return newActivity
            })

            newState = _.set(newState, 'activityfeed.data', newActivityFeed)
            return newState
        }

        /**
         * Update goal feed and activity feed after user marks a need as complete
         */
        case GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS: {
            const { id, goalId, pageId, isCompleted } = action.payload
            let newState = _.cloneDeep(state)
            // Update goal feed
            const oldGoalFeed = _.get(newState, 'mastermind.data')
            const newGoalFeed = oldGoalFeed.map((goal) => {
                if (goal._id === goalId) {
                    let goalToUpdate = _.cloneDeep(goal)
                    let oldNeeds = _.get(goalToUpdate, 'needs')
                    if (!oldNeeds || oldNeeds.length === 0) {
                        return goalToUpdate
                    }
                    // Iterate to update needs
                    const newNeeds = oldNeeds.map((n) => {
                        if (n._id === id) {
                            return {
                                ...n,
                                isCompleted,
                            }
                        }
                        return n
                    })
                    // Update the goal
                    return _.set(goalToUpdate, 'needs', newNeeds)
                }
                return goal
            })

            newState = _.set(newState, 'mastermind.data', newGoalFeed)

            const oldActivityFeed = _.get(newState, 'activityfeed.data')
            const newActivityFeed = oldActivityFeed.map((activity) => {
                const { actedUponEntityType, goalRef } = activity
                let newActivity = _.cloneDeep(activity)
                if (
                    actedUponEntityType === 'Goal' &&
                    goalRef &&
                    goalRef._id === goalId
                ) {
                    let goalToUpdate = _.get(newActivity, 'goalRef')
                    let oldNeeds = _.get(goalToUpdate, 'needs')
                    if (!oldNeeds || oldNeeds.length === 0) return newActivity // Nothing to update
                    const newNeeds = oldNeeds.map((n) => {
                        if (n._id === id) {
                            return {
                                ...n,
                                isCompleted,
                            }
                        }
                        return n
                    })
                    // Update the goal with new needs
                    goalToUpdate = _.set(goalToUpdate, 'needs', newNeeds)
                    // Update the activity with the updated goal
                    newActivity = _.set(newActivity, 'goalRef', goalToUpdate)
                }
                return newActivity
            })

            newState = _.set(newState, 'activityfeed.data', newActivityFeed)

            return newState
        }

        /**
         * Update goal feed and activity feed after user marks a need as complete
         */
        case GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS: {
            const { id, goalId, pageId, isCompleted } = action.payload
            let newState = _.cloneDeep(state)
            // Update goal feed
            const oldGoalFeed = _.get(newState, 'mastermind.data')
            const newGoalFeed = oldGoalFeed.map((goal) => {
                if (goal._id === goalId) {
                    let goalToUpdate = _.cloneDeep(goal)
                    let oldSteps = _.get(goalToUpdate, 'steps')
                    if (!oldSteps || oldSteps.length === 0) return goalToUpdate // Nothing to update
                    // Iterate to update needs
                    const newSteps = oldSteps.map((n) => {
                        if (n._id === id) {
                            return {
                                ...n,
                                isCompleted,
                            }
                        }
                        return n
                    })
                    // Update the goal
                    return _.set(goalToUpdate, 'steps', newSteps)
                }
                return goal
            })

            newState = _.set(newState, 'mastermind.data', newGoalFeed)

            const oldActivityFeed = _.get(newState, 'activityfeed.data')
            const newActivityFeed = oldActivityFeed.map((activity) => {
                const { actedUponEntityType, goalRef } = activity
                let newActivity = _.cloneDeep(activity)
                if (
                    actedUponEntityType === 'Goal' &&
                    goalRef &&
                    goalRef._id === goalId
                ) {
                    let goalToUpdate = _.get(newActivity, 'goalRef')
                    let oldSteps = _.get(goalToUpdate, 'steps')
                    if (!oldSteps || oldSteps.length === 0) return newActivity // Nothing to update
                    const newSteps = oldSteps.map((n) => {
                        if (n._id === id) {
                            return {
                                ...n,
                                isCompleted,
                            }
                        }
                        return n
                    })
                    // Update the goal with new needs
                    goalToUpdate = _.set(goalToUpdate, 'steps', newSteps)
                    // Update the activity with the updated goal
                    newActivity = _.set(newActivity, 'goalRef', goalToUpdate)
                }
                return newActivity
            })

            newState = _.set(newState, 'activityfeed.data', newActivityFeed)

            return newState
        }

        // Notification to update maybeIsSubscribe state for goal
        case NOTIFICATION_UNSUBSCRIBE: {
            let newState = _.cloneDeep(state)
            const { entityId, entityKind } = action.payload

            // Update goal feed
            if (entityKind === 'Goal') {
                const oldGoalFeedData = _.get(newState, 'mastermind.data')
                const newGoalFeedData = oldGoalFeedData.map((g) => {
                    if (g._id === entityId) {
                        return {
                            ...g,
                            maybeIsSubscribed: false,
                        }
                    }
                    return g
                })
                newState = _.set(newState, 'mastermind.data', newGoalFeedData)
            }

            // Update activity feed
            const oldActivityFeed = _.get(newState, 'activityfeed.data')
            const newActivityFeed = oldActivityFeed.map((a) => {
                let ret = _.cloneDeep(a)
                const { actedUponEntityType, postRef, goalRef } = ret
                if (actedUponEntityType === 'Post' && postRef) {
                    ret = _.set(ret, 'postRef.maybeIsSubscribed', false)
                }

                if (actedUponEntityType === 'Goal' && goalRef) {
                    ret = _.set(ret, 'goalRef.maybeIsSubscribed', false)
                }

                return ret
            })
            newState = _.set(newState, 'activityfeed.data', newActivityFeed)

            return newState
        }

        case NOTIFICATION_SUBSCRIBE: {
            let newState = _.cloneDeep(state)
            const { entityId, entityKind } = action.payload
            // Update goal feed
            if (entityKind === 'Goal') {
                const oldGoalFeedData = _.get(newState, 'mastermind.data')
                const newGoalFeedData = oldGoalFeedData.map((g) => {
                    if (g._id === entityId) {
                        return {
                            ...g,
                            maybeIsSubscribed: true,
                        }
                    }
                    return g
                })
                newState = _.set(newState, 'mastermind.data', newGoalFeedData)
            }

            // Update activity feed
            const oldActivityFeed = _.get(newState, 'activityfeed.data')
            const newActivityFeed = oldActivityFeed.map((a) => {
                let ret = _.cloneDeep(a)
                const { actedUponEntityType, postRef, goalRef } = ret
                if (actedUponEntityType === 'Post' && postRef) {
                    ret = _.set(ret, 'postRef.maybeIsSubscribed', true)
                }

                if (actedUponEntityType === 'Goal' && goalRef) {
                    ret = _.set(ret, 'goalRef.maybeIsSubscribed', true)
                }

                return ret
            })
            newState = _.set(newState, 'activityfeed.data', newActivityFeed)

            return newState
        }

        /**
         * User related
         */
        case USER_LOG_OUT: {
            return _.cloneDeep(INITIAL_STATE)
        }

        default:
            return { ...state }
    }
}

function updateLike(array, id, likeId, type, undo, likeType) {
    return array.map((item) => {
        let newItem = _.cloneDeep(item)
        if (type === 'post' || type === 'goal') {
            let itemToUpdate
            let path
            if (newItem.postRef) {
                path = 'postRef'
            }
            if (newItem.goalRef) {
                path = 'goalRef'
            }
            if (path) {
                itemToUpdate = _.get(newItem, `${path}`)
                if (itemToUpdate._id === id) {
                    // upate maybeLikeRef
                    itemToUpdate = _.set(itemToUpdate, 'maybeLikeRef', likeId)

                    // Update like Count
                    const oldLikeCount = _.get(itemToUpdate, 'likeCount', 0)
                    let newLikeCount = oldLikeCount || 0

                    if (likeType === LIKE_GOAL || likeType === LIKE_POST) {
                        if (undo) {
                            newLikeCount = newLikeCount - 1
                        } else if (likeId === 'testId') {
                            newLikeCount = newLikeCount + 1
                        }
                    } else if (
                        likeType === UNLIKE_GOAL ||
                        likeType === UNLIKE_POST
                    ) {
                        if (undo) {
                            newLikeCount = newLikeCount + 1
                        } else if (likeId === undefined) {
                            newLikeCount = newLikeCount - 1
                        }
                    }
                    itemToUpdate = _.set(
                        itemToUpdate,
                        'likeCount',
                        newLikeCount
                    )
                    newItem = _.set(newItem, `${path}`, itemToUpdate)
                }
            } else {
                if (item._id.toString() === id.toString()) {
                    newItem = _.set(newItem, 'maybeLikeRef', likeId)

                    const oldLikeCount = _.get(newItem, 'likeCount', 0)
                    let newLikeCount = oldLikeCount || 0

                    if (likeType === LIKE_GOAL || likeType === LIKE_POST) {
                        if (undo) {
                            newLikeCount = newLikeCount - 1
                        } else if (likeId === 'testId') {
                            newLikeCount = newLikeCount + 1
                        }
                    } else if (
                        likeType === UNLIKE_GOAL ||
                        likeType === UNLIKE_POST
                    ) {
                        if (undo) {
                            newLikeCount = newLikeCount + 1
                        } else if (likeId === undefined) {
                            newLikeCount = newLikeCount - 1
                        }
                    }
                    newItem = _.set(newItem, 'likeCount', newLikeCount)
                    console.log(newItem)
                }
            }
            return newItem
        }

        if (item._id.toString() === id.toString()) {
            newItem = _.set(newItem, 'maybeLikeRef', likeId)

            const oldLikeCount = _.get(newItem, 'likeCount', 0)
            let newLikeCount = oldLikeCount || 0

            if (likeType === LIKE_GOAL || likeType === LIKE_POST) {
                if (undo) {
                    newLikeCount = newLikeCount - 1
                } else if (likeId === 'testId') {
                    newLikeCount = newLikeCount + 1
                }
            } else if (likeType === UNLIKE_GOAL || likeType === UNLIKE_POST) {
                if (undo) {
                    newLikeCount = newLikeCount + 1
                } else if (likeId === undefined) {
                    newLikeCount = newLikeCount - 1
                }
            }
            newItem = _.set(newItem, 'likeCount', newLikeCount)
        }
        return newItem
    })
}

function arrayUnique(array) {
    let a = array.concat()
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i]._id === a[j]._id) {
                a.splice(j--, 1)
            }
        }
    }

    return a
}

function updatePriorities(priorities, newPriority) {
    let newPriorities = []
    const oldPriorities = priorities === '' ? [] : priorities.split(',').sort()

    if (newPriority === 'All') {
        if (oldPriorities.join() === '1,2,3,4,5,6,7,8,9') {
            return ''
        }
        return '1,2,3,4,5,6,7,8,9'
    }

    if (oldPriorities.indexOf(`${newPriority}`) < 0) {
        // Add the new priority to the string
        newPriorities = [...oldPriorities, newPriority]
    } else {
        // Remove the new priority from the string
        newPriorities = oldPriorities.filter((p) => p !== newPriority)
    }

    return newPriorities.join()
}
