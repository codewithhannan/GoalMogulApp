/** @format */

import { setTooltipStatus } from '../reducers/TooltipReducer'

const DEBUG_KEY = '[ TooltipActions ]'

export const setProgressTooltip = (type) => async (dispatch, getState) => {
    switch (type) {
        case 'goal':
            let goalTooltip = getState().tooltip
            goalTooltip.goalProgressTooltip = false
            return dispatch(setTooltipStatus({ goalTooltip }))

        case 'swiper':
            let swiperTooltip = getState().tooltip
            swiperTooltip.swipeToolTipStatus = false
            return dispatch(setTooltipStatus({ swiperTooltip }))

        case 'goalDetail':
            let swiperDetail = getState().tooltip
            swiperDetail.profileGoalDetail = false
            return dispatch(setTooltipStatus({ swiperDetail }))

        default:
            return null
    }
}
