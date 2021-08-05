/** @format */

import { Actions } from 'react-native-router-flux'
import { trackWithProperties, EVENT as E } from '../../../monitoring/segment'
import { api as API } from '../../middleware/api'

const DEBUG_KEY = 'PHONE_VERIFY'

export const phoneNumberSent = (value, onError) => {
    return async (dispatch, getState) => {
        const token = getState().user.token

        try {
            const res = await API.post(
                'secure/user/account/verification',

                {
                    for: 'phone',
                    phone: value,
                },
                token
            )

            const response = res
            console.log(
                `${DEBUG_KEY} This is the response of sending phone number`,
                response
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of sending phone number`,
                err
            )
            onError()
        }
    }
}

export const phoneNumberVerify = (value, onError) => {
    return async (dispatch, getState) => {
        try {
            const res = await API.post(
                'pub/user/verification',

                {
                    for: 'phone',
                    code: value,
                }
            )
            const response = res
            if (res.success == true) {
                Actions.push('registration_add_photo')
                trackWithProperties(E.REG_MOBILE_VERIFICATION_SUBMIT, {
                    result: 'success',
                })
            } else if (res.status == 400) {
                trackWithProperties(E.REG_MOBILE_VERIFICATION_SUBMIT, {
                    result: 'failure',
                })
                onError()
            }

            console.log(
                `${DEBUG_KEY} This is the response of verifying phone number`,
                response
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of verifying phone number`,
                err
            )
        }
    }
}
