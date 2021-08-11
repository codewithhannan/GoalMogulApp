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
                }, 1000)
            }

            console.log(
                `${DEBUG_KEY} This is the response of sending accountability request`,
                res
            )
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is error of sending accountability request`,
                err
            )
        }
    }
}
