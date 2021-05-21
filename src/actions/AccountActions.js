/** @format */

import {
    REGISTRATION_ACCOUNT_FORM_CHANGE,
    ACCOUNT_UPDATE_PASSWORD_DONE,
    ACCOUNT_UPDATE_PASSWORD,
} from './types'

import { Actions } from 'react-native-router-flux'
import { SubmissionError } from 'redux-form'

import { updatePassword } from '../Utils/ProfileUtils'
import { auth as Auth } from '../redux/modules/auth/Auth'
import {
    loadAllData,
    getAllChats,
    getAllTribes,
    getAllUsers,
    errorGettingData,
    getLoadedUsers,
    getLoadedTribes,
    getLoadedChats,
} from '../reducers/ExistingAccounts'
import { api as API } from '../redux/middleware/api'

const DEBUG_KEY = '[ Action Account ]'
/* Registration Account Actions */
export const handleOnFormChange = (value, prop) => {
    return {
        type: REGISTRATION_ACCOUNT_FORM_CHANGE,
        payload: { value, prop },
    }
}

/* Profile Account Actions */
export const handleUpdatePassword = (values) => {
    return async (dispatch, getState) => {
        const { token } = getState().user
        const { oldPassword, newPassword, confirmPassword } = values

        if (newPassword !== confirmPassword) {
            throw new SubmissionError({
                _error: "New passwords does't match",
            })
        }
        dispatch({
            type: ACCOUNT_UPDATE_PASSWORD,
        })

        const result = await updatePassword({ oldPassword, newPassword, token })
            .then(async (res) => {
                console.log('response for updating password is: ', res)
                await Auth.updatePassword(newPassword)
                return res
            })
            .catch((err) => {
                console.log('errro in updating password', err)
                dispatch({
                    type: ACCOUNT_UPDATE_PASSWORD_DONE,
                })
                throw new SubmissionError({
                    _error: err,
                })
            })
        /*
      If result is not true, then update fails.
      Please look into custumeFetch in ProfileUtils.handleUpdatePassword
    */
        if (!result) {
            throw new SubmissionError({
                _error: 'Error updating password. Please try later.',
            })
        }
        dispatch({
            type: ACCOUNT_UPDATE_PASSWORD_DONE,
        })
        console.log(`${DEBUG_KEY}: result is: `, result)
        Actions.pop()
    }
}

export const getAllAccounts = () => {
    return async (dispatch, getState) => {
        const { token } = getState().user
        const { userSkip, tribeSkip, chatSkip, limit } = getState().account
        const { selectedTab } = getState().search

        if (selectedTab == 'people') {
            try {
                dispatch(loadAllData(true))

                const res = await API.get(
                    `secure/user/account/pre-populated-search?skip=${userSkip}&limit=${limit}`,
                    token
                )
                dispatch(getAllUsers(res.users))
                dispatch(getAllTribes(res.tribes))
                dispatch(getAllChats(res.chats))
                dispatch(loadAllData(false))

                console.log(
                    `${DEBUG_KEY} This is the response of getting all users`,
                    res
                )
            } catch (error) {
                console.log(
                    `${DEBUG_KEY} This is the error of getting all users`,
                    error.message
                )
            }
        } else if (selectedTab == 'tribes') {
            try {
                dispatch(loadAllData(true))

                const res = await API.get(
                    `secure/user/account/pre-populated-search?skip=${tribeSkip}&limit=${limit}`,
                    token
                )
                console.log(
                    `${DEBUG_KEY} This is the response of getting all tribes`,
                    res
                )
                dispatch(getAllTribes(res.tribes))

                dispatch(loadAllData(false))
            } catch (error) {
                console.log(
                    `${DEBUG_KEY} This is the error of getting all tribes`,
                    error.message
                )
            }
        } else if (selectedTab == 'chatRooms') {
            try {
                dispatch(loadAllData(true))

                const res = await API.get(
                    `secure/user/account/pre-populated-search?skip=${chatSkip}&limit=${limit}`,
                    token
                )
                console.log(
                    `${DEBUG_KEY} This is the response of getting all chats`,
                    res
                )
                dispatch(getAllChats(res.chats))
                dispatch(loadAllData(false))
            } catch (error) {
                console.log(
                    `${DEBUG_KEY} This is the error of getting all chats`,
                    error.message
                )
            }
        }
    }
}

export const loadMoreUsers = () => {
    return async (dispatch, getState) => {
        const { token } = getState().user
        const { userSkip, limit } = getState().account

        try {
            const res = await API.get(
                `secure/user/account/pre-populated-search?skip=${
                    userSkip + 10
                }&limit=${limit}`,
                token
            )

            dispatch(getLoadedUsers(res.users))

            const response = res
            console.log(
                `${DEBUG_KEY} This is the response of loading all users`,
                response
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of loading all users`,
                err
            )
        }
    }
}

export const loadMoreTribes = () => {
    return async (dispatch, getState) => {
        const { token } = getState().user
        const { tribeSkip, limit } = getState().account

        try {
            const res = await API.get(
                `secure/user/account/pre-populated-search?skip=${
                    tribeSkip + 10
                }&limit=${limit}`,
                token
            )

            dispatch(getLoadedTribes(res.tribes))

            const response = res
            console.log(
                `${DEBUG_KEY} This is the response of loading all tribes`,
                response
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of loading all tribes`,
                err
            )
        }
    }
}
export const loadMoreChats = () => {
    return async (dispatch, getState) => {
        const { token } = getState().user
        const { chatSkip, limit } = getState().account

        try {
            const res = await API.get(
                `secure/user/account/pre-populated-search?skip=${
                    chatSkip + 10
                }&limit=${limit}`,
                token
            )

            dispatch(getLoadedChats(res.chats))

            const response = res
            console.log(
                `${DEBUG_KEY} This is the response of loading all chats`,
                response
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of loading all chats`,
                err
            )
        }
    }
}
