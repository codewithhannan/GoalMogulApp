/** @format */

import _ from 'lodash'
import { CHALLENGES_OPEN_CHALLENGES } from '../actions/types'

const INITIAL_STATE = []
const DEBUG_KEY = '[ Reducer Challenges ]'
/*
  TODO:
  1. populate initial set on profile fetch successfully
*/
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHALLENGES_OPEN_CHALLENGES: {
            return { ...state }
        }

        default:
            return { ...state }
    }
}
