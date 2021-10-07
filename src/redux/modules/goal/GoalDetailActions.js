/** @format */

import React from 'react'
import { Actions } from 'react-native-router-flux'
import _, { get } from 'lodash'
import { Alert, Keyboard } from 'react-native'
import * as Notifications from 'expo-notifications'
import moment from 'moment'

import { api as API } from '../../middleware/api'
import { queryBuilder } from '../../middleware/utils'

import { DropDownHolder } from '../../../Main/Common/Modal/DropDownModal'

import {
    GOAL_DETAIL_UPDATE,
    GOAL_DETAIL_UPDATE_DONE,
    GOAL_DETAIL_FETCH,
    GOAL_DETAIL_FETCH_DONE,
    GOAL_DETAIL_FETCH_ERROR,
    GOAL_DETAIL_CLOSE,
    GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
    GOAL_DETAIL_UPDATE_STEP_NEED_SUCCESS,
    GOAL_DETAIL_SWITCH_TAB,
    GOAL_DETAIL_SWITCH_TAB_V2,
} from '../../../reducers/GoalDetailReducers'

import { GOAL_CREATE_EDIT_SUCCESS } from './CreateGoal'

import { getGoalDetailByTab } from './selector'

import { refreshComments } from '../feed/comment/CommentActions'
import { Logger } from '../../middleware/utils/Logger'
import { SentryRequestBuilder } from '../../../monitoring/sentry'
import {
    SENTRY_MESSAGE_TYPE,
    SENTRY_MESSAGE_LEVEL,
    SENTRY_TAGS,
    SENTRY_TAG_VALUE,
} from '../../../monitoring/sentry/Constants'
import { trackWithProperties } from 'expo-analytics-segment'
import { EVENT } from '../../../monitoring/segment'

const DEBUG_KEY = '[ Action GoalDetail ]'

// Basic request routes
const BASE_ROUTE = 'secure/feed'
const LIKE_BASE_ROUTE = `${BASE_ROUTE}/like`
const COMMENT_BASE_ROUTE = `${BASE_ROUTE}/comment`
const GOAL_BASE_ROUTE = 'secure/goal'

/**
 * Send request to server endpoint /secure/goal/views
 * @param {string} goalId
 */
export const markUserViewGoal = (goalId) => (dispatch, getState) => {
    const { token } = getState().user
    const onSuccess = (res) => {
        Logger.log(
            `${DEBUG_KEY}: [markUserViewGoal]: success with res: `,
            res,
            2
        )
    }

    const onError = (err) => {
        Logger.log(
            `${DEBUG_KEY}: [markUserViewGoal]: failed with err: `,
            err,
            1
        )
    }

    API.put('secure/goal/views', { goalId }, token)
        .then((res) => {
            if (res.status === 200) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => onError(err))
}

/**
 *
 * @param {string} type: ['Tomorrow', 'Next Week', 'Next Month', 'Custom']
 */
export const scheduleNotification = (date, goal, hasAskedPermissions) => async (
    dispatch,
    getState
) => {
    if (!hasAskedPermissions) {
        const { status } = await Notifications.requestPermissionsAsync()
        if (status !== 'granted') {
            return Alert.alert(
                'Denied',
                'Enable Push Notifications for GoalMogul in your phone’s settings to get reminders'
            )
        }
    }

    const { title, _id } = goal

    const localNotification = {
        title: 'Goal Reminder',
        body: `Tap here to update the progress on your goal: "${title}"`,
        data: {
            path: `/goal/${_id}`,
        },
    }

    const schedulingOptions = {
        time: date,
    }

    console.log(`${DEBUG_KEY}: [ scheduleNotification ]: date: `, date)
    console.log(`${DEBUG_KEY}: [ scheduleNotification ]: goal: `, goal.title)
    const notificationId = await Notifications.scheduleNotificationAsync(
        localNotification,
        schedulingOptions
    ).then((notificationId) => {
        DropDownHolder.alert(
            'success',
            'Reminder set',
            `We’ll remind you about this goal ${moment(date).fromNow()}`
        )
    })
}

/**
 * Refresh goal detail and comments by goal Id
 */
export const refreshGoalDetailById = (
    goalId,
    pageId,
    onErrorCallback,
    shouldSkipRefreshComments,
    { disableNotFoundAlert } = { disableNotFoundAlert: false }
) => (dispatch, getState) => {
    const { tab } = getState().navigation
    const { token } = getState().user

    dispatch({
        type: GOAL_DETAIL_FETCH,
        payload: {
            goalId,
            tab,
            pageId,
        },
    })

    const onError = (err) => {
        console.warn(`${DEBUG_KEY}: refresh goal error: `, err)
        if (err.status === 400 || err.status === 404) {
            if (onErrorCallback) {
                onErrorCallback()
            }
            Keyboard.dismiss()
            if (!disableNotFoundAlert) {
                Alert.alert('Content not found', 'This goal has been removed', [
                    {
                        text: 'Cancel',
                        onPress: () => Actions.pop(),
                    },
                ])
            }
        }
        dispatch({
            type: GOAL_DETAIL_FETCH_ERROR,
            payload: {
                goal: undefined,
                goalId,
                pageId,
                tab,
                error: err,
            },
        })
    }

    const onSuccess = (res) => {
        console.log(`${DEBUG_KEY}: refresh goal done with res`)
        dispatch({
            type: GOAL_DETAIL_FETCH_DONE,
            payload: {
                goal: res.data,
                goalId,
                tab,
                pageId,
            },
        })
    }

    API.get(`${GOAL_BASE_ROUTE}?goalId=${goalId}`, token)
        .then((res) => {
            if (res.status === 200) {
                return onSuccess(res)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })

    if (shouldSkipRefreshComments) return
    refreshComments('Goal', goalId, tab, pageId)(dispatch, getState)
}

export const goalDetailSwitchTabV2ByKey = (
    key,
    focusRef,
    focusType,
    goalId,
    pageId
) => (dispatch, getState) => {
    const { tab } = getState().navigation
    dispatch({
        type: GOAL_DETAIL_SWITCH_TAB_V2,
        payload: {
            tab,
            key,
            focusRef,
            focusType,
            goalId,
            pageId,
        },
    })
}

export const goalDetailSwitchTabV2 = (
    index,
    focusRef,
    focusType,
    goalId,
    pageId
) => (dispatch, getState) => {
    const { tab } = getState().navigation
    dispatch({
        type: GOAL_DETAIL_SWITCH_TAB_V2,
        payload: {
            tab,
            index,
            focusRef,
            focusType,
            goalId,
            pageId,
        },
    })
}

// This is used in GoalDetailCardV2 which is currently deprecated so no need to update for now
export const goalDetailSwitchTab = (index, goalId, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    dispatch({
        type: GOAL_DETAIL_SWITCH_TAB,
        payload: {
            tab,
            index,
            goalId,
            pageId,
        },
    })
}

export const closeGoalDetail = (goalId, pageId) => (dispatch, getState) => {
    // Return to previous page
    Actions.pop()
    // Clear the state
    closeGoalDetailWithoutPoping(goalId, pageId)(dispatch, getState)
}

export const closeGoalDetailWithoutPoping = (goalId, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    // Clear the state
    dispatch({
        type: GOAL_DETAIL_CLOSE,
        payload: {
            tab,
            goalId,
            pageId,
        },
    })
}

const move = (indexFrom, indexTo, itemArr) => {
    if (indexFrom === indexTo) return
    const itemFrom = itemArr.splice(indexFrom, 1)[0]
    itemArr.splice(indexTo, 0, itemFrom)
    itemArr.forEach((item, index) => {
        item.order = index + 1
        return item
    })
}

/**
 * If a step is already mark as completed, then it will change its state to incomplete
 * @param goal: if it's in the need card, then goal is passed in. Otherwise, goal is
 *              undefined
 */
export const updateGoalItemsOrder = (
    type,
    indexFrom,
    indexTo,
    goal,
    pageId
) => (dispatch, getState) => {
    if (indexFrom === indexTo) return

    const { token } = getState().user
    const goalToUpdate = _.cloneDeep(goal)
    const { _id } = goalToUpdate

    const { tab } = getState().navigation

    if (type === 'steps') move(indexFrom, indexTo, goalToUpdate.steps)
    else if (type === 'needs') move(indexFrom, indexTo, goalToUpdate.needs)
    else return

    const onSuccess = (res) => {
        console.log(`${DEBUG_KEY}: mark step complete succeed with res: `, res)

        dispatch({
            type: GOAL_DETAIL_UPDATE_DONE,
            payload: {
                tab,
                goalId: _id,
                pageId,
            },
        })
    }
    const onError = (err) => {
        // This will undo the dragged cards to previous position
        dispatch({
            type: GOAL_CREATE_EDIT_SUCCESS,
            payload: {
                tab,
                goal,
            },
        })
        dispatch({
            type: GOAL_DETAIL_UPDATE_DONE,
            payload: {
                tab,
                goalId: _id,
                pageId,
            },
        })

        Alert.alert('Operation failed', 'Please try again later.')
        console.warn(`${DEBUG_KEY}: update goal failed with error: `, err)
    }

    // This will keep the dragged cards where user intend them to be
    dispatch({
        type: GOAL_CREATE_EDIT_SUCCESS,
        payload: {
            tab,
            goal: goalToUpdate,
        },
    })
    dispatch({
        type: GOAL_DETAIL_UPDATE,
        payload: {
            tab,
            goalId: _id,
            pageId,
        },
    })

    const fields =
        type === 'steps'
            ? { steps: goalToUpdate.steps }
            : { needs: goalToUpdate.needs }
    updateGoalWithFields(_id, fields, token, onSuccess, onError)
}

/**
 * If a step is already mark as completed, then it will change its state to incomplete
 * @param goal: if it's in the need card, then goal is passed in. Otherwise, goal is
 *              undefined
 */
export const updateGoal = (itemId, type, updates, goal, pageId) => (
    dispatch,
    getState
) => {
    console.log('function called======itemid=======>', itemId)
    console.log('function called======updates=======>', updates)
    if (type !== 'step' && type !== 'need') return
    let { isCompleted, description } = updates

    // console.log('ISCOMPLETEDDD', updates)

    const { token } = getState().user
    const goalToUpdate = goal || getGoalDetailByTab(getState()).goal

    // const { goal } = getState().goalDetail;
    const { tab } = getState().navigation
    const { _id } = goalToUpdate
    const items = type === 'step' ? goalToUpdate.steps : goalToUpdate.needs

    const itemsToUpdate = items.map((item) => {
        if (item._id === itemId) {
            const newItem = _.cloneDeep(item)
            isCompleted = newItem.isCompleted =
                typeof isCompleted === 'boolean'
                    ? isCompleted
                    : !!newItem.isCompleted
            description = newItem.description = description
                ? description
                : newItem.description
            return newItem
        }
        return item
    })
    if (!itemId) {
        const newItem = {
            description: description,
            isCompleted: false,
            created: new Date(),
            order: itemsToUpdate.length + 1,
        }
        itemsToUpdate.push(newItem)
    }

    const onSuccess = (res) => {
        console.log(`${DEBUG_KEY}: mark step complete succeed with res: `, res)

        const payload = {
            id: itemId,
            updates: {
                isCompleted,
                description,
            },
            type: type + 's',
            pageId,
            goalId: _id,
            isNew: false,
        }

        if (!itemId) {
            const updatedItems =
                type === 'step'
                    ? _.get(res, 'steps', [])
                    : _.get(res, 'needs', [])
            payload.updates = updatedItems.find(
                (value) => _.get(value, 'order', 1) === updatedItems.length
            )
            payload.id = _.get(payload.updates, '_id', itemId)
            payload.isNew = true
        }

        if (type === 'step') {
            trackWithProperties(EVENT.GOAL_STEP_ADDED, { steps: itemsToUpdate })
        } else {
            trackWithProperties(EVENT.GOAL_NEED_ADDED, { needs: itemsToUpdate })
        }

        dispatch({
            type: GOAL_DETAIL_UPDATE_STEP_NEED_SUCCESS,
            payload,
        })

        dispatch({
            type: GOAL_DETAIL_UPDATE_DONE,
            payload: {
                tab,
                pageId,
                goalId: _id,
            },
        })
    }
    const onError = (err) => {
        dispatch({
            type: GOAL_DETAIL_UPDATE_DONE,
            payload: {
                tab,
                pageId,
                goalId: _id,
            },
        })

        Alert.alert('Update step status failed', 'Please try again later.')
        console.warn(
            `${DEBUG_KEY}: update step status failed with error: `,
            err
        )
    }

    dispatch({
        type: GOAL_DETAIL_UPDATE,
        payload: {
            tab,
            pageId,
            goalId: _id,
        },
    })

    updateGoalWithFields(
        _id,
        type === 'step' ? { steps: itemsToUpdate } : { needs: itemsToUpdate },
        token,
        onSuccess,
        onError
    )
}

// User marks a goal as completed
export const markGoalAsComplete = (goalId, complete, pageId) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    const { tab } = getState().navigation

    const onSuccess = (data) => {
        dispatch({
            type: GOAL_DETAIL_UPDATE_DONE,
            payload: {
                complete,
                tab,
                goalId,
                type: 'markGoalAsComplete',
                pageId,
            },
        })

        dispatch({
            type: GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
            payload: {
                goalId,
                tab,
                complete,
                pageId,
                data,
            },
        })

        trackWithProperties(
            complete ? EVENT.GOAL_MARKED_DONE : EVENT.GOAL_MARKED_UNDONE,
            { GoalId: goalId }
        )

        // Alert.alert(
        //   'Success',
        //   `You have successfully marked this goal as ${complete ? 'complete' : 'incomplete'}.`
        // );
        console.log(
            `${DEBUG_KEY}: mark goal as ` +
                `${complete ? 'complete' : 'incomplete'} ` +
                `succeed with data: `,
            data
        )
    }

    const onError = (err) => {
        dispatch({
            type: GOAL_DETAIL_UPDATE_DONE,
            payload: {
                complete,
                tab,
                goalId,
                type: 'markGoalAsComplete',
                pageId,
            },
        })

        Alert.alert(
            `Failed to mark goal as ${complete ? 'complete' : 'incomplete'}.`,
            'Please try again later.'
        )
        console.log(
            `${DEBUG_KEY}: mark goal as
      ${complete ? 'complete' : 'incomplete'}
      failed with err: `,
            err
        )
    }

    dispatch({
        type: GOAL_DETAIL_UPDATE,
        payload: {
            complete,
            tab,
            goalId,
            type: 'markGoalAsComplete',
            pageId,
        },
    })

    updateGoalWithFields(
        goalId,
        { isCompleted: complete },
        token,
        onSuccess,
        onError
    )
}

// Load states to CreateGoal modal to edit.
export const editGoal = (goal) => (dispatch) => {
    Actions.push('createGoalModal', { initializeFromState: true, goal })
}

/**
 *Send updates to server and on Success Update the state of the goal detail
 * And the goal in profile if found
 */
export const editGoalDone = () => (dispatch, getState) => {}

// Show a popup to confirm if user wants to share this goal to mastermind
export const shareGoalToMastermind = (goalId, pageId) => (
    dispatch,
    getState
) => {
    Alert.alert(
        'Are you sure you want to publish this to the top of the Home Feed?',
        '',
        [
            {
                text: 'Confirm',
                onPress: () =>
                    shareToMastermind(goalId, pageId, dispatch, getState),
            },
            {
                text: 'Cancel',
                onPress: () =>
                    console.log(
                        'User cancel publish to the top of the Home Feed'
                    ),
                style: 'cancel',
            },
        ]
    )
}

const shareToMastermind = (goalId, pageId, dispatch, getState) => {
    console.log('user pressed confirm ')
    const { token } = getState().user
    const { tab } = getState().navigation

    const onSuccess = (res) => {
        dispatch({
            type: GOAL_DETAIL_UPDATE_DONE,
            payload: {
                tab,
                goalId,
                type: 'shareToMastermind',
                pageId,
            },
        })

        dispatch({
            type: GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
            payload: {
                goalId,
                tab,
                pageId,
            },
        })
        // Alert.alert('Success', 'You have successfully shared this goal to mastermind.');
        console.log(`${DEBUG_KEY}: shareToMastermind succeed with res: `, res)
        DropDownHolder.alert(
            'success',
            'Successfully publish to the Home Feed',
            ''
        )
    }

    const onError = (err) => {
        dispatch({
            type: GOAL_DETAIL_UPDATE_DONE,
            payload: {
                tab,
                goalId,
                type: 'shareToMastermind',
                pageId,
            },
        })

        Alert.alert('Share to mastermind failed', 'Please try again later')
        console.warn(
            `${DEBUG_KEY}: share to mastermind failed with error: `,
            err
        )
    }

    dispatch({
        type: GOAL_DETAIL_UPDATE,
        payload: {
            tab,
            goalId,
            type: 'shareToMastermind',
            pageId,
        },
    })
    updateGoalWithFields(
        goalId,
        { shareToGoalFeed: true },
        token,
        onSuccess,
        onError
    )
}

/**
 * This is a API to send updates for a goal
 * @param fields: fields for the goal that needs updates
 * @param goalId: the goal that is updated
 * @param token: current user token
 * @param dispatch
 */
const updateGoalWithFields = (
    goalId,
    fields,
    token,
    onSuccessFunc,
    onErrorFunc
) => {
    const onError =
        onErrorFunc ||
        ((err) =>
            console.log(`${DEBUG_KEY}: updating fields with Error: `, err))
    const onSuccess =
        onSuccessFunc ||
        ((message) =>
            console.log(
                `${DEBUG_KEY}: updating fields succeed with message: `,
                message
            ))
    API.put(
        'secure/goal',
        { goalId, updates: JSON.stringify({ ...fields }) },
        token
    )
        .then((res) => {
            if (!res.message) {
                return onSuccess(res.data)
            }
            console.log(
                `${DEBUG_KEY}: updating fields ${fields} with with message: `,
                res
            )
            onError(res)
            new SentryRequestBuilder(res, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.INFO)
                .withTag(
                    SENTRY_TAGS.ACTION.GOAL_UPDATE,
                    SENTRY_TAG_VALUE.ACTIONS.FAILED
                )
                .withExtraContext(SENTRY_TAGS.ACTION.GOAL_UPDATE, {
                    fields,
                    token,
                })
                .send()
        })
        .catch((err) => {
            console.log(
                `${DEBUG_KEY}: updating fields ${fields} with err: `,
                err
            )
            onError(err)
            new SentryRequestBuilder(error, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.INFO)
                .withTag(
                    SENTRY_TAGS.ACTION.GOAL_UPDATE,
                    SENTRY_TAG_VALUE.ACTIONS.FAILED
                )
                .withExtraContext(SENTRY_TAGS.ACTION.GOAL_UPDATE, {
                    fields,
                    token,
                })
                .send()
        })
}
