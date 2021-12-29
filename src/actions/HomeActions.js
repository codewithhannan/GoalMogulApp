/** @format */

import { Actions } from 'react-native-router-flux'
import { Image } from 'react-native'

import {
    PROFILE_FETCHING_SUCCESS,
    PROFILE_FETCHING_FAIL,
    HOME_SWITCH_TAB,
    GOAL_UPDATE_27,
} from './types'
import TokenService from '../services/token/TokenService'
import { api as API } from '../redux/middleware/api'

const DEBUG_KEY = '[ HomeActions ]'

// Fetching profile
export const fetchProfile = (userId, callback) => {
    return async (dispatch, getState) => {
        const token = await TokenService.getAuthToken()
        const url = `https://goalmogul-api-dev.herokuapp.com/api/secure/user/profile?userId=${userId}`
        const headers = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        }
        fetch(url, headers)
            .then((res) => res.json())
            .then((res) => {
                /* If message, it means error */
                if (res.message) {
                    /* TODO: error handling */
                    console.log(
                        `${DEBUG_KEY}: error fetching user profile: `,
                        res
                    )
                    dispatch({
                        type: PROFILE_FETCHING_FAIL,
                        payload: {
                            res: res.message,
                            userId,
                            pageId: 'HOME',
                        },
                    })
                    return
                }
                dispatch({
                    type: PROFILE_FETCHING_SUCCESS,
                    payload: {
                        user: res.data,
                        userId,
                        pageId: 'HOME',
                    },
                })

                if (callback) {
                    callback()
                    return
                }
            })
            /* TODO: error handling */
            .catch((err) =>
                console.log(
                    `${DEBUG_KEY}: exception in loading user profile`,
                    err
                )
            )
    }
}
export const fetchGoalPopup27Day = () => {
    console.log('fetch 27 goal')
    return async (dispatch, getState) => {
        const token = await TokenService.getAuthToken()
        const url = `https://goalmogul-api-dev.herokuapp.com/api/secure/goal/stale-goal`
        const headers = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        }
        fetch(url, headers)
            .then((res) => res.json())
            .then((res) => {
                console.log(`fetch 27 goal result is disptaching:`, res)
                if (res.data) {
                    dispatch({
                        type: GOAL_UPDATE_27,
                        payload: res.data,
                    })
                }
            })
            /* TODO: error handling */
            .catch((err) =>
                console.log(
                    `${DEBUG_KEY}: exception in loading user profile`,
                    err
                )
            )
    }
}

// Tab switch between ActivityFeed and Mastermind
export const homeSwitchTab = (index) => {
    return (dispatch) => {
        dispatch({
            type: HOME_SWITCH_TAB,
            payload: index,
        })
    }
}
