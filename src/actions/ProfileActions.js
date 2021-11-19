/** @format */

import { Actions } from 'react-native-router-flux'
import React from 'react'
import { Image, Alert, View } from 'react-native'
import _ from 'lodash'

import ImageUtils from '../Utils/ImageUtils'
import {
    updateAccount,
    updateProfile,
    updatePassword,
} from '../Utils/ProfileUtils'
import { api as API } from '../redux/middleware/api'
import { queryBuilder, constructPageId } from '../redux/middleware/utils'

import {
    getUserData,
    getUserDataByPageId,
} from '../redux/modules/User/Selector'

import { Bronze3D, Silver3D, Gold3D, Green } from '../asset/banner'
import { trackWithProperties, EVENT as E, track } from '../monitoring/segment'

import {
    PROFILE_OPEN_PROFILE,
    PROFILE_FETCHING_FAIL,
    PROFILE_FETCHING_SUCCESS,
    PROFILE_SUBMIT_UPDATE,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_UPDATE_FAIL,
    PROFILE_IMAGE_UPLOAD_SUCCESS,
    PROFILE_SWITCH_TAB,
    PROFILE_CLOSE_PROFILE,
    PROFILE_OPEN_PROFILE_DETAIL,
    PROFILE_CLOSE_PROFILE_DETAIL,
    PROFILE_FETCHING,
} from './types'

import {
    PROFILE_FETCH_FRIEND_COUNT_DONE,
    PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE,
    PROFILE_FETCH_FRIENDSHIP_DONE,
    PROFILE_FETCH_MUTUAL_FRIEND,
    PROFILE_FETCH_MUTUAL_FRIEND_DONE,
    // Profile load tabs constants
    PROFILE_FETCH_TAB,
    PROFILE_FETCH_TAB_DONE,
    PROFILE_REFRESH_TAB_DONE,
    PROFILE_FETCH_TAB_FAIL,
    PROFILE_REFRESH_TAB_FAIL,
    PROFILE_REFRESH_TAB,
    PROFILE_UPDATE_FILTER,
    PROFILE_RESET_FILTER,
    PROFILE_GOAL_FILTER_CONST,
    PROFILE_GOAL_DELETE_SUCCESS,
    PROFILE_POST_DELETE_SUCCESS,
    // Profile Create overlay
    PROFILE_OPEN_CREATE_OVERLAY,
    PROFILE_CLOSE_CREATE_OVERLAY,
    PROFILE_BADGE_EARN_MODAL_SHOWN,
    PROFILE_BADGE_EARN_MODAL_SHOWN_ERROR,
} from '../reducers/Profile'

// Constants
import { IMAGE_BASE_URL } from '../Utils/Constants'
import { Logger } from '../redux/middleware/utils/Logger'
import { default_style } from '../styles/basic'
import { loadUserGoals } from '../redux/modules/goal/GoalActions'

const DEBUG_KEY = '[ Action Profile ]'

const prefetchImage = (imageUrl) => {
    if (imageUrl) {
        const fullImageUrl = `${IMAGE_BASE_URL}${imageUrl}`
        Image.prefetch(fullImageUrl)
    }
}

const fetchFriendshipSucceed = (userId, res, dispatch) => {
    console.log(`${DEBUG_KEY} fetchFriendshipSucceed with res: `, res)
    dispatch({
        type: PROFILE_FETCH_FRIENDSHIP_DONE,
        payload: {
            data: res.data,
            userId,
        },
    })
}

const fetchFriendsCountSucceed = (userId, res, self, dispatch) => {
    console.log(`${DEBUG_KEY} fetchMutualFriendSucceed with res: `, res)
    const type = self
        ? PROFILE_FETCH_FRIEND_COUNT_DONE
        : PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE
    dispatch({
        type,
        payload: {
            data: self ? res.count : res.data,
            userId,
        },
    })
}

const fetchProfileSucceed = (pageId, res, dispatch) => {
    console.log(
        `${DEBUG_KEY} fetch profile for pageId: ${pageId} succeed with res: `,
        res
    )
    dispatch({
        type: PROFILE_FETCHING_SUCCESS,
        payload: {
            user: res.data,
            pageId,
        },
    })
}

const fetchProfileFail = (pageId, userId, res, dispatch) => {
    console.log(`${DEBUG_KEY} fetch profile failed with res: `, res)
    if (res.status === 400 || res.status === 404) {
        Alert.alert('Content not found', 'This user does not exist', [
            {
                text: 'Cancel',
                onPress: () => Actions.pop(),
            },
        ])
    }

    if (res.status === 500) {
        Alert.alert('Error loading user profile', `${res.message}`, [
            {
                text: 'Cancel',
                onPress: () => Actions.pop(),
            },
        ])
    }

    dispatch({
        type: PROFILE_FETCHING_FAIL,
        payload: {
            res,
            pageId,
        },
    })
}

/**
 * This method only fetches user profile. It is primarily used after user updates
 * the profile. Need to update the profile page
 */
export const fetchUserProfile = (userId, pageId, shouldSkipFailureHandling) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    dispatch({
        type: PROFILE_FETCHING,
        payload: {
            userId,
            pageId,
        },
    })
    API.get(`secure/user/profile?userId=${userId}`, token)
        .then((res) => {
            if (res.status === 200) {
                fetchProfileSucceed(pageId, res, dispatch)
                // Prefetch profile image
                prefetchImage(res.data.profile.image)
                return
            }

            if (shouldSkipFailureHandling) return
            fetchProfileFail(pageId, userId, res, dispatch)
        })
        .catch((err) => {
            if (shouldSkipFailureHandling) return
            fetchProfileFail(pageId, userId, err, dispatch)
        })
}

export const closeProfile = (userId, pageId) => (dispatch, getState) => {
    // Obtain the list of goals and posts that are referenced by this profile page
    const user = _.get(getState().users, `${userId}`)
    let goalList = []
    let postList = []
    if (_.has(user, `${pageId}`)) {
        goalList = _.get(user, `${pageId}.goals.data`)
        postList = _.get(user, `${pageId}.posts.data`)
    }

    dispatch({
        type: PROFILE_CLOSE_PROFILE,
        payload: {
            userId,
            pageId,
            goalList,
            postList,
        },
    })
}

/**
 * Open user profile list by userId
 * @param {string} userId
 * @param {string} tab
 */
export const openProfile = (userId, tab, initialFilter, props) => (
    dispatch,
    getState
) => {
    const pageId = constructPageId('user')
    dispatch({
        type: PROFILE_OPEN_PROFILE,
        payload: {
            userId,
            pageId,
        },
    })
    // trackWithProperties(E.PROFILE_OPENED, { UserId: userId })
    // Refresh goals on open
    if (tab) {
        selectProfileTabByName(
            `${tab}`,
            userId,
            pageId,
            initialFilter
        )(dispatch, getState)
        resetFilterType(`${tab}`, userId, pageId)(dispatch, getState)
    }

    const mainNavigationTab = getState().navigation.tab
    let componentKeyToOpen = 'profile'
    if (mainNavigationTab !== 'homeTab' && mainNavigationTab !== undefined) {
        componentKeyToOpen = `${mainNavigationTab}_profile`
    }
    console.log(
        `${DEBUG_KEY}: componentKeyToOpen is: ${componentKeyToOpen}, initialFilter:`,
        initialFilter
    )
    Actions.push(`${componentKeyToOpen}`, {
        pageId,
        userId,
        hideProfileDetail: tab && tab !== 'about',
        initialFilter,
        ...props,
    })

    const { token } = getState().user
    const self = userId.toString() === getState().user.userId.toString()

    const profilePromise = self
        ? API.get(`secure/user/profile?userId=${userId}`, token)
        : API.get(
              `secure/user/profile?userId=${userId}&isProfileView=true`,
              token
          )

    // If self, fetch friend list. Otherwise, fetch mutual friends
    const friendsCountPromise = self
        ? API.get(`secure/user/friendship/count?userId=${userId}`, token)
        : API.get(
              `secure/user/friendship/mutual-friends/count?userId=${userId}`,
              token
          )

    // If self, fetch nothing. Otherwise, fetch friendship with userId
    const friendshipPromise = self
        ? new Promise((resolve, reject) => resolve({ data: [] }))
        : API.get(`secure/user/friendship/friendship?userId=${userId}`, token)

    Promise.all([profilePromise, friendsCountPromise, friendshipPromise])
        .then((res) => {
            const [profileRes, friendsCountRes, friendshipRes] = res
            if (profileRes.message || profileRes.status !== 200) {
                /* TODO: error handling */
                return fetchProfileFail(pageId, userId, profileRes, dispatch)
            }
            fetchProfileSucceed(pageId, profileRes, dispatch)
            handleCurrentTabRefresh({ userId, pageId })(dispatch, getState)
            // Prefetch profile image
            prefetchImage(profileRes.data.profile.image)

            if (friendsCountRes.message) {
                /* TODO: error handling for failing to fetch friends */
                console.log(
                    `${DEBUG_KEY} fetch friends count fails: `,
                    friendsCountRes.message
                )
            } else {
                fetchFriendsCountSucceed(
                    userId,
                    friendsCountRes,
                    self,
                    dispatch
                )
            }

            if (friendshipRes.message) {
                /* TODO: error handling for failing to fetch friends */
                console.log(
                    `${DEBUG_KEY} fetch friendship fails: `,
                    friendshipRes
                )
            } else {
                fetchFriendshipSucceed(userId, friendshipRes, dispatch)
            }
        })
        .catch((err) => {
            console.log(`${DEBUG_KEY}: err in loading user profile`, err)
            dispatch({
                type: PROFILE_FETCHING_FAIL,
                payload: `Error loading user profile: ${err}`,
            })
            // TODO: show toaster saying loading fail
        })
}

/**
 * Open user goal list by userId
 * @param {string} userId
 */
export const refreshProfileData = (userId) => (dispatch, getState) => {
    const pageId = constructPageId('user')
    if (!userId) {
        console.log('auth reducer now is: ', getState().auth)
    }
    dispatch({
        type: PROFILE_OPEN_PROFILE,
        payload: {
            userId,
            pageId,
        },
    })
    // trackWithProperties(E.PROFILE_REFRESHED, { UserId: userId })

    const { token } = getState().user
    const self = userId.toString() === getState().user.userId.toString()

    try {
        const profilePromise = self
            ? API.get(`secure/user/profile?userId=${userId}`, token)
            : API.get(
                  `secure/user/profile?userId=${userId}&isProfileView=true`,
                  token
              )

        // If self, fetch friend list. Otherwise, fetch mutual friends
        const friendsCountPromise = self
            ? API.get(`secure/user/friendship/count?userId=${userId}`, token)
            : API.get(
                  `secure/user/friendship/mutual-friends/count?userId=${userId}`,
                  token
              )

        // If self, fetch nothing. Otherwise, fetch friendship with userId
        const friendshipPromise = self
            ? new Promise((resolve, reject) => resolve({ data: [] }))
            : API.get(
                  `secure/user/friendship/friendship?userId=${userId}`,
                  token
              )

        Promise.all([profilePromise, friendsCountPromise, friendshipPromise])
            .then((res) => {
                const [profileRes, friendsCountRes, friendshipRes] = res
                if (profileRes.message || profileRes.status !== 200) {
                    /* TODO: error handling */
                    return fetchProfileFail(
                        pageId,
                        userId,
                        profileRes,
                        dispatch
                    )
                }
                fetchProfileSucceed(pageId, profileRes, dispatch)
                handleCurrentTabRefresh({ userId, pageId })(dispatch, getState)
                // Prefetch profile image
                prefetchImage(profileRes.data.profile.image)

                if (friendsCountRes.message) {
                    /* TODO: error handling for failing to fetch friends */
                    console.log(
                        `${DEBUG_KEY} fetch friends count fails: `,
                        friendsCountRes.message
                    )
                } else {
                    fetchFriendsCountSucceed(
                        userId,
                        friendsCountRes,
                        self,
                        dispatch
                    )
                }

                if (friendshipRes.message) {
                    /* TODO: error handling for failing to fetch friends */
                    console.log(
                        `${DEBUG_KEY} fetch friendship fails: `,
                        friendshipRes
                    )
                } else {
                    fetchFriendshipSucceed(userId, friendshipRes, dispatch)
                }
            })
            .catch((err) => {
                console.log(`${DEBUG_KEY}: err in loading user profile`, err)
                dispatch({
                    type: PROFILE_FETCHING_FAIL,
                    payload: `Error loading user profile: ${err}`,
                })
                // TODO: show toaster saying loading fail
            })

        return pageId
    } catch (error) {
        console.log('ERRORR ARAH HA PROFILE ME', error.message)
    }
}

/**
 * Open user profile detail based on an userId and a pageId. This is used when we enter user page through
 * user goal list
 * @param {*} userId
 * @param {*} pageId
 */
export const openProfileDetail = (userId) => (dispatch, getState) => {
    // pageId here should be created when a profile component is opened.
    // We append the detail to the end of pageId to create a new one
    const newPageId = constructPageId('user_profile_detail')
    // trackWithProperties(E.PROFILE_OPENED, { UserId: userId })
    dispatch({
        type: PROFILE_OPEN_PROFILE_DETAIL,
        payload: {
            userId,
            pageId: newPageId,
        },
    })
    // Whether a new pageId or reuse the one that is generated when user opens the
    // Profile component seem to be much of a difference due to the added use case of notification
    // Go with appending to create a new pageId first
    const { tab } = getState().navigation
    let componentKeyToOpen = 'profileDetail'
    if (tab !== 'homeTab' && tab !== undefined) {
        componentKeyToOpen = `${tab}_profileDetail`
    }
    Actions.push(`${componentKeyToOpen}`, { userId, pageId: newPageId })
}

export const closeProfileDetail = (userId, pageId) => (dispatch) => {
    // Pop the profile detail page
    Actions.pop()

    // Clear related component reference
    dispatch({
        type: PROFILE_CLOSE_PROFILE_DETAIL,
        payload: {
            userId,
            pageId,
        },
    })
}

// Fetch mutual friends
export const fetchMutualFriends = (userId, refresh) => (dispatch, getState) => {
    const { token } = getState().user
    const mutualFriends = getUserData(getState(), userId, 'mutualFriends')

    if (!mutualFriends || _.isEmpty(mutualFriends)) {
        console.err(
            `${DEBUG_KEY}: no mutual friend object found for user: ${userId}`
        )
        return
    }

    const { skip, limit, hasNextPage, loading } = mutualFriends
    const newSkip = refresh ? 0 : skip
    if ((hasNextPage === undefined || hasNextPage) && !loading) {
        dispatch({
            type: PROFILE_FETCH_MUTUAL_FRIEND,
            payload: {
                userId,
                refresh,
            },
        })

        API.get(
            `secure/user/friendship/mutual-friends?userId=${userId}&skip=${skip}&limit=${limit}`,
            token
        )
            .then((res) => {
                console.log(`${DEBUG_KEY} fetch mutual friends with res: `, res)
                if (res.status === 200 || res.data) {
                    const data = res.data
                    dispatch({
                        type: PROFILE_FETCH_MUTUAL_FRIEND_DONE,
                        payload: {
                            skip: newSkip + res.data.length,
                            hasNextPage: !(
                                data === undefined ||
                                data.length === 0 ||
                                data.length < skip
                            ),
                            data:
                                data === null || data === undefined ? [] : data,
                            refresh,
                            userId,
                        },
                    })
                }
            })
            .catch((err) => {
                console.log(`${DEBUG_KEY} fetch mutual friends error: ${err}`)
                dispatch({
                    type: PROFILE_FETCH_MUTUAL_FRIEND_DONE,
                    payload: {
                        skip,
                        hasNextPage,
                        data: [],
                        refresh: false,
                        userId,
                    },
                })
            })
    }
}

export const openProfileDetailEditForm = (userId, pageId) => {
    return (dispatch) => {
        dispatch({
            type: '',
        })
        Actions.profileDetailEditForm({ userId, pageId })
    }
}

export const createOrGetDirectMessage = (userId, maybeCallback) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    const body = {
        roomType: 'Direct',
        membersToAdd: userId,
    }
    API.post(`secure/chat/room`, body, token)
        .then((resp) => {
            if (resp.status != 200) {
                if (maybeCallback) {
                    return maybeCallback(new Error('Error creating chat.'))
                }
                return Alert.alert(
                    'Error',
                    'Could not start the conversation. Please try again later.'
                )
            }
            const chatRoom = resp.data
            if (!chatRoom) {
                if (maybeCallback) {
                    return maybeCallback(new Error('Error creating chat.'))
                }
                return Alert.alert(
                    'Error',
                    'Could not start the conversation. Please try again later.'
                )
            }
            if (maybeCallback) {
                maybeCallback(null, chatRoom)
            } else {
                Actions.push('chatRoomConversation', {
                    chatRoomId: chatRoom._id,
                })
            }
        })
        .catch((err) => {
            if (maybeCallback) {
                return maybeCallback(err)
            }
            Alert.alert(
                'Error',
                'Could not create a conversation with specified user.'
            )
        })
}

// TODO: profile reducer redesign to change here. The method signature. Search for usage
export const submitUpdatingProfile = (
    { values, hasImageModified },
    pageId,
    refreshHome
) => {
    return (dispatch, getState) => {
        const { headline, name, oldPassword, newPassword } = values
        const { about, occupation, elevatorPitch, location } = values.profile
        const imageUri = values.profile.image
        const { token, userId } = getState().user

        // Start updaing process
        dispatch({
            type: PROFILE_SUBMIT_UPDATE,
            payload: {
                userId,
                pageId,
            },
        })

        const updateAccountPromise = updateAccount({ name, headline, token })
        const updateProfilePromise = ImageUtils.upload(
            hasImageModified,
            imageUri,
            token,
            PROFILE_IMAGE_UPLOAD_SUCCESS,
            dispatch,
            userId
        ).then(() => {
            const image = getUserData(getState(), userId, 'tmpImage')
            return updateProfile({
                image,
                about,
                occupation,
                location,
                elevatorPitch,
                token,
            })
        })

        // if (hasImageModified) {
        //     track(E.PROFILE_PHOTO_UPDATED)
        // }

        let updatePasswordPromise = null
        if (oldPassword && newPassword) {
            updatePasswordPromise = updatePassword({
                oldPassword,
                newPassword,
                token,
            })
        }

        Promise.all([
            updateAccountPromise,
            updateProfilePromise,
            updatePasswordPromise,
        ])
            .then((res) => {
                const [
                    accountUpdateRes,
                    profileUpdateRes,
                    passwordUpdateRes,
                ] = res
                const user = {
                    ...accountUpdateRes,
                    profile: { ...profileUpdateRes },
                }
                // trackWithProperties(E.PROFILE_UPDATED, {
                //     ...user,
                //     UserId: userId,
                // })
                // track(E.PROFILE_UPDATED)

                dispatch({
                    type: PROFILE_UPDATE_SUCCESS,
                    payload: {
                        user,
                        userId,
                        pageId,
                    },
                })
                refreshHome()
                Actions.pop()
                fetchUserProfile(userId, pageId)(dispatch, getState)
                Logger.log(
                    `${DEBUG_KEY}: submitUpdatingProfile done with new user:`,
                    user,
                    2
                )
            })
            .catch((err) => {
                dispatch({
                    type: PROFILE_UPDATE_FAIL,
                    payload: err,
                })
                console.log('error updating profile: ', err)
            })
    }
}

export const updateProfilePic = (imageUri, pageId) => (dispatch, getState) => {
    const { token, userId } = getState().user
    // Start updaing process
    dispatch({
        type: PROFILE_SUBMIT_UPDATE,
        payload: {
            userId,
            pageId,
        },
    })

    if (imageUri) {
        const updateProfilePromise = ImageUtils.upload(
            true, //This is function ius called when the image is changed
            imageUri,
            token,
            PROFILE_IMAGE_UPLOAD_SUCCESS,
            dispatch,
            userId
        ).then(() => {
            const image = getUserData(getState(), userId, 'tmpImage')
            return updateProfile({ image, token })
        })
        updateProfilePromise
            .then((res) => {
                console.log('\nResponse from profile updating function: ', res)
                const user = {
                    profile: { image: res.image },
                }
                dispatch({
                    type: PROFILE_UPDATE_SUCCESS,
                    payload: {
                        user,
                        userId,
                        pageId,
                    },
                })
                Logger.log(
                    `${DEBUG_KEY}: submitUpdatingProfile done with new user:`,
                    user,
                    2
                )
            })
            .catch((err) => {
                dispatch({
                    type: PROFILE_UPDATE_FAIL,
                    payload: err,
                })
                console.log('\nError updating profile picture: ', err)
            })
    }
}

/**
 * select a tab by tab name
 */
export const selectProfileTabByName = (tab, userId, pageId, initialFilter) => (
    dispatch,
    getState
) => {
    const routes = getUserDataByPageId(
        getState(),
        userId,
        pageId,
        'navigationState.routes'
    )

    let index = 0
    routes.forEach((route, i) => {
        if (route.key === tab) {
            index = i
        }
    })
    selectProfileTab(index, userId, pageId, initialFilter)(dispatch, getState)
}

/**
 * Select a tab by index
 */
export const selectProfileTab = (index, userId, pageId, initialFilter) => (
    dispatch,
    getState
) => {
    dispatch({
        type: PROFILE_SWITCH_TAB,
        payload: {
            index,
            userId,
            pageId,
        },
    })

    // const tab = getState().profile.navigationState.routes[index].key; // Original implementation
    // const { data } = _.get(getState().profile, tab);
    const routes = getUserDataByPageId(
        getState(),
        userId,
        pageId,
        'navigationState.routes'
    )
    const tab = routes[index].key

    if (tab === 'about') return // No need to refresh tab for about
    const data = getUserDataByPageId(getState(), userId, pageId, `${tab}.data`)

    // Only attempt to load if there is no data
    if (!data || data.length === 0) {
        handleTabRefresh(tab, userId, pageId, initialFilter)(dispatch, getState)
    }
}

// Reset filter state for a tab to have All for categories
export const resetFilterType = (tab, userId, pageId) => (
    dispatch,
    getState
) => {
    dispatch({
        type: PROFILE_RESET_FILTER,
        payload: {
            tab,
            userId,
            pageId,
        },
    })
}

// User update filter for specific tab
export const changeFilter = (tab, filterType, value, { userId, pageId }) => (
    dispatch,
    getState
) => {
    dispatch({
        type: PROFILE_UPDATE_FILTER,
        payload: {
            tab,
            type: filterType,
            value,
            pageId,
            userId,
        },
    })
    handleTabRefresh(tab, userId, pageId)(dispatch, getState)
}

export const handleCurrentTabRefresh = ({ userId, pageId }) => (
    dispatch,
    getState
) => {
    const navigationState = getUserDataByPageId(
        getState(),
        userId,
        pageId,
        'navigationState'
    )
    const { routes, index } = navigationState
    handleTabRefresh(routes[index].key, userId, pageId)(dispatch, getState)
}

/**
 * Handle user profile on refresh
 * NOTE: This is TODO for milestone 2
 * Refresh for profile tab
 * @params tab: one of ['about', 'goals', 'posts', 'needs']
 */
export const handleTabRefresh = (tab, userId, pageId, initialFilter) => (
    dispatch,
    getState
) => {
    const { token } = getState().user

    if (tab === 'about') return // we don't need to refresh about

    // Get user by userId
    const user = getUserData(getState(), userId, 'user')

    // Get page info for this user by userId and pageId
    const page = getUserDataByPageId(getState(), userId, pageId, `${tab}`)
    const { filter, limit, refreshing } = page

    if (!user || !user._id || refreshing) return
    console.log(
        `${DEBUG_KEY}: refresh tab ${tab} for user with name ${user.name} and id: ${user._id} and pageId: ${pageId}`
    )
    const userIdToUser = user._id

    let filterToAdapt = filter
    if (initialFilter && _.has(initialFilter, `${tab}.filter`)) {
        filterToAdapt = _.merge(filter, _.get(initialFilter, `${tab}.filter`))
    }

    const filterToUse = profileFilterAdapter(filterToAdapt, tab)
    dispatch({
        type: PROFILE_REFRESH_TAB,
        payload: {
            type: tab,
            pageId,
            userId,
            filterToUse,
        },
    })

    const onSuccess = (data) => {
        console.log(
            `${DEBUG_KEY}: ${tab} refresh succeed with data length: `,
            data.length
        )
        dispatch({
            type: PROFILE_REFRESH_TAB_DONE,
            payload: {
                type: tab,
                data,
                skip: data.length,
                limit,
                userId: userIdToUser,
                hasNextPage: !(data === undefined || data.length === 0),
                pageId,
                filterToUse,
            },
        })
    }

    const onError = (err) => {
        console.log(`${DEBUG_KEY}: ${tab} refresh failed with err: `, err)
        dispatch({
            type: PROFILE_REFRESH_TAB_FAIL,
            payload: {
                type: tab,
                userId,
                pageId,
            },
        })
        console.log(`${DEBUG_KEY}: refresh tab: ${tab} failed with err: `, err)
    }

    loadOneTab(
        tab,
        0,
        limit,
        { ...filterToUse, userId: userIdToUser },
        token,
        onSuccess,
        onError
    )
}

/**
 * Load more for profile tab
 * @params tab: one of ['goals', 'posts', 'needs']
 */
export const handleProfileTabOnLoadMore = (tab, userId, pageId) => (
    dispatch,
    getState
) => {
    const { token } = getState().user

    // Get user by userId
    const user = getUserData(getState(), userId, 'user')
    if (!user || _.isEmpty(user)) return
    const { _id } = user

    // Get page info for this user by userId and pageId
    const page = getUserDataByPageId(getState(), userId, pageId, `${tab}`)
    const { filter, limit, hasNextPage, skip, loading, refreshing } = page

    if (hasNextPage === false || refreshing || loading) {
        return
    }

    dispatch({
        type: PROFILE_FETCH_TAB,
        payload: {
            type: tab,
            userId,
            pageId,
        },
    })

    const onSuccess = (data) => {
        console.log(
            `${DEBUG_KEY}: ${tab} load more succeed with data length: `,
            data.length
        )
        dispatch({
            type: PROFILE_FETCH_TAB_DONE,
            payload: {
                type: tab,
                data,
                skip: skip + data.length,
                limit,
                hasNextPage: !(data === undefined || data.length === 0),
                pageId,
                userId,
            },
        })
    }

    const onError = (err) => {
        console.log(`${DEBUG_KEY}: ${tab} load more failed with err: `, err)
        dispatch({
            type: PROFILE_FETCH_TAB_FAIL,
            payload: {
                type: tab,
                pageId,
                userId,
            },
        })
        console.log(
            `${DEBUG_KEY}: tab: ${tab} on load more fail with err: `,
            err
        )
    }

    loadOneTab(
        tab,
        skip,
        limit,
        { ...profileFilterAdapter(filter, tab), userId: _id },
        token,
        onSuccess,
        onError
    )
}

/**
 * Original field for orderBy should be ['ascending', 'descending'],
 * server accepted types are ['asc', 'desc']
 */
const profileFilterAdapter = (filter, tab) => {
    let newFilter = _.cloneDeep(filter)
    // const sortOrder = _.clone(newFilter.orderBy);
    const sortOrder = PROFILE_GOAL_FILTER_CONST.orderBy[filter.orderBy]
    // const categories = filter.catergory;
    // console.log('categories are: ', categories);
    if (newFilter.categories === 'All') {
        delete newFilter.categories
    }

    // Create special filter for needs
    // if (tab === 'needs') {
    //   newFilter = _.omit(newFilter, 'categories');
    //   newFilter = _.omit(newFilter, 'orderBy');
    //   newFilter = _.omit(newFilter, 'sortBy');
    //   newFilter = _.omit(newFilter, 'completedOnly');
    //   newFilter = _.set(newFilter, 'withNeeds', true);
    //   console.log(`${DEBUG_KEY}: filter is:`, newFilter);
    //   return newFilter
    // }
    delete newFilter.orderBy
    // delete newFilter.catergory;
    delete newFilter.completedOnly
    return {
        ...newFilter,
        sortOrder,
        // categories
    }
}

/**
 * Basic API to load one tab based on params
 * @param tab:
 * @param skip:
 * @param limit:
 * @param filter:
 * @param token:
 * @param callback:
 */
const loadOneTab = (tab, skip, limit, filter, token, onSuccess, onError) => {
    if (tab !== 'posts') {
        return loadUserGoals(skip, limit, filter, token, onSuccess, onError)
    }

    const route = `secure/feed/post/user?${queryBuilder(skip, limit, {
        userId: filter.userId,
    })}`
    API.get(route, token)
        .then((res) => {
            // console.log(`${DEBUG_KEY}: res for fetching for tab: ${tab}, is: `, res);
            if (res.status === 200 || (res && res.data)) {
                // TODO: change this
                return onSuccess(res.data)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * Delete a goal in profile tab
 */
// TODO: profile reducer redesign to change here. Add pageId
export const deleteGoal = (goalId, pageId) => (dispatch, getState) => {
    const { userId } = getState().user
    deleteItem(
        {
            param: { goalId },
            route: `secure/goal?goalId=${goalId}`,
        },
        dispatch,
        getState,
        // onSuccess
        () => {
            console.log(`${DEBUG_KEY}: delete goal succeed.`)
            trackWithProperties(E.GOAL_DELETED, {
                GoalId: goalId,
                UserId: userId,
            })
            dispatch({
                type: PROFILE_GOAL_DELETE_SUCCESS,
                payload: {
                    goalId,
                    userId,
                    pageId,
                },
            })
        },
        // onError
        ({ message }) => {
            Alert.alert('Deleting goal failed', `${message}`, [
                { text: 'Cancel', style: 'cancel' },
            ])
        }
    )
}

/**
 * Delete a post in profile tab
 */

export const deletePost = (postId) => (dispatch, getState) => {
    const { userId } = getState().user
    deleteItem(
        {
            param: { postId },
            route: `secure/feed/post?postId=${postId}`,
        },
        dispatch,
        getState,
        (res) => {
            console.log(`${DEBUG_KEY}: delete post success with res: `, res)
            trackWithProperties(E.POST_DELETED, {
                PostId: postId,
                UserId: userId,
            })
            dispatch({
                type: PROFILE_POST_DELETE_SUCCESS,
                payload: {
                    postId,
                    userId,
                },
            })
        },
        ({ message }) => {
            Alert.alert('Deleting post failed', `${message}`, [
                { text: 'Cancel', style: 'cancel' },
            ])
        }
    )
}

// By pass in user object, return corresponding banner
export const UserBanner = (props) => {
    const { user, iconStyle } = props

    if (!user || !user.profile || user.profile.badges === undefined) {
        return <View style={{ padding: 3 }} />
    }

    // Before gamification, we only show green badge
    const level = _.get(
        user,
        'profile.badges.milestoneBadge.currentMilestone',
        0
    )
    const source = switchCaseBannerSource(level)

    if (!user || !user.profile) return null
    if (!source) return <View style={{ width: 8 }} />
    const defaultIconStyle = {
        alignSelf: 'center',
        marginLeft: 4,
        marginRight: 4,
        height: 14 * default_style.uiScale,
        width: 10 * default_style.uiScale,
    }

    return <Image source={source} style={[defaultIconStyle, iconStyle]} />
}

export const openCreateOverlay = (userId, pageId) => (dispatch) => {
    dispatch({
        type: PROFILE_OPEN_CREATE_OVERLAY,
        payload: {
            userId,
            pageId,
        },
    })
}

export const closeCreateOverlay = (userId, pageId) => (dispatch) => {
    dispatch({
        type: PROFILE_CLOSE_CREATE_OVERLAY,
        payload: {
            userId,
            pageId,
        },
    })
}

/**
 * When user opens profile for the first time / opens app later on and they earn a new badge,
 * we show the modal to congradulate. This sends to server to mark that field as shown.
 * @param {string} badgeName: Ex. 'milestoneBadge'
 */
export const markEarnBadgeModalAsShown = (badgeName = 'milestoneBadge') => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user

    const onSuccess = () => {
        dispatch({
            type: PROFILE_BADGE_EARN_MODAL_SHOWN,
            payload: {
                userId,
            },
        })
    }

    const onError = (err) => {
        dispatch({
            type: PROFILE_BADGE_EARN_MODAL_SHOWN_ERROR,
            payload: {
                userId,
            },
        })

        console.warn(
            `${DEBUG_KEY}: mark earn badge modal as shown failed with res: `,
            err
        )
    }

    API.put(
        'secure/user/profile/badges/award-alert-shown',
        { badgeName },
        token
    )
        .then((res) => {
            if (res.status === 200) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => onError(err))
}

// Fetch the number of users on the badge level
export const fetchBadgeUserCount = (
    callback,
    tier = 3,
    badgeName = 'milestoneBadge'
) => (dispatch, getState) => {
    const { token } = getState().user
    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: [ fetchBadgeUserCount ] failed with err: `,
            err
        )
        if (callback) callback(0)
        return 0
    }

    const onSuccess = (res) => {
        const { data } = res
        if (callback) callback(data)
        return data
    }

    API.get(
        `secure/user/profile/stats/badge-count?badgeName=${badgeName}&tier=${tier}`,
        token
    )
        .then((res) => {
            if (res.status === 200) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => onError(err))
}

export const switchCaseBannerSource = (level) => {
    if (!level) {
        return undefined
    } else if (level === 1) {
        return Green
    } else if (level === 2) {
        return Bronze3D
    } else if (level === 3) {
        return Silver3D
    } else if (level === 4) {
        return Gold3D
    }
}

const deleteItem = (item, dispatch, getState, onSuccess, onError) => {
    const { token } = getState().user
    API.delete(item.route, { ...item.param }, token)
        .then((res) => {
            if (res.status === 200 || res.isSuccess) {
                return onSuccess(res)
            }
            console.warn('Delete item fail in profile err with res: ', res)
            return onError({ message: res.message })
        })
        .catch((err) => {
            console.warn('Delete item fail in profile with exception: ', err)
            return onError({ message: err })
        })
}
