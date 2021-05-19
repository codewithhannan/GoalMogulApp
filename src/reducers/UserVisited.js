/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    loading: false,
    visitedTime: 0,

    error: '',
}

const slice = createSlice({
    name: 'visitedTime',
    initialState,
    reducers: {
        loadVisitedTime: (state, action) => {
            state.loading = action.payload
        },
        getVisitedTime: (state, action) => {
            state.visitedTime = action.payload
        },
        errorVisitedTime: (state, action) => {
            state.loading = action.payload
        },
        userLogout: (state) => initialState,
    },
})

export default slice.reducer
export const {
    loadVisitedTime,
    getVisitedTime,
    errorVisitedTime,
    userLogout,
} = slice.actions
