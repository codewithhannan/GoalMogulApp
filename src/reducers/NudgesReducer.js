/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    loading: false,
    nudgesData: [],
    error: '',
}

const slice = createSlice({
    name: 'nudges',
    initialState,
    reducers: {
        loadNudgesData: (state, action) => {
            state.loading = action.payload
        },
        getNudgesData: (state, action) => {
            state.nudgesData = action.payload
        },
        errorNudgesData: (state, action) => {
            state.loading = action.payload
        },
        deleteSelectedNudge: (state, action) => {
            filtered = state.nudgesData.filter(
                (nudge) => nudge._id !== action.payload
            )

            state.nudgesData = filtered
        },
        clearNudgeData: () => initialState,
    },
})

export default slice.reducer
export const {
    loadNudgesData,
    getNudgesData,
    errorNudgesData,
    deleteSelectedNudge,
    clearNudgeData,
} = slice.actions
