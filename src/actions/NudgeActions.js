/** @format */

import { postRequest, getRequest } from '../store/services'
import { api as API } from '../redux/middleware/api'

import {
    getNudgesData,
    loadNudgesData,
    errorNudgesData,
    deleteSelectedNudge,
} from '../reducers/NudgesReducer'
import { setBadgeNumberAsyncByPlatform } from '../redux/modules/notification/NotificationTabActions'

const DEBUG_KEY = '[ NudgeActions ]'
export const NUDGE_TYPES = {
    makeGoalsPublic: 'makeGoalsPublic',
    createFirstGoal: 'createFirstGoal',
    clarifyGoals: 'clarifyGoals',
}

export const addNudge = (visitedId, token, nudgeType) => {
    return async (dispatch, getState) => {
        let obj = {
            id: visitedId,
            nudgeTypes: {
                makeGoalsPublic: false,
                createFirstGoal: false,
                clarifyGoals: false,
            },
        }
        obj.nudgeTypes[nudgeType] = true
        try {
            const res = await API.post('secure/nudge/send-nudge', obj, token)
            const response = res.result
            console.log(
                `${DEBUG_KEY} This is the response of addNudge`,
                response
            )
        } catch (err) {
            console.log(`${DEBUG_KEY} This is the error of addNudge`, err)
        }
    }
}

// export const makeGoalsPublicNudge = (visitedId, token) => {
//     return async (dispatch, getState) => {
//         try {
//             const res = await API.post(
//                 'secure/nudge/send-nudge',

//                 {
//                     id: visitedId,
//                     nudgeTypes: {
//                         makeGoalsPublic: true,
//                         createFirstGoal: false,
//                     },
//                 },
//                 token
//             )
//             const response = res.result
//             console.log(
//                 `${DEBUG_KEY} This is the response of make goals public nudge`,
//                 response
//             )
//         } catch (err) {
//             console.log(
//                 `${DEBUG_KEY} This is the error of make goals public nudge`,
//                 err
//             )
//         }
//     }
// }

// export const createFirstGoalNudge = (visitedId, token) => {
//     return async (dispatch, getState) => {
//         try {
//             const res = await API.post(
//                 'secure/nudge/send-nudge',

//                 {
//                     id: visitedId,
//                     nudgeTypes: {
//                         makeGoalsPublic: false,
//                         createFirstGoal: true,
//                     },
//                 },
//                 token
//             )

//             const response = res.result
//             console.log(
//                 `${DEBUG_KEY} This is the response of create first goal nudge`,
//                 response
//             )
//         } catch (err) {
//             console.log(
//                 `${DEBUG_KEY} This is the error of create goals nudge`,
//                 err
//             )
//         }
//     }
// }

export const getAllNudges = (token) => {
    return async (dispatch, getState) => {
        try {
            let res
            dispatch(loadNudgesData(true))
            res = await API.get('secure/nudge/nudgesToRender', token)

            dispatch(getNudgesData(res.result))
            setBadgeNumberAsyncByPlatform(res.result.length)
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
    return async (dispatch, getState) => {
        try {
            let res

            const { token, userId } = getState().user
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
