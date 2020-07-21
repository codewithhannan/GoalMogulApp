/** @format */

import { Actions } from 'react-native-router-flux'
import { AppState, Image } from 'react-native'
import { api as API } from '../redux/middleware/api'
import { SplashScreen } from 'expo'
import { SPLASHSCREEN_HIDE } from '../reducers/AuthReducers'

import {
    USERNAME_CHANGED,
    PASSWORD_CHANGED,
    REGISTRATION_ACCOUNT,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER_LOADING,
} from './types'

import { USER_LOAD_PROFILE_DONE, USER_LOG_OUT } from '../reducers/User'

import { auth as Auth } from '../redux/modules/auth/Auth'
import { openProfile } from '../actions'
import {
    subscribeNotification,
    saveUnreadNotification,
    loadUnreadNotification,
    unsubscribeNotifications,
} from '../redux/modules/notification/NotificationActions'

import {
    saveTutorialState,
    loadTutorialState,
} from '../redux/modules/User/TutorialActions'

import { refreshFeed } from '../redux/modules/home/feed/actions'

import { refreshGoals } from '../redux/modules/home/mastermind/actions'

import { IMAGE_BASE_URL, MINUTE_IN_MS, DAY_IN_MS } from '../Utils/Constants'

// Components
import { DropDownHolder } from '../Main/Common/Modal/DropDownModal'

import LiveChatService from '../socketio/services/LiveChatService'
import MessageStorageService from '../services/chat/MessageStorageService'
import { MemberDocumentFetcher } from '../Utils/UserUtils'
import { Logger } from '../redux/middleware/utils/Logger'
import { saveRemoteMatches, loadRemoteMatches } from './MeetActions'
import { setUser, SentryRequestBuilder } from '../monitoring/sentry'
import { identify, resetUser, track, EVENT as E } from '../monitoring/segment'
import {
    SENTRY_TAGS,
    SENTRY_MESSAGE_LEVEL,
    SENTRY_TAG_VALUE,
    SENTRY_MESSAGE_TYPE,
    SENTRY_CONTEXT,
} from '../monitoring/sentry/Constants'

const DEBUG_KEY = '[ Action Auth ]'

export const userNameChanged = (username) => {
    return {
        type: USERNAME_CHANGED,
        payload: username,
    }
}

export const passwordChanged = (password) => {
    return {
        type: PASSWORD_CHANGED,
        payload: password,
    }
}

const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

export const tryAutoLogin = (flags) => async (dispatch, getState) => {
    let res
    try {
        res = await Auth.getKey()
    } catch (error) {
        new SentryRequestBuilder(message, SENTRY_MESSAGE_TYPE.MESSAGE)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(
                SENTRY_TAGS.AUTH.EXPO_SECURE_STORE_FETCH,
                SENTRY_TAG_VALUE.ACTIONS.FAILED
            )
            .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
            .send()
        return
    }

    try {
        // auto-login with current token
        authenticate(res, flags)(dispatch, getState)
        // refresh token 30s after app load
        setTimeout(async () => {
            const { username, password } = res
            authenticate({ username, password }, { tokenRefresh: true })(
                dispatch,
                getState
            )
        }, MINUTE_IN_MS / 2)
    } catch (error) {
        new SentryRequestBuilder(message, SENTRY_MESSAGE_TYPE.MESSAGE)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(
                SENTRY_TAGS.AUTH.AUTO_AUTHENTICATE,
                SENTRY_TAG_VALUE.ACTIONS.FAILED
            )
            .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
            .send()
    }
}

export const loginUser = ({ username, password, onError, onSuccess }) => (
    dispatch,
    getState
) => {
    return authenticate({ username, password, onError, onSuccess })(
        dispatch,
        getState
    )
}

const authenticate = (
    { username, password, token, onError, onSuccess },
    flags
) => {
    // Call the endpoint to use username and password to signin
    // Obtain the credential
    const data = validateEmail(username)
        ? {
              email: username,
              password,
          }
        : {
              phone: username,
              password,
          }

    return async (dispatch, getState) => {
        console.log(
            `${DEBUG_KEY}: current app state is: `,
            AppState.currentState
        )
        // Do not reload data when on background or inactive
        if (
            AppState.currentState === 'inactive' ||
            AppState.currentState === 'background'
        )
            return

        const { loading } = getState().auth

        // If user loading is already triggerred, do nothing
        // Potential place to trigger loading is at Router
        if (loading) return
        dispatch({
            type: LOGIN_USER_LOADING,
        })

        try {
            if (token) {
                // If token is more than 2 days old, re-authorize
                const payload = JSON.parse(token)
                const minTokenCreationLimit = Date.now() - 2 * DAY_IN_MS

                if (payload.created > minTokenCreationLimit) {
                    await mountUserWithToken(
                        {
                            payload,
                            username,
                            password,
                            onSuccess,
                        },
                        flags
                    )(dispatch, getState)
                    return
                }
            }
        } catch (error) {
            new SentryRequestBuilder(error, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.INFO)
                .withTag(
                    SENTRY_TAGS.ACTION.LOGIN_IN,
                    SENTRY_TAG_VALUE.ACTIONS.FAILED
                )
                .withExtraContext(SENTRY_TAGS.ACTION.TOKEN, { username, token })
                .send()
        }

        const message = await API.post(
            'pub/user/authenticate/',
            { ...data },
            undefined
        )
            .then(async (res) => {
                // User Login Failed
                if (!res.token) return res.message

                // User Login Successfully
                const payload = {
                    token: res.token,
                    userId: res.userId,
                    created: Date.now(),
                }

                await mountUserWithToken(
                    {
                        payload,
                        username,
                        password,
                        onSuccess,
                    },
                    flags
                )(dispatch, getState)
            })
            .catch((err) => err.message || 'Please try again later')

        if (message) {
            dispatch({
                type: LOGIN_USER_FAIL,
            })

            if (onError) onError(message)

            // Record failure message in Sentry
            new SentryRequestBuilder(
                new Error(message),
                SENTRY_MESSAGE_TYPE.ERROR
            )
                .withLevel(SENTRY_MESSAGE_LEVEL.INFO)
                .withTag(
                    SENTRY_TAGS.ACTION.LOGIN_IN,
                    SENTRY_TAG_VALUE.ACTIONS.FAILED
                )
                .withExtraContext(SENTRY_TAGS.ACTION.USERNAME, username)
                .send()
        }
    }
}

/**
 * Dispaches required actions and set's the app state to mount user
 * and content after login is successful
 * @param { payload: { userId, token }, username, password, onSuccess } param0
 * payload: { userId, token } and username is required for a successful user mount
 * @param { hideSplashScreen, tokenRefresh } param1
 * if tokenRefresh then token will be mounted but user wont be mounted
 * if hideSplashScreen then function will the hide SplashScreen on end
 */
const mountUserWithToken = (
    { payload, username, password, onSuccess },
    { hideSplashScreen, tokenRefresh }
) => async (dispatch, getState) => {
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload,
    })

    // set up chat listeners
    LiveChatService.mountUser({
        userId: payload.userId,
        authToken: payload.token,
    })
    MessageStorageService.mountUser({
        userId: payload.userId,
        authToken: payload.token,
    })

    Auth.saveKey(username, password, JSON.stringify(payload))

    if (onSuccess) onSuccess()
    // If just refreshing token do not refresh profile and app state
    if (tokenRefresh) return

    // Sentry track user
    setUser(payload.userId, username)

    // Segment track user
    identify(payload.userId, username)

    // Refresh feed and all goals
    refreshFeed()(dispatch, getState)
    refreshGoals()(dispatch, getState)
    subscribeNotification()(dispatch, getState)

    // Fetch user profile using returned token and userId
    const userObject = await fetchAppUserProfile(payload.token, payload.userId)(
        dispatch,
        getState
    )

    // Let the screen transition happen first
    // before waiting on potential long duration operations
    if (userObject && userObject.isOnBoarded == false) {
        // Load profile success and user is marked as not onboarded
        // Go to onboarding flow
        Actions.replace('registration_add_photo')
    } else {
        // Go to home page
        Actions.replace('drawer')
    }

    // Load unread notification
    await loadUnreadNotification()(dispatch, getState)

    // Load tutorial state
    await loadTutorialState(payload.userId)(dispatch, getState)

    // Load remote matches
    await loadRemoteMatches(payload.userId)(dispatch, getState)

    if (hideSplashScreen) {
        SplashScreen.hide()
        dispatch({
            type: SPLASHSCREEN_HIDE,
        })
    }
}

// We have the same action in Profile.js
export const fetchAppUserProfile = (token, userId) => async (
    dispatch,
    getState
) => {
    let tokenToUse = token
    let userIdToUse = userId
    if (!token) {
        tokenToUse = getState().user.token
    }

    if (!userId) {
        userIdToUse = getState().user.userId
    }

    try {
        const res = await API.get(
            `secure/user/profile?userId=${userIdToUse}`,
            tokenToUse
        )

        // Profile fetch failed
        if (res.status > 299 || res.status < 200) {
            new SentryRequestBuilder(message, SENTRY_MESSAGE_TYPE.MESSAGE)
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(
                    SENTRY_TAGS.ACTION.FETCH_USER_PROFILE,
                    SENTRY_TAG_VALUE.ACTIONS.FAILED
                )
                .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
                .send()
            return undefined
        }

        // Dispatch events
        dispatch({
            type: USER_LOAD_PROFILE_DONE,
            payload: {
                user: res.data,
                pageId: 'LOGIN',
            },
        })

        return res.data
    } catch (error) {
        new SentryRequestBuilder(error, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(
                SENTRY_TAGS.ACTION.FETCH_USER_PROFILE,
                SENTRY_TAG_VALUE.ACTIONS.FAILED
            )
            .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
            .send()

        return undefined
    }
}

export const registerUser = () => (dispatch) => {
    dispatch({
        type: REGISTRATION_ACCOUNT,
    })
    Actions.registrationAccount()
}

export const logout = () => async (dispatch, getState) => {
    track(E.USER_LOGOUT)
    // Reset user on logout
    resetUser()
    // Store the unread notification first as USER_LOG_OUT will clear its state
    await saveUnreadNotification()(dispatch, getState)
    await saveTutorialState()(dispatch, getState)
    await saveRemoteMatches()(dispatch, getState)

    const callback = (res) => {
        if (res instanceof Error) {
            console.log(`${DEBUG_KEY}: log out user error: `, res)
            new SentryRequestBuilder(res, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.INFO)
                .withTag(
                    SENTRY_TAGS.ACTION.LOGOUT,
                    SENTRY_TAG_VALUE.ACTIONS.FAILED
                )
                .withExtraContext(SENTRY_TAGS.ACTION.USERNAME, username)
                .send()
        } else {
            console.log(`${DEBUG_KEY}: log out user with res: `, res)
        }
    }
    await unsubscribeNotifications()(dispatch, getState)
    Auth.reset(callback)
    Actions.reset('root')
    // clear chat service details
    LiveChatService.unMountUser()
    MessageStorageService.unMountUser()
    // clear caches
    MemberDocumentFetcher.clearMemberCache()

    dispatch({
        type: USER_LOG_OUT,
    })
}

const TOAST_IMAGE_STYLE = {
    height: 36,
    width: 36,
    borderRadius: 4,
}

const TOAST_IMAGE_CONTAINER_STYLE = {
    borderWidth: 0.5,
    padding: 0.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: 'transparent',
}

const NEWLY_CREATED_KEY = 'newly_created_key'
const makeTitleWithName = (name) => `You\'ve accepted ${name}\'s invite!`
const makeMessage = () =>
    'Tap here to visit their profile and help them with their goals.'

export const checkIfNewlyCreated = () => async (dispatch, getState) => {
    const { token, userId } = getState().user
    // Check if we already show toast
    const hasShownToast = await Auth.getByKey(`${userId}_${NEWLY_CREATED_KEY}`)
    if (hasShownToast) {
        Logger.log(`${DEBUG_KEY}: user shown toast state:`, hasShownToast, 2)
        return // comment out to test
    }

    // Check if user is newly invited
    const onSuccess = async (res) => {
        Logger.log(`${DEBUG_KEY}: [ checkIfNewlyCreated ] res is:`, res, 2)
        const { isNewlyInvited, inviter } = res
        // Show toast
        if (!isNewlyInvited) {
            Logger.log(
                `${DEBUG_KEY}: [ checkIfNewlyCreated ] user is no longer newly invited`,
                null,
                2
            )
            return // comment out to test
        }

        if (!inviter) {
            console.warn(
                `${DEBUG_KEY}: [ checkIfNewlyCreated ] invalid inviter:`,
                inviter
            )
            return // comment out to test
        }

        const { profile, name, _id } = inviter
        if (profile && profile.image) {
            const urlToSet = `${IMAGE_BASE_URL}${profile.image}`
            const onCloseFunc = () => {
                console.log(`${DEBUG_KEY}: I am here`)
                openProfile(_id)(dispatch, getState)
            }
            Image.prefetch(urlToSet)
            // Set image, image style and image container style
            DropDownHolder.setDropDownImage(urlToSet)
            DropDownHolder.setDropDownImageStyle(TOAST_IMAGE_STYLE)
            DropDownHolder.setDropDownImageContainerStyle(
                TOAST_IMAGE_CONTAINER_STYLE
            )
            DropDownHolder.setOnClose(onCloseFunc)
        }

        // Wait for image to preload
        console.log(
            `${DEBUG_KEY}: [ checkIfNewlyCreated ]: scheduled showing alert`
        )

        setTimeout(() => {
            console.log(`${DEBUG_KEY}: [ checkIfNewlyCreated ]: showing alert`)
            DropDownHolder.alert(
                'custom',
                makeTitleWithName(name),
                makeMessage()
            )
        }, 1000)

        // Save the response
        await Auth.saveByKey(`${userId}_${NEWLY_CREATED_KEY}`, 'true')
    }

    const onError = (res) => {
        console.warn(
            `${DEBUG_KEY}: endpoint fetch user/account/is-newly-invited failed with err:`,
            res
        )
        return
    }

    API.get('secure/user/account/is-newly-invited', token)
        .then((res) => {
            if (res.status === 200) {
                onSuccess(res)
                return
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}
