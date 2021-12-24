/** @format */

import _ from 'lodash'

import {
    PROFILE_OPEN_PROFILE,
    PROFILE_FETCHING_SUCCESS,
    PROFILE_IMAGE_UPLOAD_SUCCESS,
    PROFILE_SUBMIT_UPDATE,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_UPDATE_FAIL,
    PROFILE_SWITCH_TAB,
    MEET_UPDATE_FRIENDSHIP_DONE,
    PROFILE_FETCHING_FAIL,
    GOAL_UPDATE_27,
} from '../actions/types'

import {
    GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
    GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS,
} from './GoalDetailReducers'

import { USER_LOG_OUT } from './User'

import { GOAL_CREATE_EDIT_SUCCESS } from '../redux/modules/goal/CreateGoal'

// Profile action constants
export const PROFILE_FETCH_MUTUAL_FRIEND = 'profile_fetch_mutual_friend'
export const PROFILE_FETCH_MUTUAL_FRIEND_DONE =
    'profile_fetch_mutual_friend_done'
export const PROFILE_FETCH_FRIENDSHIP_DONE = 'profile_fetch_friendship_done'
export const PROFILE_FETCH_FRIEND_DONE = 'profile_fetch_friend_done'
export const PROFILE_FETCH_FRIEND_COUNT_DONE = 'profile_fetch_friend_count_done'
// Constants for profile fetching goals and posts
export const PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE =
    'profile_fetch_mutual_friend_count_done'
export const PROFILE_FETCH_TAB = 'profile_fetch_tab'
export const PROFILE_FETCH_TAB_DONE = 'profile_fetch_tab_done'
export const PROFILE_FETCH_TAB_FAIL = 'profile_fetch_tab_fail'
export const PROFILE_REFRESH_TAB_FAIL = 'profile_refresh_tab_fail'
export const PROFILE_REFRESH_TAB_DONE = 'profile_refresh_tab_done'
export const PROFILE_REFRESH_TAB = 'profile_refresh_tab'
// Constants for updating filter bar
export const PROFILE_UPDATE_FILTER = 'profile_update_filter'
export const PROFILE_RESET_FILTER = 'profile_reset_filter'

// Constants related to goals, posts and needs in user page
export const PROFILE_GOAL_DELETE_SUCCESS = 'profile_goal_delete_success'
export const PROFILE_POST_DELETE_SUCCESS = 'profile_post_delete_success'

export const PROFILE_OPEN_CREATE_OVERLAY = 'profile_open_create_overlay'
export const PROFILE_CLOSE_CREATE_OVERLAY = 'profile_close_create_overlay'

// Constants related to badge info
export const PROFILE_BADGE_EARN_MODAL_SHOWN = 'profile_badge_earn_modal_shown'
export const PROFILE_BADGE_EARN_MODAL_SHOWN_ERROR =
    'profile_badge_earn_modal_shown_error'

export const PROFILE_GOAL_FILTER_CONST = {
    sortBy: ['created', 'updated', 'shared', 'priority'],
    orderBy: {
        ascending: 'asc',
        descending: 'desc',
    },
    caterogy: [
        'General',
        'Physical',
        'Learning/Education',
        'Career/Business',
        'Financial',
        'Spiritual',
        'Family/Personal',
        'Charity/Philanthropy',
        'Travel',
        'Things',
    ],
}

export const INITIAL_FILTER_STATE = {
    sortBy: 'created',
    orderBy: 'descending',
    categories: 'All',
    completedOnly: 'false',
    priorities: '',
}

const INITIAL_STATE = {
    userId: '',
    // User model for profile

    user: {
        profile: {
            image: undefined,
            badges: {
                milestoneBadge: {
                    currentMilestone: '',
                },
            },
        },
        email: {},
    },
    // Profile page plus icon for goal / post creation
    showPlus: true,

    // Me Page mutual friends count
    mutualFriends: {
        loading: false,
        count: 0,
        data: [],
        skip: 0,
        limit: 20,
        hasNextPage: undefined,
    },
    // Overall loading status
    loading: false,
    /**
     * Friendship between current user and current profile fetched
     * Ignore if it's self
     */
    friendship: {
        _id: undefined,
        initiator_id: undefined,
        status: undefined, // one of [undefined, 'Invited', 'Accepted']
    },

    uploading: false,
    // navigation state
    selectedTab: 'suggested',
    navigationState: {
        index: 0,
        routes: [
            { key: 'about', title: 'About' },
            { key: 'goals', title: 'Goals' },
            { key: 'posts', title: 'Posts' },
            { key: 'needs', title: 'Needs' },
        ],
    },
    // Individual tab state
    goals: {
        filter: {
            sortBy: 'created',
            orderBy: 'descending',
            categories: 'All',
            completedOnly: 'false',
            priorities: '',
        },
        limit: 10,
        skip: 0,
        hasNextPage: undefined,
        data: [],
        loading: false,
        refreshing: false,
    },
    needs: {
        filter: {
            sortBy: 'created',
            orderBy: 'descending',
            categories: 'All',
            completedOnly: 'false',
            priorities: '',
        },
        limit: 10,
        skip: 0,
        hasNextPage: undefined,
        data: [],
        loading: false,
        refreshing: false,
    },
    posts: {
        filter: {
            sortBy: 'created',
            orderBy: 'descending',
            categories: 'All',
            completedOnly: 'false',
            priorities: '',
        },
        limit: 10,
        skip: 0,
        hasNextPage: undefined,
        data: [],
        loading: false,
        refreshing: false,
    },
    lateGoal: {
        show: false,
        goal: {},
    },
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PROFILE_OPEN_PROFILE: {
            const { userId, pageId } = action.payload
            let newState
            if (userId === state.userId || userId === state.user._id) {
                newState = _.cloneDeep(state)
            } else {
                newState = _.cloneDeep(INITIAL_STATE)
            }
            newState = _.set(newState, 'userId', action.payload)
            newState = _.set(newState, 'loading', true)

            return newState
        }

        case PROFILE_FETCHING_FAIL:
            return { ...state, loading: false }

        case PROFILE_FETCHING_SUCCESS: {
            console.log('27 goal update reducer profile')
            let newState = _.cloneDeep(state)
            const { user } = action.payload
            newState = _.set(newState, 'loading', false)
            return _.set(newState, 'user', user)
        }
        case GOAL_UPDATE_27: {
            console.log('27 goal update reducer')
            let newState = _.cloneDeep(state)
            // const { goal } = action.payload
            return _.set(newState, 'lateGoal', {
                show: true,
                goal: action.payload,
            })
        }

        case PROFILE_IMAGE_UPLOAD_SUCCESS: {
            let user = _.cloneDeep(state.user)
            user.profile.tmpImage = action.payload.data
            return { ...state, user }
        }

        case PROFILE_SUBMIT_UPDATE: {
            return { ...state, uploading: true }
        }

        case PROFILE_UPDATE_SUCCESS: {
            const { user } = action.payload
            return { ...state, user, uploading: false }
        }

        // Update navigation state when new tab is selected
        case PROFILE_SWITCH_TAB: {
            const newNavigationState = { ...state.navigationState }
            const { index } = action.payload
            newNavigationState.index = index

            return {
                ...state,
                selectedTab: newNavigationState.routes[index].key,
                navigationState: newNavigationState,
            }
        }

        case PROFILE_FETCH_MUTUAL_FRIEND: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'mutualFriends.loading', true)
        }

        // profile fetch mutual friend request done
        case PROFILE_FETCH_MUTUAL_FRIEND_DONE: {
            const { skip, hasNextPage, data, refresh } = action.payload
            const newState = _.cloneDeep(state)
            let newMutualFriends = _.get(newState, 'mutualFriends')
            if (refresh) {
                newMutualFriends = _.set(newMutualFriends, 'data', data)
            } else {
                const oldData = _.get(newMutualFriends, 'data')
                const newData = arrayUnique(oldData.concat(data))
                newMutualFriends = _.set(newMutualFriends, 'data', newData)
            }
            newMutualFriends = _.set(
                newMutualFriends,
                'hasNextPage',
                hasNextPage
            )
            newMutualFriends = _.set(newMutualFriends, 'skip', skip)
            newMutualFriends = _.set(newMutualFriends, 'loading', false)
            return _.set(newState, 'mutualFriends', newMutualFriends)
        }

        case PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE: {
            const newState = _.cloneDeep(state)
            const { userId, data } = action.payload
            let newMutualFriends = _.get(newState, 'mutualFriends')

            const currentUser = _.get(newState, 'user')
            if (!currentUser || currentUser._id !== userId) return newState

            newMutualFriends = _.set(newMutualFriends, 'count', data)
            return _.set(newState, 'mutualFriends', newMutualFriends)
        }

        // profile fetch friendship request done
        case PROFILE_FETCH_FRIENDSHIP_DONE: {
            let newFriendship = _.cloneDeep(state.friendship)
            const { data } = action.payload
            if (data !== undefined && data !== null) {
                newFriendship = data
            }
            return { ...state, friendship: newFriendship }
        }

        /**
    payload: {
      type: ['acceptFriend', 'deleteFriend', 'requestFriend']
      tab: ['requests.outgoing', 'requests.incoming', 'friends', 'suggested']
      data: if 'deleteFriend' or 'acceptFriend', then friendshipId. Otherwise, userId
    }
    */
        case MEET_UPDATE_FRIENDSHIP_DONE: {
            // If updating current profile's friendship, then update the status
            const { type, data, message } = action.payload
            const { userId, friendshipId } = data
            const resData = data.data
            let newFriendship = _.cloneDeep(state.friendship)
            if (!message) {
                // If no message, upate succeed
                if (type === 'requestFriend' && userId === state.userId) {
                    if (resData) {
                        newFriendship = _.cloneDeep(resData)
                    } else {
                        newFriendship.status = 'Invited'
                    }
                } else if (
                    type === 'deleteFriend' &&
                    friendshipId === state.friendship._id
                ) {
                    newFriendship.status = undefined
                } else if (
                    type === 'acceptFriend' &&
                    friendshipId === state.friendship._id
                ) {
                    newFriendship.status = 'Accepted'
                }
            }

            return { ...state, friendship: newFriendship }
        }

        case PROFILE_FETCH_TAB: {
            const { type } = action.payload
            const newState = _.cloneDeep(state)
            return _.set(newState, `${type}.loading`, true)
        }

        /**
         * Cases when loading/refreshing profile tabs
         * TODO: refactor the following three cases to abstract logic
         * Right now,
         * 1. MeetReducers
         * 2. Profile
         * 3. Home tabs
         * Share the same patterns
         */
        case PROFILE_FETCH_TAB_DONE: {
            const { skip, data, hasNextPage, type } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${type}.loading`, false)

            if (skip !== undefined) {
                newState = _.set(newState, `${type}.skip`, skip)
            }
            newState = _.set(newState, `${type}.hasNextPage`, hasNextPage)
            const oldData = _.get(newState, `${type}.data`)
            let newData = arrayUnique(oldData.concat(data))
            if (type === 'needs') {
                newData = newData.filter(
                    (item) => item.needs && item.needs.length !== 0
                )
            }
            return _.set(newState, `${type}.data`, newData)
        }

        case PROFILE_FETCH_TAB_FAIL: {
            const { type } = action.payload
            const newState = _.cloneDeep(state)
            return _.set(newState, `${type}.loading`, false)
        }

        case PROFILE_REFRESH_TAB_DONE: {
            const { skip, data, hasNextPage, type, userId } = action.payload
            let newState = _.cloneDeep(state)
            const currentUser = _.get(newState, 'user')

            // This state update is no longer valid
            if (currentUser._id !== userId) return newState

            newState = _.set(newState, `${type}.refreshing`, false)

            if (skip !== undefined) {
                newState = _.set(newState, `${type}.skip`, skip)
            }
            newState = _.set(newState, `${type}.hasNextPage`, hasNextPage)
            let newData = data
            if (type === 'needs') {
                newData = data.filter(
                    (item) => item.needs && item.needs.length !== 0
                )
            }
            return _.set(newState, `${type}.data`, newData)
        }

        case PROFILE_REFRESH_TAB: {
            const { type } = action.payload
            let newState = _.cloneDeep(state)
            return _.set(newState, `${type}.refreshing`, true)
        }

        case PROFILE_REFRESH_TAB_FAIL: {
            const { type } = action.payload
            const newState = _.cloneDeep(state)
            return _.set(newState, `${type}.refreshing`, false)
        }

        // Update one of filter within tab
        case PROFILE_UPDATE_FILTER: {
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

        // Clean up actions
        case USER_LOG_OUT: {
            return { ...INITIAL_STATE }
        }

        // Find and update the goal that current user marks as complete
        case GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS: {
            const { goalId, complete } = action.payload
            const newState = _.cloneDeep(state)
            const oldGoals = newState.goals.data
            return _.set(
                newState,
                'goals.data',
                findAndUpdate(goalId, oldGoals, { isCompleted: complete })
            )
        }

        // Find and upate the goal that current user shared to mastermind
        case GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS: {
            const { goalId } = action.payload
            const newState = _.cloneDeep(state)
            const oldGoals = newState.goals.data
            return _.set(
                newState,
                'goals.data',
                findAndUpdate(goalId, oldGoals, { shareToGoalFeed: true })
            )
        }

        // When a goal or a post is deleted by user
        case PROFILE_GOAL_DELETE_SUCCESS: {
            const newState = _.cloneDeep(state)
            const oldData = newState.goals.data
            const { goalId } = action.payload
            return _.set(newState, 'goals.data', removeItem(goalId, oldData))
        }

        case PROFILE_POST_DELETE_SUCCESS: {
            const newState = _.cloneDeep(state)
            const oldData = newState.posts.data
            const { postId } = action.payload
            return _.set(newState, 'posts.data', removeItem(postId, oldData))
        }

        // Update the status of a step within a goal
        case GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS: {
            const { goalId, id, isCompleted } = action.payload
            let newState = _.cloneDeep(state)
            const oldGoalData = newState.goals.data
            const newGoalData = updateNeedsOrSteps(
                goalId,
                id,
                { isCompleted },
                oldGoalData,
                'steps'
            )

            newState = _.set(newState, 'goals.data', newGoalData)

            const oldNeedData = newState.needs.data
            const newNeedData = updateNeedsOrSteps(
                goalId,
                id,
                { isCompleted },
                oldNeedData,
                'steps'
            )

            return _.set(newState, 'needs.data', newNeedData)
        }

        // Update the status of a need within a goal
        case GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS: {
            const { goalId, id, isCompleted } = action.payload
            let newState = _.cloneDeep(state)
            const oldGoalData = newState.goals.data
            const newGoalData = updateNeedsOrSteps(
                goalId,
                id,
                { isCompleted },
                oldGoalData,
                'needs'
            )

            newState = _.set(newState, 'goals.data', newGoalData)

            const oldNeedData = newState.needs.data
            const newNeedData = updateNeedsOrSteps(
                goalId,
                id,
                { isCompleted },
                oldNeedData,
                'needs'
            )

            return _.set(newState, 'needs.data', newNeedData)
        }

        // Reset filter to default state
        case PROFILE_RESET_FILTER: {
            const { tab } = action.payload
            const newState = _.cloneDeep(state)
            return _.set(newState, `${tab}.filter`, { ...INITIAL_FILTER_STATE })
        }

        // User updates a goal
        case GOAL_CREATE_EDIT_SUCCESS: {
            // Here tab is for main navigation tab not for profile sub component tab
            const { goal, tab } = action.payload
            const newState = _.cloneDeep(state)

            const currentGoals = _.get(newState, 'goals.data')
            const newGoals = currentGoals.map((oldGoal) => {
                if (oldGoal._id === goal._id) {
                    const newGoalToReturn = {
                        ...goal,
                        owner: { ...oldGoal.owner },
                    }

                    return newGoalToReturn
                }
                return oldGoal
            })
            return _.set(newState, 'goals.data', newGoals)
        }

        case PROFILE_OPEN_CREATE_OVERLAY: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'showPlus', false)
        }

        case PROFILE_CLOSE_CREATE_OVERLAY: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'showPlus', true)
        }

        default:
            return { ...state }
    }
}

function removeItem(id, data) {
    return data.filter((item) => item._id !== id)
}

// Find the object with id and update the object with the newValsMap
function findAndUpdate(id, data, newValsMap) {
    return data.map((item) => {
        let newItem = _.cloneDeep(item)
        if (item._id === id) {
            Object.keys(newValsMap).forEach((key) => {
                if (newValsMap[key] !== null) {
                    newItem = _.set(newItem, `${key}`, newValsMap[key])
                }
            })
        }
        return newItem
    })
}

// Find the corresponding goal to update needs and steps
function updateNeedsOrSteps(goalId, id, fields, data, type) {
    return data.map((item) => {
        let newItem = _.cloneDeep(item)
        if (item._id === goalId) {
            const oldList = _.get(newItem, `${type}`)
            newItem = _.set(
                newItem,
                `${type}`,
                findAndUpdate(id, oldList, { ...fields })
            )
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

export function updatePriorities(priorities, newPriority) {
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
