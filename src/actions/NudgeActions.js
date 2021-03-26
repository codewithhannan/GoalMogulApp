/** @format */

import { postRequest, getRequest } from '../store/services'
import { api as API } from '../redux/middleware/api'

import {
    getNudgesData,
    loadNudgesData,
    errorNudgesData,
} from '../reducers/NudgesReducer'

const DEBUG_KEY = '[ NudgeActions ]'

export const makeGoalsPublicNudge = (visitedId, token) => {
    return async (dispatch, getState) => {
        try {
            const res = await postRequest(
                'http://192.168.1.3:8081/api/secure/nudge/send-nudge',

                {
                    id: visitedId,
                    nudgeTypes: {
                        makeGoalsPublic: true,
                        createFirstGoal: false,
                    },
                },
                {
                    'x-access-token': token,
                }
            )
            const response = res.result
            console.log(
                `${DEBUG_KEY} This is the response of make goals public nudge`,
                response
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of make goals public nudge`,
                err
            )
        }
    }
}

export const createFirstGoalNudge = (visitedId, token) => {
    return async (dispatch, getState) => {
        try {
            const res = await postRequest(
                'http://192.168.1.3:8081/api/secure/user/profile/send-nudge',

                {
                    id: visitedId,
                    nudgeTypes: {
                        makeGoalsPublic: false,
                        createFirstGoal: true,
                    },
                },
                {
                    'x-access-token': token,
                }
            )

            const response = res.result
            console.log(
                `${DEBUG_KEY} This is the response of create first goal nudge`,
                response
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of create goals nudge`,
                err
            )
        }
    }
}

export const removeNudge = (userId, token) => {
    return async (dispatch, getState) => {
        try {
            const res = await postRequest(
                'http://192.168.1.3:8081/api/secure/user/profile/send-nudge',

                {
                    id: userId,
                    hasResponded: false,
                    isDeleted: true,
                },
                {
                    'x-access-token': token,
                }
            )

            const response = res.result

            console.log(
                `${DEBUG_KEY} This is the response of remove nudge`,
                response
            )
        } catch (err) {
            ;`${DEBUG_KEY} This is the error of removing nudge`, err
        }
    }
}

export const getAllNudges = (token) => {
    return async (dispatch, getState) => {
        try {
            let res
            dispatch(loadNudgesData(true))
            res = await API.get('secure/nudge/nudgesToRender', token)

            dispatch(getNudgesData(res.result))
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
