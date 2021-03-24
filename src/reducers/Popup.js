/** @format */

import _ from 'lodash'
import { POPUP_OPEN_POPUP } from '../actions/types'

const INITIAL_STATE = {
    SILVER_BADGE: {
        status: false,
        created: '',
    },
    GOLD_BADGE: {
        status: false,
        created: '',
    },
    BRONZE_BADGE: {
        status: false,
        created: '',
    },
    GREEN_BADGE: {
        status: false,
        created: '',
    },
    FIRST_GOAL: {
        status: false,
        created: '',
    },
    SEVEN_GOALS: {
        status: false,
        created: '',
    },
    STREAK: {
        status: false,
        created: '',
    },
    STREAK_MISSED: {
        status: false,
        created: '',
    },
}
const DEBUG_KEY = '[ Reducer Popup ]'
/*
  TODO:
  1. populate initial set on profile fetch successfully
*/
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case POPUP_OPEN_POPUP: {
            const { res, popupName } = action.payload
            if (popupName) {
                let newState = _.cloneDeep(state)
                _.set(newState, `${popupName}.created`, Date.now())
                return _.set(newState, `${popupName}.status`, true)
            } else {
                let newState = _.cloneDeep(res.result)
                return { ...newState }
            }
        }

        default:
            return { ...state }
    }
}
