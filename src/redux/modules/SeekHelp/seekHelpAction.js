/** @format */

// Actions to create a new tribe
import { Actions } from 'react-native-router-flux'
import { Alert } from 'react-native'
import { api as API } from '../../middleware/api'
import ImageUtils from '../../../Utils/ImageUtils'

import { GET_HELP_FROM } from './seekHelpReducers'

const BASE_ROUTE = 'secure/tribe'
const DEBUG_KEY = '[ Action Create Tribe ]'

// Open creating tribe modal
export const setSelected = (data) => (dispatch) => {
    console.log(data)
    // Actions.push('createTribeStack')
    dispatch({
        type: GET_HELP_FROM,
        paylaod: data,
    })
}

// export const cancelCreatingNewTribe = () => (dispatch) => {
//     Actions.pop()
//     dispatch({
//         type: TRIBE_NEW_CANCEL,
//     })
// }
