/**
 * This file is created during implementation of GM V2. This is the central hub
 * for registration actions.
 *
 * TODO: migration all actions from /src/actions/RegistrationActions.js here
 *
 * @format
 */

import _ from 'lodash'
import * as Contacts from 'expo-contacts'
import {
    REGISTRATION_TEXT_CHANGE,
    REGISTRATION_USER_TARGETS,
    REGISTRATION_TRIBE_SELECT,
    REGISTRATION_TRIBE_FETCH,
    REGISTRATION_USER_INVITE,
    REGISTRATION_USER_INVITE_FAIL,
    REGISTRATION_USER_INVITE_DONE,
} from './RegistrationReducers'
import {
    REGISTRATION_ACCOUNT_LOADING,
    REGISTRATION_ADDPROFILE,
    REGISTRATION_ACCOUNT_SUCCESS,
    REGISTRATION_CONTACT_SYNC,
    REGISTRATION_CONTACT_SYNC_UPLOAD_DONE,
    REGISTRATION_CONTACT_SYNC_FETCH,
    REGISTRATION_CONTACT_SYNC_FETCH_DONE,
    REGISTRATION_ERROR,
    REGISTRATION_LOGIN,
    REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
} from '../../../actions/types'
import { DropDownHolder } from '../../../Main/Common/Modal/DropDownModal'
import { api as API } from '../../middleware/api'
import TokenService from '../../../services/token/TokenService'
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
import { CONTACT_SYNC_LOAD_CONTACT_DONE } from '../User/ContactSync/ContactSyncReducers'
import {
    updateFriendship,
    fetchAppUserProfile,
    updateTokenObject,
} from '../../../actions'
import { Logger } from '../../middleware/utils/Logger'
import LiveChatService from '../../../socketio/services/LiveChatService'
import MessageStorageService from '../../../services/chat/MessageStorageService'
import { auth as Auth } from '../auth/Auth'
import { is2xxRespose } from '../../middleware/utils'
import { Actions } from 'react-native-router-flux'
import { storeData } from '../../../store/storage'
import ReactMoE from 'react-native-moengage'
import { Platform } from 'react-native'

const DEBUG_KEY = '[ Action RegistrationActions ]'
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

    try {
        // trackWithProperties(E.REG_SURVEY_SELECTED, {
        //     NumOptionSelected: targets.filter((i) => i.selected).length,
        //     OtherSelected: targets.filter((i) => i.title === 'Other')[0]
        //         .selected,
        //     UserId: userId,
        // })

        const res = await API.post(
            'secure/user/survey/create',
            { contents },
            token
        )
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
    } catch (error) {
        console.log('this is error of upload survey', error.message)
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
export const registrationFetchTribes = () => async (dispatch, getState) => {
    dispatch({
        type: REGISTRATION_TRIBE_FETCH,
        payload: { loading: true },
    })

    const { token, userId } = getState().user

    let tribesFetched = []
    const res = await API.get('secure/tribe/goalmogul-tribes', token)
    if (res.status < 200 || res.status > 299) {
        new SentryRequestBuilder(res.message, SENTRY_MESSAGE_TYPE.message)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.REGISTRATION.ACTION, 'registrationFetchTribes')
            .withExtraContext(SENTRY_CONTEXT.REGISTRATION.USER_ID, userId)
            .send()
    } else {
        tribesFetched = res.data
    }

    dispatch({
        type: REGISTRATION_TRIBE_FETCH,
        payload: { loading: false, tribes: tribesFetched },
    })
}

/**
 * Upload selected tribes during onboarding
 */
export const uploadSelectedTribes = () => async (dispatch, getState) => {
    const { token, userId } = getState().user

    const tribes = getState().registration.tribes

    const tribeIds = tribes.filter((t) => t.selected).map((t) => t._id)
    const body = {
        tribeIds,
    }

    trackWithProperties(E.REG_TRIBE_SELECTED, {
        TribeIds: tribeIds,
    })

    const res = await API.post('secure/tribe/batch-join-tribes', body, token)
    if (res.status < 200 || res.status > 299) {
        console.log('update selected tribes: ', res)
        new SentryRequestBuilder(res.message, SENTRY_MESSAGE_TYPE.message)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.REGISTRATION.ACTION, 'uploadSelectedTribes')
            .withExtraContext(SENTRY_CONTEXT.REGISTRATION.USER_ID, userId)
            .send()
    } else {
        // TODO: analytics
        // console.log('update selected tribes: ', res)
    }
}

export const validatePhoneCode = async () => (dispatch) => {}

/**
 * Compose country code and phone number
 * @param {*} countryCode
 * @param {*} phone
 */
export const constructPhoneNumber = (countryCode, phone) => {
    if (!phone) {
        // TODO: add sentry log info
        return undefined
    }

    const callingCodeArr = _.get(countryCode, 'country.callingCode')
    if (!callingCodeArr || callingCodeArr.length == 0) {
        // TODO: add sentry log warning
        return phone
    }

    return callingCodeArr[0] + phone
}

/**
 * return to login page from registration and clear registration states
 */
export const cancelRegistration = () => (dispatch) => {
    dispatch({
        type: REGISTRATION_LOGIN,
    })
}

/**
 * Action triggered when user clicks on next step in RegistrationAccount.
 * 1. Massage data for the request format
 * 2. Hit endpoint /pub/user to register
 *
 * @param {Function} screenTransitionCallback required. When account registration succeeded.
 */
export const registerAccount = (onSuccess, dateToSend) => async (
    dispatch,
    getState
) => {
    const {
        name,
        password,
        email,
        countryCode,
        inviterCode,
        phone,
        gender,
        dateOfBirth,
    } = getState().registration

    const phoneNumber = constructPhoneNumber(countryCode, phone)
    const data = {
        name,
        password,
        email,
        phone: phoneNumber,
        gender: gender === 'Prefer not to say' ? undefined : gender,
        dateOfBirth: new Date(dateOfBirth),
        // dateOfBirth: dateToSend,
        inviterCode,
    }

    dispatch({
        type: REGISTRATION_ACCOUNT_LOADING,
    })

    let message = ''

    try {
        const res = await API.post('pub/user/', { ...data })

        if (res.status == 200) {
            ReactMoE.setUserUniqueID(email)
            ReactMoE.setUserName(name)
            ReactMoE.setUserEmailID(email)
            if (gender !== undefined) {
                ReactMoE.setUserGender(gender)
            }
            ReactMoE.setUserBirthday(dateOfBirth)
            track(E.REG_FIELDS_FILL)
            trackWithProperties(E.REG_UTM_SOURCE, { utm_source: 'affiliate' })
        }

        Logger.log(
            '[RegistrationActions] [registerAccount] registration response is: ',
            res,
            1
        )
        if (is2xxRespose(res.status)) {
            TokenService.mountUser(res.userId)
            await TokenService.populateAndPersistToken(
                res.token,
                res.refreshToken,
                false,
                res.userId,
                res.accountOnHold
            )

            // Save token for auto login
            await Auth.saveKey(
                email,
                password,
                JSON.stringify({
                    token: res.token,
                    userId: res.userId,
                    created: Date.now(),
                    accountOnHold: res.accountOnHold,
                })
            )

            // AuthReducers record user token
            const payload = {
                token: res.token,
                userId: res.userId,
                name,
            }

            // Mark loading status as false and setup Auth reducer
            // to mount main profile page.
            // This chain might need some refactoring
            dispatch({
                type: REGISTRATION_ACCOUNT_SUCCESS,
                payload: {
                    ...payload,
                    email,
                },
            })

            // Invoke screen transition callback for registration success

            if (onSuccess && res.accountOnHold) {
                Actions.replace('waitlist')
            } else if (onSuccess && !res.accountOnHold) {
                onSuccess()
            }

            // set up chat listeners
            LiveChatService.mountUser({
                userId: res.userId,
                authToken: res.token,
            })
            MessageStorageService.mountUser({
                userId: res.userId,
                authToken: res.token,
            })

            return
        } else {
            // fail to register account
            new SentryRequestBuilder(res.message, SENTRY_MESSAGE_TYPE.MESSAGE)
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(SENTRY_TAGS.REGISTRATION.ACTION, 'registerAccount')
                .withExtraContext(SENTRY_CONTEXT.REGISTRATION.EMAIL, email)
                .withExtraContext(
                    SENTRY_CONTEXT.REGISTRATION.PHONE_NUMBER,
                    phoneNumber
                )
                .send()
            message = res.message
        }
    } catch (err) {
        console.error(err)
        new SentryRequestBuilder(err, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.REGISTRATION.ACTION, 'registerAccount')
            .withExtraContext(SENTRY_CONTEXT.REGISTRATION.EMAIL, email)
            .withExtraContext(
                SENTRY_CONTEXT.REGISTRATION.PHONE_NUMBER,
                phoneNumber
            )
            .send()
        message = 'Failed to register account. Please try again later'
    }

    if (message) {
        dispatch({
            type: REGISTRATION_ERROR,
            payload: {
                error: message,
            },
        })
    }
}

/**
 * User added a photo and choose to upload the profile photo.
 * @param {*} maybeOnSuccess transition function after profile upload is done
 */
export const registrationAddProfilePhoto = (maybeOnSuccess) => async (
    dispatch,
    getState
) => {
    // Obtain pre-signed url
    const imageUri = getState().registration.profilePic
    const { userId, token } = getState().user

    if (imageUri) {
        await ImageUtils.getImageSize(imageUri)
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

        // trackWithProperties(E.REG_ADD_PHOTO_UPLOADED, {
        //     UserId: userId,
        // })
        // After profile image is uploaded, async refresh profile
        fetchAppUserProfile()(dispatch, getState)
    }
    if (maybeOnSuccess) {
        maybeOnSuccess()
    }
}

/**
 * Current user invites existing member after contact sync match
 * @param {String} userId UserId for current user to invite
 */
export const inviteExistingUser = (userId, maybeTrackingEventName) => async (
    dispatch,
    getState
) => {
    const currentUserId = getState().user && getState().user.userId
    if (maybeTrackingEventName) {
        trackWithProperties(maybeTrackingEventName, {
            UserId: currentUserId,
            InviteeId: userId,
        })
    }

    // Dispatch to update user status to loading indicator
    dispatch({
        type: REGISTRATION_USER_INVITE,
        payload: {
            userId,
        },
    })

    const onFinish = (err) => {
        if (err) {
            // TODO: registration: dropdown alert to indicate try again
            dispatch({
                type: REGISTRATION_USER_INVITE_FAIL,
                payload: {
                    userId,
                },
            })
            return
        }

        // Terminate loading indicator
        dispatch({
            type: REGISTRATION_USER_INVITE_DONE,
            payload: {
                userId,
            },
        })
    }

    // Send update friendship request
    updateFriendship(
        userId,
        undefined,
        'requestFriend',
        undefined,
        onFinish
    )(dispatch, getState)
}

/**
 * Upload contacts and fetch matched contacts
 * @param {*} param0
 */
export const uploadContacts = ({
    onMatchFound,
    onMatchNotFound,
    onError,
}) => async (dispatch, getState) => {
    const permission = await Contacts.requestPermissionsAsync()
    if (permission.status !== 'granted') {
        // Permission was denied and dispatch an action
        return
    }

    const { token, userId } = getState().user

    // Skip and limit for fetching matched contacts
    const { matchedContacts } = getState().registration

    // Show spinning bar
    dispatch({
        type: REGISTRATION_CONTACT_SYNC,
        payload: {
            uploading: true,
        },
    })

    try {
        // Dispatch actions to fill ContactSyncReducers
        // After contacts are loaded from the phone
        const loadContactCallback = (contacts) => {
            dispatch({
                type: CONTACT_SYNC_LOAD_CONTACT_DONE,
                payload: {
                    data: contacts,
                },
            })
        }

        // Upload contacts and store local contacts to ContactSyncReducers
        const uploadContactRes = await handleUploadContacts(
            token,
            loadContactCallback
        )

        const validResults = uploadContactRes.filter(
            (result) => !(result instanceof Error)
        )
        // As long as there are valid result, we deem it as successful
        if (!validResults || !validResults.length) {
            return onError('upload')
        }

        // uploadContactRes should either be success or throw exception
        console.log(`${DEBUG_KEY}: contact upload res is: `, uploadContactRes)

        // Fetching matched records. Show spinner
        dispatch({
            type: REGISTRATION_CONTACT_SYNC_FETCH,
            payload: {
                refreshing: true,
                loading: false,
            },
        })
    } catch (error) {
        if (onError) {
            return onError('upload')
        }
        new SentryRequestBuilder(error, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.REGISTRATION.ACTION, 'uploadContacts.upload')
            .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
            .send()
    }

    try {
        const matchedContactsRes = await fetchMatchedContacts(
            token,
            0,
            matchedContacts.limit
        )
        console.log(`${DEBUG_KEY}: matched contacts are`, matchedContactsRes)

        // User finish fetching
        dispatch({
            type: REGISTRATION_CONTACT_SYNC_FETCH_DONE,
            payload: {
                data: matchedContactsRes.data, // TODO: replaced with res
                skip: matchedContactsRes.data.length,
                limit: matchedContacts.limit,
                refreshing: true,
            },
        })

        if (matchedContactsRes.data.length && onMatchFound) {
            onMatchFound()
            return
        }

        if (!matchedContactsRes.data.length && onMatchNotFound) {
            onMatchNotFound()
            return
        }
    } catch (err) {
        console.warn(`${DEBUG_KEY}: uploadContacts failed`, err)
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

        // error happens when getting matches and directly go to invite user
        if (onMatchNotFound) {
            onMatchNotFound()
        }
        new SentryRequestBuilder(error, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(
                SENTRY_TAGS.REGISTRATION.ACTION,
                'uploadContacts.fetchMatchedContacts'
            )
            .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
            .send()
    }
}

/**
 * Mark user as onboarded. In V1, this means when user finishes registration + create goal tutorial.
 * In V2, we have moved the function from TutorialActions.js here.
 *
 * In V2, mark user as onboarded when user finishes all onboarding steps required without tutorial.
 */
export const markUserAsOnboarded = () => async (dispatch, getState) => {
    const { userId, token } = getState().user
    Logger.log(`${DEBUG_KEY}: [ markUserAsOnboarded ] for user: `, userId, 1)
    track(E.ONBOARDING_DONE)

    // Update onboarding status on SecureStore
    // This should be fired regardless of API call succeeds or not
    await updateTokenObject({ isOnboarded: true })

    // Fire request to update server user state
    try {
        const res = await API.put(
            'secure/user/account/mark-as-onboarded',
            {},
            token,
            1
        )
        if (res.status < 200 || res.status > 299) {
            // mark user as onboarded failed
            new SentryRequestBuilder(res.message, SENTRY_MESSAGE_TYPE.MESSAGE)
                .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
                .withTag(SENTRY_TAGS.REGISTRATION.ACTION, 'markUserAsOnboarded')
                .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
                .send()

            // TODO: integrate this error message in SentryRequestBuilder
            console.error(
                `${DEBUG_KEY}: markUserAsOnboarded failed: `,
                res.message
            )
            return
        }
    } catch (error) {
        new SentryRequestBuilder(error, SENTRY_MESSAGE_TYPE.ERROR)
            .withLevel(SENTRY_MESSAGE_LEVEL.ERROR)
            .withTag(SENTRY_TAGS.REGISTRATION.ACTION, 'markUserAsOnboarded')
            .withExtraContext(SENTRY_CONTEXT.USER.USER_ID, userId)
            .send()

        // TODO: integrate this error message in SentryRequestBuilder
        console.error(`${DEBUG_KEY}: markUserAsOnboarded failed: `, error)
        return
    }
}
