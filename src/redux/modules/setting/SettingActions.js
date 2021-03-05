/** @format */

import { SETTING_SWITCH_TAB } from '../../../reducers/Setting'

export const settingSwitchTab = (index) => (dispatch) => {
    dispatch({
        type: SETTING_SWITCH_TAB,
        payload: {
            index,
        },
    })
}
