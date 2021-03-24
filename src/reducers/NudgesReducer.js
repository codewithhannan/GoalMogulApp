/** @format */

import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {}

const slice = createSlice({
    name: 'nudges',
    INITIAL_STATE,
    reducers: {
        getNudgesData: (state, action) => {
            state.nudges = action.payload
        },
        updateNudgesData: (state, action) => {
            state.nudges = action.payload
        },
    },
})

export default slice.reducer
export const { getNudgesData, updateNudgesData } = slice.actions
