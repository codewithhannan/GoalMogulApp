/** @format */

import _ from 'lodash'
import {
    REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
    REGISTRATION_ACCOUNT_SUCCESS,
    PROFILE_FETCHING_SUCCESS,
    PROFILE_UPDATE_SUCCESS,
    LOGIN_USER_SUCCESS,
    SETTING_EMAIL_UPDATE_SUCCESS,
    ACCOUNT_UPDATE_PASSWORD_DONE,
    ACCOUNT_UPDATE_PASSWORD,
    SETTING_INVITE_CODE_UPDATE_SUCCESS,
    SETTING_INVITE_CODE_UPDATE,
} from '../actions/types'

import {
    SETTING_UPDATE_NOTIFICATION_PREFERENCE,
    SETTING_UPDATE_NOTIFICATION_PREFERENCE_ERROR,
    SETTING_UPDATE_NOTIFICATION_PREFERENCE_SUCCESS,
} from '../redux/modules/User/Setting'

import { TUTORIAL_MARK_USER_ONBOARDED } from '../redux/modules/User/Tutorials'
import { PROFILE_BADGE_EARN_MODAL_SHOWN } from './Profile'

export const INITIAL_STATE = {
    userId: '',
    token: '',
    // Detail user info
    user: {
        profile: {
            image: undefined,
            badges: {
                milestoneBadge: {
                    currentMilestone: '',
                },
            },
        },
        email: {},
        chatNotificationPreferences: undefined,
    },
    profile: {},
    updatingPassword: false,
    updatingInviteCode: false,
    updateAccountSetting: false, // Boolean indicator for account setting is being updated
}

export const USER_LOAD_PROFILE_DONE = 'user_load_profile_done'
export const USER_LOG_OUT = 'user_log_out'
const DEBUG_KEY = '[ Reducer User ]'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PROFILE_UPDATE_SUCCESS:
        case PROFILE_FETCHING_SUCCESS: {
            let newState = _.cloneDeep(state)
            const { user } = action.payload
            if (user._id !== _.get(newState, 'userId')) {
                return newState
            }

            const oldUser = _.get(newState, 'user')
            const newUser = {
                ...oldUser,
                ...user,
            }
            return _.set(newState, 'user', newUser)
        }

        case SETTING_INVITE_CODE_UPDATE: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'updatingInviteCode', true)
            return newState
        }

        case SETTING_INVITE_CODE_UPDATE_SUCCESS: {
            let newState = _.cloneDeep(state)
            const { inviteCode } = action.payload
            // On updating invite code failed, this field is undefined
            if (inviteCode) {
                newState = _.set(newState, 'user.inviteCode', inviteCode)
            }
            console.log('invite to update is: ', inviteCode)
            newState = _.set(newState, 'updatingInviteCode', false)
            return newState
        }

        case PROFILE_BADGE_EARN_MODAL_SHOWN: {
            let newState = _.cloneDeep(state)
            const { userId } = action.payload

            if (userId !== _.get(newState, 'userId')) {
                return newState
            }

            newState = _.set(
                newState,
                `user.profile.badges.milestoneBadge.isAwardAlertShown`,
                true
            )
            return newState
        }

        // TODO: verify if this behavior is necessary
        case SETTING_EMAIL_UPDATE_SUCCESS:
            return { ...state, email: action.payload.email }

        case LOGIN_USER_SUCCESS:
        case REGISTRATION_ACCOUNT_SUCCESS: {
            const { userId, token } = action.payload
            return { ...state, token, userId }
        }

        case REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS: {
            const profile = _.cloneDeep(state.profile)
            profile.imageObjectId = action.payload
            return { ...state, profile }
        }

        case USER_LOAD_PROFILE_DONE: {
            const { user } = action.payload
            let newState = _.cloneDeep(state)
            return _.set(newState, 'user', { ...user })
        }

        case USER_LOG_OUT: {
            return { ...INITIAL_STATE }
        }

        case ACCOUNT_UPDATE_PASSWORD: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'updatingPassword', true)
        }

        case ACCOUNT_UPDATE_PASSWORD_DONE: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'updatingPassword', false)
        }

        // User setting update
        case SETTING_UPDATE_NOTIFICATION_PREFERENCE: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'updateAccountSetting', true)
            return newState
        }

        case SETTING_UPDATE_NOTIFICATION_PREFERENCE_ERROR: {
            let newState = _.cloneDeep(state)
            newState = _.set(newState, 'updateAccountSetting', false)
            return newState
        }

        case SETTING_UPDATE_NOTIFICATION_PREFERENCE_SUCCESS: {
            let newState = _.cloneDeep(state)
            const { notificationPreferences } = action.payload
            newState = _.set(
                newState,
                'user.notificationPreferences',
                notificationPreferences
            )
            newState = _.set(newState, 'updateAccountSetting', false)
            return newState
        }

        case TUTORIAL_MARK_USER_ONBOARDED: {
            const { userId } = action.payload
            let newState = _.cloneDeep(state)
            if (newState.userId !== userId) {
                console.warn(`${DEBUG_KEY}: [ ${action.type} ]: not updating current user. 
          Current user: ${newState.user.userId}, user updated: ${userId}`)
                return newState
            }

            newState = _.set(newState, 'user.isOnBoarded', true)
            return newState
        }

        default:
            return { ...state }
    }
}
