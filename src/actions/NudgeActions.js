/** @format */
import { api as API } from '../redux/middleware/api'

import {
    getNudgesData,
    loadNudgesData,
    errorNudgesData,
    deleteSelectedNudge,
} from '../reducers/NudgesReducer'
import { setBadgeNumberAsyncByPlatform } from '../redux/modules/notification/NotificationTabActions'
import { Alert } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { DropDownHolder } from '../Main/Common/Modal/DropDownModal'

const makeMessage = () => 'You have nudged successfully!'

const DEBUG_KEY = '[ NudgeActions ]'
export const NUDGE_TYPES = {
    makeGoalsPublic: 'makeGoalsPublic',
    createFirstGoal: 'createFirstGoal',
    clarifyGoals: 'clarifyGoals',
    inviteeGoalCheck: 'inviteeGoalCheck',
}

export const addNudge = (visitedId, token, nudgeType, question, goalId) => {
    return async () => {
        let obj = {
            id: visitedId,
            nudgeTypes: {
                makeGoalsPublic: false,
                createFirstGoal: false,
                clarifyGoals: false,
                inviteeGoalCheck: false,
            },
        }
        obj.nudgeTypes[nudgeType] = true
        if (obj.nudgeTypes.inviteeGoalCheck) {
            obj.question = question
        }
        if (obj.nudgeTypes.clarifyGoals) {
            obj.goalId = goalId
        }
        try {
            const res = await API.post('secure/nudge/send-nudge', obj, token)
            const response = res

            console.log(
                `${DEBUG_KEY} This is the response of addNudge`,
                response.result
            )
            if (res.status === 200) {
                setTimeout(() => {
                    DropDownHolder.alert(
                        'success',
                        'Request sent!',
                        makeMessage()
                    )
                }, 500)
            }
        } catch (err) {
            setTimeout(() => {
                DropDownHolder.alert(
                    'error',
                    'Error',
                    "We're sorry that some error happened. Please try again later."
                )
            }, 500)
            console.log(`${DEBUG_KEY} This is the error of addNudge`, err)
        }
    }
}

export const getAllNudges = (token) => {
    return async (dispatch) => {
        try {
            let res
            dispatch(loadNudgesData(true))
            res = await API.get('secure/nudge/nudgesToRender', token)

            dispatch(getNudgesData(res.result))
            // setBadgeNumberAsyncByPlatform(res.result.length)
            dispatch(loadNudgesData(false))
            console.log(`${DEBUG_KEY} This is the response of nudge data`, res)
        } catch (err) {
            console.log(
                errorNudgesData(
                    err
                )`${DEBUG_KEY} This is the error of getting nudge`,
                err.message
            )
        }
    }
}

export const deleteNudge = (nudgeId) => {
    return async (dispatch, getState) => {
        try {
            let res
            const { token, userId } = getState().user
            res = await API.delete('secure/nudge/handleActiontypesForNudge', {
                id: nudgeId,
                type: {
                    isDeleted: true,
                    hasResponded: false,
                },
                token,
            })
            dispatch(deleteSelectedNudge(nudgeId))
            console.log(
                `${DEBUG_KEY} This is the response of deleting nudge`,
                res
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of deleting nudge`,
                err.message
            )
        }
    }
}

export const handleNudgeResponsed = (nudgeId) => {
    return async () => {
        try {
            let res
            res = await API.delete('secure/nudge/handleActiontypesForNudge', {
                id: nudgeId,
                type: {
                    isDeleted: false,
                    hasResponded: true,
                },
            })

            console.log(
                `${DEBUG_KEY} This is the response of responding nudge`,
                res
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of responding nudge`,
                err.message
            )
        }
    }
}
