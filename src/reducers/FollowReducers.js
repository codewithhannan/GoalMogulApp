/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const initialState = {
    isFollowed: false,
}

const slice = createSlice({
    name: 'follow',
    initialState,
    reducers: {
        getFollowStatus: (state, action) => {
            state.isFollowed = action.payload
        },

        clearFollowData: () => initialState,
    },
})

export default slice.reducer
export const { getFollowStatus, clearFollowData } = slice.actions
