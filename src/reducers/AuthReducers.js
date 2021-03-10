/** @format */

import { REHYDRATE } from 'redux-persist'
import _ from 'lodash'
import {
    USERNAME_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER_LOADING,
    REGISTRATION_ACCOUNT,
    REGISTRATION_ACCOUNT_SUCCESS,
} from '../actions/types'
import { USER_LOG_OUT } from './User'

const INITIAL_STATE = {
    username: '',
    password: '',
    error: '',
    loading: false,
    splashScreen: true,
}

export const SPLASHSCREEN_HIDE = 'splash_screen_hide'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USERNAME_CHANGED:
            return { ...state, username: action.payload }
        case PASSWORD_CHANGED:
            return { ...state, password: action.payload }
        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                ...INITIAL_STATE,
                user: action.payload,
            }
        case LOGIN_USER_FAIL:
            //TODO: alter error message
            return {
                ...state,
                error: action.payload,
                password: '',
                loading: false,
            }

        case LOGIN_USER_LOADING:
            return { ...state, error: '', loading: true }

        case REGISTRATION_ACCOUNT:
            return { ...state, ...INITIAL_STATE, registration: true }

        case REGISTRATION_ACCOUNT_SUCCESS: {
            return {
                ...state,
                user: action.payload,
            }
        }

        case USER_LOG_OUT: {
            return { ...INITIAL_STATE }
        }

        case SPLASHSCREEN_HIDE: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'splashScreen', false)
        }

        default:
            return { ...state }
    }
}
