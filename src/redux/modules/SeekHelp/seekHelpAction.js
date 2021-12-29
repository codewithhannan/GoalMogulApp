/** @format */

// Actions to create a new tribe
import { Actions } from 'react-native-router-flux'
import { Alert } from 'react-native'
import { api as API } from '../../middleware/api'
import ImageUtils from '../../../Utils/ImageUtils'

import {
    GET_HELP_FROM,
    CLEAR_SEEKHELP,
    SET_TRIBE_SEEK,
} from './seekHelpReducers'

const BASE_ROUTE = 'secure/tribe'
const DEBUG_KEY = '[ Action Create Tribe ]'

// Open creating tribe modal
export const setSelected = (data) => (dispatch) => {
    console.log(data)
    // Actions.push('createTribeStack')
    dispatch({
        type: GET_HELP_FROM,
        paylaod: data,
    })
}

export const clearSelected = (data) => (dispatch) => {
    // console.log(data)
    // Actions.push('createTribeStack')
    dispatch({
        type: CLEAR_SEEKHELP,
    })
}

export const getUserTribes = () => async (dispatch, getState) => {
    const { token, userId } = getState().user

    const onSuccess = async (res) => {
        // await SecureStore.setItemAsync(
        //     NOTIFICATION_TOKEN_KEY,
        //     notificationToken,
        //     {}
        // )
        // await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, notificationToken)
        // console.log('notificationToken', notificationToken)
        // ReactMoE.passFcmPushToken(notificationToken)
        dispatch({
            type: SET_TRIBE_SEEK,
            payload: res.data,
        })
        console.log(
            `${DEBUG_KEY}: register notification succeed success with res: tribe wali `,
            res
        )
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: register notification failed with err: `,
            err
        )
    }

    return API.get('secure/tribe', token)
        .then((res) => {
            // All 200 status imply success
            if (res.status >= 200 && res.status < 300) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

export const postHelpTribe = (newPost) => async (dispatch, getState) => {
    const { token, userId } = getState().user
    console.log('new post tribe', newPost)

    const onSuccess = async (res) => {
        // await SecureStore.setItemAsync(
        //     NOTIFICATION_TOKEN_KEY,
        //     notificationToken,
        //     {}
        // )
        // await AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, notificationToken)
        // console.log('notificationToken', notificationToken)
        // ReactMoE.passFcmPushToken(notificationToken)
        // dispatch({
        //     type: SET_TRIBE_SEEK,
        //     payload: res.data,
        // })
        console.log(
            `${DEBUG_KEY}: register notification succeed success with res: tribe wali `,
            res
        )
        return Alert.alert('Help posted in tribe!')
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: register notification failed with err: `,
            err
        )
    }
    return API.post(
        'secure/feed/post',
        {
            post: JSON.stringify({
                owner: newPost.user._id,
                privacy: 'public',
                content: { text: newPost.helpText, tags: [] },
                postType: 'seekHelpFromTribe',
                belongsToTribe: newPost.tribeDoc._id,
                goalRef: newPost.goal.goal._id,
            }),
        },
        token
    )
        .then((res) => {
            // All 200 status imply success
            if (res.status >= 200 && res.status < 300) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => {
            onError(err)
        })

    // return API.post('secure/tribe', token)
    //     .then((res) => {
    //         // All 200 status imply success
    //         if (res.status >= 200 && res.status < 300) {
    //             return onSuccess(res)
    //         }
    //         return onError(res)
    //     })
    //     .catch((err) => {
    //         onError(err)
    //     })
}

// export const cancelCreatingNewTribe = () => (dispatch) => {
//     Actions.pop()
//     dispatch({
//         type: TRIBE_NEW_CANCEL,
//     })
// }
