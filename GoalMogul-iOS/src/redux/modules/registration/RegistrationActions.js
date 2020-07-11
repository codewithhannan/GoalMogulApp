/**
 * This file is created during implementation of GM V2. This is the central hub
 * for registration actions.
 *
 * TODO: migration all actions from /src/actions/RegistrationActions.js here
 *
 * @format
 */

import _ from 'lodash'
import * as Permissions from 'expo-permissions'
import {
    REGISTRATION_TEXT_CHANGE,
    REGISTRATION_USER_TARGETS,
    REGISTRATION_TRIBE_SELECT,
    REGISTRATION_TRIBE_FETCH,
} from './RegistrationReducers'
import {
    REGISTRATION_ACCOUNT_LOADING,
    REGISTRATION_ADDPROFILE,
    REGISTRATION_ACCOUNT_SUCCESS,
} from '../../../actions/types'
import { DropDownHolder } from '../../../Main/Common/Modal/DropDownModal'
import { api as API } from '../../middleware/api'
import {
    track,
    EVENT as E,
    trackWithProperties,
} from '../../../monitoring/segment'
import ImageUtils from '../../../Utils/ImageUtils'
import {
    handleUploadContacts,
    fetchMatchedContacts,
} from '../../../Utils/ContactUtils'
import { SentryRequestBuilder } from '../../../monitoring/sentry'
import {
    SENTRY_MESSAGE_TYPE,
    SENTRY_MESSAGE_LEVEL,
    SENTRY_TAGS,
    SENTRY_CONTEXT,
} from '../../../monitoring/sentry/Constants'

/**
 * Alter the state of registration text input
 * @param {String} type one of [name, email, phone, password]
 * @param {String} value
 */
export const registrationTextInputChange = (type, value) => (
    dispatch,
    getState
) => {
    dispatch({
        type: REGISTRATION_TEXT_CHANGE,
        payload: {
            value,
            type,
        },
    })
}

/**
 * User updates the selection on the targets for using GoalMogul
 *
 * @param {String} title one of titles in REGISTRATION_USER_TARGETS
 * @param {Boolean} value indicate if a target is selected or not
 */
export const registrationTargetSelection = (title, value, extra) => (
    dispatch,
    getState
) => {
    dispatch({
        type: REGISTRATION_USER_TARGETS,
        payload: {
            title,
            value,
            extra,
        },
    })
}

/**
 * Upload user survey on their motivation
 */
export const uploadSurvey = () => async (dispatch, getState) => {
    const { token, userId } = getState().user
    const targets = getState().registration.userTargets
    const contents = getSurveyFromTargets(targets)

    const res = await API.post('secure/user/survey/create', { contents }, token)
    if (res.status >= 300 || res.status < 200) {
        // Failed to create survey for this user
        new SentryRequestBuilder(res.message, SENTRY_MESSAGE_TYPE.message)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.REGISTRATION.ACTION, 'uploadSurvey')
            .withExtraContext(SENTRY_CONTEXT.REGISTRATION.USER_ID, userId)
            .send()
    } else {
        // TODO: analytics
    }
}

/**
 * transform targets to server format. Titles are defined in RegistrationReducers.
 * @param {Array} targets Array [{ title: '', selected: boolean, extra: '' }]
 */
const getSurveyFromTargets = (targets) => {
    return targets.map((i) => {
        if (i.title === 'Other') {
            return {
                question: i.title,
                answer: i.extra,
            }
        }
        return {
            question: i.title,
            answer: i.selected,
        }
    })
}

/**
 * User selects a tribe and update the reducer
 * @param {String} _id tribeId
 * @param {Boolean} selected {@code true} if this tribe with _id is selected
 */
export const registrationTribeSelection = (_id, selected) => (dispatch) => {
    dispatch({
        type: REGISTRATION_TRIBE_SELECT,
        payload: { _id, selected },
    })
}

/**
 * Fetch tribes for user to select during onboarding flow
 */
export const registrationFetchTribes = () => (dispatch, getState) => {
    dispatch({
        type: REGISTRATION_TRIBE_FETCH,
        payload: { tribes: [], status: 'done' },
    })
}

export const validatePhoneCode = async () => (dispatch) => {}

/**
 * Compose country code and phone number
 * @param {*} countryCode
 * @param {*} phone
 */
const phoneNumber = (countryCode, phone) => {
    if (!phone) {
        // TODO: add sentry log info
        return undefined
    }

    const callingCodeArr = _.get(countryCode, 'country.callingCode')
    if (!callingCodeArr || callingCodeArr.length() == 0) {
        // TODO: add sentry log warning
        return phone
    }

    return callingCodeArr[0] + phone
}

/**
 * Action triggered when user clicks on next step in RegistrationAccount.
 * 1. Massage data for the request format
 * 2. Hit endpoint /pub/user to register
 *
 * @param {Function} screenTransitionCallback required. When account registration succeeded.
 */
export const registerAccount = (onSuccess) => async (dispatch, getState) => {
    const {
        name,
        password,
        email,
        countryCode,
        phone,
    } = getState().registration

    // TODO: phone might not exist

    // const data = validateEmail(email) ?
    // {
    //   name, email, password, phoneNumber
    // } :
    // {
    //   name, phone: email, password
    // };
    const data = {
        name,
        password,
        email,
        phone: phoneNumber(countryCode, phone),
    }

    dispatch({
        type: REGISTRATION_ACCOUNT_LOADING,
    })

    const message = await API.post('pub/user/', { ...data }) // use default log level
        .then((res) => {
            if (res.message) {
                return res.message
            }
            dispatch({
                type: REGISTRATION_ADDPROFILE,
            })
            // AuthReducers record user token
            const payload = {
                token: res.token,
                userId: res.userId,
                name,
            }
            dispatch({
                type: REGISTRATION_ACCOUNT_SUCCESS,
                payload,
            })

            // Invoke screen transition callback for registration success
            if (onSuccess) {
                onSuccess()
            }

            trackWithProperties(E.REG_ACCOUNT_CREATED, {
                UserId: res.userId,
            })

            // set up chat listeners
            LiveChatService.mountUser({
                userId: res.userId,
                authToken: res.token,
            })
            MessageStorageService.mountUser({
                userId: res.userId,
                authToken: res.token,
            })
            // Actions.reset('auth');
        })
        .catch((err) => {
            // TODO: add sentry log error
            console.log(err)
        })

    if (message) {
        dispatch({
            type: REGISTRATION_ERROR,
            error: message,
        })
    }
}

/**
 * User added a photo and choose to upload the profile photo.
 * @param {*} maybeOnSuccess transition function after profile upload is done
 */
export const registrationAddProfilePhoto = (maybeOnSuccess) => (
    dispatch,
    getState
) => {
    // Obtain pre-signed url
    const imageUri = getState().registration.profilePic
    const token = getState().user.token

    if (imageUri) {
        ImageUtils.getImageSize(imageUri)
            .then(({ width, height }) => {
                // Resize image
                console.log('width, height are: ', width, height)
                return ImageUtils.resizeImage(imageUri, width, height)
            })
            .then((image) => {
                // Upload image to S3 server
                console.log('image to upload is: ', image)
                return ImageUtils.getPresignedUrl(
                    image.uri,
                    token,
                    (objectKey) => {
                        dispatch({
                            type: REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
                            payload: objectKey,
                        })
                    }
                )
            })
            .then(({ signedRequest, file }) => {
                return ImageUtils.uploadImage(file, signedRequest)
            })
            .then((res) => {
                if (res instanceof Error) {
                    // uploading to s3 failed
                    console.log('error uploading image to s3 with res: ', res)
                    throw res
                }
                return getState().user.profile.imageObjectId
            })
            .then((image) => {
                // Update profile imageId to the latest uploaded one
                return API.put(
                    'secure/user/profile',
                    {
                        image,
                    },
                    token
                )
                    .then((res) => {
                        console.log('update profile picture Id with res: ', res)
                    })
                    .catch((err) => {
                        console.log('error updating record: ', err)
                    })
            })
            .catch((err) => {
                // TODO: error handling for different kinds of errors.
                /*
                    Error Type:
                    image getSize
                    image Resize
                    image upload to S3
                    update profile image Id
                */
                console.log('profile picture error: ', err)
            })
    }
    if (maybeOnSuccess) {
        maybeOnSuccess()
    }
}

export const uploadContacts = () => async (dispatch, getState) => {
    const permission = await Permissions.askAsync(Permissions.CONTACTS)
    if (permission.status !== 'granted') {
        // Permission was denied and dispatch an action
        return
    }
    const { token } = getState().user
    // Skip and limit for fetching matched contacts
    const { matchedContacts } = getState().registration

    // Show spinning bar
    dispatch({
        type: REGISTRATION_CONTACT_SYNC,
        payload: {
            uploading: true,
        },
    })

    handleUploadContacts(token)
        .then((res) => {
            console.log(' response is: ', res)
            // Uploading contacts done. Hide spinner
            dispatch({
                type: REGISTRATION_CONTACT_SYNC_UPLOAD_DONE,
                payload: {
                    uploading: false,
                },
            })

            // Fetching matched records. Show spinner
            dispatch({
                type: REGISTRATION_CONTACT_SYNC_FETCH,
                payload: {
                    refreshing: true,
                    loading: false,
                },
            })

            /* TODO: load matched contacts */
            return fetchMatchedContacts(token, 0, matchedContacts.limit)
        })
        .then((res) => {
            console.log('matched contacts are: ', res)
            if (res.data) {
                // User finish fetching
                dispatch({
                    type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
                    payload: {
                        data: res.data, // TODO: replaced with res
                        skip: res.data.length,
                        limit: matchedContacts.limit,
                        refreshing: true,
                    },
                })
                return
            }
            // TODO: error handling for fail to fetch contact cards
            // TODO: show toast for user to refresh

            console.warn(
                `${DEBUG_KEY}: failed to fetch contact cards with res:`,
                res
            )
            dispatch({
                type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
                payload: {
                    data: [], // TODO: replaced with res
                    skip: 0,
                    limit: matchedContacts.limit,
                    refreshing: true,
                },
            })
        })
        .catch((err) => {
            console.warn('[ Action ContactSync Fail ]: ', err)
            console.log('error is:', err)
            // Error handling to clear both uploading and refreshing status
            dispatch({
                type: REGISTRATION_CONTACT_SYNC_UPLOAD_DONE,
                payload: {
                    uploading: false,
                },
            })

            dispatch({
                type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
                payload: {
                    data: [], // TODO: replaced with res
                    skip: 0,
                    limit: matchedContacts.limit,
                    refreshing: true,
                },
            })
            DropDownHolder.alert(
                'error',
                'Error',
                "We're sorry that some error happened. Please try again later."
            )
        })
}
