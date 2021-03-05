/** @format */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    content: {},
    error: '',
}

const slice = createSlice({
    name: 'messageDoc',
    initialState,
    reducers: {
        loadingMessageDoc: (state, action) => {
            state.loading = action.payload
        },
        setMessageDoc: (state, action) => {
            state.list = action.payload
        },
        MessageDocError: (state, action) => {
            state.loading = true
            state.error = action.payload
        },
    },
})

export default slice.reducer
export const {
    loadingMessageDoc,
    setMessageDoc,
    MessageDocError,
} = slice.actions
