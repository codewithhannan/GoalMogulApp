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
    SEEKHELP_FRIEND_SELECTED_ITEM,
    SEEKHELP_FRIEND_UNSELECTED_ITEM,
    SEEKHELP_FRIEND_CLEAR,
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
    // https://api.goalmogul.com/api/secure/tribe?filterForMembershipCategory=Member&filterForMembershipCategory=Admin
    return API.get(
        'secure/tribe?filterForMembershipCategory=Member&filterForMembershipCategory=Admin',
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

export const onFriendsItemSelect = (selectedItemFriend, pageId) => (
    dispatch,
    getState
) => {
    // console.log('suggestion item selected with item: ', selectedItemFriend)
    const { tab } = getState().navigation
    dispatch({
        type: SEEKHELP_FRIEND_SELECTED_ITEM,
        payload: {
            selectedItemFriend,
            tab,
            pageId,
        },
    })
}

export const onFriendsItemUnselect = (selectedItemFriend, pageId) => (
    dispatch,
    getState
) => {
    console.log('suggestion item unselected with item: ', selectedItemFriend)
    const { tab } = getState().navigation
    dispatch({
        type: SEEKHELP_FRIEND_UNSELECTED_ITEM,
        payload: {
            selectedItemFriend,
            tab,
            pageId,
        },
    })
}

export const clearFriendsArray = (pageId) => (dispatch, getState) => {
    // console.log('suggestion item unselected with item: ', selectedItemFriend)
    const { tab } = getState().navigation
    dispatch({
        type: SEEKHELP_FRIEND_CLEAR,
        payload: {
            tab,
            pageId,
        },
    })
}

export const postHelpFriends = (newPost) => async (dispatch, getState) => {
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
        return Alert.alert(`Help posted in Friend's Feed!`)
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: register notification failed with err: `,
            err
        )
    }

    const data = {
        owner: newPost.user._id,
        privacy: newPost.privacy,
        content: { text: newPost.helpText, tags: [] },
        postType: 'seekHelpFromFriend',
        goalRef: newPost.goal.goal._id,
    }
    if (newPost.hideFrom) {
        if (newPost.privacy === 'exclude-friends') {
            data['excludedFriends'] = newPost.hideFrom
        } else if (newPost.privacy === 'exclude-close-friends') {
            data['excludedCloseFriends'] = newPost.hideFrom
        } else {
            data['specificFriends'] = newPost.hideFrom
        }
    }
    return API.post(
        'secure/feed/post',
        {
            post: JSON.stringify(data),
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
