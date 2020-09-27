/** @format */

import { Actions } from 'react-native-router-flux'
import { AppState, Image } from 'react-native'
import { api as API } from '../redux/middleware/api'
import { SplashScreen } from 'expo'
import { SPLASHSCREEN_HIDE } from '../reducers/AuthReducers'
import _ from 'lodash'

import {
    USERNAME_CHANGED,
    PASSWORD_CHANGED,
    REGISTRATION_ACCOUNT,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER_LOADING,
} from './types'

import { USER_LOAD_PROFILE_DONE, USER_LOG_OUT } from '../reducers/User'

import { auth as Auth, AUTH_TOKEN_OBJECT } from '../redux/modules/auth/Auth'
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

import { refreshActivityFeed } from '../redux/modules/home/feed/actions'

import { refreshGoalFeed } from '../redux/modules/home/mastermind/actions'

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
import {
    isPossiblePhoneNumber,
    isValidPhoneNumber,
    getE164PhoneNumber,
    is4xxResponse,
    is5xxResponse,
    is2xxRespose,
} from '../redux/middleware/utils'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import TokenService from '../services/token/TokenService'
import getEnvVars from '../../environment'

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

const dispatchHideSplashScreen = (dispatch) => {
    SplashScreen.hide()
    dispatch({
        type: SPLASHSCREEN_HIDE,
    })
}

export const loginUser = ({ username, password, onError, onSuccess }) => (
    dispatch,
    getState
) => {
    let usernameToUse

    // if this is a possible and valid phone number, then get E163 phone number
    if (isPossiblePhoneNumber(username) && isValidPhoneNumber(username)) {
        usernameToUse = getE164PhoneNumber(username)
    } else {
        usernameToUse = username
    }

    return authenticate(
        {
            username: usernameToUse,
            password,
            onError,
            onSuccess,
        },
        {}
    )(dispatch, getState)
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
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(
                    SENTRY_TAGS.ACTION.LOGIN_IN,
                    SENTRY_TAG_VALUE.ACTIONS.FAILED
                )
                .withExtraContext(SENTRY_CONTEXT.LOGIN.USERNAME, username)
                .send()
        }

        const onAuthenticationError = ({ response, error }) => {
            // Error message for authentication
            const errorMessage = getLoginErrorMessage({
                response,
                error,
                username,
            })

            dispatch({
                type: LOGIN_USER_FAIL,
            })

            // Invoke onError callback
            if (onError) {
                onError(errorMessage, username)
            }

            // Hide SplashScreen
            if (flags && flags.hideSplashScreen) {
                dispatchHideSplashScreen(dispatch)
            }
        }

        try {
            const res = await API.post(
                'pub/user/authenticate/',
                { ...data },
                undefined
            )
            if (!res.token || !is2xxRespose(res.status)) {
                if (!is4xxResponse(res.status)) {
                    // Record failure in Sentry excluding user behavior
                    new SentryRequestBuilder(
                        res.message,
                        SENTRY_MESSAGE_TYPE.MESSAGE
                    )
                        .withLevel(SENTRY_MESSAGE_LEVEL.WARNING)
                        .withTag(
                            SENTRY_TAGS.ACTION.LOGIN_IN,
                            SENTRY_TAG_VALUE.ACTIONS.FAILED
                        )
                        .withExtraContext(
                            SENTRY_CONTEXT.LOGIN.USERNAME,
                            username
                        )
                        .send()
                }
                return onAuthenticationError({ response: res })
            }

            // User Login Successfully
            const payload = {
                token: res.token,
                userId: res.userId,
                created: Date.now(),
            }

            TokenService.mountUser(res.userId)
            TokenService.populateAndPersistToken(res.token, res.refreshToken)

            await mountUserWithToken(
                {
                    payload,
                    username,
                    password,
                    onSuccess,
                },
                flags
            )(dispatch, getState)
        } catch (err) {
            new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.WARNING)
                .withTag(
                    SENTRY_TAGS.ACTION.LOGIN_IN,
                    SENTRY_TAG_VALUE.ACTIONS.FAILED
                )
                .withExtraContext(SENTRY_CONTEXT.LOGIN.USERNAME, username)
                .send()
            onAuthenticationError({ error: err })
        }
    }
}

/**
 * Get error message from error, response and username
 * @param {*} param0
 */
export const getLoginErrorMessage = ({ username, error, response }) => {
    // default message
    let message = 'Could not find an account matching those credentials.'

    // Server error
    if (response && is5xxResponse(response.status)) {
        return "Sorry we're having trouble logging you in. Please try again later or contact support."
    }

    // Account not exist
    if (response && is4xxResponse(response.status)) {
        if (response.message && response.message.includes('Wrong password')) {
            // Invalid password
            return 'Could not find an account matching those credentials.'
        }
        // If it's a phone number
        if (isPossiblePhoneNumber(username)) {
            return "That account could not be found.\n Make sure you've entered the right country code."
        }
    }
    return message
}

/**
 * Dispaches required actions and set's the app state to mount user
 * and content after login is successful
 * @param { payload: { userId, token, created }, username, password, onSuccess } param0
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

    let tokenObjectToUpdate = _.cloneDeep(payload)

    // set up chat listeners
    LiveChatService.mountUser({
        userId: payload.userId,
        authToken: payload.token,
    })
    MessageStorageService.mountUser({
        userId: payload.userId,
        authToken: payload.token,
    })

    // This call is to save username and password
    // for "payload", it's actually updated together with isOnboarded
    // through {@code updateTokenObject}
    Auth.saveKey(username, password, JSON.stringify(payload))

    if (onSuccess) onSuccess()
    // If just refreshing token do not refresh profile and app state
    if (tokenRefresh) return

    // Sentry track user
    setUser(payload.userId, username)

    // Segment track user
    identify(payload.userId, username)

    // Refresh feed and all goals
    refreshActivityFeed()(dispatch, getState)
    refreshGoalFeed()(dispatch, getState)
    subscribeNotification()(dispatch, getState)

    // Fetch user profile using returned token and userId
    const userObject = await fetchAppUserProfile(payload.token, payload.userId)(
        dispatch,
        getState
    )

    // Let the screen transition happen first
    // before waiting on potential long duration operations
    if (userObject && !userObject.isOnBoarded) {
        // Load profile success and user is marked as not onboarded
        // Go to onboarding flow
        Actions.replace('registration_add_photo')
    } else {
        // Go to home page
        Actions.replace('drawer')
        tokenObjectToUpdate = _.set(tokenObjectToUpdate, 'isOnboarded', true)
    }

    // Load unread notification
    await loadUnreadNotification()(dispatch, getState)

    // Load tutorial state
    await loadTutorialState(payload.userId)(dispatch, getState)

    // Load remote matches
    await loadRemoteMatches(payload.userId)(dispatch, getState)

    if (hideSplashScreen) dispatchHideSplashScreen(dispatch)

    await updateTokenObject(tokenObjectToUpdate)
}

/**
 * Auto login when user starts the app.
 * TODO: there might be refactoring can be done by merging with {@code loginUser} function
 */
export const tryAutoLoginV2 = () => async (dispatch, getState) => {
    const refreshTokenObject = await TokenService.checkAndGetValidRefreshToken()
    if (refreshTokenObject == null) {
        // When refresh token is null, it means either user hasn't logged in before
        // or the refreshToken has expired. User needs to login
        dispatchHideSplashScreen(dispatch)
        return
    }

    const { token, userId, isOnboarded } = refreshTokenObject

    // Saturate User.js and AuthReducers.js with user token and userId for other actions to work
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {
            token,
            userId,
        },
    })

    // Step 1 Page transition
    if (!isOnboarded) {
        // isOnboarded is false, then we fetch user profile to validate
        // this is to handle when user has finished onboarding but it's first time
        // logging on this device
        const userObject = await fetchAppUserProfile(token, userId)(
            dispatch,
            getState
        )
        if (!userObject) {
            // Something went wrong fetching profile
            dispatchHideSplashScreen(dispatch)
            return
        }
        if (!userObject.isOnBoarded) {
            // Go to onboarding flow
            Actions.replace('registration_add_photo')
        } else {
            // This is to update the TokenService isOnboarded flag
            TokenService.populateAndPersistToken(undefined, token, true)

            // Go to home page
            Actions.replace('drawer')
        }
    } else {
        // Go to home page
        Actions.replace('drawer')
    }

    // Add a 50ms delay here to let screen transition finishes
    await new Promise((resolve, rej) => setTimeout(() => resolve(), 50))

    // Step 2 hide splash screen
    dispatchHideSplashScreen(dispatch)

    // Step 3 Setup all necessary service and configuration
    // set up chat listeners
    LiveChatService.mountUser({
        userId: userId,
        authToken: token,
    })
    MessageStorageService.mountUser({
        userId: userId,
        authToken: token,
    })

    // Step 4 Refresh feed and all goals
    refreshActivityFeed()(dispatch, getState)
    refreshGoalFeed()(dispatch, getState)

    // Step 5 Subscribe notification
    subscribeNotification()(dispatch, getState)

    /** Below actions are none blocking since we have transitioned the UI **/
    // Load general assets like icons and images
    loadGeneralAssets()

    // Load unread notification
    loadUnreadNotification()(dispatch, getState)

    // Load tutorial state
    loadTutorialState(payload.userId)(dispatch, getState)

    // Load remote matches
    loadRemoteMatches(payload.userId)(dispatch, getState)

    // Fetch user profile
    fetchAppUserProfile(token, userId)(dispatch, getState)
}

/**
 * Refresh user token
 * @param {Object} loginCredential Optional: { username, password }
 * @returns { token, userId, created }
 */
export const refreshToken = async (loginCredential) => {
    let username
    let password
    if (
        loginCredential &&
        loginCredential.username &&
        loginCredential.password
    ) {
        // Use login credential passed in through params
        username = loginCredential.username
        password = loginCredential.password
    } else {
        // Obtain login credential through SecureStorage
        let payload
        try {
            payload = await Auth.getKey()
        } catch (error) {
            // Fail to get login credential. Do nothing.
            // Log error as there are issues retrieving items from SecureStore
            new SentryRequestBuilder(error, SENTRY_MESSAGE_TYPE.ERROR)
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(SENTRY_TAGS.AUTH.ACTION, 'refreshToken')
                .send()
            return
        }
        if (!payload || !payload.username || !payload.password) {
            // Fail to get login credential. Do nothing.
            return
        }
        username = payload.username
        password = payload.password
    }

    const { token, userId } = await authenticateUser({ username, password })
    if (!token || !userId) {
        // Failed to authenticate
        return
    }

    return { token, userId, created: Date.now() }
}

/**
 * Update token object
 * @param {Object} tokenObjectToUpdate { token, userId, created, isOnboarded } token object to update SecureStore
 */
export const updateTokenObject = async (tokenObjectToUpdate) => {
    let parsedTokenObject = {}
    const tokenObject = await Auth.getByKey(AUTH_TOKEN_OBJECT) // Error is handled within Auth.getByKey
    if (tokenObject) {
        parsedTokenObject = JSON.parse(tokenObject)
    }

    // Set latest token, userId and created
    parsedTokenObject = {
        ...parsedTokenObject,
        ...tokenObjectToUpdate,
    }

    try {
        await Auth.saveByKey(
            AUTH_TOKEN_OBJECT,
            JSON.stringify(parsedTokenObject)
        )
    } catch (error) {
        // Error event as saving user token object encounter errors
        new SentryRequestBuilder(error, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.AUTH.ACTION, 'updateTokenObject')
            .withExtraContext(
                SENTRY_CONTEXT.LOGIN.USERNAME,
                parsedTokenObject.username
            )
            .send()
    }
}

/**
 * Authenticate user based on username and password
 * @param {Object} param0 { username, password }
 * @returns {Object} { token, userId, response, error } token and userId are undefined when response or error is not undefined
 * response is set when invalid login credential, error is set when exception happens
 */
export const authenticateUser = async ({ username, password }) => {
    const data = validateEmail(username)
        ? {
              email: username,
              password,
          }
        : {
              phone: username,
              password,
          }

    try {
        const res = await API.post(
            'pub/user/authenticate/',
            { ...data },
            undefined
        )
        if (!res.token || !is2xxRespose(res.status)) {
            if (!is4xxResponse(res.status)) {
                // Record failure in Sentry excluding user behavior
                new SentryRequestBuilder(
                    res.message,
                    SENTRY_MESSAGE_TYPE.MESSAGE
                )
                    .withLevel(SENTRY_MESSAGE_LEVEL.WARNING)
                    .withTag(SENTRY_TAGS.AUTH.ACTION, 'authenticateUser')
                    .withExtraContext(SENTRY_CONTEXT.LOGIN.USERNAME, username)
                    .send()
            }
            return { response: res }
        }

        // User authenticates Successfully
        return {
            token: res.token,
            userId: res.userId,
        }
    } catch (error) {
        new SentryRequestBuilder(error, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.AUTH.ACTION, 'authenticateUser')
            .withExtraContext(SENTRY_CONTEXT.LOGIN.USERNAME, username)
            .send()
        return { error }
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
    await Auth.reset(callback)
    await TokenService.unmountUser()
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

/**
 * Load necessary assets at login for home.
 * 1. Fonts
 * 2. Home nav assets
 *
 * @returns an array of promises
 */
export const loadInitialAssets = () => {
    // Images that are required initially
    const imageAssetPromises = cacheImages([
        // Splash screen images
        require('../asset/utils/help.png'),
        require('../asset/header/header-logo-white.png'),
    ])

    // Fonts are required initially
    const fontPromise = cacheFonts({
        'SFProDisplay-Bold': require('../../assets/fonts/SFProDisplay-Bold.otf'),
        'SFProDisplay-Regular': require('../../assets/fonts/SFProDisplay-Regular.otf'),
        'SFProDisplay-Semibold': require('../../assets/fonts/SFProDisplay-Semibold.otf'),
        'SFProDisplay-Medium': require('../../assets/fonts/SFProDisplay-Medium.otf'),
    })

    return Promise.all([...imageAssetPromises, ...fontPromise]).catch((err) => {
        new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.AUTH.ACTION, 'loadInitialAssets')
            .send()
    })
}

/**
 * Load general assets
 * @returns an array of promises
 */
export const loadGeneralAssets = async () => {
    const imageAssetPromises = cacheImages([
        require('../asset/utils/badge.png'),
        require('../asset/utils/dropDown.png'),
        require('../asset/utils/like.png'),
        require('../asset/utils/bulb.png'),
        require('../asset/utils/privacy.png'),
        require('../asset/utils/edit.png'),
        require('../asset/utils/defaultUserProfile.png'),
        require('../asset/utils/meetSetting.png'),
        require('../asset/utils/back.png'),
        require('../asset/utils/next.png'),
        require('../asset/utils/plus.png'),
        require('../asset/utils/cancel_no_background.png'),
        require('../asset/utils/briefcase.png'),
        require('../asset/utils/love.png'),
        require('../asset/utils/cancel.png'),
        require('../asset/utils/post.png'),
        require('../asset/utils/friendsSettingIcon.png'),
        require('../asset/utils/camera.png'),
        require('../asset/utils/cameraRoll.png'),
        require('../asset/utils/photoIcon.png'),
        require('../asset/utils/expand.png'),
        require('../asset/utils/forward.png'),
        require('../asset/utils/steps.png'),
        require('../asset/utils/activity.png'),
        require('../asset/utils/calendar.png'),
        require('../asset/utils/location.png'),
        require('../asset/utils/lightBulb.png'),
        require('../asset/utils/comment.png'),
        require('../asset/utils/reply.png'),
        require('../asset/utils/makeSuggestion.png'),
        require('../asset/utils/imageOverlay.png'),
        require('../asset/utils/info_white.png'),
        require('../asset/utils/info.png'),
        require('../asset/utils/HelpBG2.png'),
        require('../asset/utils/allComments.png'),
        require('../asset/utils/undo.png'),
        require('../asset/utils/trash.png'),
        require('../asset/utils/invite.png'),
        require('../asset/utils/tutorial.png'),
        require('../asset/utils/right_arrow.png'),
        require('../asset/utils/search.png'),
        require('../asset/utils/dot.png'),
        require('../asset/utils/envelope.png'),
        require('../asset/utils/eventIcon.png'),
        require('../asset/utils/tribeIcon.png'),
        // Friends Tab images
        require('../asset/utils/Friends.png'),
        require('../asset/utils/ContactSync.png'),
        require('../asset/utils/Suggest.png'),
        require('../asset/utils/clipboard.png'),
        require('../asset/utils/logout.png'),
        require('../asset/utils/bug_report.png'),
        // Suggestion Modal Icons
        require('../asset/suggestion/book.png'),
        require('../asset/suggestion/chat.png'),
        require('../asset/suggestion/event.png'),
        require('../asset/suggestion/flag.png'),
        require('../asset/suggestion/friend.png'),
        require('../asset/suggestion/group.png'),
        require('../asset/suggestion/link.png'),
        require('../asset/suggestion/other.png'),
        // Explore related icons
        require('../asset/explore/explore.png'),
        require('../asset/explore/tribe.png'),
        require('../asset/explore/PeopleGlobe.png'),
        require('../asset/explore/ExploreImage.png'),
        // Navigation Icons
        require('../asset/footer/navigation/meet.png'),
        require('../asset/footer/navigation/chat.png'),
        require('../asset/header/menu.png'),
        require('../asset/header/setting.png'),
        require('../asset/header/logo.png'),
        require('../asset/header/GMText.png'),
        // Banners
        require('../asset/banner/bronze.png'),
        require('../asset/banner/gold.png'),
        require('../asset/banner/green.png'),
        require('../asset/banner/silver.png'),
        // Tutorial
        require('../../assets/tutorial/RightArrow.png'),
        require('../../assets/tutorial/Replay.png'),
        require('../../assets/tutorial/logo.png'),
        // Chat
        require('../asset/utils/direct_message.png'),
        require('../asset/utils/profile_people.png'),
        require('../asset/utils/sendButton.png'),
    ])

    return Promise.all(imageAssetPromises).catch((err) => {
        new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.AUTH.ACTION, 'loadGeneralAssets')
            .send()
    })
}

/**
 * Utility function to return an array of promise for caching images
 * @param {*} images
 * @return an array of promises
 */
function cacheImages(images) {
    return images.map((image) => {
        if (typeof image === 'string') {
            return Image.prefetch(image)
        }

        return Asset.fromModule(image).downloadAsync()
    })
}

/**
 * Utility function to return an array of promise for caching fonts
 * @param {*} fonts
 * @return an array of promises
 */
function cacheFonts(fonts) {
    return [Font.loadAsync(fonts)]
}
