/** @format */

import { createSlice } from '@reduxjs/toolkit'

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
    },
})

export default slice.reducer
export const { loadNudgesData, getNudgesData, errorNudgesData } = slice.actions
