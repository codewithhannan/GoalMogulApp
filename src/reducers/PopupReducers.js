/** @format */

import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { api as API } from '../redux/middleware/api/index'

const initialState = {}

const slice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        setPopupData: (state, action) => {
            // console.log('\nsetPopupData is called in reducer')
            state = action.payload.data
            return state
        },
        updatePopupData: (state, action) => {
            state = action.payload.data
            return state
        },
        clearPopupData: () => initialState,
    },
})

export default slice.reducer
export const { setPopupData, updatePopupData, clearPopupData } = slice.actions
