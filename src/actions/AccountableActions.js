/** @format */

import { DropDownHolder } from '../Main/Common/Modal/DropDownModal'
import { api as API } from '../redux/middleware/api'
const DEBUG_KEY = '[Accountability Actions ]'

const makeMessage = () =>
    'Your request for accountability has been sent successfully'

export const requestAccountability = (goalId, type) => {
    return async (dispatch, getState) => {
        const { token } = getState().auth.user
        try {
            const res = await API.post(
                'secure/accountability',
                { goalId },
                token
            )

            if (res.status === 200) {
                setTimeout(() => {
                    DropDownHolder.alert(
                        'success',
                        'Request sent!',
                        makeMessage()
                    )
                }, 500)
            }
        } catch (err) {
            setTimeout(() => {
                DropDownHolder.alert(
                    'error',
                    'Error',
                    "We're sorry that some error happened. Please try again later."
                )
            }, 500)
            console.log(
                `${DEBUG_KEY} This is error of sending accountability request`,
                err
            )
        }
    }
}
