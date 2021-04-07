/** @format */

import _ from 'lodash'
import {
    REGISTRATION_ERROR,
    REGISTRATION_BACK,
    REGISTRATION_ACCOUNT,
    REGISTRATION_ACCOUNT_LOADING,
    REGISTRATION_ACCOUNT_SUCCESS,
    REGISTRATION_LOGIN,
    REGISTRATION_ADDPROFILE,
    REGISTRATION_INTRO,
    REGISTRATION_INTRO_SKIP,
    REGISTRATION_CONTACT,
    REGISTRATION_CONTACT_SKIP,
    REGISTRATION_CONTACT_SYNC,
    REGISTRATION_CONTACT_SYNC_DONE,
    REGISTRATION_CONTACT_SYNC_FETCH,
    REGISTRATION_CONTACT_SYNC_FETCH_DONE,
    REGISTRATION_CONTACT_SYNC_UPLOAD_DONE,
    REGISTRATION_CONTACT_SYNC_SKIP,
    REGISTRATION_CONTACT_SYNC_REFRESH,
    REGISTRATION_CONTACT_SYNC_REFRESH_DONE,
    REGISTRATION_ACCOUNT_FORM_CHANGE,
    REGISTRATION_INTRO_FORM_CHANGE,
    REGISTRATION_ADDPROFILE_CAMERAROLL_OPEN,
    REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
    REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
} from '../actions/types'
import { USER_LOG_OUT } from './User'
import {
    REGISTRATION_TEXT_CHANGE,
    REGISTRATION_USER_TARGETS,
    REGISTRATION_DEFAULT_TRIBES,
    REGISTRATION_TRIBE_FETCH,
    REGISTRATION_TRIBE_SELECT,
    REGISTRATION_COMMUNITY_GUIDELINE,
    REGISTRATION_USER_INVITE,
    REGISTRATION_USER_INVITE_DONE,
    REGISTRATION_USER_INVITE_FAIL,
} from '../redux/modules/registration/RegistrationReducers'

export function arrayUnique(array) {
    let a = array.concat()
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i]._id === a[j]._id) {
                a.splice(j--, 1)
            }
        }
    }

    return a
}

const INITIAL_STATE = {
    name: '',
    email: '',
    password: '',
    headline: '',
    inviterCode: '',
    countryCode: {
        cca2: 'US',
        country: {
            callingCode: ['1'],
            cca2: 'US',
            currency: ['USD'],
            flag: 'flag-us',
            name: 'United States',
            region: 'Americas',
            subregion: 'North America',
        },
    }, // country code for phone number
    phone: '',
    registerErrMsg: '', // registration top error message
    userTargets: [...REGISTRATION_USER_TARGETS],
    tribes: [],
    // Below are fake tribes when network is not available
    // tribes: [...REGISTRATION_DEFAULT_TRIBES],
    tribeLoading: false,
    communityGuidelines: [...REGISTRATION_COMMUNITY_GUIDELINE],
    matchedContacts: {
        data: [],
        limit: 30,
        skip: 0,
        refreshing: false,
        loading: false,
        hasNextPage: undefined,
        uploading: false,
    },
    profilePic: null,
    profileObjectId: null,
    step: '',
    error: {},
    errorMessage: '',
    uploading: false, // flag for uploading user contacts, no longer being used after v0.4.8
    fetching: false, // flag for fetching matched contacts, no longer being used after v0.4.8
    loading: false, // Register account loading. Disable account input when loading, no longer being used after v0.4.8
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // Contact sync match found, user sent out invite
        case REGISTRATION_USER_INVITE: {
            const { userId } = action.payload
            let newState = _.cloneDeep(state)

            let matchedContactData = _.get(newState, 'matchedContacts.data')
            matchedContactData = matchedContactData.map((userDoc) => {
                if (_.isEqual(userDoc._id, userId)) {
                    // set user doc inviting field to true
                    return _.set(userDoc, 'inviting', true)
                }
                return userDoc
            })

            newState = _.set(
                newState,
                'matchedContacts.data',
                matchedContactData
            )
            return newState
        }

        case REGISTRATION_USER_INVITE_DONE: {
            const { userId } = action.payload
            let newState = _.cloneDeep(state)

            let matchedContactData = _.get(newState, 'matchedContacts.data')
            matchedContactData = matchedContactData.map((userDoc) => {
                if (_.isEqual(userDoc._id, userId)) {
                    let newUserDoc
                    // set user doc inviting field to true
                    newUserDoc = _.set(userDoc, 'inviting', false)
                    newUserDoc = _.set(userDoc, 'invited', true)
                    return newUserDoc
                }
                return userDoc
            })

            newState = _.set(
                newState,
                'matchedContacts.data',
                matchedContactData
            )
            return newState
        }

        case REGISTRATION_USER_INVITE_FAIL: {
            const { userId } = action.payload
            let newState = _.cloneDeep(state)

            let matchedContactData = _.get(newState, 'matchedContacts.data')
            matchedContactData = matchedContactData.map((userDoc) => {
                if (_.isEqual(userDoc._id, userId)) {
                    // set user doc inviting field to false
                    return _.set(userDoc, 'inviting', false)
                }
                return userDoc
            })

            newState = _.set(
                newState,
                'matchedContacts.data',
                matchedContactData
            )
            return newState
        }

        case REGISTRATION_TEXT_CHANGE: {
            const { type, value } = action.payload
            let newState = _.cloneDeep(state)

            // Update the text field for a type
            newState = _.set(newState, `${type}`, value)
            return newState
        }

        case REGISTRATION_USER_TARGETS: {
            const { title, value, extra } = action.payload
            let newState = _.cloneDeep(state)

            let targets = _.get(newState, 'userTargets')
            targets.forEach((v) => {
                if (v.title == title) {
                    v.selected = value
                    v.extra = extra
                }
                return v
            })
            // Update the selection
            newState = _.set(newState, 'userTargets', targets)
            return newState
        }

        case REGISTRATION_TRIBE_FETCH: {
            const { tribes, loading } = action.payload
            let newState = _.cloneDeep(state)

            if (loading) {
                // Set tribe loading to true
                newState = _.set(newState, 'tribeLoading', true)
                return newState
            }

            newState = _.set(newState, 'tribes', tribes)
            newState = _.set(newState, 'tribeLoading', false)
            return newState
        }

        case REGISTRATION_TRIBE_SELECT: {
            const { _id, selected } = action.payload
            let newState = _.cloneDeep(state)
            let tribes = _.get(newState, 'tribes')
            tribes.forEach((t) => {
                if (t._id == _id) {
                    t.selected = selected
                }
            })

            newState = _.set(newState, 'tribes', tribes)
            return newState
        }

        case REGISTRATION_ERROR: {
            const { error } = action.payload
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'loading', false)
            newState = _.set(newState, 'registerErrMsg', error)

            return newState
        }

        // User pressed back button on nav bar
        case REGISTRATION_BACK:
            return { ...state }

        // User pressed login button
        case REGISTRATION_LOGIN:
            return { ...state, ...INITIAL_STATE }

        case REGISTRATION_ACCOUNT:
            return { ...state, step: REGISTRATION_ACCOUNT }

        case REGISTRATION_ACCOUNT_LOADING:
            return { ...state, loading: true }

        case REGISTRATION_ACCOUNT_SUCCESS: {
            const { name } = action.payload
            return { ...state, loading: false, name }
        }

        // Registration account form change
        case REGISTRATION_ACCOUNT_FORM_CHANGE:
            return {
                ...state,
                [action.payload.prop]: action.payload.value,
                error: {},
                errorMessage: '',
            }

        case REGISTRATION_INTRO_FORM_CHANGE:
            return {
                ...state,
                headline: action.payload,
                error: {},
                errorMessage: '',
            }

        // User go to adding profile picture part
        case REGISTRATION_ADDPROFILE:
            return { ...state, step: REGISTRATION_ADDPROFILE }

        case REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS:
            return { ...state, profileObjectId: action.payload }

        case REGISTRATION_ADDPROFILE_CAMERAROLL_OPEN:
            return { ...state, cameraRollModalOpen: true }

        case REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE:
            return { ...state, profilePic: action.payload }

        case REGISTRATION_INTRO:
            return { ...state, step: REGISTRATION_INTRO }

        // User skipped profile picture section
        case REGISTRATION_INTRO_SKIP:
            return { ...state, profilePic: null }

        case REGISTRATION_CONTACT:
            return { ...state, step: REGISTRATION_CONTACT }

        case REGISTRATION_CONTACT_SKIP:
            return { ...state, headline: '' }

        // User starts to upload contacts
        case REGISTRATION_CONTACT_SYNC: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'step', REGISTRATION_CONTACT_SYNC)
            newState = _.set(newState, 'uploading', true)
            newState = _.set(newState, 'matchedContacts.uploading', true) // New standardized way for uploading flag
            return newState
        }

        // Contacts upload done
        case REGISTRATION_CONTACT_SYNC_UPLOAD_DONE: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'uploading', false)
            newState = _.set(newState, 'matchedContacts.uploading', false) // New standardized way for uploading flag
            return newState
        }

        case REGISTRATION_CONTACT_SYNC_FETCH: {
            const { refreshing, loading } = action.payload
            let newState = _.cloneDeep(state)
            // For refreshing, loading will be undefined which is fine and vice versa
            newState = _.set(newState, 'matchedContacts.refreshing', refreshing) // New standardized way for uploading flag
            newState = _.set(newState, 'matchedContacts.loading', loading) // New standardized way for uploading flag

            newState = _.set(newState, 'fetching', true)
            return newState
        }

        // Contacts fetching done
        case REGISTRATION_CONTACT_SYNC_FETCH_DONE: {
            const {
                data,
                skip,
                hasNextPage,
                refreshing,
                loading,
            } = action.payload

            let newState = _.cloneDeep(state)
            if (refreshing) {
                newState = _.set(newState, 'matchedContacts.refreshing', false) // New standardized way for uploading flag
            }
            if (loading) {
                newState = _.set(newState, 'matchedContacts.loading', false) // New standardized way for uploading flag
            }
            newState = _.set(newState, 'matchedContacts.skip', skip)
            newState = _.set(
                newState,
                'matchedContacts.hasNextPage',
                hasNextPage
            )
            newState = _.set(newState, 'fetching', false)

            // Set new data based on fetch type
            let newData = []
            if (refreshing) {
                newData = data
            }

            if (loading) {
                const oldData = _.get(newState, 'matchedContacts.data')
                newData = arrayUnique(oldData.concat(data))
            }
            newState = _.set(newState, 'matchedContacts.data', newData)

            // const newMatchedContacts = { ...state.matchedContacts };
            // newMatchedContacts.data = arrayUnique(newMatchedContacts.data.concat(data));
            // newMatchedContacts.skip = skip;
            // newMatchedContacts.refreshing = false;
            // newMatchedContacts.hasNextPage = hasNextPage;
            // console.log('contact sync fetch done.');
            // return { ...state, fetching: false, matchedContacts: newMatchedContacts };
            return newState
        }

        // Refresh contact sync
        case REGISTRATION_CONTACT_SYNC_REFRESH: {
            // const newMatchedContacts = { ...state.matchedContacts };
            // newMatchedContacts.refreshing = true;
            // return { ...state, fetching: true, matchedContacts: newMatchedContacts };

            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'matchedContacts.refreshing', true) // New standardized way for uploading flag
            newState = _.set(newState, 'fetching', true)
            return newState
        }

        // Refresh contact sync cards done
        case REGISTRATION_CONTACT_SYNC_REFRESH_DONE: {
            const { skip, data } = action.payload
            let newState = _.cloneDeep(state)

            newState = _.set(newState, 'matchedContacts.data', data)
            newState = _.set(newState, 'matchedContacts.refreshing', false)
            newState = _.set(newState, 'matchedContacts.skip', skip)
            newState = _.set(newState, 'fetching', false)

            return newState
        }

        case REGISTRATION_CONTACT_SYNC_DONE:
            return { ...state }

        case REGISTRATION_CONTACT_SYNC_SKIP:
            return { ...state }

        case USER_LOG_OUT: {
            return { ...state, ...INITIAL_STATE }
        }

        default:
            return { ...state }
    }
}
