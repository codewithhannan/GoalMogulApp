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
        deleteSelectedNudge: (state, action) =>
            state.filter((pro) => pro.id !== action.payload.id),
    },
})

export default slice.reducer
export const {
    loadNudgesData,
    getNudgesData,
    errorNudgesData,
    deleteSelectedNudge,
} = slice.actions
