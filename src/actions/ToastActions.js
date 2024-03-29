/** @format */

import { postRequest, getRequest } from '../store/services'
import { api as API } from '../redux/middleware/api'

import {
    getToastData,
    loadToastData,
    resetToastData,
} from '../reducers/ToastReducers'
import { Actions } from 'react-native-router-flux'

const DEBUG_KEY = '[ ToastActions ]'

export const getToastsData = (refresh) => {
    return async (dispatch, getState) => {
        const { token } = getState().user

        try {
            dispatch(loadToastData())

            const res = await API.get(
                'secure/user/profile/toasts-to-show',
                token
            )

            const response = res.result

            dispatch(getToastData(response))

            console.log(
                `${DEBUG_KEY} This is the response of toasts data`,
                response
            )
        } catch (err) {
            console.log(`${DEBUG_KEY} This is the error of toast data`, err)
        }
    }
}
