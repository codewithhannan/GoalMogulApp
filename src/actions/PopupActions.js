/** @format */

import { api as API } from '../redux/middleware/api'

import { POPUP_OPEN_POPUP } from './types'

const DEBUG_KEY = '[ Popup Action ]'

export const openPopup = (popupName = '') => async (dispatch, getState) => {
    const { token } = getState().user

    if (!popupName) {
        let res
        try {
            res = await API.get('secure/user/profile/getJourney', token)
            console.log('chamak jao', res)
        } catch (err) {
            console.log('error getting user journey info', err)
        }
        dispatch({
            type: POPUP_OPEN_POPUP,
            payload: {
                res,
            },
        })
    } else {
        dispatch({
            type: POPUP_OPEN_POPUP,
            payload: {
                popupName,
            },
        })
        const { popup: journeyObject } = getState()
        // console.log('\nThis is the journey obj', journeyObject)
        try {
            res = await API.post(
                'secure/user/profile/update-journey',
                { journeyObject },
                token
            )
        } catch (err) {
            console.log('error updating user journey info', err)
        }
    }
}
