/** @format */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    goalProgressTooltip: true,
}

const slice = createSlice({
    name: 'tooltip',
    initialState,
    reducers: {
        setTooltipStatus: (state, action) => {
            state = action.payload.data
            return state
        },
    },
})

export default slice.reducer
export const { setTooltipStatus } = slice.actions
