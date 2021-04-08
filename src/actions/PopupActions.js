/** @format */

import { api as API } from '../redux/middleware/api'
import _ from 'lodash'
import moment from 'moment'

import { setPopupData, updatePopupData } from '../reducers/PopupReducers'

const DEBUG_KEY = '[ PopupActions ]'

export const getPopupData = () => async (dispatch, getState) => {
    console.log('\n getPopupData is called from PopupActions')
    const { token } = getState().user
    try {
        let data = await API.get('secure/user/profile/getJourney', token)
        dispatch(setPopupData({ data: data.result }))
    } catch (err) {
        console.log(`${DEBUG_KEY} Error while getting popup data:`, err)
    }
}

export const uploadPopupData = (popupName) => async (dispatch, getState) => {
    console.log('\n uploadPopupData is called from PopupActions')
    let data = _.cloneDeep(getState().popup)
    data[popupName].status = true
    data[popupName].created = moment().utc().format()
    dispatch(updatePopupData({ data }))
    const { user, popup: journeyObject } = getState()
    console.log('\nData updated ater dispatch:', journeyObject)
    try {
        await API.post(
            'secure/user/profile/update-journey',
            { journeyObject },
            user.token
        )
    } catch (err) {
        console.log(`${DEBUG_KEY} Error while updating popup data:`, err)
    }
}
