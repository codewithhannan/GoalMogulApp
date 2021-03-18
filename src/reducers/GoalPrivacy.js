/** @format */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    privacy: '',
}

const slice = createSlice({
    name: 'goalPrivacy',
    initialState,
    reducers: {
        loadingGoalPrivacy: (state, action) => {
            state.loading = action.payload
        },
        setGoalPrivacy: (state, action) => {
            state.privacy = action.payload
        },
        goalPrivacyError: (state, action) => {
            state.loading = true
            state.error = action.payload
        },
    },
})

export default slice.reducer
export const {
    loadingGoalPrivacy,
    setGoalPrivacy,
    goalPrivacyError,
} = slice.actions
