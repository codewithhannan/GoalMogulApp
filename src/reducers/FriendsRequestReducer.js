/** @format */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    requestsSent: 0,
}

const slice = createSlice({
    name: 'tooltip',
    initialState,
    reducers: {
        setRequestsSent: (state, action) => {
            state.requestsSent = action.payload.data
            state.requestsSent += 1
            return state
        },
    },
})

export default slice.reducer
export const { setRequestsSent } = slice.actions
