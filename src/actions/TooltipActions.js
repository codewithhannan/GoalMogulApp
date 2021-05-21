/** @format */

import { setTooltipStatus } from '../reducers/TooltipReducer'

const DEBUG_KEY = '[ TooltipActions ]'

export const setGoalProgressTooltip = () => async (dispatch, getState) => {
    let tooltip = getState().tooltip
    tooltip.goalProgressTooltip = false
    dispatch(setTooltipStatus({ tooltip }))
}
